// React and react related imports
import React from "react";
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Assets
import Shamiana from "../../../../assets/Shamiana12.png";
import Sound from "../../../../assets/speakerbg3.png";
import Lights from "../../../../assets/eventLights.png";
import Video from "../../../../assets/cameraFinalPng.png";
import Fabrication from "../../../../assets/carpet.png";
import Genset from "../../../../assets/genset.png";

// Styles
import "./styles.scss";

const categories = [
  {
    title: "Sound",
    color: "#f8f9fa",
    img: Sound,
    shopNow: true,
    cols: 4,
    left: "10rem",
    width: "10rem",
    height: "198px",
    top: "0rem",
  },
  {
    title: "Lighting",
    color: "#d4edf8",
    img: Lights,
    cols: 3,
    left: "0rem",
    width: "15rem",
    height: "198px",
    top: "0rem",
  },
  {
    title: "Shamiana",
    color: "#fef9c4",
    img: Shamiana,
    cols: 3,
    left: "0rem",
    width: "15rem",
    height: "308px",
    top: "6.5rem",
  },
  {
    title: "Fabrication",
    color: "#f2e7e3",
    img: Fabrication,
    cols: 3,
    left: "0rem",
    width: "12rem",
    height: "198px",
    top: "-2rem",
  },
  {
    title: "Video",
    color: "#e3f2e6",
    img: Video,
    cols: 3,
    left: "0rem",
    width: "12rem",
    height: "198px",
    top: "0rem",
  },
  {
    title: "Genset",
    color: "#fae8e8",
    img: Genset,
    shopNow: true,
    cols: 4,
    left: "8rem",
    width: "12rem",
    height: "198px",
    top: "3rem",
  },
];

const ExploreCategory = () => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <div className="category-container">
      <Box
        className="card-header"
        sx={{
          textAlign: "center",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <Typography
          variant="h4"
          className="small-title"
          sx={{ color: "#1a365d", fontWeight: 600, fontSize: "1.5rem" }}
        >
          Categories
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
      >
        {categories.map((category, index) => (
          <Grid item lg={category.cols} key={index}>
            <Card
              className="category-card"
              style={{ backgroundColor: category.color }}
              onClick={() => handleClick(category.title.toLowerCase())}
            >
              <CardContent className="card-content">
                <Typography
                  variant="h5"
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: "600",
                    color: "#858585",
                  }}
                  className="category-name"
                >
                  {category.title}
                </Typography>
                {category.shopNow && (
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "black", marginTop: "3rem" }}
                    className="shop-now-button"
                  >
                    Shop Now →
                  </Button>
                )}
                <div className="image-container">
                  <img
                    src={category.img}
                    alt={category.title}
                    style={{
                      left: category.left,
                      width: category.width,
                      height: category.height,
                      marginTop: category.top,
                    }}
                    className="category-image"
                  />
                </div>
              </CardContent>
            </Card>

          </Grid>
          
        ))}
      </Grid>

      {/* <Button
        variant="contained"
        sx={{ marginTop: "4rem", backgroundColor: "#c026d3" }}
        className="view-all-button"
        onClick={() => handleClick(categories.title)}
      >
        View All
      </Button> */}
    </div>
  );
};

export default ExploreCategory;
