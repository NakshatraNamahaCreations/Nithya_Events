import "./DownloadApp.css";



export default function DownloadApp({
  title = "Download the app now!",
  subtitle = "Get instant access to event rentals and vendors anytime, anywhere",
  qrSrc = "/media/qrcode.jpeg",
  playStoreSrc = "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
  appStoreSrc = "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
}) {
  return (
    <section className="dw-section" aria-labelledby="dw-title">
      <div className="dw-container">
        <div className="dw-left">
          <div className="dw-image"><img src="/media/heart-beat-1.png"/></div>
          <h3 id="dw-title" className="dw-title">{title}</h3>
          <p className="dw-sub">{subtitle}</p>

          <div className="dw-badges" role="group" aria-label="Get the app">
            <a
              className="dw-badge"
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label="Get it on Google Play"
            >
              <img src={playStoreSrc} alt="Get it on Google Play" />
            </a>

            <a
              className="dw-badge"
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label="Download on the App Store"
            >
              <img src={appStoreSrc} alt="Download on the App Store" />
            </a>
          </div>
        </div>

       <div className="dw-right" aria-hidden="false">
  <div className="dw-phone-wrapper">
    <img src="/media/mobile-app.jpeg"/>
  </div>
 
</div>

      </div>
    </section>
  );
}
