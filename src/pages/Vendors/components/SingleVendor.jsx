// React related imports
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// Custom components
import { setLoading } from "../../../redux/slice/LoaderSlice";
import { getErrorMessage } from "../../../utils/helperFunc";
import authService from "../../../api/ApiService";

// styles
import "./styles.scss";
import { Box, Button } from "@mui/material";
import Review from "./Review";

const SingleVendor = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [vendorProduct, setVendorProduct] = useState([]);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRatings = reviews.reduce(
      (sum, review) => sum + review.ratings,
      0
    );
    return (totalRatings / reviews.length).toFixed(1);
  };

  const fetchVendors = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.getVendorProfile(id);
      const vendorData = res.data;
      console.log(res.data);

      vendorData.rating = calculateAverageRating(vendorData.Reviews);
      setVendor(vendorData);
      dispatch(setLoading(false));
    } catch (error) {
      getErrorMessage(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchParticularVendorProducts = async () => {
    try {
      const res = await authService.getParticularVendorProduct(id);
      console.log(res.data[0]._id);

      setVendorProduct(res.data);
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const handleVendorReviewClick = () => {
    setReviewModalOpen(true);
  };
  console.log("The id check", id);
  const handleReviewSubmit = async(reviewData) => {
  const res = await authService.writeVendorReview(reviewData, id);
  
  
  setReviewModalOpen(false);
  }

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };
  useEffect(() => {
    fetchVendors();
    fetchParticularVendorProducts();
  }, [id]);

  if (error) return <Box className="error">{error}</Box>;

  return (
    <Box className="vendor-container">
      {vendor && (
        <>
          <Box className="vendor-header">
            <Box className="vendor-image" sx={{position:'relative'}}>
              <Button onClick={handleVendorReviewClick} sx={{position:'absolute', top:'3rem', left:'30rem'}}>Review</Button>
              <img
                src={vendor.shop_image_or_logo || "/assets/vendor-logo.png"}
                alt="Vendor Logo"
                className="vendor-logo"
              />
            </Box>
            <Box className="vendor-info">
              <h2>{vendor.vendor_name}</h2>
              <p> Mobile: {vendor.mobile_number}</p>
              <p>{vendor?.address[0]?.roadArea}</p>
              <p>{vendor?.address[0]?.cityDownVillage}</p>
              <p>
                {vendor?.address[0]?.distric}, {vendor?.address[0]?.state}
              </p>
              <Box className="vendor-rating">
                {[...Array(5)]?.map((_, i) => (
                  <span
                    key={i}
                    className={`star ${
                      i < Math.floor(vendor.rating || 0) ? "filled" : ""
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="rating-value">
                  {vendor.rating ? `${vendor.rating}/5` : "No Ratings"}
                </span>
              </Box>
            </Box>
          </Box>

          <Box className="items-section">
            <h3>✨ ITEMS ✨</h3>
            <Box className="items-grid">
              {vendorProduct?.map((item) => (
                <Box
                  className="item-card"
                  key={item._id}
                  onClick={() => handleProductClick(item._id)}
                >
                  <Box className="item-image">
                    <img
                      src={item.product_image || "/assets/default-item.png"}
                      alt={item.title}
                    />
                  </Box>
                  <Box className="item-info">
                    <h4>{item.product_name}</h4>
                    <p>₹{item.product_price}</p>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

       <Review     onSubmit={handleReviewSubmit}
            productId={id}
            open={isReviewModalOpen}
            onClose={() => setReviewModalOpen(false)}/>
        </>
      )}
    </Box>
  );
};

export default SingleVendor;
