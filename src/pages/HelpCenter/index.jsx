import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { Container, Box, Typography, IconButton, Paper } from "@mui/material";

const HelpCentre = () => {
  const navigate = useNavigate();

  const profileData = {
    contact_email: "info@nithyaevent.com",
    contact_phone: "+91 98765 43210",
    corporate_address: "123 Event Street, Bangalore, India",
  };

  return (
    <Container maxWidth="md" sx={{ backgroundColor: "#f0f0f0", minHeight: "100vh", py: 4 }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ paddingTop: "15px" }}>
          <ArrowBack fontSize="large" />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" sx={{ textAlign: "center", flex: 1 }}>
          HELP CENTRE
        </Typography>
      </Box>

      {/* Content Section */}
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We’re here to assist you every step of the way, ensuring a seamless experience for your event planning and rentals.
        </Typography>

        {/* Contact Information */}
        <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
          Contact Us
        </Typography>
        <Typography variant="body1">
          <strong>{profileData.contact_email}</strong>
        </Typography>
        <Typography variant="body1">
          <strong>Phone: {profileData.contact_phone}</strong>
        </Typography>

        {/* Address Section */}
        <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
          Address
        </Typography>
        <Typography variant="body1">{profileData.corporate_address}</Typography>

        {/* Closing Statement */}
        <Typography variant="body1" sx={{ mt: 3 }}>
          At <strong>Nithyaevent</strong>, we value your satisfaction and are committed to ensuring your event is a success.
          If you need further assistance, don’t hesitate to reach out. We’re always happy to help!
        </Typography>

        <Typography variant="h6" fontWeight="bold" color="primary" align="center" sx={{ mt: 3 }}>
          Nithyaevent – Making your celebrations hassle-free.
        </Typography>
      </Paper>
    </Container>
  );
};

export default HelpCentre;
