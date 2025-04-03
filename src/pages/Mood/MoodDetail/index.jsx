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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const MoodDetail = () => {
  const [project, setProject] = useState(null);
  const [objects, setObjects] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const canvasRef = useRef(null);
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const saveLayout = () => {
    localStorage.setItem(`layout_${id}`, JSON.stringify(objects));
    setIsSaved(true);
    alert("Layout saved successfully!");
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
  const addObject = (type) => {
    const newObject = {
      id: Date.now(), // Use Date.now() to generate a unique id for each object
      type,
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

  const downloadDesign = () => {
    html2canvas(canvasRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "design.png";
      link.click();
    });
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
              {[
                "chair",
                "mic",
                "spotlight1",
                "spotlight",
                "dinning",
                "tablecloth",
                "tribune",
                "theater",
              ].map((type) => (
                <div key={type} className="palette-item">
                  <img src={renderIcon(type)} alt={type} className="icon" />
                  <button onClick={() => addObject(type)} className="add-btn">
                    +
                  </button>
                  <Typography
                    sx={{ minWidth: "20px", textAlign: "center", color: "red" }}
                  >
                    {" "}
                    {objects.filter((obj) => obj.type === type).length}
                  </Typography>
                  <button
                    onClick={() => {
                      const objectToRemove = objects.find(
                        (obj) => obj.type === type
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
              {[
                "chair",
                "mic",
                "spotlight1",
                "spotlight",
                "dinning",
                "tablecloth",
                "tribune",
                "theater",
              ].map((type) => (
                <div key={type} className="palette-item">
                  <img src={renderIcon(type)} alt={type} className="icon" />
                  <button onClick={() => addObject(type)} className="add-btn">
                    +
                  </button>
                  {objects.filter((obj) => obj.type === type).length}
                  <button
                    onClick={() => {
                      const objectToRemove = objects.find(
                        (obj) => obj.type === type
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
              onContextMenu={(e) => {
                e.preventDefault(); // Prevent default right-click
                handleRotate(obj.id);
              }}
            >
              <img
                src={renderIcon(obj.type)}
                alt={obj.type}
                className="object-img"
              />
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
};

export default MoodDetail;
