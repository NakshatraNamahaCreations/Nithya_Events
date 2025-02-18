import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Shamiana from "../../assets/tent1.jpg";
import Sound from "../../assets/speakerFinal.jpg";
import Lights from "../../assets/lights.jpg";
import Video from "../../assets/cameraFinal.jpg";
import Genset from "../../assets/genset.png";


import Fabrication from "../../assets/carpet.png";
import "./styles.scss";
import { Box, Typography } from "@mui/material";
import Trusted from "../Home/components/Trusted";

const categories = [
  { name: "Sound", tag: "sound", image: Sound },
  { name: "Video", tag: "video", image: Video },
  { name: "Light", tag: "Lighting", image: Lights },
  { name: "Genset", tag: "genset", image: Genset },
  { name: "Shamiana", tag: "shamiana", image: Shamiana },
  { name: "Shamiana", tag: "shamiana", image: Shamiana },
];

function AllCategory() {
  useEffect(() => {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = 1;
        card.style.transform = "translateY(0)";
      }, index * 100);
    });
  }, []);
  const navigate = useNavigate();
  const handleNavigate = (category) => {
    navigate(`/category/${category}`);
  };
  return (
    <Box className="all-category">
      <h1 className="all-category-heading">Categories</h1>
      <p className="all-category-subHeading">Dive Into Our Exclusive Categories.</p>
      <Box className="scroll-container-allCategory">
        {categories.map((category, index) => (
          <Box
            key={index}
            className="category-card"
            onClick={() => handleNavigate(category.tag.toLowerCase())}
          >
            <Box className="image-container">
              <img
                className="card-img"
                src={category.image}
                alt={category.name}
              />
            </Box>
            <Typography variant="p" className="category-name">{category.name}</Typography>
          </Box>
        ))}
      </Box>
      <Trusted />
    </Box>
  );
}

export default AllCategory;
