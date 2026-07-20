// React related imports
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Only show vendors within this many km of the user's current location.
const NEARBY_RADIUS_KM = 60;

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

// Read the location the user selected in the header. The header saves it under
// "selectedLocation" as { lat, lng, city, town } — read the SAME key/shape here
// (previously this read a different key, so the distance filter never applied).
const getUserCoords = () => {
  try {
    const raw = localStorage.getItem("selectedLocation");
    if (raw) {
      const loc = JSON.parse(raw);
      const lat = Number(loc?.lat);
      const lng = Number(loc?.lng);
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

  // Show vendors within NEARBY_RADIUS_KM of the user's current location,
  // sorted by distance (nearest first). If the user's location is unknown we
  // can't compute distance, so we fall back to showing all vendors.
  const userCoords = useMemo(() => getUserCoords(), []);
  const displayedVendors = useMemo(() => {
    const withDistance = (filteredVendors || []).map((vendor) => {
      const vLat = Number(vendor?.address?.[0]?.latitude);
      const vLng = Number(vendor?.address?.[0]?.longitude);
      let distance = Infinity;
      if (userCoords && Number.isFinite(vLat) && Number.isFinite(vLng)) {
        distance = calculateDistance(userCoords.lat, userCoords.lng, vLat, vLng);
      }
      return { vendor, distance };
    });
    const sorted = withDistance.sort((a, b) => a.distance - b.distance);
    // Only apply the radius filter when we actually know the user's location.
    const withinRadius = userCoords
      ? sorted.filter((x) => x.distance <= NEARBY_RADIUS_KM)
      : sorted;
    return withinRadius.map((x) => x.vendor);
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
