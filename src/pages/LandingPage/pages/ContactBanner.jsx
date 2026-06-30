import React from "react";
import "./ContactBanner.css";


export default function ContactBanner({
  illustration = "/assets/partner-illustration.png",
  googleBadge = "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
  appleBadge = "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
}) {
  return (
    <section className="partner-section" aria-labelledby="partner-heading">
      <div className="partner-inner">
        <div className="partner-left">
          <h2 id="partner-heading" className="partner-title">
            Want to be our partner!
          </h2>

          <p className="partner-sub">
            Join Nithya Event and showcase your event<br/> services to thousands of users.
          </p>

       <div className="download-box" role="region" aria-label="Download vendor app">
  <div className="download-text">
    Download Nithya Event Vendor App to be a partner
  </div>

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
   {/*}   <img src="/media/spinner.png" className="spinner-img"/>*/}
      <img
        className="illustration"
        src="/media/want-to-partner.jpeg"
        alt="App preview"
      />
    </div>
  </div>
      </div>
    </section>
  );
}
