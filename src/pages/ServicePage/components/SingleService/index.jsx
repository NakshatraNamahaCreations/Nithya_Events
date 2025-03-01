import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import StarRating from "../../../../components/StarRating";
import ReviewSection from "./components/ReviewSection";
import authService from "../../../../api/ApiService";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../../redux/slice/LoaderSlice";
// import {SliderImage} from "../../../Products/SingleProducts/components/SliderImage"
import axios from "axios";

const SingleService = () => {
  const { id } = useParams();
  const [service, setService] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const userDetail = sessionStorage.getItem("userDetails");
  const userDetails = JSON.parse(userDetail);
  const userId = userDetails?._id;

  const fetchService = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.getParticularService(id);
      setService(res.data);
      console.log(res.data);
      
      if (res.data.service_image) {
        setMainImage(res.data.service_image[0]);
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Error fetching service:", error);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);
  useEffect(() => {
    if (service.additional_services && service.additional_services.length > 0) {
      setMainImage(service.additional_services[0]);
    }
  }, [service.additional_services]);
  const handleWishlistClick = async () => {
    const payload = {
      service_name: service.service_name,
      service_id: service._id,
      service_image: service.service_image[0],
      price: service.pricing,
      user_id: userId,
    };

    try {
      await axios.post(
        "http://192.168.1.103:9000/api/wishlist/add-wishlist",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      setWishlist([...wishlist, service._id]);
      alert("Service added to wishlist!");
    } catch (error) {
      console.error("Wishlist API Error:", error);
      alert("Error adding service to wishlist");
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.ratings, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <Box sx={{ padding: "6rem", maxWidth: "1200px", margin: "auto" }}>
      {/* Service Details Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "3rem",
        }}
      >
        {/* Left: Service Image */}
        <Box sx={{ width: isMobile ? "100%" : "50%" }}>
          <img
            src={service.shop_image_or_logo}
            alt={service.
shop_image_or_logo
}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
                  {/* <SliderImage
                productImages={service.additional_services || []}
                setMainImage={setMainImage}
                mainImage={mainImage}
                productVideo={product.product_video}
              /> */}
        </Box>

        {/* Right: Service Details */}
        <Box sx={{ width: isMobile ? "100%" : "50%" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#c026d3" }}>
            {service.shop_name}
          </Typography>
          <Typography sx={{ color: "#6c757d", fontSize: "1rem", marginTop: "0.5rem" }}>
            {service.profession_category}
          </Typography>

          {/* Rating and Wishlist */}
          {/* <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
            <StarRating rating={parseFloat(calculateAverageRating(service.Reviews))} />
            <Typography variant="p" sx={{ fontSize: "0.8rem" }}>
              {service.Reviews?.length || 20} Reviews
            </Typography>

            <IconButton onClick={handleWishlistClick} sx={{ color: "#c026d3" }}>
              {wishlist.includes(service._id) ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            </IconButton>
          </Box> */}

          {/* Pricing */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.7rem", marginTop: "1rem" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000" }}>
              ₹{service.pricing}
            </Typography>
            <Typography
              sx={{
                textDecoration: "line-through",
                color: "red",
                fontSize: "1rem",
              }}
            >
              ₹{service.mrp_price || 2000}
            </Typography>
            <Typography sx={{ color: "red" }}>Per day</Typography>
          </Box>

          {/* Contact Buttons */}
          <Box sx={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <IconButton href={`https://wa.me/${service.mobile_number}`} target="_blank">
              <WhatsAppIcon sx={{ color: "#25D366", fontSize: "2rem" }} />
            </IconButton>
            <IconButton href={`tel:${service.mobile_number}`} target="_blank">
              <PhoneIcon sx={{ color: "#c026d3", fontSize: "2rem" }} />
            </IconButton>
          </Box>

          {/* Booking & Wishlist Buttons */}
          {/* <Box sx={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#c026d3",
                color: "white",
                fontWeight: "bold",
                textTransform: "capitalize",
                width: "50%",
              }}
            >
              Book Service
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#c026d3",
                color: "#c026d3",
                fontWeight: "bold",
                textTransform: "capitalize",
                width: "50%",
              }}
              onClick={handleWishlistClick}
            >
              Add to Wishlist
            </Button>
          </Box> */}
        </Box>
      </Box>

      {/* Tabs Section */}
      <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ marginTop: "3rem" }}>
        <Tab label="Service Details" />
        <Tab label="Reviews" />
        <Tab label="Photos" />
      </Tabs>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box sx={{ marginTop: "2rem" }}>
          <Typography variant="h6">Service Details</Typography>
          <Typography>{service.description}</Typography>
        </Box>
      )}

      {activeTab === 1 && <ReviewSection id={id} />}

      {activeTab === 2 && (
        <Box sx={{ marginTop: "2rem" }}>
          <Typography variant="h6">Photos</Typography>
          <img src={service.service_image} alt="Service" style={{ width: "100%", borderRadius: "10px" }} />
        </Box>
      )}
    </Box>
  );
};

export default SingleService;
