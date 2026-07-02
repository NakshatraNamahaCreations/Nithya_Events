// React related imports
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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
      // Fetch product vendors and service vendors independently so the list
      // shows BOTH types. Each returns 404 when its category is empty — that's
      // not an error, just an empty result, so we swallow failures per call.
      const safeList = async (fn) => {
        try {
          const res = await fn();
          return Array.isArray(res?.data?.data) ? res.data.data : [];
        } catch (error) {
          if (error?.response?.status !== 404) {
            console.error("Failed to fetch vendors:", error);
          }
          return [];
        }
      };

      const [productVendors, serviceVendors] = await Promise.all([
        safeList(authService.vendorLists),
        safeList(authService.serviceVendorLists),
      ]);

      // Merge and de-duplicate by _id (a vendor could appear in both lists).
      const merged = [...productVendors, ...serviceVendors];
      const unique = Array.from(
        new Map(merged.map((v) => [v._id, v])).values()
      );
      setVendors(unique);
    };
    fetchVendors();
  }, []);
  const filteredVendors = vendors?.filter((vendor) =>
    vendor.vendor_name?.toLowerCase().includes(search.toLowerCase()) ||
  vendor.shop_name?.toLowerCase().includes(search.toLowerCase())
  );

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
        {filteredVendors?.map((vendor) => (
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
