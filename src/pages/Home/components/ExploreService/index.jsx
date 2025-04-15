import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.scss";
import authService from "../../../../api/ApiService";

const ExploreService = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const res = await authService.getAllServices();
      setServices(res.data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <Box sx={{ padding: "2rem", paddingLeft: { xs: "3rem", md: "8rem" } }}>
      <Typography
        sx={{
          fontSize: "1.4rem",
          fontWeight: "bold",
          color: "#343a40",
          marginBottom: "2rem",
          textTransform: "uppercase",
        }}
      >
        Services
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gap: "1.5rem",
        }}
      >
        {services.slice(0, 6).map((service) => (
          <Box
            key={service._id}
            onClick={() => navigate(`/service/${service.service_name}`)}
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
              backgroundColor: "#fff",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              maxWidth: "280px",
              width: "100%",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <Box sx={{ position: "relative", height: "370px" }}>
              <img
                src={service.service_image}
                alt={service.service_name}
                style={{
                  width: "100%",
                  // height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          backgroundColor: "limegreen",
          color: "white",
          padding: "2px 8px",
          borderRadius: "8px",
          fontSize: "0.7rem",
          fontWeight: "bold",
        }}
      >
        Available
      </Box> */}
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate("/services")}
          sx={{
            textTransform: "capitalize",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "#c026d3",
            width: "8rem",
            height: "40px",
            border: "none",
            "&:hover": {
              transform: "scale(1.1)",
              color: "#fff",
            },
          }}
        >
          View All
        </Button>
      </Box>
    </Box>
  );
};

export default ExploreService;
