// React and related imports
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
    color: "linear-gradient(135deg, #f8f9fa 0%, #e8e8e8 100%)",
    img: Sound,
  },
  {
    title: "Lighting",
    color: "linear-gradient(135deg, #d4edf8 0%, #bde4f3 100%)",
    img: Lights,
  },
  {
    title: "Shamiana",
    color: "linear-gradient(135deg, #fff9d6 0%, #fbeec0 100%)",
    img: Shamiana,
  },
  {
    title: "Fabrication",
    color: "linear-gradient(135deg, #f2e7e3 0%, #e8dcd7 100%)",
    img: Fabrication,
  },
  {
    title: "Video",
    color: "linear-gradient(135deg, #e3f2e6 0%, #c9ebd2 100%)",
    img: Video,
  },
  {
    title: "Genset",
    color: "linear-gradient(135deg, #fae8e8 0%, #f4d2d2 100%)",
    img: Genset,
  },
];

const ExploreCategory = () => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    navigate(`/category/${category.toLowerCase()}`);
  };

  return (
    <Box className="category-container" sx={{ py: 6, px: 3 }}>
      {/* Header */}
      <Box
        sx={{
          textAlign: "center",
          mb: 5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#1a365d",
            fontWeight: 700,
            fontSize: "2rem",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: "70px",
              height: "4px",
              borderRadius: "2px",
              background: "linear-gradient(90deg, #c026d3, #7b2cbf)",
            },
          }}
        >
          Explore Our Categories
        </Typography>
      </Box>

      {/* Grid Layout */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="stretch"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: "2rem",
          px: { xs: 2, md: 8 },
        }}
      >
        {categories.map((category, index) => (
          <Card
            key={index}
            onClick={() => handleClick(category.title)}
            sx={{
              background: category.color,
              borderRadius: "18px",
              cursor: "pointer",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: "0 14px 25px rgba(0,0,0,0.2)",
              },
            }}
          >
            <CardContent
              sx={{
                textAlign: "center",
                position: "relative",
                height: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                p: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: "1.6rem",
                  fontWeight: "600",
                  color: "#333",
                  textTransform: "capitalize",
                  mb: 1,
                }}
              >
                {category.title}
              </Typography>

              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "180px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src={category.img}
                  alt={category.title}
                  sx={{
                    width: "auto",
                    height: "160px",
                    objectFit: "contain",
                    transition: "transform 0.4s ease",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                />
              </Box>

              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  background: "linear-gradient(90deg, #c026d3, #7b2cbf)",
                  fontWeight: 600,
                  color: "#fff",
                  px: 3,
                  py: 1,
                  borderRadius: "30px",
                  boxShadow: "0 4px 10px rgba(192,38,211,0.4)",
                  transition: "0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(90deg, #a21caf, #6d28d9)",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Rent Now →
              </Button>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};

export default ExploreCategory;
