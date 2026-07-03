// React related imports
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Haversine distance (km) between two lat/lng points.
const toRad = (v) => (v * Math.PI) / 180;
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Read the user's last known location, saved during address selection.
const getUserCoords = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("saved_locations") || "[]");
    if (Array.isArray(saved) && saved.length) {
      const last = saved[saved.length - 1];
      const lat = Number(last?.lat);
      const lng = Number(last?.lng);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    }
  } catch {
    /* ignore malformed storage */
  }
  return null;
};

// Third party library
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box } from "@mui/material";

// Custom Component
import authService from "../../api/ApiService";

// styles
import "./styles.scss";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleVendorClick = (vendorId) => {
    navigate(`/vendors/${vendorId}`);
  };

  useEffect(() => {
    const fetchVendors = async () => {
      // Use the same endpoint as the User App (getallvendor) so both platforms
      // show identical vendor data. It returns a plain array of all approved,
      // non-deleted vendors (a 404 just means the list is empty).
      try {
        const res = await authService.allVendorLists();
        setVendors(Array.isArray(res?.data) ? res.data : []);
      } catch (error) {
        if (error?.response?.status !== 404) {
          console.error("Failed to fetch vendors:", error);
        }
        setVendors([]);
      }
    };
    fetchVendors();
  }, []);
  const filteredVendors = vendors?.filter((vendor) =>
    vendor.vendor_name?.toLowerCase().includes(search.toLowerCase()) ||
  vendor.shop_name?.toLowerCase().includes(search.toLowerCase())
  );

  // Show ALL vendors sorted by distance (nearest first) — no radius limit, so
  // no booking is missed. Vendors without coordinates (or when the user's
  // location is unknown) get a distance of Infinity and fall to the end.
  const userCoords = useMemo(() => getUserCoords(), []);
  const displayedVendors = useMemo(() => {
    return (filteredVendors || [])
      .map((vendor) => {
        const vLat = Number(vendor?.address?.[0]?.latitude);
        const vLng = Number(vendor?.address?.[0]?.longitude);
        let distance = Infinity;
        if (userCoords && Number.isFinite(vLat) && Number.isFinite(vLng)) {
          distance = calculateDistance(userCoords.lat, userCoords.lng, vLat, vLng);
        }
        return { vendor, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .map((x) => x.vendor);
  }, [filteredVendors, userCoords]);

  return (
    <div className="vendors-container">
      <h2 className="vendors-title">All Vendors</h2>
      <input
        type="text"
        placeholder="Search shop or address..."
        className="vendors-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="vendors-list">
        {displayedVendors?.map((vendor) => (
          <div
            key={vendor._id}
            className="vendor-card"
            onClick={() => handleVendorClick(vendor._id)}
          >
            <img
              src={vendor.shop_image_or_logo}
              alt={vendor.vendor_name}
              className="vendor-image"
            />
            <div className="vendor-details">
              <h3 className="vendor-name">{vendor.vendor_name}</h3>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: "0.9rem" }}
              >
                <LocationOnIcon />
                <p className="vendor-address">
                  {vendor.address?.[0]?.cityDownVillage}
                </p>
              </Box>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vendors;
