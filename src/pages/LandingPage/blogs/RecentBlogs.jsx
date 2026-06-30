import React from "react";
import { Link } from "react-router-dom";   // <-- added
import "./RecentBlogs.css";

const sampleBlogs = [
  {
    id: 1,
    date: "November 13, 2025",
    title: "How to Choose the Perfect Shamiana Rental for Your Event?",
    img: "/media/recent-blog2.jpeg",
    link: "/how-to-choose-perfect-shamiana"
  },
  {
    id: 2,
    date: "November 11, 2025",
    title: "How Task Management Software Transforms the Way Teams Work",
    img: "/media/recent-blog1.jpeg",
    link: "/how-task-management"
  },
];

export default function RecentBlogs() {
  return (
    <section className="rb-section" aria-labelledby="recent-blogs-title">
      <div className="rb-inner">
        <h2 id="recent-blogs-title" className="rb-heading">
          Recent Blogs
        </h2>

        <div className="rb-grid">
          {sampleBlogs.map((b) => (
            <Link to={b.link} key={b.id} className="rb-link">
              <article className="rb-card">
                <div className="rb-accent-bar" aria-hidden="true" />

                <div className="rb-media">
                  <div className="rb-media-bg" aria-hidden="true" />
                  <img
                    src={b.img}
                    alt={b.title}
                    className="rb-thumb"
                    loading="lazy"
                  />
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
  );
}
