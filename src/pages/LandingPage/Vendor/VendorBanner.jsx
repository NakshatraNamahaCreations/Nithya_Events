// VendorDetail.jsx
import React from "react";
import { FaArrowLeft, FaStar, FaMapMarkerAlt } from "react-icons/fa";

const sampleVendor = {
  id: 1,
  company: "AV Tech",
  banner: "/media/vendor.png",
  categories: "Sound • Lights • Video",
  reviewsText: "3.2 (3k Reviews)",
  locality: "Queens Road, Bangalore Karnataka",
};

export default function VendorDetail({ vendor = sampleVendor, onBack }) {
  return (
    <div className="vd-wrap">
      <style>{styles}</style>

      {/* Topbar */}
      <div className="vd-topbar">
        <button
          className="vd-back"
          onClick={() => (onBack ? onBack() : window.history.back())}
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>

        <h1 className="vd-title">Vendors</h1>
      </div>

      {/* Banner + Sidebar */}
      <div className="vd-main">
        <div className="vd-left">
          <div className="vd-banner">
            <img
              src={vendor.banner}
              alt={vendor.company}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://via.placeholder.com/780x300?text=Vendor+Banner";
              }}
            />
          </div>
        </div>

        {/* Right Panel */}
        <aside className="vd-right">
          <div className="vd-right-inner">
            <div className="vd-row">
              <div className="vd-label">Company Name</div>
              <div className="vd-value">{vendor.company}</div>
            </div>

            <div className="vd-row">
              <div className="vd-label">Categories</div>
              <div className="vd-value">{vendor.categories}</div>
            </div>

            <div className="vd-row">
              <div className="vd-label">Reviews</div>
              <div className="vd-value reviews">
                <FaStar className="star" /> <span>{vendor.reviewsText}</span>
              </div>
            </div>

            <div className="vd-row">
              <div className="vd-label">Locality</div>
              <div className="vd-value">
                
                <span>{vendor.locality}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const styles = `
.vd-wrap {
  font-family: 'poppinsreg', sans-serif;
  color: #111827;
  padding: 28px 20px;
  background: #fff;
  max-width: 1280px;
  margin: 0 auto;
}

/* topbar */
.vd-topbar {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 20px;
}
.vd-back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 16px;
}
.vd-back svg { color: #2b2b2b; }

.vd-title {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
}

/* Main Layout */
.vd-main {
  display: grid;
  grid-template-columns: 0.7fr 360px;
  gap: 48px;
  align-items: center;
  margin-bottom: 28px;
}

.vd-left {
  max-width: 700px;
}

.vd-banner {
  overflow: hidden;
  width: 700px;
}
.vd-banner img {
  width: 700px;
  height: 350px;
  object-fit: cover;
  display: block;
  border-radius: 12px;
}

/* Right panel */
.vd-right-inner { background: transparent; }

.vd-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-top: 1px dashed #efefef;
  align-items: center;
}
.vd-row:first-of-type { border-top: none; padding-top: 0; }

.vd-label {
  color: #484848;
  font-size: 16px;
  font-family: 'poppins';
}
.vd-value {
  font-size: 16px;
  text-align: right;
  max-width: 220px;
  color: #484848;
  font-family: 'poppins';
}

.reviews { display: flex; align-items: center; gap: 8px; }
.star { color: #f6c84c; }
.loc { color: #707070; }
`;
