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
  Grid,
  CardContent,
  Card,
  CardMedia,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from "@mui/icons-material/Close";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import StarRating from "../../../../components/StarRating";
import ReviewSection from "./components/ReviewSection";
import authService from "../../../../api/ApiService";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../../redux/slice/LoaderSlice";
// import {SliderImage} from "../../../Products/SingleProducts/components/SliderImage"
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles.scss";
import { Star } from "@mui/icons-material";
import { addService } from "../../../../redux/slice/serviceSlice";


const SingleService = () => {
  const { id } = useParams();
  const [service, setService] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const userDetail = sessionStorage.getItem("userDetails");
  // const userDetails = JSON.parse(userDetail);
  // const userId = userDetails?._id;
  const [modalMainImage, setModalMainImage] = useState("");


  const [services, setServices] = useState([]);
  const fetchService = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.getParticularService(id);
      console.log("vendor profile data:",res.data)
      setService(res.data);
      if (res.data.shop_image_or_logo) {
        setMainImage(res.data.shop_image_or_logo);
      } else if (res.data.additional_services?.length > 0) {
        setMainImage(res.data.additional_services[0]);
      }

      const individualService = await authService.getIndividualService(id);
  
      setServices(individualService.data.service);

      if (res.data.shop_image_or_logo) {
        setMainImage(res.data.shop_image_or_logo);
      } else if (res.data.additional_services?.length > 0) {
        setMainImage(res.data.additional_services[0]);
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

console.log("service data profike",service);

  useEffect(() => {
    // Simulate API call in the future
    // fetch("YOUR_API_ENDPOINT")
    //   .then((res) => res.json())
    //   .then((data) => setService(data));
  }, []);

  // const handleWishlistClick = async () => {
  //   const payload = {
  //     service_name: service.service_name,
  //     service_id: service._id,
  //     service_image: service.service_image[0],
  //     price: service.pricing,
  //     user_id: userId,
  //   };

  //   try {
  //     await axios.post(
  //       "http://192.168.1.103:9000/api/wishlist/add-wishlist",
  //       payload,
  //       { headers: { "Content-Type": "application/json" } }
  //     );
  //     setWishlist([...wishlist, service._id]);
  //     alert("Service added to wishlist!");
  //   } catch (error) {
  //     console.error("Wishlist API Error:", error);
  //     alert("Error adding service to wishlist");
  //   }
  // };
  const handleAddToCart = (serviceItem) => {
    if (!serviceItem) return;
  
    const payload = {
      orderId: Date.now().toString(),
      id: serviceItem._id,
      context: "service",
      store: "123rooms",
      productName: serviceItem.service_name,
      productPrice: serviceItem.price,
      imageUrl: serviceItem.additional_images?.[0] || "", 
      sellerName: serviceItem.vendor_name || "Unknown Seller",
      sellerId: serviceItem.vendor_id,
      totalPrice: serviceItem.price, 
      quantity: 1,
      eventStartDate: new Date().toISOString().split("T")[0], 
      eventEndDate: new Date().toISOString().split("T")[0], 
      commissionTax: 18, 
      commissionPercentage: 22,
    };
  
    dispatch(addService(payload));
    alert("Service added to cart!");
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleCardClick = (serviceItem) => {
    setSelectedService(serviceItem);
    setModalMainImage(serviceItem.image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedService(null);
  };
  const imageList = [
    service.shop_image_or_logo,
    ...(service.additional_images || [])
  ].filter(Boolean);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.ratings, 0);
    return (total / reviews.length).toFixed(1);
  };

  const sliderSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(4, imageList.length),
    slidesToScroll: 1,
    arrows: true,
    focusOnSelect: true,
  };

  return (
    <Box sx={{ padding: "6rem", maxWidth: "1200px", margin: "auto" }}>
      {/* Service Details Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "8rem",
        }}
      >

        {/* Left Column: Image Section */}
        <Grid item xs={12} md={6}>
          {/* Main Image Display */}
          <Box sx={{
            textAlign: "center",
            marginBottom: "1rem",
            maxWidth: "500px",
            margin: "0 auto"
          }}>
            <img
              src={mainImage}
              alt="Selected Service"
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </Box>

          {/* Thumbnail Slider */}
          {imageList.length > 1 && (
            <Box sx={{ maxWidth: "400px", margin: "0 auto" }}>
              <Slider {...sliderSettings}>
                {imageList.map((img, index) => (
                  <div key={index} onClick={() => setMainImage(img)}>
                    <img
                      src={img}
                      alt={`Thumbnail-${index}`}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: img === mainImage ? "2px solid #c026d3" : "2px solid transparent",
                        transition: "border 0.3s ease",
                        margin: "auto",
                      }}
                    />
                  </div>
                ))}
              </Slider>
            </Box>
          )}
        </Grid>


        {/* Right: Service Details */}
        <Box sx={{ width: isMobile ? "100%" : "50%" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#c026d3" }}>
            {service.shop_name}
          </Typography>
          <Typography sx={{ color: "#6c757d", fontSize: "1rem", marginTop: "0.5rem" }}>
            {service.profession_category}
          </Typography>

          {/* Rating and Wishlist */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
            {console.log(service.Reviews)
            }
            <Typography>{calculateAverageRating(service.Reviews)}</Typography>
            {/* <Typography variant="p" sx={{ fontSize: "0.8rem" }}>
              {service.Reviews?.length || 0} 
            </Typography> */}
            <Star sx={{ color: 'yellow' }} />
            {/* <IconButton onClick={handleWishlistClick} sx={{ color: "#c026d3" }}>
              {wishlist.includes(service._id) ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            </IconButton> */}
          </Box>

          {/* Pricing */}
 

          <Box sx={{ display: "flex", gap: "0.7rem", marginTop: "1rem", flexDirection: 'column' }}>
            <Typography variant="h6">Description</Typography>
            <Typography
              sx={{

                fontSize: "1rem",
              }}
            >

              {service?.shop_name} has been in business for {service?.experience_in_business} years and was established in {service?.year_of_establishment}.
            </Typography>
            <Typography
              sx={{

                fontSize: "1rem",
              }}
            >
              With {service?.experience_in_business} years of experience, {service?.shop_name} has been serving customers since {service?.year_of_establishment}.
            </Typography>

          </Box>

          {/* Contact Buttons */}
          {/* <Box sx={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <IconButton href={`https://wa.me/${service.mobile_number}`} target="_blank">
              <WhatsAppIcon sx={{ color: "#25D366", fontSize: "2rem" }} />
            </IconButton>
            <IconButton href={`tel:${service.mobile_number}`} target="_blank">
              <PhoneIcon sx={{ color: "#c026d3", fontSize: "2rem" }} />
            </IconButton>
          </Box> */}

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
      <Tabs value={activeTab} onChange={handleTabChange} centered sx={{

        padding: "0.8rem 5rem",

        "& .MuiTabs-indicator": {
          backgroundColor: "#c026d3",
        },
        "& .MuiTab-root": {
          color: "#9c27b0",
          textTransform: "none",
          fontWeight: "bold",
        },
        "& .Mui-selected": {
          color: "#c026d3 !important",
        },
      }}
      >
        <Tab label="Service Details" />
        <Tab label="Reviews" />
        {/* <Tab label="Photos" /> */}
      </Tabs>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box sx={{ marginTop: "2rem" }}>
          {services.map((serviceItem) => (
            <Card key={serviceItem._id} sx={{ display: "flex", padding: "1rem", alignItems: "center", marginBottom: "1rem", cursor: 'pointer' }} onClick={() => handleCardClick(serviceItem)}>
              <CardMedia
                component="img"
                image={serviceItem.additional_images[0]}
                alt={serviceItem.name}
                sx={{ width: "180px", height: "120px", borderRadius: "6px" }}
              />

              <CardContent sx={{ flex: 1, paddingLeft: "1rem" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {serviceItem.service_name}
                </Typography>

                <Typography variant="body2" sx={{ marginBottom: "0.5rem" }}>
                  {serviceItem.service_category}
                </Typography>


                <Typography style={{ paddingLeft: "1rem", margin: 0, fontSize: "0.9rem" }} variant="body2" sx={{ marginBottom: "0.5rem" }}>
                  {serviceItem.service_description}
                </Typography>
                {/* <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                  {serviceItem.service_description.map((feature, index) => (
                    <li key={index} style={{ fontSize: "0.9rem", color: "#555" }}>
                      {feature}
                    </li>
                  ))}
                </ul> */}
              </CardContent>

              <Grid item xs={6} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}   onClick={() => handleAddToCart(serviceItem)} >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  ₹{serviceItem?.price?.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: "#888" }}>
                  + ₹{serviceItem?.taxes?.toLocaleString()} taxes & fees
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "red",
                    color: "red",
                    fontWeight: "bold",
                    marginTop: "10px",
                  }}
                >
                  Add to cart
                </Button>
              </Grid>
            </Card>
          ))}
        </Box>
      )}

      {activeTab === 1 && <ReviewSection id={id} />}
     
      {/* {activeTab === 2 && (
        <Box sx={{ marginTop: "2rem" }}>
          <Typography variant="h6">Photos</Typography>
          <img src={service.additional_images[0]} alt="Service" style={{ width: "100%", borderRadius: "10px" }} />
        </Box>
      )} */}
      {/* Modal for Service Details */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedService?.service_name}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ maxWidth: "400px", margin: "0 auto" }}>
            <Slider {...sliderSettings}>
              {selectedService?.additional_images.map((img, index) => (
                <div key={index} onClick={() => setModalMainImage(img)}>
                  <img
                    src={img}
                    alt={`Thumbnail-${index}`}
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      cursor: "pointer",
                      border: img === modalMainImage ? "2px solid #c026d3" : "2px solid transparent",
                      transition: "border 0.3s ease",
                      margin: "auto",
                    }}
                  />
                </div>
              ))}
            </Slider>
          </Box>
          <Typography variant="p" mt={1}>
            <strong>Category: </strong> {selectedService?.service_category}
          </Typography> <br />
          <Typography variant="p">
            <strong>Description:</strong> {selectedService?.service_description}
          </Typography>
          {/* <Typography variant="body1" sx={{ marginTop: "10px" }}>
            <strong>Room Size:</strong> {selectedService?.size}
          </Typography> */}
          {
            selectedService?.additional_services ? (
              <>
                <Typography variant="body1" sx={{ marginTop: "10px" }}>
                  <strong>Amenities:</strong>
                </Typography>

                <Box>
                  {
                    selectedService?.additional_services?.map((item) => (
                      <Card>
                        <CardContent>
                          <ul>
                            <li>
                              <Typography>
                                {item.name}
                              </Typography>

                              <Typography>
                                {item.value}
                              </Typography>
                            </li>
                          </ul>

                        </CardContent>

                      </Card>
                    ))
                  }
                </Box>

              </>
            ) : null
          }
          {/* <ul>
            {selectedService?.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SingleService;
