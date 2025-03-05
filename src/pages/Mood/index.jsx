import React, { useState } from "react";
import "./styles.scss"; // Import external CSS for styling

// Importing images
import ChairIcon from "@mui/icons-material/Chair";
import MicIcon from "@mui/icons-material/Mic";
import SpeakerIcon from "@mui/icons-material/Speaker";


const Mood = () => {
  const [objects, setObjects] = useState([]);

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

  const handleDrag = (id, e) => {
    e.preventDefault();
    const updatedObjects = objects.map((obj) => {
      if (obj.id === id) {
        return {
          ...obj,
          x: e.clientX - 25, // Adjusting for center position
          y: e.clientY - 25,
        };
      }
      return obj;
    });
    setObjects(updatedObjects);
  };

  const renderIcon = (type) => {
    switch (type) {
   
      case "chair":
        return ChairIcon;
      case "mic":
        return MicIcon;
      case "speaker":
        return SpeakerIcon;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <div className="palette">
        <h2>Object Palette</h2>
        {["table", "chair", "mic", "speaker"].map((type) => (
          <div key={type} className="palette-item">
            <img src={renderIcon(type)} alt={type} className="icon" />
            <button onClick={() => addObject(type)} className="add-btn">+</button>
            <button onClick={() => removeObjectOfType(type)} className="remove-btn">-</button>
          </div>
        ))}
      </div>

      <div className="canvas">
        {objects.map((obj) => (
          <div
            key={obj.id}
            className="draggable-object"
            style={{
              top: obj.y,
              left: obj.x,
              transform: `rotate(${obj.rotation}deg)`,
            }}
            draggable="true"
            onDragEnd={(e) => handleDrag(obj.id, e)}
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
