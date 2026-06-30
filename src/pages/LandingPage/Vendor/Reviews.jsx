// RatingsReviews.jsx
import React, { useState, useMemo } from "react";
import { FaRegThumbsDown, FaRegThumbsUp, FaStar, FaThumbsDown, FaThumbsUp } from "react-icons/fa";

const initialDistribution = [
  { stars: 5, count: 20000 },
  { stars: 4, count: 12000 },
  { stars: 3, count: 6900 },
  { stars: 2, count: 2200},
  { stars: 1, count: 10000 },
];

const sampleReviews = [
  {
    id: 1,
    name: "Saniya",
    avatar: "https://i.pravatar.cc/48?img=5",
    rating: 4,
    text: "Here is a clean, strong vendor-side poster content based on the same list of products & services - written in a way that speaks directly to vendors.",
    date: "2025-11-01",
    likes: 42,
dislikes: 2,

  },
  {
    id: 2,
    name: "Saniya",
    avatar: "https://i.pravatar.cc/48?img=5",
    rating: 3,
    text: "Here is a clean, strong vendor-side poster content based on the same list of products & services - written in a way that speaks directly to vendors.",
    date: "2025-10-28",
    likes: 42,
dislikes: 2,

  },
   {
    id: 2,
    name: "Saniya",
    avatar: "https://i.pravatar.cc/48?img=5",
    rating: 3,
    text: "Here is a clean, strong vendor-side poster content based on the same list of products & services - written in a way that speaks directly to vendors.",
    date: "2025-10-28",
    likes: 42,
dislikes: 2,

  },
   {
    id: 2,
    name: "Saniya",
    avatar: "https://i.pravatar.cc/48?img=5",
    rating: 3,
    text: "Here is a clean, strong vendor-side poster content based on the same list of products & services - written in a way that speaks directly to vendors.",
    date: "2025-10-28",
    likes: 42,
dislikes: 2,

  },
];

export default function Reviews() {
  const [distribution] = useState(initialDistribution);
  const [reviews, setReviews] = useState(sampleReviews);
  const [formRating, setFormRating] = useState(0);
  const [formText, setFormText] = useState("");

  const totalCount = useMemo(
    () => distribution.reduce((s, r) => s + r.count, 0),
    [distribution]
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (formRating === 0 && formText.trim() === "") return;
    const newReview = {
      id: Date.now(),
      name: "You",
      avatar: `https://i.pravatar.cc/48?u=${Date.now()}`,
      rating: formRating || 5,
      text: formText.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    setReviews([newReview, ...reviews]);
    setFormRating(0);
    setFormText("");
  }

  function handleLike(id) {
  setReviews(prev =>
    prev.map(r =>
      r.id === id ? { ...r, likes: (r.likes ?? 0) + 1 } : r
    )
  );
}

function handleDislike(id) {
  setReviews(prev =>
    prev.map(r =>
      r.id === id ? { ...r, dislikes: (r.dislikes ?? 0) + 1 } : r
    )
  );
}


  return (
    <section className="rr-section" aria-labelledby="rr-heading">
      <style>{styles}</style>

      <div className="rr-container">
        <h2 id="rr-heading" className="rr-title">Ratings &amp; Reviews</h2>

        {/* distribution */}
        <div className="rr-distribution" role="list" aria-label="Ratings distribution">
          {distribution.map((row) => {
            const pct = totalCount ? Math.round((row.count / totalCount) * 100) : 0;
            return (
              <div key={row.stars} className="rr-row" role="listitem">
               <span className="rr-star-num">
  <FaStar color="#000" style={{ marginRight: "6px" }} />
  {row.stars}
</span>


                <div className="rr-barwrap" aria-hidden>
                  <div className="rr-bar-bg">
                    <div
                      className="rr-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="rr-count">{formatCount(row.count)}</div>
              </div>
            );
          })}
        </div>

        <hr className="rr-sep" />

        {/* give review */}
        <div className="rr-give">
          <h3 className="rr-subtitle">Give Your Review</h3>

          <form onSubmit={handleSubmit} className="rr-form">
            <div className="rr-form-top">
              <div className="rr-avatar">
                <img src="https://i.pravatar.cc/48?img=47" alt="Your avatar" />
              </div>

              <div className="rr-form-controls">
                <div className="rr-form-name" style={{fontFamily:'poppinsmed'}}> Saniya</div>

                <div className="rr-star-input" role="radiogroup" aria-label="Select rating">
                  {[1,2,3,4,5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`rr-star-btn ${n <= formRating ? "active" : ""}`}
                      aria-pressed={n <= formRating}
                      onClick={() => setFormRating(n)}
                      title={`${n} star${n>1 ? "s" : ""}`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <textarea
              className="rr-textarea"
              placeholder="Description"
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              rows={4}
              aria-label="Review description"
            />

           {/*} <div className="rr-form-actions">
              <button type="submit" className="rr-submit">Submit Review</button>
            </div>*/}
          </form>
        </div>

        <hr className="rr-sep"  />

        {/* reviews list */}
        <div className="rr-list" aria-live="polite">
          {reviews.map((r) => (
            <article key={r.id} className="rr-review">
              <div className="rr-review-left">
                <img className="rr-review-avatar" src={r.avatar} alt={`${r.name} avatar`} />
              </div>

             <div className="rr-review-body">
  <div className="rr-review-head">
    <div className="rr-review-name">{r.name}</div>
  </div>

  

  <div className="rr-review-footer">

  {/* ⭐ Rating instead of date */}
  <div className="rr-review-rating-stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        size={18}
        color={i < r.rating ? "#f6c84c" : "#e6e6e6"}
        style={{ marginRight: 4 }}
      />
    ))}
  </div>

  <div className="rr-actions">
    <button className="rr-like-btn" onClick={() => handleLike(r.id)}>
      <FaRegThumbsUp size={30} color="#575757"/> {r.likes}
    </button>

    <button className="rr-dislike-btn" onClick={() => handleDislike(r.id)}>
      <FaRegThumbsDown size={30} color="#575757"/> {r.dislikes}
    </button>
  </div>

</div>
{r.text ? <p className="rr-review-text">{r.text}</p> : null}

</div>

            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* helpers */
function formatCount(n){
  // display K shorthand if large
  if (n >= 1000) {
    const k = Math.round(n / 100) / 10; // one decimal
    return `${k}k`;
  }
  return String(n);
}

const styles = `
:root {
  --muted: #6b7280;
  --line: #5a5a5aff;
  --accent: #22c55e; /* green for 5 star */
  --bg: #fff;
  --card: #fff;
  --text: #111827;
}

.rr-section {
  font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  color: var(--text);
  padding: 28px;
  background: var(--bg);
}

.rr-container {
  max-width: 1280px;
  margin: 0 auto;
}

/* title */
.rr-title {
  font-size: 24px;
  margin: 0 0 18px 0;
  font-weight: 500;
  font-family: 'poppinsmed'
}

/* distribution rows */
.rr-distribution {
    display: grid;
    gap: 40px;
    margin-bottom: 12px;
    max-width: 600px;
}

.rr-row {
  display: grid;
  grid-template-columns: 50px 1fr 64px;
  gap: 12px;
  align-items: center;
}

.rr-starcell {
  display:flex;
  align-items:center;
  justify-content:flex-start;
  color: var(--muted);
  font-weight: 600;
}
.rr-star-num {
  display:flex;
  width:28px;
  height:28px;
  border-radius:14px;
  text-align:center;
  line-height:28px;
  font-size:14px;
  color: var(--muted);
  font-family: 'poppinsreg';
  align-items: center
  
}

/* bar */
.rr-barwrap { width:100%; }
.rr-bar-bg {
  background: #f1f3f5;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}
.rr-bar-fill {
  background: linear-gradient(90deg, var(--accent) 0%, #9be9a0 100%);
  height: 100%;
  border-radius: 999px;
  transition: width 400ms ease;
}

/* count */
.rr-count {
  text-align: right;
  color: var(--muted);
  font-weight: 600;
  font-family: 'poppins'
}

/* separator */
.rr-sep {
  border: none;
  border-bottom: 3px solid var(--line);
  margin: 40px 0;
}

/* Give your review */
.rr-give { margin-bottom: 10px; }
.rr-subtitle { margin: 0 0 12px 0; font-size: 18px; font-weight: 500; font-family: 'poppinsmed' }

.rr-form {
  display: grid;
  gap: 12px;
}

.rr-form-top {
  display:flex;
  gap: 12px;
  align-items: center;
}

.rr-avatar img {
  width:48px;
  height:48px;
  border-radius:50%;
  display:block;
  object-fit:cover;
  border: 2px solid #fff;
}

.rr-form-name { font-weight: 500; color: var(--muted); }

/* star input */
.rr-star-input { display:flex; gap:8px; }
.rr-star-btn {
  border: 1px solid transparent;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  font-size: 18px;
}
.rr-star-btn.active, .rr-star-btn:hover {
  color: #f6c84c;
}
.rr-star-btn:focus { outline: 2px solid rgba(0,0,0,0.06); }

/* textarea */
.rr-textarea {
  width: 100%;
  min-height: 86px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--line);
  resize: vertical;
  font-size: 14px;
  font-family: 'poppinsmed';
}

/* form actions */
.rr-form-actions { display:flex; justify-content:flex-end; }
.rr-submit {
  background: #0f172a;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

/* reviews list */
.rr-list {
  display: grid;
  gap: 18px;
  margin-top: 8px;
}

.rr-review {
  display:flex;
  gap: 12px;
  align-items:flex-start;
  padding: 12px 0;
}

.rr-review-left img {
  width:44px;
  height:44px;
  border-radius:50%;
  object-fit:cover;
}

.rr-review-head {
  display:flex;
  align-items:center;
  gap:12px;
  justify-content:space-between;
}

.rr-review-body { flex:1; }

.rr-review-name { font-weight:500; color: #0f172a; font-family: 'poppinsmed'}
.rr-review-rating { display:flex; gap:4px; align-items:center; }
.rr-small-star { color: #e6e6e6; }
.rr-small-star.filled { color: #f6c84c; }

.rr-review-text {
  margin:8px 0;
  color:#595959;
  font-family: 'poppinsreg';
  font-size: 14px;
  max-width: 900px
}

.rr-review-date { color: var(--muted); font-size: 13px; }

.rr-review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}

.rr-actions {
  display: flex;
  gap: 12px;
}

.rr-like-btn,
.rr-dislike-btn {
  background: transparent;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-family:'poppinsreg';
  color: #626262ff
}

.rr-like-btn:hover {
  background: #e6ffe6;
}

.rr-dislike-btn:hover {
  background: #ffe6e6;
}

.rr-review-rating-stars {
  display: flex;
  align-items: center;
}


/* small screens */
@media (max-width:720px) {
  .rr-row { grid-template-columns: 36px 1fr 56px; }
  .rr-banner { display:none; }
}
`;
