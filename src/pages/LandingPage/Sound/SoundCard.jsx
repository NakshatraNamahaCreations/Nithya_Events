// SoundCard.jsx
import React from "react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function SoundCard({ product }) {
  return (
    <article className="card">
     <div className="card-body">
  <div className="card-header">
    <h3 className="card-title">
      <Link to={`/product/${product.id}`}>{product.title}</Link>
    </h3>
    <button
      className={`fav ${product.fav ? "active" : ""}`}
      aria-label="Save to moodboard"
    >
      <FaHeart size={20} />
    </button>
  </div>



  <div className="card-meta">
    <div className="card-price">
      {product.discountPrice ? (
        <>
          <span className="discount">₹{product.discountPrice.toLocaleString()}</span>
          <span className="amount">₹{product.price.toLocaleString()}</span>
        </>
      ) : (
        <span className="amount">₹{product.price.toLocaleString()}</span>
      )}
      <span className="label">{product.priceLabel}</span>
    </div>
  </div>
</div>


      <div className="card-body">
    
        <h3 className="card-title"><Link to={`/product/${product.id}`}>{product.title}</Link></h3>
        

        <div className="card-meta">
          <div className="card-price">
            <span className="amount">₹{product.price.toLocaleString()}</span>
            <span className="label">{product.priceLabel}</span>
          </div>
        {/*}  <div className={`card-availability ${product.available ? "in" : "out"}`}>
            {product.available ? "Available" : "Unavailable"}
          </div>*/}
        </div>
      </div>
    </article>
  );
}
