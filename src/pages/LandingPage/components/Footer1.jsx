import React from "react";
import "./Footer1.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer1() {
  return (
    <footer className="nnc-footer">
      <div className="nnc-footer-inner">

        {/* ========= TOP LOGO ROW ========= */}
        <div className="nnc-logo-row">
          <img
            className="nnc-logo"
            src="/media/nithya-logo1.png"
            alt="NithyaEvent"
          />
          <h3>NithyaEvent</h3>
        </div>

        {/* ========= COLUMNS SECTION ========= */}
        <div className="nnc-top">
          <div className="nnc-columns">

            {/* COLUMN 1 */}
            <div className="nnc-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
<li><Link to="/about-us">About Us</Link></li>
<li><Link to="/blog">Blogs</Link></li>
<li><Link to="/partner-with-us">Partner with us</Link></li>
              </ul>

              <div className="nnc-links-block">
                <h5>Links</h5>
                <p className="nnc-small">
                  Better Experience <br />
                  Download Nithyaevent app now
                </p>
                <div className="nnc-store-badges">
                  <img alt="app-store" src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" />
                  <img alt="play-store" src="/media/Appstore.svg" />
                </div>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="nnc-col">
              <h4>Products</h4>
              <ul>
                <li>Lights</li>
                <li>Sounds</li>
                <li>Video</li>
                <li>Fabrications</li>
                <li>Shamiana</li>
                <li>Genset</li>
              </ul>
            </div>

            {/* COLUMN 3 */}
            <div className="nnc-col">
              <h4>Services</h4>
              <ul>
                <li>Flex Banner Service</li>
                <li>Man Power</li>
                <li>Vendor & seller</li>
                <li>Event Tent</li>
                <li>Volunteer</li>
                <li>Security Personel</li>
                <li>Technical support</li>
                <li>Catering support</li>
                <li>Flower Decoration</li>
              </ul>
            </div>

            {/*COLUMN 4 */}
            <div className="nnc-col">
                <h4 style={{color:"#fff"}}>.</h4>
                <ul>
                <li>Stage Designers</li>
                <li>Freelancer</li>
                <li>Auditorium</li>
                <li>Photographer</li>
                <li>Artists</li>
                <li>Tele prompter</li>
                <li>Hotel</li>
                <li>Resort</li>
              </ul>
            </div>

            {/* COLUMN 5 */}
            <div className="nnc-col">
              <h4>Our Entities</h4>
              <ul className="nnc-links">
                <li><Link to="https://kadagamventures.com/" style={{textDecoration:"underline", fontWeight:"bold", letterSpacing:".5px"}}>Kadagam Ventures Private Limited</Link></li>
                <li><Link to="https://kadagamfoundation.org/" style={{textDecoration:"underline", fontWeight:"bold", letterSpacing:".5px"}}>Kadagam Foundation</Link></li>
                <li><Link to="https://www.nithyatickets.com/" style={{textDecoration:"underline", fontWeight:"bold", letterSpacing:".5px"}}> Nithya tickets</Link></li>
                <li><Link to="https://www.kadagamnext.com/" style={{textDecoration:"underline", fontWeight:"bold", letterSpacing:".5px"}}>Kadagam next</Link></li>
                <li><a href="#vendor" style={{textDecoration:"underline", fontWeight:"bold", letterSpacing:".5px"}}>Nithyaevent vendor</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* ========= MIDDLE SECTION ========= */}
        <div className="nnc-mid">

          <div className="nnc-legal">
            <h5>Legal</h5>
            <ul>
              <li><Link to="/user-privacy-policy">Privacy Policy</Link></li>
<li><Link to="/user-terms-and-conditions">Terms & Conditions</Link></li>
<li><Link to="/user-refund-policy">Refund Policy</Link></li>
<li><Link to="/user-help-center">Help Center</Link></li>

            </ul>
          </div>

          <div className="nnc-legal">
            <h5>Legal (vendor)</h5>
            <ul>
              <li><Link to="/user-privacy-policy">Privacy Policy</Link></li>
<li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
<li><Link to="/refund-policy">Refund Policy</Link></li>
<li><Link to="/help-center">Help Center</Link></li>
            </ul>
          </div>

          <div className="nnc-social-contact">
            <h5>Social Links</h5>
            <div className="nnc-social-icons">
              <a href="#linkedin" className="icon"><FaLinkedin/></a>
              <a href="#insta" className="icon"><FaInstagram/></a>
              <a href="#fb" className="icon"><FaFacebook/></a>
              <a href="#yt" className="icon"><FaYoutube/></a>
              <a href="#wa" className="icon"><FaWhatsapp/></a>
            </div>

            <div className="nnc-contact">
              <h6>Contact information</h6>
              <p className="nnc-email">✉ support@nithyaevents.com</p>
            </div>
          </div>

          {/* MAP */}
          <div className="nnc-map">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15551.082569756916!2d77.5800119871582!3d12.9865164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17b635334231%3A0xf421072b58352191!2sOff%20Queens%20Road!5e0!3m2!1sen!2sin!4v1763113245705!5m2!1sen!2sin"
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="nnc-map-frame"
  ></iframe>

  <p className="nnc-map-address">
    No.34 1st floor, venkatappa Road,<br />
    Tasker Town, Off Queens Road<br />
    Bengaluru - 56651
  </p>
</div>

        </div>

        {/* ========= BOTTOM ========= */}
        <hr className="fe-sep" />

        <div className="fe-bottom">
          <div className="fe-location">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path fill="currentColor" d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/></svg>
            <span style={{fontSize:"17px", textAlign:"center", fontFamily:"poppinsmed"}}>Bengaluru, India</span>
          </div>

          <div className="fe-copy text-center mt-3" style={{fontFamily:"poppinsmed", fontSize:"15px"}}>Copyright © 2025 Nithyaevent. All rights reserved</div>
        </div>
      </div>
    </footer>
  );
}
