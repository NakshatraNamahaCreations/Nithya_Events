// RentalServices.jsx
import React from "react";
import "./RentalServices.css";
import { useNavigate } from "react-router-dom";
import NavbarMenu from "../components/NavbarMenu";

export default function RentalServices({
  // defaults (callers can override by passing props)
  title = "We Take Your Events from Good To Extraordinary !",
  subtitle = "Rent premium products, decor and essentials to elevate weddings, parties and corporate events.",
  ctas, // optional: array of { label, variant, onClick, to }
  images = {
    main: "/media/event3.jpg",
    thumbTop: "/media/event1.jpg",
    thumbBottom: "/media/event2.jpg",
  },
}) {
  const navigate = useNavigate();

  // default CTAs that use `navigate`. If the caller passes `ctas`, we use them (but if they include a "to" prop we wire navigation).
  const defaultCtas = [
    {
      label: "Explore Service",
      variant: "primary",
      onClick: () => navigate("/Sound"),
    },
    {
      label: "Get the App",
      variant: "outline",
      onClick: () => window.open("https://play.google.com/store", "_blank"),
    },
  ];

  // normalize CTAs: if a CTA has `to` but no onClick, convert it to a navigate handler.
  const ctaList = (Array.isArray(ctas) && ctas.length > 0)
    ? ctas.map((c) => {
        if (typeof c.onClick === "function") return c;
        if (c.to) return { ...c, onClick: () => navigate(c.to) };
        // fallback
        return { ...c, onClick: () => {} };
      })
    : defaultCtas;

  return (
    <>
    
    <section className="rs-section" aria-labelledby="rs-heading">
      <div className="rs-container">
        <div className="rs-left">
          <div className="rs-pretitle fw-bold">Rental Service</div>

          <h1 id="rs-heading" className="rs-title">
            {title}
          </h1>

          <p className="rs-sub">{subtitle}</p>

          <div className="rs-ctas" role="group" aria-label="Call to actions">
            {ctaList.map((c, i) => (
              <button
                key={i}
                type="button"
                className={`rs-cta ${c.variant === "primary" ? "primary" : "outline"}`}
                onClick={c.onClick}
              >
                {c.label}
                {c.variant === "outline" && <span className="rs-cta-arrow" aria-hidden><img src="/media/arrow-up.png" style={{width:"30px", height:"30px"}}/></span>}
              </button>
            ))}
          </div>
        </div>

        <aside className="rs-right" aria-hidden>
          <div className="rs-image-grid">
            <div className="rs-image-main">
              <img src={images.main} alt="Event main" loading="lazy" />
            </div>

            <div className="rs-image-column">
              <div className="rs-thumb rs-thumb-top">
                <img src={images.thumbTop} alt="Event thumbnail top" loading="lazy" />
              </div>

              <div className="rs-thumb rs-thumb-bottom">
                <img src={images.thumbBottom} alt="Event thumbnail bottom" loading="lazy" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
    </>
  );
}
