import React, { useState, useEffect } from "react";
import { Button, Modal, Box, Typography, TextField, Card, CardContent, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Mood = () => {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const userDetails = sessionStorage.getItem("userDetails");

  let userId = null;

  if (userDetails) {
    try {
      let userDetail = JSON.parse(userDetails);
      userId = userDetail._id;
    } catch (error) {
      console.error("Error in userDetails from sessionStorage");
    }
  }

  // Load projects specific to the logged-in user
  useEffect(() => {
    const savedProjects =
      JSON.parse(localStorage.getItem(`projects_${userId}`)) || [];
    setProjects(savedProjects);
  }, [userId]);

  // Open Modal
  const handleOpen = () => setOpen(true);

 
  const handleClose = () => {
    setOpen(false);
    setProjectName(""); 
  };

 
  const handleSave = () => {
    if (projectName.trim() === "") {
      alert("Project name cannot be empty!");
      return;
    }

    const updatedProjects = [...projects, projectName]; 
    setProjects(updatedProjects);

    localStorage.setItem(`projects_${userId}`, JSON.stringify(updatedProjects)); 
    handleClose(); 
  };
const handleProjectClick = () => {
navigate("/");
}
  return (
    <Box sx={{ textAlign: "center", mt: 8, mb: 12 }}>
      {/* Open Modal Button */}
      <Button variant="contained" sx={{backgroundColor:'#c026d3'}} onClick={handleOpen}>
        Create New Project
      </Button>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Create New Project
          </Typography>

          {/* Project Name Input */}
          <TextField
            fullWidth
            label="Project Name"
            variant="outlined"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" sx={{backgroundColor:'#c026d3'}} onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Display Saved Projects */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Saved Projects:
        </Typography>

        {projects.length > 0 ? (
          <Grid container spacing={3} justifyContent="center">
            {projects.map((proj, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                    borderRadius: "10px",
                    transition: "0.3s",
                    "&:hover": { boxShadow: "0px 6px 10px rgba(0,0,0,0.15)" },
                    cursor:'pointer'
                  }}
                  onClick={handleProjectClick}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#333",
                        textAlign: "center",
                      }}
                    >
                      {proj}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">
            No projects created yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Mood;
