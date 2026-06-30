import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaYoutube } from "react-icons/fa";

/**
 * Props:
 * - logo: url / path to small footer logo
 * - googleBadge / appleBadge: urls for store badges
 * - social: optional array of {name, href, svg} for social icons
 */
export default function Footer({
  logo = "/media/nithya-logo1.png",
  googleBadge = "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
  appleBadge = "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
}) {
  return (
    <footer className="fe-footer mt-5" role="contentinfo" aria-label="Footer">
      <div className="fe-inner">
     <div className="fe-top">
  {/* Logo and Brand Title — now on top center */}
  <div className="fe-brand fe-brand-top">
    <img className="fe-logo" src={logo} alt="NithyaEvent logo" />
    <div className="fe-brand-title">NithyaEvent</div>
  </div>

  {/* Link Columns */}
  <nav className="fe-links" aria-label="Footer navigation">
    <div className="fe-col">
      <h4 className="fe-col-title">Quick Links</h4>
      <ul className="fe-list">
        <li><a href="#">Home</a></li>
        <li><a href="#">About Us</a></li>
        <li><a href="#">Blogs</a></li>
        <li><a href="#">Partner with us</a></li>
      </ul>
    </div>

    <div className="fe-col">
      <h4 className="fe-col-title">Products</h4>
      <ul className="fe-list">
        <li><a href="#">Lights</a></li>
        <li><a href="#">Sounds</a></li>
        <li><a href="#">Video</a></li>
        <li><a href="#">Fabrications</a></li>
        <li><a href="#">Shamiana</a></li>
        <li><a href="#">Genset</a></li>
      </ul>
    </div>

    <div className="fe-col">
      <h4 className="fe-col-title">Legal</h4>
      <ul className="fe-list">
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms &amp; Conditions</a></li>
        <li><a href="#">Refund Policy</a></li>
        <li><a href="#">Help Center</a></li>
      </ul>
    </div>

    <div className="fe-col">
      <h4 className="fe-col-title">Our Entities</h4>
      <ul className="fe-list">
        <li><a href="#">Kadagam Ventures ptd ltd</a></li>
        <li><a href="#">Kadagam next</a></li>
        <li><a href="#">Nithya event vendor</a></li>
      </ul>
    </div>

    <div className="fe-col fe-col-social">
      <h4 className="fe-col-title">Social Links</h4>
      <div className="fe-social-row">
      <FaLinkedin color="#3a3a3a" size={18}/>
      <FaInstagram color="#3a3a3a" size={18}/>
      <FaFacebook color="#3a3a3a" size={18}/>
      <FaYoutube color="#3a3a3a" size={18}/>
      <FaWhatsapp color="#3a3a3a" size={18}/>
      </div>
      <div className="fe-app-copy">
        Better Experience<br />Download NithyaEvent app now
      </div>
      <div className="fe-badges">
        <a href="#"><img src={appleBadge} alt="App Store" /></a>
        <a href="#"><img src={googleBadge} alt="Google Play" /></a>
      </div>
    </div>
  </nav>
</div>


        <hr className="fe-sep" />

        <div className="fe-bottom">
          <div className="fe-location">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path fill="currentColor" d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/></svg>
            <span style={{fontSize:"18px"}}>Bengaluru, India</span>
          </div>

          <div className="fe-copy">© 2025 | copyrights its Nithya Events</div>
        </div>
      </div>
    </footer>
  );
}
