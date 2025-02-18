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
      
            <Link to="/aboutUs" style={{textDecoration:'none'}}>
            <li>About Us</li>

            </Link>
            <Link to="/help-center" style={{textDecoration:'none'}}>
            <li>Help Center</li>
            </Link>
            <p>Contact Us</p>
            <p>info@nithyaevent.com</p>
            <p>Phone: +91 98765 43210</p>
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
    </footer>
  );
};

export default Footer;
