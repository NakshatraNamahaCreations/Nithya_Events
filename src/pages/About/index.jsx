import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { Button, Container, Typography, Paper, Box } from "@mui/material";

const About = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{marginBottom:'4rem'}}>
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
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          align="center" 
          gutterBottom
        >
          About Us
        </Typography>

        {/* About Content */}
        <Box sx={{ color: "text.secondary", lineHeight: 1.7 }}>
          <Typography paragraph>
            <strong>Welcome to Nithyaevent,</strong> where your dream events come to life with ease and elegance. 
            We specialize in offering premium event rental services to make every occasion unforgettable. 
            Whether it's a wedding, corporate gathering, birthday celebration, or any special event, we provide 
            a wide range of high-quality products to suit your unique needs.
          </Typography>

          <Typography paragraph>
            With a focus on exceptional service and attention to detail, we take pride in delivering everything 
            you need to create the perfect atmosphere. From furniture and decor to audio-visual equipment and 
            bespoke setups, our diverse inventory ensures that your event reflects your vision and style.
          </Typography>

          <Typography paragraph>
            At Nithyaevent, our team of professionals is committed to making event planning stress-free and 
            enjoyable. We go above and beyond to ensure timely delivery, seamless setup, and impeccable quality. 
            Partner with us to transform your ideas into reality and create memories that last a lifetime.
          </Typography>

          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color="primary" 
            align="center"
            sx={{ mt: 2 }}
          >
            Nithyaevent – Your trusted partner for every celebration.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default About;
