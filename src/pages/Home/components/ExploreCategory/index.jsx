// React related imports
import { useNavigate } from "react-router-dom";

// Third party library
import { Box, Typography, Button } from "@mui/material";

// Assests
import Shamiana from "../../../../assets/tent1.jpg";
import Sound from "../../../../assets/speakerFinal.jpg";
import Lights from "../../../../assets/lights.jpg";
import Video from "../../../../assets/cameraFinal.jpg";
import Fabrication from "../../../../assets/carpet.png";
import Genset from "../../../../assets/genset.png";

// styles
import "./styles.scss";

const ExploreCategory = () => {
  const navigate = useNavigate();

  const handleNavigation = (category) => {
    window.scrollTo(0, 0);
    navigate(`/category/${category}`);
  };

  const handleViewAll = () => {
    window.scrollTo(0, 0);
    navigate(`/categories`);
  };

  const categories = [
    {
      name: "Sound",
      icon: Sound,
      bgColor: "#f8f9fa",
      textColor: "#444444",
    },
    {
      name: "Lighting",
      icon: Lights,
      bgColor: "#e3f2fd",
      textColor: "#2381ab",
    },
    {
      name: "Shamiana",
      icon: Shamiana,
      bgColor: "#fff3cd",
      textColor: "#d9ba18",
    },
    {
      name: "Fabrication",
      icon: Fabrication,
      bgColor: "#f8d7da",
      textColor: "#c63d42",
    },
    { name: "Video", icon: Video, bgColor: "#d4edda", textColor: "#3cd343" },
    { name: "Genset", icon: Genset, bgColor: "#f2e7e3", textColor: "#c19d5d" },
  ];

  return (
    <Box className="main-container">
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
          sx={{ color: "#6c757d" }}
        >
          Categories
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 2fr))",
          gap: "20px",
        }}
      >
        {categories.map((category, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: category.bgColor,
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
              "@media(max-width:600px)": {
                width: "24rem",
              },
            }}
            onClick={() => handleNavigation(category.name.toLowerCase())}
          >
            <Box
              sx={{
                display: "flex",
                gap: "2rem",
                justifyContent: "space-around",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "2.5rem",
                    color: "#858585",
                  }}
                >
                  {category.name}
                </Typography>
                <Button
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    width: "8rem",
                    marginTop: "1.4rem",
                  }}
                >
                  Shop Now
                </Button>
              </Box>
              <Box sx={{ marginBottom: "1rem", textAlign: "center" }}>
                <img
                  src={category.icon}
                  alt={category.name}
                  className="image-category-container"
                />
              </Box>
            </Box>
            <Box></Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
        <Button
          variant="contained"
          sx={{
            padding: "10px 20px",
            fontSize: "1rem",
            fontWeight: "bold",
            backgroundColor: "#c026d3",
          }}
          onClick={handleViewAll}
        >
          View All
        </Button>
      </Box>
    </Box>
  );
};

export default ExploreCategory;
