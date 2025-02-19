import React from "react";
import "./styles.scss";
import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  LocationOn,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer-main">
      <div className="footer-container">
        <div className="footer-column">
          <h3>Shop by Category</h3>
          <ul>
            <li onClick={() => navigate("/category/sound")}>Sounds</li>
            <li onClick={() => navigate("/category/lighting")}>Lights</li>
            <li onClick={() => navigate("/category/fabrication")}>
              Fabrications
            </li>
            <li onClick={() => navigate("/category/shamiana")}>Shamiana</li>
            <li onClick={() => navigate("/category/video")}>Video</li>
            <li onClick={() => navigate("/category/genset")}>Genset</li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>About</h3>
          <ul>
            <Link to="/aboutUs" style={{ textDecoration: "none" }}>
              <li>About Us</li>
            </Link>
            <Link to="/help-center" style={{ textDecoration: "none" }}>
              <li>Help Center</li>
            </Link>
            <p>Contact Us</p>
            <p>Support@nithyaevents.com</p>
            <p>Phone: +91 99801370001</p>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Policy</h3>
          <ul>
            <li onClick={() => navigate("/privacyPolicy")}>Privacy Policy</li>
            <li onClick={() => navigate("/TermsAndCondition")}>
              Terms and conditions
            </li>
            <li onClick={() => navigate("/returnPolicy")}>Refund Policy</li>
          </ul>
        </div>

        <div className="footer-column">
          <div className="social-media">
            <Facebook className="icon" />
            <Instagram className="icon" />
            <Twitter className="icon" />
            <YouTube className="icon" />
          </div>
          <div className="location">
            <LocationOn />
            <span>Bengaluru, India</span>
          </div>
          <p>© 2025 | Nithya All Rights Reserved</p>
        </div>
      </div>

      {/* 📍 Google Maps Integration */}
      <div className="footer-map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62207.564887681794!2d77.51997442373327!3d12.973591159377882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17005b0a5e31%3A0xb6796593445e2823!2sKadagam%20Ventures!5e0!3m2!1sen!2sin!4v1739967980569!5m2!1sen!2sin"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: "10px", marginTop: "20px" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </footer>
  );
};

export default Footer;
