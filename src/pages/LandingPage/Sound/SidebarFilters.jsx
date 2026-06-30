import React, { useState } from "react";
import "./SidebarFilters.css";

export default function SidebarFilters({
  categories = [],
  selectedCategories = new Set(),
  onSetCategories = () => {},
  priceRange = [0, 5000],
  onChangePriceRange = () => {},
  onlyAvailable = false,
  onToggleAvailable = () => {},
  query = "",
  onQuery = () => {},
}) {
  const [localMin, localMax] = priceRange;

  // accordion open state: keys 'categories', 'price', 'availability'
  const [open, setOpen] = useState({
    categories: true,
    price: false,
    availability: false,
  });

  function togglePanel(key) {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handlePriceSubmit(e) {
    e.preventDefault();
    const min = Number(e.target.min.value || 0);
    const max = Number(e.target.max.value || 50000);
    onChangePriceRange([min, max]);
  }

  // Preferred display order
  const preferredOrder = ["Sound", "Genset", "Video", "Lighting", "Fabrication", "Shamiana"];

  // Build the ordered category list: always include preferred items
  const orderedSet = new Set();
  preferredOrder.forEach((c) => orderedSet.add(c));
  categories.forEach((c) => !orderedSet.has(c) && orderedSet.add(c));
  const orderedCategories = Array.from(orderedSet);

  // Are all categories selected?
  const allSelected =
    orderedCategories.length > 0 &&
    orderedCategories.every((c) => selectedCategories.has(c));

  // Toggle "All" -> select all or clear all using onSetCategories
  function handleAllToggle() {
    if (allSelected) {
      onSetCategories(new Set()); // clear selection => treat as "no filter"
    } else {
      onSetCategories(new Set(orderedCategories)); // select all
    }
  }

  // Single-select a category (only that category)
  function handleCategorySelect(c) {
    onSetCategories(new Set([c]));
  }

  return (
    <div className="filters accordion" aria-label="Sidebar filters">
      {/* Categories panel */}
      <div className="accordion-item">
        <h3 className="accordion-header">
          <button
            type="button"
            className="accordion-button"
            aria-expanded={open.categories}
            aria-controls="panel-categories"
            onClick={() => togglePanel("categories")}
          >
            Categories
       
          </button>
        </h3>

        <div
          id="panel-categories"
          className={`accordion-panel ${open.categories ? "open" : ""}`}
          role="region"
          aria-labelledby="panel-categories"
        >
          <div className="filter-list">
            <label className="filter-item">
              <input type="checkbox" checked={allSelected} onChange={handleAllToggle} />
              <span>All</span>
            </label>

            {orderedCategories.map((c) => (
              <label key={c} className="filter-item">
                <input
                  type="checkbox"
                  checked={selectedCategories.has(c)}
                  onChange={() => handleCategorySelect(c)}
                />
                <span>{c}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Price range panel */}
      <div className="accordion-item">
        <h3 className="accordion-header">
          <button
            type="button"
            className="accordion-button"
            aria-expanded={open.price}
            aria-controls="panel-price"
            onClick={() => togglePanel("price")}
          >
            Price range (₹)
          
          </button>
        </h3>

        <div
          id="panel-price"
          className={`accordion-panel ${open.price ? "open" : ""}`}
          role="region"
          aria-labelledby="panel-price"
        >
          <form onSubmit={handlePriceSubmit} className="price-form">
            <div className="price-row">
              <input name="min" type="number" defaultValue={localMin} className="price-input" aria-label="Minimum price" />
              <span className="price-sep">—</span>
              <input name="max" type="number" defaultValue={localMax} className="price-input" aria-label="Maximum price" />
            </div>
            <button type="submit" className="btn-primary small">Apply</button>
          </form>
        </div>
      </div>

      {/* Availability panel */}
      <div className="accordion-item">
        <h3 className="accordion-header">
          <button
            type="button"
            className="accordion-button"
            aria-expanded={open.availability}
            aria-controls="panel-availability"
            onClick={() => togglePanel("availability")}
          >
            Availability
        
          </button>
        </h3>

        <div
          id="panel-availability"
          className={`accordion-panel ${open.availability ? "open" : ""}`}
          role="region"
          aria-labelledby="panel-availability"
        >
          <label className="filter-item">
            <input type="checkbox" checked={onlyAvailable} onChange={onToggleAvailable} />
            <span>Only show available</span>
          </label>
        </div>
      </div>
    </div>
  );
}
