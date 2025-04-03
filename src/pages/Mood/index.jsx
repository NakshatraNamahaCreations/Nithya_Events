import React, { useState, useEffect } from "react";
import { 
  Box, Button, Modal, Typography, TextField, 
  Card, CardContent, Grid, IconButton 
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Mood = () => {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const userDetails = sessionStorage.getItem("userDetails");
  let userId = userDetails ? JSON.parse(userDetails)._id : null;

  useEffect(() => {
    const savedProjects =
      JSON.parse(localStorage.getItem(`projects_${userId}`)) || [];
    setProjects(savedProjects);
  }, [userId]);

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
    const newProject = { id: Date.now(), name: projectName };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem(`projects_${userId}`, JSON.stringify(updatedProjects));
  

    navigate(`/moodDetails/${newProject.id}`);
    handleClose();
  };
  

  const handleProjectClick = (project) => {
    navigate(`/moodDetails/${project.id}`);
  };

  const handleEdit = (index) => {
    const newProjectName = prompt("Edit project name:", projects[index].name);
    if (newProjectName) {
      const updatedProjects = [...projects];
      updatedProjects[index].name = newProjectName;
      setProjects(updatedProjects);
      localStorage.setItem(`projects_${userId}`, JSON.stringify(updatedProjects));
    }
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updatedProjects = projects.filter((_, i) => i !== index);
      setProjects(updatedProjects);
      localStorage.setItem(`projects_${userId}`, JSON.stringify(updatedProjects));
    }
    
  };

  return (
    <Box sx={{ textAlign: "center", mt: 8, mb: 12 }}>
      <Button variant="contained" sx={{ backgroundColor: '#c026d3' }} onClick={handleOpen}>
        Create New Project
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400, bgcolor: "background.paper",
            boxShadow: 24, p: 3, borderRadius: 2, textAlign: "center"
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Create New Project</Typography>
          <TextField
            fullWidth label="Project Name"
            variant="outlined"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" sx={{ backgroundColor: '#c026d3' }} onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>Saved Projects:</Typography>

        {projects.length > 0 ? (
          <Grid container spacing={2} justifyContent="center" sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            {projects.map((proj, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={proj.id} >
                <Card
                  sx={{
                    width: "250px", height: "60px",
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                    borderRadius: "10px",
                    transition: "0.3s",
                    "&:hover": { boxShadow: "0px 6px 10px rgba(0,0,0,0.15)" },
                    cursor: 'pointer'
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", flexGrow: 1, overflow: "hidden" }}
                    onClick={() => handleProjectClick(proj)}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: "#333",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        ml: 1
                      }}
                    >
                      {proj.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={() => handleEdit(index)} size="small">
                      <Edit fontSize="small" sx={{ color: "#0288d1" }} />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(index)} size="small">
                      <Delete fontSize="small" sx={{ color: "#d32f2f" }} />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">No projects created yet.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Mood;
