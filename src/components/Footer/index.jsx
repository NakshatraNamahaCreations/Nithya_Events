import React, { useEffect, useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  LocationOn,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import "./styles.scss";
import { Box, Button, Typography } from "@mui/material";
import get1 from "../../assets/getgp.png";
import appPng from "../../assets/download1.jpg";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import temp from "../../assets/temp.png";

const Footer = () => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <footer className="footer-main">
      <Box className="footer-container">
        <Box className="footer-column">
          <h3>Shop by Category</h3>
          <ul>
    <li onClick={() => window.location.href = "/category/sound"}>Sounds</li>
    <li onClick={() => window.location.href = "/category/lighting"}>Lights</li>
    <li onClick={() => window.location.href = "/category/fabrication"}>Fabrications</li>
    <li onClick={() => window.location.href = "/category/shamiana"}>Shamiana</li>
    <li onClick={() => window.location.href = "/category/video"}>Video</li>
    <li onClick={() => window.location.href = "/category/genset"}>Genset</li>
  </ul>
        </Box>

        <Box className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <Link to="/" style={{ textDecoration: "none" }}>
              <li>Home</li>
            </Link>
            <Link to="/aboutUs" style={{ textDecoration: "none" }}>
              <li>About</li>
            </Link>
            <Link to="/products" style={{ textDecoration: "none" }}>
              <li>Products</li>
            </Link>
            <Link to="/booking" style={{ textDecoration: "none" }}>
              <li>Bookings</li>
            </Link>
            <Link to="/services" style={{ textDecoration: "none" }}>
              <li>Services</li>
            </Link>
            <Link to="/aboutUs" style={{ textDecoration: "none" }}>
              <li>Contact Us</li>
            </Link>
            {/* <p>Contact Us</p>
            <p>Support@nithyaevents.com</p>
            <p>Phone: +91 99801370001</p> */}
          </ul>
        </Box>

        <Box className="footer-column">
          <h3>Policy</h3>
          <ul>
            <li onClick={() => navigate("/privacyPolicy")}>Privacy Policy</li>
            <li onClick={() => navigate("/TermsAndCondition")}>
              Terms and conditions
            </li>
            <li onClick={() => navigate("/returnPolicy")}>Refund Policy</li>
            <li onClick={() => navigate("/returnPolicy")}>Help Center</li>
          </ul>
        </Box>


        <Box className="footer-map-container">
          <Box>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62207.564887681794!2d77.51997442373327!3d12.973591159377882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17005b0a5e31%3A0xb6796593445e2823!2sKadagam%20Ventures!5e0!3m2!1sen!2sin!4v1739967980569!5m2!1sen!2sin"
              width="90%"
              height="220"
              style={{ border: 0, borderRadius: "10px", marginTop: "20px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Box>


        </Box>

      </Box>

      {/*  Google Maps Integration */}
      <Box className="footer-column-social">
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexDirection: 'column' }}>
          <Box>
            <Typography sx={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '8px', gap: '2rem' }}>

              Download
              <img style={{ width: '135px' }} src={get1} alt="Not Found" />
              <img style={{ width: '135px' }} src={appPng} alt="Not Found" /></Typography>
          </Box>
          <Box className="social-media" sx={{ display: 'flex', justifyContent: 'center' }}>
            <a href="https://www.facebook.com/people/Nithya-event/61571314384247/" target="_blank" rel="noopener noreferrer">
              <Facebook className="icon" />
            </a>
            <a href="https://www.instagram.com/nithya_event/" target="_blank" rel="noopener noreferrer">
              <Instagram className="icon" />
            </a>
            <a href="https://x.com/Nithya_Event" target="_blank" rel="noopener noreferrer">
              <Twitter className="icon" />
            </a>
            <a href="https://www.youtube.com/@nithyaevent" target="_blank" rel="noopener noreferrer">
              <YouTube className="icon" />
            </a>
          </Box>


        </Box>

        <Box className="location">
          <LocationOn />
          <span style={{fontSize:'0.9rem'}}>Bengaluru, India</span>
        </Box>
        <p style={{fontSize:'0.7rem'}}>© 2025 | copyrights its Kadagam Ventures Private Limited</p>
      </Box>



      <Box sx={{ display: 'flex', justifyContent:'flex-end', alignItems: 'center', marginTop: '2rem' }}>

            
{showButton && (
  <Button
    onClick={scrollToTop}

  >
    <ArrowUpwardIcon sx={{ color: 'white' }} />
  </Button>
)}


</Box>
    </footer>
  );
};

export default Footer;
