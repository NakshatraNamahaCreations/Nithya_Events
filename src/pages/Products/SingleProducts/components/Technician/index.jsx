import React, { useEffect, useState } from "react";
import "./styles.scss";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";
import authService from "../../../../../api/ApiService";

// Assests
import ProfileImage from "../../../../../assets/profile.jpg";

const Technician = ({
  productCategory,
  onSelectTechnician,
  selectedTechnicians,
  setSelectedTechnicians
}) => {
  const [technicians, setTechnicians] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const MAX_SELECTION = 7;

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true);
        const res = await authService.getAllTechnicians();
        setTechnicians(res.data.tech);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  useEffect(() => {
    if (productCategory) {
      const filtered = technicians.filter(
        (tech) => tech.category === productCategory
      );
      setFilteredTechnicians(filtered);
      setSelectedTechnicians([]); // Don't pre-select any

    }
  }, [productCategory, technicians]);

  const handleSelectTechnician = (tech) => {
    const isSelected = selectedTechnicians.some((t) => t._id === tech._id);

    if (!isSelected && selectedTechnicians.length >= MAX_SELECTION) return;

    onSelectTechnician(
      isSelected
        ? selectedTechnicians.filter((t) => t._id !== tech._id)
        : [...selectedTechnicians, tech]
    );
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "1rem" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Select a Technician for {productCategory || "Product"}
      </Typography>

      <Box
        sx={{
          background: "#fff",
          borderRadius: "10px",
          padding: "1rem",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        {filteredTechnicians.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filteredTechnicians.map((tech, index) => (
              <Card
                key={tech._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.8rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: selectedTechnicians.some(
                    (t) => t._id === tech._id
                  )
                    ? "#f1faff"
                    : "#fff",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={tech.image || ProfileImage}
                    alt={tech.service_name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {tech.service_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{tech.price?.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {index < 2 && (
                    <Chip
                      label="Most Booked"
                      color="primary"
                      size="small"
                      sx={{ marginRight: "10px" }}
                    />
                  )}
                  <Checkbox
                    checked={selectedTechnicians.some(
                      (t) => t._id === tech._id
                    )}
                    onChange={() => handleSelectTechnician(tech)}
                    color="primary"
                  />
                </Box>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", mt: 3 }}
          >
            No technicians available for this category.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Technician;
