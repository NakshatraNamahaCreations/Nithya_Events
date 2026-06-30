import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // close mobile menu on escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navItems = [
    { to: "/about-us", label: "About Us" },
    { to: "/blog", label: "Blogs" },
    { to: "/partner-with-us", label: "Partner With Us" },
  ];

  return (
    <header className="ne-header">
      <div className="ne-container">
        {/* LEFT: logo (always at left) */}
        <div className="ne-left">
          <div className="ne-logo">
            <Link to="/" className="ne-logo-link" aria-label="Nithyaevent home">
              <h4>Nithyaevent</h4>
            </Link>
          </div>
        </div>

        {/* Desktop nav (pushed to the right via CSS) */}
        <nav className="ne-nav" aria-label="Primary">
          <ul className="ne-nav-list">
            {navItems.map((item) => (
              <li key={item.to} className="ne-nav-item">
                <Link to={item.to} className="ne-nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile hamburger (remains at the far right) */}
        <button
          className="ne-hamburger"
          onClick={() => setMobileOpen((s) => !s)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
          aria-controls="ne-mobile-menu"
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        id="ne-mobile-menu"
        className={`ne-mobile ${mobileOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
      >
        <div
          className="ne-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        <div className="ne-mobile-panel" role="document">
          <nav className="ne-mobile-nav" aria-label="Mobile Primary">
            <ul>
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="ne-mobile-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
