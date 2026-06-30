import "./AppPromo.css";



export default function AppPromo({
  title = "For better Experience download nithyaevent app",
  //subtitle = "Get instant access to event rentals and vendors anytime, anywhere",
  qrSrc = "/media/qrcode.jpeg",
  playStoreSrc = "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
  appStoreSrc = "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
}) {
  return (
    <section className="da-section" aria-labelledby="da-title">
      <div className="da-container">
        <div className="da-left">
      
          <h3 id="da-title" className="da-title">{title}</h3>
        {/*}  <p className="da-sub">{subtitle}</p>*/}

          <div className="da-badges" role="group" aria-label="Get the app">
            <a
              className="da-badge"
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label="Get it on Google Play"
            >
              <img src={playStoreSrc} alt="Get it on Google Play" />
            </a>

            <a
              className="da-badge"
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label="Download on the App Store"
            >
              <img src={appStoreSrc} alt="Download on the App Store" />
            </a>
          </div>
        </div>

       <div className="da-right" aria-hidden="false">
  <div className="da-phone-wrapper">
    <img src="/media/app-promo.jpeg"/>
  </div>
 
</div>

      </div>
    </section>
  );
}
