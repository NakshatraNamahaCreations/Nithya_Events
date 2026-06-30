import React from "react";
import "./Items.css";

export default function Items({ items = [] }) {
  const sampleItems = [
    {
      id: 1,
      category: "Microphone",
      title: "Conference Mic",
      image:
        "/media/mic.jpg",
      rating: "4.88",
      reviews: "472k",
      price: "₹3,990",
      priceLabel: "/per day",
    },
    {
      id: 2,
      category: "Stand",
      title: "Keyboard Stand Rental",
      image:
        "/media/keyboard-stand1.png",
      rating: "4.00",
      reviews: "472k",
      price: "₹250",
      priceLabel: "/per day",
    },
    {
      id: 3,
      category: "Speaker",
      title: "Hartke Bass Amplifier Rental",
      image:
        "/media/amplifier2.png",
      rating: "4.98",
      reviews: "472k",
      price: "₹2,000",
      priceLabel: "/per day",
    },
    
  ];

  const list = (items && items.length > 0) ? items : sampleItems;

  return (
    <section className="pg-section" aria-labelledby="pg-heading">
      <div className="pg-container">
        <h2 id="pg-heading" className="pg-title">Items</h2>
         <span className="vd-items-count" style={{fontSize:"18px"}}>
  Total items : 0{list.length}
</span>

        <div className="pg-grid" role="list">
          {list.map((it) => (
            <article
              key={it.id}
              className="pg-card"
              role="listitem"
              tabIndex={0}
              aria-labelledby={`title-${it.id}`}
            >
              <div className="pg-card-media" aria-hidden>
                <img src={it.image} alt={it.title} loading="lazy" />
              </div>

              <div className="pg-card-body">
                <div className="pg-category">{it.category}</div>

                <h3 id={`title-${it.id}`} className="pg-item-title">{it.title}</h3>

               <div className="pg-meta">
  <div className="pg-rating" aria-label={`${it.rating} out of 5`}>
    <svg className="pg-star" viewBox="0 0 24 24" width="14" height="14" aria-hidden>
      <path
        fill="currentColor"
        d="M12 .587l3.668 7.431L23.5 9.75l-5.666 5.526L19.335 24 12 19.897 4.665 24l1.5-8.724L.5 9.75l7.832-1.732z"
      />
    </svg>
    <span className="pg-rating-num">{it.rating}</span>
    <span className="pg-reviews">({it.reviews})</span>
  </div>

  <div className="pg-price" aria-hidden>
  <span className="pg-price-amt">
    {it.price}
    <span className="pg-price-label">&nbsp;{it.priceLabel || "/per day"}</span>
  </span>
</div>

</div>

              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
