import React, { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "./NearByVendor.css"

const sampleVendors = [
  { id: 1, name: "Bangalore", img: "/media/vendor.png", link: "/bangalore" },
  { id: 2, name: "Ramanagara", img: "/media/vendor.png", link: "/ramanagara" },
  { id: 3, name: "Ramanagara", img: "/media/vendor.png", link: "/ramanagara1" },
  
];

export default function NearbyVendors({ vendors = sampleVendors }) {
  const [query, setQuery] = useState("");
  const scrollRef = useRef(null);

  const scrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;

    // find a card inside the list
    const card = el.querySelector(".nv-item");
    if (!card) return;

    // card width + gap (gap approx 28px in CSS). We use computed style if available.
    const gap = 28;
    const cardWidth = card.offsetWidth + gap;
    el.scrollBy({ left: cardWidth, behavior: "smooth" });
  };

  const filtered = vendors.filter((v) =>
    v.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section className="nearby-vendors">
    

      <div className="nv-inner">
        <div className="nv-header">
          <h2>Near by Vendor</h2>

          <div className="nv-search">
            <FaSearch className="nv-search-icon" />
            <input
              placeholder="Search by vendor name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{fontFamily:"poppinsreg"}}
            />
          </div>
        </div>

        {/* vendor grid — scrollRef attached so arrow can scroll horizontally if desired */}
        <div className="nv-list-wrap">
          <div className="nv-list" ref={scrollRef}>
            {filtered.length === 0 && (
              <div className="nv-empty">No vendors found.</div>
            )}

            {filtered.map((v) => (
              <Link key={v.id} to={v.link} className="nv-link nv-item">
                <div className="nv-card">
                  <div className="nv-thumb">
                    <img
                      src={v.img}
                      alt={v.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://via.placeholder.com/420x200?text=Vendor";
                      }}
                    />
                  </div>
                </div>

                {/* title placed outside the white card (separate, left aligned) */}
                <div className="nv-meta">
                  <h3>
                    <FaLocationDot color="#707070ff" /> {v.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* circular arrow placed overlapping the right side like the screenshot */}
          <button
            aria-label="Scroll vendors right"
            className="nv-arrow"
            onClick={scrollRight}
          >
            <FaArrowRight />
          </button>
        </div>

        <div className="nv-footer">
          <button className="nv-btn">View All Vendor</button>
        </div>
      </div>
    </section>
  );
}

