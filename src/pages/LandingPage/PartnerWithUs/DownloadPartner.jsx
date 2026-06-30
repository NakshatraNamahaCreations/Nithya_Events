import React from "react";
import "../pages/ContactBanner.css";


export default function ContactBanner({
  illustration = "/assets/partner-illustration.png",
  googleBadge = "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
  appleBadge = "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
}) {
  return (
    <section className="partner-section" aria-labelledby="partner-heading">
      <div className="partner-inner">
        <div className="partner-left">
         

        

       <div className="download-box" role="region" aria-label="Download vendor app" style={{padding: "30px"}}>
  
 <h2 id="partner-heading" className="partner-title">
           Download nithya event<br/> vendor app now
          </h2>
  <div className="badges-vertical">
    <a
      className="badge-link"
      href="#"
      aria-label="Get it on Google Play"
      rel="noopener noreferrer"
    >
      <img
        className="badge-img"
        src={googleBadge}
        alt="Get it on Google Play"
      />
    </a>

    <a
      className="badge-link"
      href="#"
      aria-label="Download on the App Store"
      rel="noopener noreferrer"
    >
      <img
        className="badge-img"
        src={appleBadge}
        alt="Download on the App Store"
      />
    </a>
  </div>
</div>

        </div>

        <div className="partner-right">
    <div className="illustration-wrapper">
    
      <img
        className="illustration"
        src="/media/download-promo.jpeg"
        alt="App preview"
        style={{width:'400px', objectFit:"cover", height:"400px"}}
      />
    </div>
  </div>
      </div>
    </section>
  );
}
