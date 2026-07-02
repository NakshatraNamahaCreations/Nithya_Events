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

// Local inline placeholder (no network dependency) used when an image is
// missing or fails to load.
const NO_IMAGE =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='300'%20height='300'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23eeeeee'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23999999'%20font-family='sans-serif'%20font-size='18'%20text-anchor='middle'%20dominant-baseline='middle'%3ENo%20Image%3C/text%3E%3C/svg%3E";

const SingleVendor = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [vendorProduct, setVendorProduct] = useState([]);
  const [vendorService, setVendorService] = useState([]);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetail = sessionStorage.getItem("userDetails");
  let userId = null;

  if (userDetail) {
    try {
      const userDetails = JSON.parse(userDetail);
      userId = userDetails?._id || null;
    } catch (error) {
      console.error("Error parsing userDetails from sessionStorage:", error);
    }
  }

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
      // Backend returns an array of products; guard against unexpected shapes.
      setVendorProduct(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      // A 404 simply means this vendor has no approved products — not an error.
      if (error?.response?.status === 404) {
        setVendorProduct([]);
      } else {
        getErrorMessage(error);
      }
    }
  };

  const fetchParticularVendorServices = async () => {
    try {
      const res = await authService.getIndividualService(id);
      // Endpoint returns { service: [...] }.
      setVendorService(Array.isArray(res.data?.service) ? res.data.service : []);
    } catch (error) {
      // A 404 simply means this vendor has no approved services — not an error.
      if (error?.response?.status === 404) {
        setVendorService([]);
      } else {
        getErrorMessage(error);
      }
    }
  };

  const handleVendorReviewClick = () => {
    setReviewModalOpen(true);
  };
  console.log("The id check", id);
  const handleReviewSubmit = async (reviewData) => {
    const res = await authService.writeVendorReview(reviewData, id);

    setReviewModalOpen(false);
  };

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  const handleServiceClick = (service) => {
    navigate(`/service/${service.service_name}/${service._id}`);
  };

  useEffect(() => {
    fetchVendors();
    fetchParticularVendorProducts();
    fetchParticularVendorServices();
  }, [id]);

  if (error) return <Box className="error">{error}</Box>;

  return (
    <Box className="vendor-container">
      {vendor && (
        <>
          <Box className="vendor-header">
            <Box className="vendor-image" sx={{ position: "relative" }}>
              {/* <Button
                onClick={handleVendorReviewClick}
                sx={{ position: "absolute", top: "3rem", left: "30rem" }}
              >
                Review
              </Button> */}
              <img
                src={vendor.shop_image_or_logo || NO_IMAGE}
                alt={vendor.vendor_name || "Vendor Logo"}
                className="vendor-logo"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = NO_IMAGE;
                }}
              />
            </Box>
            <Box className="vendor-info">
              <h2>{vendor.vendor_name}</h2>
              <p> Mobile: {vendor.mobile_number}</p>
              <p>{vendor?.address?.[0]?.houseFlatBlock}</p>
              <p>{vendor?.address?.[0]?.cityDownVillage}</p>
              <p>
                {vendor?.address?.[0]?.distric}
                {vendor?.address?.[0]?.distric && vendor?.address?.[0]?.state
                  ? ", "
                  : ""}
                {vendor?.address?.[0]?.state}
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

          {/* Products */}
          {vendorProduct?.length > 0 && (
            <Box className="items-section">
              <h3>✨ PRODUCTS ✨</h3>
              <Box className="items-grid">
                {vendorProduct.map((item) => (
                  <Box
                    className="item-card"
                    key={item._id}
                    onClick={() => handleProductClick(item._id)}
                  >
                    <Box className="item-image">
                      <img
                        src={
                          (Array.isArray(item.product_image)
                            ? item.product_image[0]
                            : item.product_image) || NO_IMAGE
                        }
                        alt={item.product_name || "Product"}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = NO_IMAGE;
                        }}
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
          )}

          {/* Services */}
          {vendorService?.length > 0 && (
            <Box className="items-section">
              <h3>✨ SERVICES ✨</h3>
              <Box className="items-grid">
                {vendorService.map((item) => (
                  <Box
                    className="item-card"
                    key={item._id}
                    onClick={() => handleServiceClick(item)}
                  >
                    <Box className="item-image">
                      <img
                        src={
                          item.service_image ||
                          (Array.isArray(item.additional_images)
                            ? item.additional_images[0]
                            : item.additional_images) ||
                          NO_IMAGE
                        }
                        alt={item.service_name || "Service"}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = NO_IMAGE;
                        }}
                      />
                    </Box>
                    <Box className="item-info">
                      <h4>{item.service_name}</h4>
                      <p>₹{item.price}</p>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Empty state */}
          {vendorProduct?.length === 0 && vendorService?.length === 0 && (
            <Box className="items-section">
              <h3>✨ ITEMS ✨</h3>
              <p style={{ textAlign: "center", color: "#888", padding: "1rem" }}>
                This vendor has no products or services listed yet.
              </p>
            </Box>
          )}
          <Review
        onSubmit={handleReviewSubmit}
        productId={id}
        open={isReviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        setOpen={setReviewModalOpen}
      />
        </>
      )}
    </Box>
  );
};

export default SingleVendor;
