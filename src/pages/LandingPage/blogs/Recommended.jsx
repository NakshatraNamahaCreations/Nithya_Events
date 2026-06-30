import React from "react";
import { Link } from "react-router-dom";   // <-- added
import "./Recommended.css";

const sampleBlogs = [
  {
    id: 1,
    date: "November 13, 2025",
    title: "Power Up Your Big Day: Top Generator Rental Services for We...",
    img: "/media/rec-blog1.png",
    link: "/power-up-your-big-day"
  },
  {
    id: 2,
    date: "November 11, 2025",
    title: "How to Book Fabric Rentals Easily with Nithyaevent?",
    img: "/media/recent-blog3.jpeg",
    link: "/how-to-book-fabric-rentals"
  },
];

const recentBlogs = [
  {
    id: 1,
    date: "November 13, 2025",
    title: "Best Event Photography Rental Services in India Nithyaevent",
    img: "/media/rec-blog2.jpeg",
    link: "/best-event-photography"
  },
  {
    id: 2,
    date: "November 11, 2025",
    title: "How to Choose Perfect Lighting Setup for Events in In...",
    img: "/media/rec-blog4.jpeg",
    link: "/how-to-choose-perfect-lighting"
  },
];

export default function Recommended() {
  return (
    <>
      {/* Recommended section */}
      <section className="rd-section" aria-labelledby="recent-blogs-title">
        <div className="rd-inner">
          <h2 id="recent-blogs-title" className="rd-heading">
            Recommended for you
          </h2>

          <div className="rd-grid">
            {sampleBlogs.map((b) => (
              <Link to={b.link} key={b.id} className="rd-link">
                <article className="rd-card">
                  <div className="rd-accent-bar" aria-hidden="true" />

                  <div className="rd-media">
                    <div className="rd-media-bg" aria-hidden="true" />
                    <img src={b.img} alt={b.title} className="rd-thumb" loading="lazy" />
                  </div>

                  <div className="rd-meta">
                    <time className="rd-date">{b.date}</time>
                    <h3 className="rd-title">{b.title}</h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent blogs section */}
      <section className="rb-section">
        <div className="rb-inner">
          <div className="rb-grid">
            {recentBlogs.map((b) => (
              <Link to={b.link} key={b.id} className="rb-link">
                <article className="rb-card">
                  <div className="rb-accent-bar" aria-hidden="true" />

                  <div className="rb-media">
                    <div className="rb-media-bg" aria-hidden="true" />
                    <img src={b.img} alt={b.title} className="rb-thumbimg" loading="lazy" />
                  </div>

                  <div className="rb-meta">
                    <time className="rb-date">{b.date}</time>
                    <h3 className="rb-title">{b.title}</h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
