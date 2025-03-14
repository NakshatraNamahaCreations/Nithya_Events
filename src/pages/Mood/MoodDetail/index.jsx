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
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";

const MoodDetail = () => {
  const [project, setProject] = useState(null);
  const [objects, setObjects] = useState([]);
    const canvasRef = useRef(null);
  const { id } = useParams();   
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // Retrieve projects from localStorage
    const userDetails = sessionStorage.getItem("userDetails");
    let userId = userDetails ? JSON.parse(userDetails)._id : null;
    const savedProjects = JSON.parse(localStorage.getItem(`projects_${userId}`)) || [];

    // Find the project by ID
    const selectedProject = savedProjects.find((p) => p.id.toString() === id);
    setProject(selectedProject);

    // Retrieve saved layout for the project
    if (selectedProject) {
      const savedLayout = JSON.parse(localStorage.getItem(`layout_${id}`)) || [];
      setObjects(savedLayout);
    }
  }, [id]);

  const saveLayout = () => {
    localStorage.setItem(`layout_${id}`, JSON.stringify(objects));
    alert("Layout saved successfully!");
  };
  const addObject = (type) => {
    const newObject = {
      id: Date.now(),
      type,
      x: 100,
      y: 100,
      rotation: 0,
    };
    setObjects([...objects, newObject]);
  };

  const removeObjectOfType = (type) => {
    setObjects((prevObjects) => prevObjects.filter((obj) => obj.type !== type));
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
          <div
        className="controls"
        style={{ display: "flex", gap: "10px", justifyContent: "end", backgroundColor:'#f4f4f9', marginTop:'2rem' }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor:'pointer'
          }}
          onClick={saveLayout}
        >
          <img style={{ width: "30px" }} src={Save} alt="Save Image" />
          <Typography sx={{ fontSize: "0.7rem" }} >
            Save
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor:'pointer'
          }}
          onClick={downloadDesign}
        >
          <img style={{ width: "30px" }} src={Download} alt="Download Image" />
          <Typography sx={{ fontSize: "0.7rem" }} >
            Download
          </Typography>
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
                <button
                  onClick={() => removeObjectOfType(type)}
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
                <button
                  onClick={() => removeObjectOfType(type)}
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
