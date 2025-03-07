import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import "./styles.scss"; // Import external CSS for styling

// Importing images
import ChairIcon from "../../assets/wooden-chair.png";
import MicIcon from "../../assets/mic-stand.png";
import Tribune from "../../assets/tribune.png";
import TableCloth from "../../assets/tablecloth.png";
import Spotlight1 from "../../assets/spotlight1.png";
import Spotlight from "../../assets/spotlight.png";
import Theater from "../../assets/theatre.png";
import Dinning from "../../assets/dining.png";

const Mood = () => {
  const [objects, setObjects] = useState([]);
  const canvasRef = useRef(null);

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

  const saveLayout = () => {
    localStorage.setItem("savedLayout", JSON.stringify(objects));
    alert("Layout saved successfully!");
  };

  const loadLayout = () => {
    const savedLayout = localStorage.getItem("savedLayout");
    if (savedLayout) {
      setObjects(JSON.parse(savedLayout));
    }
  };

  const downloadLayout = () => {
    const link = document.createElement("a");
    const file = new Blob([JSON.stringify(objects, null, 2)], { type: "application/json" });
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
    <div className="app" style={{marginTop:'2rem',position:'relative', display:'flex',justifyContent:'flex-end'}}>
      <div className="controls" style={{display:'flex', position:'absolute', zIndex:'1'}}>
        <button onClick={saveLayout}>Save Layout</button>
        <button onClick={loadLayout}>Load Layout</button>
        {/* <button onClick={downloadLayout}>Download Layout</button> */}
        <button onClick={downloadDesign}>Download Design</button>
      </div>
      <div className="palette">
        <h2>Object Palette</h2>
        {["chair", "mic", "spotlight1", "spotlight", "dinning", "tablecloth", "tribune", "theater"].map((type) => (
          <div key={type} className="palette-item">
            <img src={renderIcon(type)} alt={type} className="icon" />
            <button onClick={() => addObject(type)} className="add-btn">+</button>
            <button onClick={() => removeObjectOfType(type)} className="remove-btn">-</button>
          </div>
        ))}
      </div>
      
      <div className="canvas" ref={canvasRef} onDrop={handleDrop} onDragOver={allowDrop}>
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
            <img src={renderIcon(obj.type)} alt={obj.type} className="object-img" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mood;
