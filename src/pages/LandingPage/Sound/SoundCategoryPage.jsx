// src/pages/SoundCategoryPage.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarFilters from "./SidebarFilters";
import "./SoundCategory.css";

function SoundCard({ product }) {
  return (
    <article className="card">
      <div className="card-media">
        <Link to={`/product/${product.id}`} className="card-media-link" aria-label={product.title}>
          <img src={product.image} alt={product.title} loading="lazy" />
        </Link>

        <button className={`fav ${product.fav ? "active" : ""}`} aria-label="Save to moodboard">♡</button>
      </div>

      <div className="card-body">
        <h3 className="card-title"><Link to={`/product/${product.id}`}>{product.title}</Link></h3>
        
        <p className="card-review">{product.review}</p>

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
            <span className="label"> {product.priceLabel}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* Sample data — replace with API data as needed */
const SAMPLE_PRODUCTS = [
  {
    id: "p1",
    title: "Conference mic",
   // description: "High-quality condenser mic ideal for conferences.",
    category: "Sound",
    image: "/media/conference-mic.jpg",
    price: 500,
    discountPrice: 400,
    priceLabel: "Per day",
    review: "0 Reviews"
  },
  {
    id: "p2",
    title: "Keyboard Stand",
  //  description: "Adjustable keyboard stand rental.",
    category: "Sound",
    image: "/media/keyboard-stand1.png",
    price: 250,
    discountPrice: 500,
    priceLabel: "Per day",
    review: "0 Reviews"
  },
  {
    id: "p3",
    title: "Clear Communication",
  //  description: "Powerful bass amp for live events and halls.",
    category: "Sound",
    image: "/media/communication.jpg",
    price: 1500,
    discountPrice: 1200,
    priceLabel: "Per day",
    review: "0 Reviews"
  },
  {
    id: "p4",
    title: "Quiz Buzzer Wir...",
  //  description: "Reliable generator for medium events (5kVA).",
    category: "Genset",
    image: "/media/buzzer-wire-2.png",
    price: 2500,
    discountPrice: 2000,
    priceLabel: "Per day",
    review: "0 Reviews"
  },
  {
    id: "p5",
    title: "Quiz Buzzer Lat...",
 //   description: "Reliable generator for medium events (5kVA).",
    category: "Genset",
    image: "/media/buzzer-wire1.jpg",
    price: 1000,
    discountPrice: 800,
    priceLabel: "Per day",
    review: "0 Reviews"
  },
];

export default function SoundCategoryPage() {
  const [products] = useState(SAMPLE_PRODUCTS);
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [priceRange, setPriceRange] = useState([0, 5000]); 
  const [sortBy, setSortBy] = useState("default");
  
  const navigate = useNavigate();

  // modal state
  const [showMoodPopup, setShowMoodPopup] = useState(false);
  const [projectName, setProjectName] = useState("");
  const inputRef = useRef(null);

  // initialize selectedCategories to all categories on first load
  useEffect(() => {
    if (products.length > 0) {
      const allCategories = new Set(products.map((p) => p.category));
      setSelectedCategories(allCategories);
    }
  }, [products]);

  // focus input when modal opens
  useEffect(() => {
    if (showMoodPopup && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showMoodPopup]);

  // categories derived from products
  const categories = useMemo(() => {
    const s = new Set(products.map((p) => p.category));
    return Array.from(s);
  }, [products]);

  // filtered + sorted list (treat empty set as "no category filter", though we initialize all selected)
  const filtered = useMemo(() => {
    const [minP, maxP] = priceRange;
    let list = products.filter((p) => {
      // text search
      if (
        query &&
        !p.title.toLowerCase().includes(query.toLowerCase()) &&
        !p.description.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }

      // category filtering: if selectedCategories is empty -> show all
      if (selectedCategories.size > 0 && !selectedCategories.has(p.category)) return false;

      // price - compare against discountPrice if present (show items within range if either price or discount fits)
      const effectivePrice = p.discountPrice && typeof p.discountPrice === "number" ? p.discountPrice : p.price;
      if (effectivePrice < minP || effectivePrice > maxP) return false;

      return true;
    });

    // sorting
    if (sortBy === "price-asc") {
      list.sort((a, b) => {
        const pa = a.discountPrice || a.price;
        const pb = b.discountPrice || b.price;
        return pa - pb;
      });
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => {
        const pa = a.discountPrice || a.price;
        const pb = b.discountPrice || b.price;
        return pb - pa;
      });
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [products, query, selectedCategories, priceRange, sortBy]);

  const handleOpenMoodPopup = () => {
    setProjectName("");
    setShowMoodPopup(true);
  };

  const handleSaveMoodboard = () => {
  const trimmed = projectName.trim();
  if (!trimmed) {
    // simple validation - prefer inline message in real UI
    alert("Please enter a project name.");
    if (inputRef.current) inputRef.current.focus();
    return;
  }

  // create moodboard object
  const newMoodboard = {
    id: `mb-${Date.now()}`,
    name: trimmed,
    createdAt: new Date().toISOString(),
    // optionally include the current palette or other data:
    // palette: currentPalette
  };

  // Save to localStorage (keeps a list of moodboards)
  try {
    const key = "moodboards_v1";
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(newMoodboard);
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (e) {
    console.warn("Could not save moodboard to localStorage", e);
  }

  // optionally log
  console.log("Saved moodboard:", newMoodboard);

  // close modal and clear
  setShowMoodPopup(false);
  setProjectName("");

navigate('/projectpage', { state: { moodboard: newMoodboard } });
};


  return (
    <div className="sc-page">
      <div className="sc-topbar">
        <div className="sc-breadcrumb">
          <Link to="/">Home</Link> &gt; <span style={{ color: "#959595" }}>sound</span>
        </div>

        <div className="sc-moodboard">
          <button className="btn-outline" onClick={handleOpenMoodPopup}>
            Create MoodBoard <span className="plus">+</span>
          </button>
        </div>
      </div>

      <div className="sc-head">
        <h1 className="sc-title">SOUND CATEGORY</h1>
      </div>

      <div className="sc-body">
        <aside className="sc-sidebar" aria-label="Filters">
          <SidebarFilters
            categories={categories}
            selectedCategories={selectedCategories}
            onSetCategories={(newSet) => setSelectedCategories(newSet)}
            priceRange={priceRange}
            onChangePriceRange={setPriceRange}
            query={query}
            onQuery={setQuery}
          />
        </aside>

        <main className="sc-main">
          <div className="sc-controls">
            <div className="sc-results">Showing {filtered.length} results</div>

            <div className="sc-sort-row">
              <label htmlFor="sort">Sort By:</label>
              <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          <div className="sc-grid">
            {filtered.map((p) => (
              <SoundCard key={p.id} product={p} />
            ))}
          </div>
        </main>
      </div>

      {/* MoodBoard Popup Modal */}
      {showMoodPopup && (
        <div
          className="popup-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Create new moodboard"
          onClick={() => setShowMoodPopup(false)}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Project</h3>

           
            <input
              id="projectName"
              ref={inputRef}
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
            />

            <div className="popup-buttons">
              <button className="btn-save" onClick={handleSaveMoodboard}>
                Save
              </button>
              <button className="btn-cancel" onClick={() => setShowMoodPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
