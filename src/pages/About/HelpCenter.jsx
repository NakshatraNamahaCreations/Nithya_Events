import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { Button, Container, Typography, Paper, Box } from "@mui/material";

const HelpCenter = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ marginBottom: "4rem" }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, textTransform: "none", color: "gray" }}
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
          <Typography paragraph>support@nithyaevent.com</Typography>

          <Typography paragraph>Phone: 99801370001</Typography>

          <strong>Address</strong>

          <Typography>
            NO 31, 1st Floor, Venkatappa Road, Tasker Town, Off Queens Road,
            Bengaluru - 560051
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
