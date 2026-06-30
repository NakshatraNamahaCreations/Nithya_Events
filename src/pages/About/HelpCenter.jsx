import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { Button, Container, Typography, Paper, Box } from "@mui/material";

const HelpCenter = () => {
  const navigate = useNavigate();

   const profileData = {
    contact_email: "support@nithyaevents.com",
    contact_phone: "+91 9980137000",
    corporate_address: "No. 34 1st Floor, Venkatappa Road, Tasker Town, Off Queens Road, Bengaluru- 560051",
  };

  return (
    <Container maxWidth="md" sx={{ marginBottom: "4rem" }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, textTransform: "none", color: "gray",fontWeight:700,
          fontSize:18,
          marginTop:"40px",}}
      >
        Back
      </Button>

      {/* Content Box */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Title */}
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Help Centre
        </Typography>

        {/* About Content */}
        <Box sx={{ color: "text.secondary", lineHeight: 1.7 }}>
          <Typography paragraph>
            We're here to assit you every step of the way, ensuring a seamless
            experience for your event planing and rentals.
          </Typography>
          <strong>Contact Us</strong>
          <Typography paragraph>{profileData.contact_email}</Typography>

          <Typography paragraph>Phone: {profileData.contact_phone}</Typography>

          <strong>Address</strong>

          <Typography>
          {profileData.corporate_address}
          </Typography>
          <br />
          <Typography paragraph>
            At Nithyaevent, we value your satisfaction and are committed to
            ensuring your event is a success. If you need further assistance,
            don't hesitate to reach out. We're always happy to help!.
          </Typography>
          <Typography paragraph>
            <strong> Nithyaevent - Making your celebrations hassle-free</strong>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default HelpCenter;
