import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import "./styles.scss"; // Import external CSS for styling

// Importing images
import ChairIcon from "../../../assets/wooden-chair.png";
import MicIcon from "../../../assets/mic-stand.png";
import Tribune from "../../../assets/tribune.png";
import TableCloth from "../../../assets/tablecloth.png";
import Spotlight1 from "../../../assets/spotlight1.png";
import Spotlight from "../../../assets/spotlight.png";
import Theater from "../../../assets/theatre.png";
import Dinning from "../../../assets/dining.png";
import Download from "../../../assets/moodDownload.png";
import Save from "../../../assets/moodSave.png";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Modal,
} from "@mui/material";
import { FiShare2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { config } from "../../../api/config";

const MoodDetail = () => {
  const [project, setProject] = useState(null);
  const [objects, setObjects] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  // Fallback palette (bundled images) used only if the admin hasn't added any
  // Object Palette items yet, so existing boards never see an empty palette.
  const staticPaletteItems = [
    { type: "chair", label: "Chair", image: ChairIcon },
    { type: "tablecloth", label: "Table", image: TableCloth },
    { type: "dinning", label: "Dining", image: Dinning },
    { type: "theater", label: "Theater", image: Theater },
    { type: "tribune", label: "Tribune", image: Tribune },
    { type: "mic", label: "Mic Stand", image: MicIcon },
    { type: "spotlight", label: "Spotlight", image: Spotlight },
    { type: "spotlight1", label: "Spotlight 2", image: Spotlight1 },
  ];

  // Object Palette items managed by the admin — added/edited/enabled in the
  // Admin Panel and reflected here automatically (no code change needed).
  const [paletteItems, setPaletteItems] = useState(staticPaletteItems);

  useEffect(() => {
    const fetchPalette = async () => {
      try {
        const res = await axios.get(`${config.BASEURL}/mood-palette/get-active`);
        const list = Array.isArray(res?.data?.items) ? res.data.items : [];
        const usable = list
          .filter((it) => it && it.image)
          .map((it) => ({ type: it.name, label: it.name, image: it.image }));
        // Show the default palette AND the admin-added items together (the
        // defaults are no longer replaced).
        if (usable.length) setPaletteItems([...staticPaletteItems, ...usable]);
      } catch (err) {
        console.error("Failed to load mood board palette:", err);
      }
    };
    fetchPalette();
  }, []);

  const canvasRef = useRef(null);
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [showBackModal, setShowBackModal] = useState(false);

  // Back button: confirm before leaving if there are unsaved changes.
  const handleBack = () => {
    if (objects && objects.length > 0 && !isSaved) {
      setShowBackModal(true);
    } else {
      navigate("/mood-board");
    }
  };

  // Returns true on success. When silent, skips the "saved" alert (used by the
  // Back → "Save & Exit" flow which shows its own navigation).
  const saveLayout = async (silent = false) => {
    if (!project) {
      alert("Please create or select a project before saving.");
      return false;
    }
    // Blank-project validation.
    if (!objects || objects.length === 0) {
      alert("Please create a Mood Board before saving.");
      return false;
    }
    try {
      const userDetails = sessionStorage.getItem("userDetails");
      const userId = userDetails ? JSON.parse(userDetails)._id : null;
      // Persist to the database.
      await axios.post(`${config.BASEURL}/moodboard/save-moodboard`, {
        user_id: userId,
        project_name: project.name,
        items: objects,
      });
      // Keep a local copy too (so re-opening this project still shows it).
      localStorage.setItem(`layout_${id}`, JSON.stringify(objects));
      setIsSaved(true);
      if (!silent) alert("Mood board saved successfully!");
      // Redirect to the Saved Projects page after saving.
      navigate("/mood-board");
      return true;
    } catch (err) {
      console.error("Failed to save mood board:", err);
      alert("Failed to save the mood board. Please try again.");
      return false;
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSaved) {
        const confirmationMessage =
          "You have unsaved changes. Do you really want to leave?";
        e.returnValue = confirmationMessage; // Standard for most browsers
        return confirmationMessage; // For older browsers
      }
    };

    const handlePopState = (e) => {
      if (!isSaved) {
        const confirmation = window.confirm(
          "You have unsaved changes. Do you really want to leave?"
        );
        if (confirmation) {
          navigate("/mood-board"); // Navigate to the previous page if confirmed
        } else {
          e.preventDefault(); // Prevent the back navigation
        }
      } else {
        navigate("/mood-board"); // Navigate without confirmation if the layout is saved
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isSaved, navigate]);

  const clearAllObjects = () => {
    setObjects([]); // Clear all objects
    setIsSaved(false); // Mark as unsaved since layout has been cleared
    alert("All objects have been cleared!");
  };

  useEffect(() => {
    // Retrieve projects from localStorage
    const userDetails = sessionStorage.getItem("userDetails");
    let userId = userDetails ? JSON.parse(userDetails)._id : null;
    const savedProjects =
      JSON.parse(localStorage.getItem(`projects_${userId}`)) || [];

    // Find the project by ID
    const selectedProject = savedProjects.find((p) => p.id.toString() === id);
    setProject(selectedProject);

    // Retrieve saved layout for the project
    if (selectedProject) {
      const savedLayout =
        JSON.parse(localStorage.getItem(`layout_${id}`)) || [];
      setObjects(savedLayout);
    }
  }, [id]);

  // const saveLayout = () => {
  //   localStorage.setItem(`layout_${id}`, JSON.stringify(objects));
  //   alert("Layout saved successfully!");
  // };
  // Accepts a category { service_name, service_image } (from the admin) OR a
  // legacy string type (kept for backward compatibility with old layouts).
  const addObject = (item) => {
    // Accepts a palette item object ({ type/name, image }) or a plain type
    // string (legacy). Carry the image through so dynamic items render.
    const isObj = item && typeof item === "object";
    const newObject = {
      id: Date.now(), // unique id per object
      type: isObj ? item.type || item.name || item.service_name : item,
      image: isObj ? item.image || item.service_image : undefined,
      x: Math.floor(Math.random() * 300),
      y: Math.floor(Math.random() * 300),
      rotation: 0,
    };
    setObjects((prevObjects) => [...prevObjects, newObject]);
  };

  const removeObjectOfType = (id) => {
    console.log("the id", id); // Log the id for testing
    setObjects((prevObjects) => prevObjects.filter((obj) => obj.id !== id));
  };

  const handleRotate = (id) => {
    setObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === id ? { ...obj, rotation: (obj.rotation + 90) % 360 } : obj
      )
    );
  };
  

  const handleDragStart = (id, e) => {
    e.dataTransfer.setData("id", id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    const dropX = e.clientX;
    const dropY = e.clientY;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    setObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === parseInt(id)
          ? {
              ...obj,
              x: dropX - canvasRect.left - 25, // Adjust for canvas position
              y: dropY - canvasRect.top - 25,
            }
          : obj
      )
    );
  };

  const allowDrop = (e) => {
    e.preventDefault(); // Prevent default behavior to allow dropping
  };

  const downloadLayout = () => {
    const link = document.createElement("a");
    const file = new Blob([JSON.stringify(objects, null, 2)], {
      type: "application/json",
    });
    link.href = URL.createObjectURL(file);
    link.download = "layout.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadDesign = async () => {
    if (!canvasRef.current) return;
    try {
      // useCORS renders remote (S3) images; the link MUST be added to the DOM
      // before click() or the download silently fails in some browsers.
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${project?.name || "mood-board"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Mood board download failed:", err);
      alert("Could not download the mood board. Please try again.");
    }
  };

  const shareDesign = async () => {
    const projectName = project?.name || "My Mood Board";
    const shareText = `Check out my "${projectName}" mood board on Nithya Events!`;

    try {
      // Preferred: share the rendered design as an image (matches the app's Share).
      if (canvasRef.current && typeof navigator.canShare === "function") {
        const canvas = await html2canvas(canvasRef.current);
        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );
        if (blob) {
          const file = new File([blob], `${projectName}.png`, {
            type: "image/png",
          });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: projectName,
              text: shareText,
            });
            return;
          }
        }
      }

      // Fallback: share the page link/text via the native share sheet.
      if (navigator.share) {
        await navigator.share({
          title: projectName,
          text: shareText,
          url: window.location.href,
        });
        return;
      }

      // Last resort: copy the link to the clipboard.
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        alert("Mood board link copied to clipboard!");
        return;
      }
      window.prompt(
        "Copy this link to share your mood board:",
        window.location.href
      );
    } catch (err) {
      // Ignore the user dismissing the native share dialog.
      if (err && err.name !== "AbortError") {
        console.error("Share failed:", err);
        alert("Could not share the mood board. Please try again.");
      }
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case "chair":
        return ChairIcon;
      case "mic":
        return MicIcon;
      case "tribune":
        return Tribune;
      case "theater":
        return Theater;
      case "spotlight":
        return Spotlight;
      case "spotlight1":
        return Spotlight1;
      case "tablecloth":
        return TableCloth;
      case "dinning":
        return Dinning;
      default:
        return null;
    }
  };

  return (
    <Box>
      {project && (
        <Typography
          variant="h5"
          sx={{ marginTop: "3rem", marginBottom: "-2rem", textAlign: "center" }}
        >
          {project.name}
        </Typography>
      )}
      <div
        className="controls"
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "end",
          marginTop: "3rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            marginRight: "auto",
          }}
          onClick={handleBack}
        >
          <Button sx={{ fontSize: "0.7rem", color: "#e226bf" }}>← Back</Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={clearAllObjects}
        >
          <Button sx={{ fontSize: "0.7rem", color: "#e226bf" }}>
            Clear All
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={saveLayout}
        >
          <img style={{ width: "30px" }} src={Save} alt="Save Image" />
          <Typography sx={{ fontSize: "0.7rem" }}>Save</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={shareDesign}
        >
          <FiShare2 size={28} color="#e226bf" />
          <Typography sx={{ fontSize: "0.7rem" }}>Share</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={downloadDesign}
        >
          <img style={{ width: "30px" }} src={Download} alt="Download Image" />
          <Typography sx={{ fontSize: "0.7rem" }}>Download</Typography>
        </Box>
      </div>

      <div
        className="app"
        style={{
          // marginTop: "2rem",
          position: "relative",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {isMobile && (
          <Box>
            <div className="palette-mobile">
              <h2>Object Palette</h2>
              {paletteItems.map((item) => (
                <div key={item.type} className="palette-item">
                  <img src={item.image} alt={item.label} className="icon" />
                  <button
                    onClick={() => addObject(item)}
                    className="add-btn"
                  >
                    +
                  </button>
                  <Typography
                    sx={{ minWidth: "20px", textAlign: "center", color: "red" }}
                  >
                    {" "}
                    {objects.filter((obj) => obj.type === item.type).length}
                  </Typography>
                  <button
                    onClick={() => {
                      const objectToRemove = objects.find(
                        (obj) => obj.type === item.type
                      );
                      if (objectToRemove) {
                        removeObjectOfType(objectToRemove.id);
                      }
                    }}
                    className="remove-btn"
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
          </Box>
        )}

        {!isMobile && (
          <Box>
            <div className="palette">
              <h2>Object Palette</h2>
              {paletteItems.map((item) => (
                <div key={item.type} className="palette-item">
                  <img src={item.image} alt={item.label} className="icon" />
                  <button
                    onClick={() => addObject(item)}
                    className="add-btn"
                  >
                    +
                  </button>
                  {objects.filter((obj) => obj.type === item.type).length}
                  <button
                    onClick={() => {
                      const objectToRemove = objects.find(
                        (obj) => obj.type === item.type
                      );
                      if (objectToRemove) {
                        removeObjectOfType(objectToRemove.id);
                      }
                    }}
                    className="remove-btn"
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
          </Box>
        )}

        <div
          className="canvas"
          ref={canvasRef}
          onDrop={handleDrop}
          onDragOver={allowDrop}
        >
          {objects.map((obj) => (
          <div
          key={obj.id}
          className="draggable-object"
          style={{
            top: obj.y,
            left: obj.x,
            transform: `rotate(${obj.rotation}deg)`,
            position: "absolute",
          }}
          draggable="true"
          onDragStart={(e) => handleDragStart(obj.id, e)}
          onClick={() => handleRotate(obj.id)} 
        >
          <img
            src={obj.image || renderIcon(obj.type)}
            alt={obj.type}
            className="object-img"
          />
        </div>
        
          ))}
        </div>
      </div>

      {/* Back-navigation confirmation */}
      <Modal open={showBackModal} onClose={() => setShowBackModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 360,
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Unsaved Changes
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "#555" }}>
            You have unsaved changes to your mood board. What would you like to
            do?
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#c026d3" }}
              onClick={() => {
                setShowBackModal(false);
                saveLayout(true);
              }}
            >
              Save &amp; Exit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setShowBackModal(false);
                setIsSaved(true);
                navigate("/mood-board");
              }}
            >
              Exit Without Saving
            </Button>
            <Button variant="text" onClick={() => setShowBackModal(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MoodDetail;
