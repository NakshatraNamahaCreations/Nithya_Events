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
      const res = await authService.vendorLists();

      setVendors(res.data.data);
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
                  {vendor.address[0]?.cityDownVillage}
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
