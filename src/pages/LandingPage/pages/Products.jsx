import React, { useState, useEffect } from "react";
import "./Products.css";

export default function Products({ items = [] }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://api.nithyaevent.com/api/product/getrentalproduct"
        );
        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          // Transform API data to match the expected format
          const transformedProducts = data.data.map((product) => ({
            id: product._id,
            category: product.product_category || "Rental",
            title: product.product_name,
            image:
              product.product_image && product.product_image.length > 0
                ? product.product_image[0]
                : "/media/mic.jpg",
            rating: calculateAverageRating(product.Reviews),
            reviews: formatReviewCount(product.Reviews),
            price: `₹${product.product_price}`,
            priceLabel: "/per day",
            discount: product.discount || 0,
            mrp: product.mrp_rate || product.product_price
          }));

          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Calculate average rating from reviews
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "4.50";

    const total = reviews.reduce(
      (sum, review) => sum + (review.ratings || 0),
      0
    );
    const average = total / reviews.length;
    return average.toFixed(1); // Show 1 decimal place
  };

  // Format review count
  const formatReviewCount = (reviews) => {
    if (!reviews) return "0";
    if (reviews.length >= 1000) return `${(reviews.length / 1000).toFixed(1)}k`;
    return reviews.length.toString();
  };

  // Handle load more
  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  // Determine which items to display
  const displayItems =
    products.length > 0 ? products.slice(0, visibleCount) : [];

  return (
    <section className="pg-section" aria-labelledby="pg-heading">
      <div className="pg-container">
        <div className="pg-header">
          <h2 id="pg-heading" className="pg-title">
            Products for Rent
          </h2>
          <p className="pg-subtitle">Find the perfect rental equipment for your events</p>
        </div>

        <div className="pg-grid" role="list">
          {displayItems.map((it) => (
            <article
              key={it.id}
              className="pg-card"
              role="listitem"
              tabIndex={0}
              aria-labelledby={`title-${it.id}`}
            >
              <div className="pg-card-media" aria-hidden>
                <img src={it.image} alt={it.title} loading="lazy" />
                {/* {it.discount > 0 && (
                  <div className="pg-discount-badge">
                    {it.discount}% OFF
                  </div>
                )} */}
              </div>

              <div className="pg-card-body">
                <div className="pg-category">{it.category}</div>

                <h3 id={`title-${it.id}`} className="pg-item-title">
                  {it.title}
                </h3>

                <div className="pg-meta">
                  <div
                    className="pg-rating"
                    aria-label={`${it.rating} out of 5`}
                  >
                    <svg
                      className="pg-star"
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      aria-hidden
                    >
                      <path
                        fill="currentColor"
                        d="M12 .587l3.668 7.431L23.5 9.75l-5.666 5.526L19.335 24 12 19.897 4.665 24l1.5-8.724L.5 9.75l7.832-1.732z"
                      />
                    </svg>
                    <span className="pg-rating-num">{it.rating}</span>
                    <span className="pg-reviews">({it.reviews})</span>
                  </div>

                  <div className="pg-price-container">
                    <div className="pg-price" aria-hidden>
                      <span className="pg-price-amt">
                        {it.price}
                        <span className="pg-price-label">
                          &nbsp;{it.priceLabel || "/per day"}
                        </span>
                      </span>
                    </div>
                    {it.discount > 0 && (
                      <div className="pg-original-price">
                        <span className="pg-mrp">₹{it.mrp}</span>
                        <span className="pg-discount-text">{it.discount}% off</span>
                      </div>
                    )}
                  </div>
                </div>

                <button className="pg-rent-btn">
                  Rent Now
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        {products.length > visibleCount && (
          <div className="pg-load-more-container">
            <button
              className="pg-load-more-btn"
              onClick={handleLoadMore}
            >
              Load More Products
              <svg className="pg-arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="pg-no-products">
            <p>No rental products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
// import React from "react";
// import "./Products.css";

// export default function Products({ items = [] }) {
//   const sampleItems = [
//     {
//       id: 1,
//       category: "Microphone",
//       title: "Conference Mic",
//       image:
//         "/media/mic.jpg",
//       rating: "4.88",
//       reviews: "472k",
//       price: "₹3,990",
//       priceLabel: "/per day",
//     },
//     {
//       id: 2,
//       category: "Stand",
//       title: "Keyboard Stand Rental",
//       image:
//         "/media/mic.jpg",
//       rating: "4.00",
//       reviews: "472k",
//       price: "₹250",
//       priceLabel: "/per day",
//     },
//     {
//       id: 3,
//       category: "Speaker",
//       title: "Hartke Bass Amplifier Rental",
//       image:
//         "https://images.unsplash.com/photo-1518444025536-8a7a7a88f9d1?w=800&q=60",
//       rating: "4.98",
//       reviews: "472k",
//       price: "₹2,000",
//       priceLabel: "/per day",
//     },
//     {
//       id: 4,
//       category: "Percussion",
//       title: "Conga Set Rental",
//       image:
//         "https://images.unsplash.com/photo-1511376777868-611b54f68947?w=800&q=60",
//       rating: "4.72",
//       reviews: "12k",
//       price: "₹1,200",
//       priceLabel: "/per day",
//     },
//     {
//       id: 5,
//       category: "Mic Kit",
//       title: "Lavalier Mic + Windscreen",
//       image:
//         "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=800&q=60",
//       rating: "4.60",
//       reviews: "9k",
//       price: "₹350",
//       priceLabel: "/per day",
//     },
//   ];

//   const list = (items && items.length > 0) ? items : sampleItems;

//   return (
//     <section className="pg-section" aria-labelledby="pg-heading">
//       <div className="pg-container">
//         <h2 id="pg-heading" className="pg-title">Products for Rent</h2>

//         <div className="pg-grid" role="list">
//           {list.map((it) => (
//             <article
//               key={it.id}
//               className="pg-card"
//               role="listitem"
//               tabIndex={0}
//               aria-labelledby={`title-${it.id}`}
//             >
//               <div className="pg-card-media" aria-hidden>
//                 <img src={it.image} alt={it.title} loading="lazy" />
//               </div>

//               <div className="pg-card-body">
//                 <div className="pg-category">{it.category}</div>

//                 <h3 id={`title-${it.id}`} className="pg-item-title">{it.title}</h3>

//                <div className="pg-meta">
//   <div className="pg-rating" aria-label={`${it.rating} out of 5`}>
//     <svg className="pg-star" viewBox="0 0 24 24" width="14" height="14" aria-hidden>
//       <path
//         fill="currentColor"
//         d="M12 .587l3.668 7.431L23.5 9.75l-5.666 5.526L19.335 24 12 19.897 4.665 24l1.5-8.724L.5 9.75l7.832-1.732z"
//       />
//     </svg>
//     <span className="pg-rating-num">{it.rating}</span>
//     <span className="pg-reviews">({it.reviews})</span>
//   </div>

//   <div className="pg-price" aria-hidden>
//   <span className="pg-price-amt">
//     {it.price}
//     <span className="pg-price-label">&nbsp;{it.priceLabel || "/per day"}</span>
//   </span>
// </div>

// </div>

//               </div>
//             </article>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
