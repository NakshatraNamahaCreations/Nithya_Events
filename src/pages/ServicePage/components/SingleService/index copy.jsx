// import React, { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Button,
//   Tabs,
//   Tab,
//   IconButton,
//   useMediaQuery,
//   useTheme,
//   Grid,
//   CardContent,
//   Card,
//   CardMedia,
//   DialogActions,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Checkbox,
//   FormControlLabel,
// } from "@mui/material";
// import WhatsAppIcon from "@mui/icons-material/WhatsApp";
// import PhoneIcon from "@mui/icons-material/Phone";
// import CloseIcon from "@mui/icons-material/Close";
// import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
// import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
// import StarRating from "../../../../components/StarRating";
// import ReviewSection from "./components/ReviewSection";
// import authService from "../../../../api/ApiService";
// import { useDispatch, useSelector } from "react-redux";
// import { setLoading } from "../../../../redux/slice/LoaderSlice";
// import axios from "axios";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import "./styles.scss";
// import { Star } from "@mui/icons-material";
// import {
//   addService,
//   updateServiceAddons,
// } from "../../../../redux/slice/serviceSlice";

// const SingleService = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [service, setService] = useState({});
//   const [mainImage, setMainImage] = useState("");
//   const [wishlist, setWishlist] = useState([]);
//   const [activeTab, setActiveTab] = useState(0);
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedService, setSelectedService] = useState(null);
//   const [openBook, setOpenBook] = useState(false);
//   const [serviceObj, setServiceObj] = useState(null);
//   const [isInCart, setIsInCart] = useState(false);
//   const [modalMainImage, setModalMainImage] = useState("");
//   const [addOnsList, setAddOnsList] = useState([]);
//   const [selectedAddOns, setSelectedAddOns] = useState([]);
//   const [services, setServices] = useState([]);
//   const dispatch = useDispatch();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   // Corrected useSelector to access services from serviceSlice
//   const cartItems = useSelector((state) => state.services.services || []);
//   const { startDate, endDate } = useSelector((state) => state.date);

//   const userDetail = sessionStorage.getItem("userDetails");
//   let userId = null;

//   if (userDetail) {
//     try {
//       const userDetails = JSON.parse(userDetail);
//       userId = userDetails?._id || null;
//     } catch (error) {
//       console.error("Error parsing userDetails from sessionStorage:", error);
//     }
//   }

//   const fetchService = async () => {
//     try {
//       dispatch(setLoading(true));
//       const res = await authService.getParticularService(id);
//       setService(res.data || {});

//       if (res.data.shop_image_or_logo) {
//         setMainImage(res.data.shop_image_or_logo);
//       } else if (res.data.additional_services?.length > 0) {
//         setMainImage(res.data.additional_services[0]);
//       }

//       const individualService = await authService.getIndividualService(id);
//       setServices(
//         Array.isArray(individualService.data.service)
//           ? individualService.data.service
//           : []
//       );

//       // Check if any service is in the cart
//       const anyInCart = individualService.data.service?.some((serviceItem) =>
//         cartItems.some((cartItem) => cartItem.id === serviceItem._id)
//       );
//       setIsInCart(anyInCart);

//       dispatch(setLoading(false));
//     } catch (error) {
//       dispatch(setLoading(false));
//       console.error("Error fetching service:", error);
//       setServices([]);
//     }
//   };

//   const handleOpenBookDialog = async (serviceItem) => {
//     const inCartItem = cartItems.find((item) => item.id === serviceItem._id);

//     // Set main data
//     setSelectedService(serviceItem);
//     setServiceObj(serviceItem);
//     setModalMainImage(serviceItem.additional_images?.[0] || "");

//     // Check if item is in cart and restore selected add-ons
//     if (inCartItem) {
//       setSelectedAddOns(
//         inCartItem.addOns.map((a) => ({
//           _id: a.id,
//           service_name: a.name,
//           price: a.price,
//           category: a.category,
//         }))
//       );
//       setIsInCart(true);
//     } else {
//       setSelectedAddOns([]);
//       setIsInCart(false);
//     }

//     // Fetch Add-ons
//     if (service._id && serviceItem.service_subcategory) {
//       await fetchAddOnsList(service._id, serviceItem.service_subcategory);
//     }

//     setOpenBook(true);
//   };

//   const fetchAddOnsList = async (vendorId, category) => {
//     try {
//       if (!vendorId || !category) {
//         console.warn("Missing vendorId or category for add-ons fetch", {
//           vendorId,
//           category,
//         });
//         return;
//       }
//       const encodedCategory = encodeURIComponent(category);
//       const addonsRes = await axios.get(
//         `https://api.nithyaevent.com/api/addons/get-addons-by-vendorid/?vendor_id=${vendorId}&category=${encodedCategory}`
//       );
//       if (addonsRes.status === 200) {
//         setAddOnsList(
//           Array.isArray(addonsRes.data.addOns) ? addonsRes.data.addOns : []
//         );
//       } else {
//         console.warn("Unexpected status code:", addonsRes.status);
//         setAddOnsList([]);
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching add-ons:",
//         error.response?.data || error.message
//       );
//       setAddOnsList([]);
//     }
//   };

//   useEffect(() => {
//     fetchService();
//   }, [id, cartItems]); // Add cartItems to dependencies to update isInCart when cart changes

//   const handleCheckboxChange = useCallback(
//     (addon) => {
//       setSelectedAddOns((prevSelected) => {
//         const updatedAddons = prevSelected.some(
//           (item) => item._id === addon._id
//         )
//           ? prevSelected.filter((item) => item._id !== addon._id)
//           : [...prevSelected, addon];

//         // Update cart with new add-ons
//         if (serviceObj) {
//           updateServiceInCart(serviceObj, updatedAddons);
//         }

//         return updatedAddons;
//       });
//     },
//     [serviceObj]
//   );

//   const handleAddToCart = async (serviceItem) => {
//     // Check if the service is already in the cart
//     const existingItem = cartItems.find((item) => item.id === serviceItem._id);
//     if (existingItem) {
//       // Update existing item with new add-ons
//       updateServiceInCart(serviceItem, selectedAddOns);
//       setIsInCart(true);
//       setOpenBook(true); // Keep dialog open for further add-on changes
//       return;
//     }

//     // Fetch add-ons before adding to cart (if not already fetched)
//     if (
//       service._id &&
//       serviceItem.service_subcategory &&
//       addOnsList.length === 0
//     ) {
//       await fetchAddOnsList(
//         service._id,
//         serviceItem.service_subcategory || serviceItem.service_category
//       );
//     }

//     // Create payload for new cart item
//     const payload = {
//       orderId: Date.now().toString(),
//       id: serviceItem._id,
//       context: "service",
//       store: "123rooms",
//       productName: serviceItem.service_name,
//       productPrice: serviceItem.price,
//       imageUrl: serviceItem.additional_images?.[0] || "",
//       sellerName: serviceItem.vendor_name || "Unknown Seller",
//       sellerId: serviceItem.vendor_id,
//       totalPrice:
//         (serviceItem.price || 0) +
//         selectedAddOns.reduce((sum, addon) => sum + (addon.price || 0), 0),
//       quantity: 1,
//       eventStartDate: startDate || new Date().toISOString().split("T")[0],
//       eventEndDate: endDate || new Date().toISOString().split("T")[0],
//       commissionTax: 18,
//       commissionPercentage: 22,
//       addOns: selectedAddOns.map((addon) => ({
//         id: addon._id,
//         name: addon.service_name,
//         price: addon.price,
//         category: addon.category,
//       })),
//     };

//     dispatch(addService(payload));
//     setIsInCart(true);
//     alert("Service and add-ons added to cart!");
//     setOpenBook(true);
//   };

//   const updateServiceInCart = (serviceItem, updatedAddOns = selectedAddOns) => {
//     const existingItem = cartItems.find((item) => item.id === serviceItem._id);
//     if (!existingItem) return;

//     const updatedPayload = {
//       ...existingItem,
//       addOns: updatedAddOns.map((addon) => ({
//         id: addon._id,
//         name: addon.service_name,
//         price: addon.price,
//         category: addon.category,
//       })),
//       totalPrice:
//         (serviceItem.price || 0) +
//         updatedAddOns.reduce((sum, addon) => sum + (addon.price || 0), 0),
//     };

//     dispatch(addService(updatedPayload));
//     setIsInCart(true);
//   };

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };

//   const handleCardClick = (serviceItem) => {
//     setSelectedService(serviceItem);
//     setModalMainImage(serviceItem.additional_images?.[0] || "");
//     setOpenModal(true);
//   };

//   const handleCloseBook = () => {
//     setOpenBook(false);
//     setSelectedAddOns([]);
//     setAddOnsList([]);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedService(null);
//     setModalMainImage("");
//   };

//   const imageList = [
//     service.shop_image_or_logo,
//     ...(service.additional_images || []),
//   ].filter(Boolean);

//   const calculateAverageRating = (reviews) => {
//     if (!reviews || reviews.length === 0) return 0;
//     const total = reviews.reduce((sum, review) => sum + review.ratings, 0);
//     return (total / reviews.length).toFixed(1);
//   };

//   const calculateTotalPrice = () => {
//     return (
//       (serviceObj?.price || 0) +
//       selectedAddOns.reduce((sum, addon) => sum + (addon.price || 0), 0)
//     );
//   };

//   const sliderSettings = {
//     infinite: false,
//     speed: 500,
//     slidesToShow: Math.min(4, imageList.length),
//     slidesToScroll: 1,
//     arrows: true,
//     focusOnSelect: true,
//   };

//   return (
//     <Box sx={{ padding: "6rem", maxWidth: "1200px", margin: "auto" }}>
//       {/* Service Details Layout */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: isMobile ? "column" : "row",
//           gap: "8rem",
//         }}
//       >
//         <Grid item xs={12} md={6}>
//           <Box
//             sx={{
//               textAlign: "center",
//               marginBottom: "1rem",
//               maxWidth: "500px",
//               margin: "0 auto",
//             }}
//           >
//             <img
//               src={mainImage}
//               alt="Selected Service"
//               style={{
//                 width: "100%",
//                 height: "400px",
//                 objectFit: "cover",
//                 borderRadius: "10px",
//               }}
//             />
//           </Box>

//           {imageList.length > 1 && (
//             <Box sx={{ maxWidth: "400px", margin: "0 auto" }}>
//               <Slider {...sliderSettings}>
//                 {imageList.map((img, index) => (
//                   <div key={index} onClick={() => setMainImage(img)}>
//                     <img
//                       src={img}
//                       alt={`Thumbnail-R${index}`}
//                       style={{
//                         width: "80px",
//                         height: "80px",
//                         objectFit: "cover",
//                         borderRadius: "8px",
//                         cursor: "pointer",
//                         border:
//                           img === mainImage
//                             ? "2px solid #c026d3"
//                             : "2px solid transparent",
//                         transition: "border 0.3s ease",
//                         margin: "auto",
//                       }}
//                     />
//                   </div>
//                 ))}
//               </Slider>
//             </Box>
//           )}
//         </Grid>

//         <Box sx={{ width: isMobile ? "100%" : "50%" }}>
//           <Typography
//             variant="h4"
//             sx={{ fontWeight: "bold", color: "#c026d3" }}
//           >
//             {service.shop_name}
//           </Typography>
//           <Typography
//             sx={{ color: "#6c757d", fontSize: "1rem", marginTop: "0.5rem" }}
//           >
//             {service.profession_category}
//           </Typography>

//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.5rem",
//               marginTop: "1rem",
//             }}
//           >
//             <Typography>{calculateAverageRating(service.Reviews)}</Typography>
//             <Star sx={{ color: "yellow" }} />
//           </Box>

//           <Box
//             sx={{
//               display: "flex",
//               gap: "0.7rem",
//               marginTop: "1rem",
//               flexDirection: "column",
//             }}
//           >
//             <Typography variant="h6">Description</Typography>
//             <Typography sx={{ fontSize: "1rem" }}>
//               {service?.shop_name} has been in business for{" "}
//               {service?.experience_in_business} years and was established in{" "}
//               {service?.year_of_establishment}.
//             </Typography>
//             <Typography sx={{ fontSize: "1rem" }}>
//               With {service?.experience_in_business} years of experience,{" "}
//               {service?.shop_name} has been serving customers since{" "}
//               {service?.year_of_establishment}.
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       <Tabs
//         value={activeTab}
//         onChange={handleTabChange}
//         centered
//         sx={{
//           padding: "0.8rem 5rem",
//           "& .MuiTabs-indicator": {
//             backgroundColor: "#c026d3",
//           },
//           "& .MuiTab-root": {
//             color: "#9c27b0",
//             textTransform: "none",
//             fontWeight: "bold",
//           },
//           "& .Mui-selected": {
//             color: "#c026d3 !important",
//           },
//         }}
//       >
//         <Tab label="Service Details" />
//         <Tab label="Reviews" />
//       </Tabs>

//       {activeTab === 0 && (
//         <Box
//           sx={{
//             marginTop: "2rem",
//             display: { xs: "flex" },
//             flexDirection: { xs: "column" },
//           }}
//         >
//           {services.map((serviceItem) => (
//             <Card
//               key={serviceItem._id}
//               sx={{
//                 display: "flex",
//                 padding: "1rem",
//                 alignItems: "center",
//                 marginBottom: "1rem",
//                 cursor: "pointer",
//                 flexDirection: { xs: "column", md: "row" },
//               }}
//             >
//               <CardMedia
//                 component="img"
//                 image={serviceItem.additional_images?.[0] || ""}
//                 alt={serviceItem.service_name || "Service Image"}
//                 sx={{ width: "180px", height: "120px", borderRadius: "6px" }}
//                 onClick={() => handleCardClick(serviceItem)}
//               />

//               <CardContent
//                 sx={{ flex: 1, paddingLeft: "1rem" }}
//                 onClick={() => handleCardClick(serviceItem)}
//               >
//                 <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                   {serviceItem.service_name}
//                 </Typography>
//                 <Typography variant="body2" sx={{ marginBottom: "0.5rem" }}>
//                   {serviceItem.service_category}
//                 </Typography>
//                 <Typography
//                   style={{ margin: 0, fontSize: "0.9rem" }}
//                   variant="body2"
//                   sx={{ marginBottom: "0.5rem" }}
//                 >
//                   {serviceItem.service_description}
//                 </Typography>
//               </CardContent>

//               <Grid
//                 item
//                 xs={6}
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "flex-end",
//                 }}
//               >
//                 <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                   ₹{serviceItem?.price?.toLocaleString() || "0"}
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: "#888" }}>
//                   + ₹{serviceItem?.taxes?.toLocaleString() || "0"} taxes & fees
//                 </Typography>
//                 <Button
//                   variant="outlined"
//                   sx={{
//                     borderColor: "#c026d3",
//                     color: "#c026d3",
//                     fontWeight: "bold",
//                     marginTop: "10px",
//                   }}
//                   onClick={() => handleOpenBookDialog(serviceItem)}
//                 >
//                   View
//                 </Button>
//               </Grid>
//             </Card>
//           ))}
//         </Box>
//       )}

//       {activeTab === 1 && <ReviewSection id={id} userId={userId} />}

//       <Dialog open={openBook} onClose={handleCloseBook} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           Service Details
//           <IconButton
//             aria-label="close"
//             onClick={handleCloseBook}
//             sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           {serviceObj?.additional_images?.length > 0 ? (
//             <Box
//               sx={{ maxWidth: "80%", margin: "0 auto", textAlign: "center" }}
//             >
//               <Slider {...sliderSettings}>
//                 {serviceObj.additional_images.map((img, index) => (
//                   <div key={index} onClick={() => setModalMainImage(img)}>
//                     <img
//                       src={img}
//                       alt={`Thumbnail-R${index}`}
//                       style={{
//                         width: "98%",
//                         height: "280px",
//                         objectFit: "cover",
//                         borderRadius: "10px",
//                         cursor: "pointer",
//                         transition: "0.3s",
//                         border:
//                           img === modalMainImage
//                             ? "3px solid #c026d3"
//                             : "2px solid transparent",
//                       }}
//                     />
//                   </div>
//                 ))}
//               </Slider>
//             </Box>
//           ) : (
//             <Typography>No images available</Typography>
//           )}

//           <Typography
//             variant="h6"
//             sx={{ fontWeight: "bold", marginTop: "1rem" }}
//           >
//             Amount: ₹{serviceObj?.price?.toLocaleString() || "0"}
//           </Typography>
//           <Typography variant="body2" sx={{ color: "#888" }}>
//             + ₹{serviceObj?.taxes?.toLocaleString() || "0"} taxes & fees
//           </Typography>
//           {/* <Typography
//             variant="h6"
//             sx={{ fontWeight: "bold", marginTop: "1rem" }}
//           >g
//             Total: ₹{calculateTotalPrice().toLocaleString()}
//           </Typography> */}
//           {addOnsList.length > 0 ? (
//             <>
//               <Typography
//                 variant="h6"
//                 sx={{ fontWeight: "bold", marginTop: "1rem" }}
//               >
//                 Add-ons
//               </Typography>

//               <Box
//                 sx={{
//                   marginTop: "0.5rem",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 1,
//                 }}
//               >
//                 {addOnsList.map((addon) => (
//                   <Box
//                     key={addon._id}
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                       <Typography sx={{ fontSize: "1rem" }}>
//                         {addon.service_name}
//                       </Typography>
//                     </Box>

//                     <Typography sx={{ fontWeight: 500 }}>
//                       ₹{addon.price?.toLocaleString() || "0"}/day
//                     </Typography>

//                     <Checkbox
//                       checked={selectedAddOns.some(
//                         (item) => item._id === addon._id
//                       )}
//                       onChange={() => handleCheckboxChange(addon)}
//                       sx={{
//                         color: "#c026d3",
//                         "&.Mui-checked": { color: "#c026d3" },
//                       }}
//                     />
//                   </Box>
//                 ))}
//               </Box>
//             </>
//           ) : null}
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleCloseBook} color="secondary">
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             sx={{ backgroundColor: "#c026d3" }}
//             onClick={() =>
//               isInCart ? navigate("/cart") : handleAddToCart(serviceObj)
//             }
//           >
//             {isInCart ? "View Cart" : "Add to Cart"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default SingleService;
import React, { useEffect, useState, useCallback } from "react";
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
  Checkbox,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Star } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import authService from "../../../../api/ApiService";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../../redux/slice/LoaderSlice";
import { addService } from "../../../../redux/slice/serviceSlice";
import ReviewSection from "./components/ReviewSection";

const SingleService = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [service, setService] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [openBook, setOpenBook] = useState(false);
  const [serviceObj, setServiceObj] = useState(null);
  const [addOnsList, setAddOnsList] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [services, setServices] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { startDate, endDate } = useSelector((state) => state.date);

  // ✅ Fetch Service & Related Data
  const fetchService = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.getParticularService(id);
      setService(res.data || {});
      if (res.data.shop_image_or_logo)
        setMainImage(res.data.shop_image_or_logo);

      const individualService = await authService.getIndividualService(id);
      const data = Array.isArray(individualService.data.service)
        ? individualService.data.service
        : [];
      setServices(data);
    } catch (error) {
      console.error("Error fetching service:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchAddOnsList = async (vendorId, category) => {
    try {
      if (!vendorId || !category) return;
      const encodedCategory = encodeURIComponent(category);
      const res = await axios.get(
        `https://api.nithyaevent.com/api/addons/get-addons-by-vendorid/?vendor_id=${vendorId}&category=${encodedCategory}`
      );
      setAddOnsList(res.data?.addOns || []);
    } catch (error) {
      console.error("Error fetching add-ons:", error);
      setAddOnsList([]);
    }
  };

  const handleOpenBookDialog = async (serviceItem) => {
    setServiceObj(serviceItem);
    await fetchAddOnsList(service._id, serviceItem.service_subcategory);
    setOpenBook(true);
  };

  const handleCloseBook = () => {
    setOpenBook(false);
    setSelectedAddOns([]);
  };

  const handleCheckboxChange = useCallback((addon) => {
    setSelectedAddOns((prev) =>
      prev.some((i) => i._id === addon._id)
        ? prev.filter((i) => i._id !== addon._id)
        : [...prev, addon]
    );
  }, []);

  // ✅ Add to Cart + Snackbar Notification
  const handleAddToCart = async (serviceItem) => {
    try {
      const payload = {
        orderId: Date.now().toString(),
        id: serviceItem._id,
        context: "service",
        productName: serviceItem.service_name,
        productPrice: serviceItem.price,
        imageUrl: serviceItem.additional_images?.[0] || "",
        sellerName: serviceItem.vendor_name || "Unknown Seller",
        sellerId: serviceItem.vendor_id,
        totalPrice:
          (serviceItem.price || 0) +
          selectedAddOns.reduce((sum, a) => sum + (a.price || 0), 0),
        quantity: 1,
        eventStartDate: startDate || new Date().toISOString().split("T")[0],
        eventEndDate: endDate || new Date().toISOString().split("T")[0],
        addOns: selectedAddOns.map((a) => ({
          id: a._id,
          name: a.service_name,
          price: a.price,
          category: a.category,
        })),
      };

      dispatch(addService(payload));

      // ✅ Show Snackbar and close popup
      setSnackbarMessage("Service added to cart successfully!");
      setOpenSnackbar(true);

      // Delay popup closing to ensure Snackbar shows
      setTimeout(() => setOpenBook(false), 200);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.ratings || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <Box sx={{ padding: "6rem", maxWidth: "1200px", margin: "auto" }}>
      {/* Main Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "5rem",
          alignItems: "flex-start",
        }}
      >
        {/* Image Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: "center", marginBottom: "1rem" }}>
            <img
              src={mainImage}
              alt="Service"
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </Box>
        </Grid>

        {/* Text Section */}
        <Box sx={{ width: isMobile ? "100%" : "50%", textAlign: "left" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#c026d3", mb: 1 }}
          >
            {service.shop_name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              {calculateAverageRating(service.Reviews)}
            </Typography>
            <Star sx={{ color: "gold", ml: 0.5 }} />
          </Box>

          <Typography
            variant="h6"
            sx={{
              color: "#333",
              fontWeight: "bold",
              mb: 1,
              borderBottom: "2px solid #c026d3",
              display: "inline-block",
            }}
          >
            Description
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "#444", lineHeight: 1.7, mb: 1.5 }}
          >
            {`${service.shop_name} has been in business for ${service.experience_in_business} years and was established in ${service.year_of_establishment}.`}
          </Typography>

          <Typography variant="body1" sx={{ color: "#444", lineHeight: 1.7 }}>
            {`With ${service.experience_in_business} years of experience, ${service.shop_name} has been serving customers since ${service.year_of_establishment}.`}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 5 }} />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, val) => setActiveTab(val)}
        centered
        sx={{
          "& .MuiTabs-indicator": { backgroundColor: "#c026d3" },
          "& .Mui-selected": { color: "#c026d3 !important" },
        }}
      >
        <Tab label="Service Details" />
        <Tab label="Reviews" />
      </Tabs>

      {activeTab === 0 && (
        <Box sx={{ mt: 3 }}>
          {services.map((s) => (
            <Card
              key={s._id}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                p: 2,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <CardMedia
                component="img"
                image={s.additional_images?.[0] || ""}
                sx={{
                  width: 180,
                  height: 120,
                  borderRadius: 2,
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{s.service_name}</Typography>
                <Typography sx={{ color: "#777" }}>
                  {s.service_description}
                </Typography>
              </CardContent>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="h6">₹{s.price}</Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 1, borderColor: "#c026d3", color: "#c026d3" }}
                  onClick={() => handleOpenBookDialog(s)}
                >
                  View
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {activeTab === 1 && <ReviewSection id={id} />}

      {/* Popup */}
      <Dialog open={openBook} onClose={handleCloseBook} fullWidth maxWidth="sm">
        <DialogTitle>
          Service Details
          <IconButton
            onClick={handleCloseBook}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {serviceObj && (
            <>
              <Typography variant="h6">
                Amount: ₹{serviceObj?.price?.toLocaleString()}
              </Typography>
              {addOnsList.length > 0 && (
                <>
                  <Typography sx={{ mt: 2, fontWeight: "bold" }}>
                    Add-ons
                  </Typography>
                  {addOnsList.map((a) => (
                    <Box
                      key={a._id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                      }}
                    >
                      <Typography>{a.service_name}</Typography>
                      <Typography>₹{a.price}/day</Typography>
                      <Checkbox
                        checked={selectedAddOns.some((x) => x._id === a._id)}
                        onChange={() => handleCheckboxChange(a)}
                        sx={{
                          color: "#c026d3",
                          "&.Mui-checked": { color: "#c026d3" },
                        }}
                      />
                    </Box>
                  ))}
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBook}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#c026d3" }}
            onClick={() => handleAddToCart(serviceObj)}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar Notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SingleService;
