// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Box,
//   Button,
//   Divider,
//   Drawer,
//   IconButton,
//   Modal,
//   Tab,
//   Tabs,
//   Typography,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import RemoveIcon from "@mui/icons-material/Remove";
// import AddIcon from "@mui/icons-material/Add";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
// import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
// import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
// import ProfileImg1 from "../../../assets/profileImg1.jpg";
// import { addToCart } from "../../../redux/slice/CartSlice";
// import authService from "../../../api/ApiService";
// import { setLoading } from "../../../redux/slice/LoaderSlice";
// import { getErrorMessage } from "../../../utils/helperFunc"
// import Review from "./components/Review";
// import Technician from "./components/Technician";
// import ImageSlider from "./components/SliderImage";
// import { addTechnician } from "../../../redux/slice/technicianSlice";
// import "./styles.scss";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Coupon from "./components/Coupon";
// import StarRating from "../../../components/StarRating";
// import axios from "axios";
// import ModalItem from "./components/Modal";

// const SingleProducts = () => {
//   const [cart, setCart] = useState([]);
//   const [product, setProduct] = useState({});
//   const [quantity, setQuantity] = useState(1);
//   const [technicianModalOpen, setTechnicianModalOpen] = useState(false);
//   const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);
//   const [successModalOpen, setSuccessModalOpen] = useState(false);
//   const [technicians, setTechnicians] = useState([]);
//   const [showProduct, setShowProduct] = useState(false);
//   const [productId, setProductId] = useState("");
//   const [mainImage, setMainImage] = useState("");
//   const [relatedProduct, setRelatedProduct] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [successType, setSuccessType] = useState("");
//   const [modalType, setModalType] = useState("success");
//   const [modalMessage, setModalMessage] = useState("");
//   const [activeTab, setActiveTab] = useState(0);
//   const navigate = useNavigate();
//   const params = useParams();
//   const dispatch = useDispatch();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const { startDate, endDate, numberOfDays } = useSelector(
//     (state) => state.date
//   );
//   const [wishlist, setWishlist] = useState([]);

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

//   // Updated fetchSingleProduct to use category and productSlug with -rental handling
//   const fetchSingleProduct = async () => {
//     try {
//       dispatch(setLoading(true));
//       const res = await authService.rentalProduct(); // Fetch all products
//       const allProducts = res.data.data || [];

//       // Normalize the product slug for matching - remove -rental if present at the end
//       let normalizedProductSlug = params.productSlug;
//       if (normalizedProductSlug.endsWith('-rental')) {
//         normalizedProductSlug = normalizedProductSlug.slice(0, -7); // Remove "-rental"
//       }
//       normalizedProductSlug = normalizedProductSlug.replace(/-/g, ' ').toLowerCase();

//       // Find the product matching category and normalized name
//       const foundProduct = allProducts.find(
//         (item) =>
//           item.product_category.toLowerCase() === params.category.toLowerCase() &&
//           item.product_name.toLowerCase() === normalizedProductSlug
//       );

//       if (foundProduct) {
//         setProduct(foundProduct);
//         setProductId(foundProduct._id);
//         setShowProduct(true);
//         if (foundProduct.product_category) {
//           relatedProducts(foundProduct.product_category);
//         }
//       } else {
//         // Fallback: If not found, navigate back or show error
//         toast.error("Product not found!");
//         navigate("/products");
//       }
//       dispatch(setLoading(false));
//     } catch (error) {
//       getErrorMessage(error);
//       dispatch(setLoading(false));
//     }
//   };

//   const relatedProducts = async (category) => {
//     try {
//       dispatch(setLoading(true));
//       const res = await authService.relatedRentalProduct(category);
//       const filteredProducts = res.data.data
//         .filter(
//           (item) => item.product_category === category && item._id !== productId
//         )
//         .slice(0, 4);

//       setRelatedProduct(filteredProducts);
//       dispatch(setLoading(false));
//     } catch (error) {
//       getErrorMessage(error);
//     }
//   };

//   const handleReviewSubmit = async (reviewData) => {
//     try {
//       dispatch(setLoading(true));
//       const res = await authService.reviewProduct(reviewData, productId);
//       dispatch(setLoading(false));
//     } catch (error) {
//       getErrorMessage(error);
//     }
//   };

//   useEffect(() => {
//     if (product.product_category && productId) {
//       relatedProducts(product.product_category);
//     }
//   }, [product.product_category, productId]);

//   useEffect(() => {
//     fetchSingleProduct();
//   }, [params.category, params.productSlug]); // Depend on slugs

//   useEffect(() => {
//     if (product.product_image && product.product_image.length > 0) {
//       setMainImage(product.product_image[0]);
//     }
//   }, [product.product_image]);

//   const handleAddTechnician = (technician) => {
//     const updatedTechnicians = [...technicians, technician];
//     setTechnicians(updatedTechnicians);
//     setTechnicianModalOpen(false);
//     setSuccessModalOpen(true);
//   };

//   const handleCloseSuccessModal = () => {
//     setSuccessModalOpen(false);
//   };

//   const handleIncrease = () => setQuantity((prev) => prev + 1);
//   const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   let TimeoutId;

//   const handleAddToCart = async () => {
//     if (!userId) {
//       toast.error("Please login", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//       setTimeout(() => {
//         navigate("/login", { state: { from: window.location.pathname } });
//       }, 2000);
//       return;
//     }

//     try {
//       setBottomDrawerOpen(true);
//       const res = await authService.getAllTechnicians();
//       const filteredTechnicians = res.data.tech.filter(
//         (tech) => tech.category === product.product_category
//       );
//       setTechnicians(filteredTechnicians);
//     } catch (error) {
//       getErrorMessage(error);
//       toast.error("Failed to add item to cart. Try again!", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//   };

//   const handleContinue = () => {
//     if (!userId) {
//       toast.error("Please login", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//       setTimeout(() => {
//         navigate("/login", { state: { from: window.location.pathname } });
//       }, 2000);
//       return;
//     }

//     if (product) {
//       dispatch(
//         addToCart({
//           orderId: Date.now().toString(),
//           id: product._id,
//           productName: product.product_name,
//           productPrice: product.product_price,
//           mrpPrice: product.mrp_rate,
//           store: product.shop_name,
//           imageUrl: product.product_image,
//           productDimension: product.product_dimension || "Not Specified",
//           totalPrice: product.product_price * quantity,
//           quantity: quantity,
//           context: "product",
//           sellerName: product.vendor_name,
//           sellerId: product.vendor_id,
//           eventStartDate: startDate,
//           eventEndDate: endDate,
//           commissionTax: product.commission_tax || 0,
//           commissionPercentage: product.commission_percentage || 0,
//         })
//       );
//     }

//     if (technicians && technicians.length > 0) {
//       technicians.forEach((technician) => {
//         dispatch(
//           addTechnician({
//             orderId: Date.now().toString(),
//             id: technician._id,
//             product_image: technician.image || ProfileImg1,
//             category: technician.category,
//             price: technician.price,
//             service_name: technician.service_name,
//             shop_name: technician.shop_name,
//             vendor_id: technician.vendor_id,
//             vendor_name: technician.vendor_name,
//             eventStartDate: startDate,
//             eventEndDate: endDate,
//             quantity: 1,
//             totalPrice: technician.price * 1,
//             commission_tax: technician.commission_tax || 0,
//             commission_percentage: technician.commission_percentage || 0,
//           })
//         );
//       });
//     }
//     toast.success("Item added to cart!", {
//       position: "top-right",
//       autoClose: 2000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     });

//     setBottomDrawerOpen(false);
//     navigate("/cart")
//   };

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };

//   const calculateAverageRating = (review) => {
//     const total = review.reduce((sum, curr) => sum + curr.ratings, 0);
//     return review.length ? (total / review.length).toFixed(1) : 0;
//   };

//   const handleClose = () => {
//     clearTimeout(TimeoutId);
//     setOpen(false);
//   };

//   // Updated handleOpenProduct to use category and slug with -rental
//   const handleOpenProduct = (item) => {
//     const categorySlug = item.product_category.toLowerCase();
//     const productSlug = item.product_name.toLowerCase().replace(/\s+/g, "-") + "-rental";
//     navigate(`/products/${categorySlug}/${productSlug}`);
//   };

//   const handleClick = async (item) => {
//     if (!userId) {
//       toast.error("Please login", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//       setTimeout(() => {
//         navigate("/login", { state: { from: window.location.pathname } });
//       }, 2000);
//       return;
//     }

//     const isInWishlist = wishlist.some((id) => String(id) === String(item._id));

//     if (isInWishlist) {
//       toast.error("This item is already in your wishlist!", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//       return;
//     }

//     const payload = {
//       product_name: item?.product_name,
//       product_id: item?._id,
//       product_image: item?.product_image[0],
//       product_price: item?.product_price,
//       mrp_price: item?.mrp_price,
//       discount: item?.discount,
//       user_id: userId,
//     };

//     try {
//       await axios.post(
//         "https://api.nithyaevent.com/api/wishlist/add-wishlist",
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success("Item has been added to the wishlist!", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });

//       setWishlist((prevWishlist) => [...prevWishlist, item._id]);
//     } catch (error) {
//       let errorMessage = "Something went wrong. Please try again.";

//       if (error.response && error.response.data?.message) {
//         errorMessage = error.response.data.message.includes(
//           "Product already exists"
//         )
//           ? "This product is already in your wishlist!"
//           : `Error: ${error.response.data.message}`;
//       }

//       toast.error(errorMessage, {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//   };

//   const fetchWishlist = async () => {
//     if (!userId) {
//       console.log("No user ID, can't fetch wishlist.");
//       return;
//     }

//     try {
//       const res = await axios.get(
//         `https://api.nithyaevent.com/api/wishlist/get-my-wishlist/${userId}`,
//         { headers: { "Content-Type": "application/json" } }
//       );

//       console.log("Fetched wishlist response:", res);

//       if (res.data?.wishlist && Array.isArray(res.data.wishlist)) {
//         const wishlistItems = res.data.wishlist.map((item) => item.product_id);
//         setWishlist(wishlistItems);
//       } else {
//         setWishlist([]);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist:", error);
//     }
//   };

//   const handleWishlistClick = async (item) => {
//     if (!userId) {
//       toast.error("Please login", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//       setTimeout(() => {
//         navigate("/login", { state: { from: window.location.pathname } });
//       }, 2000);
//       return;
//     }

//     const isInWishlist = wishlist.includes(item._id);

//     if (isInWishlist) {
//       toast.error("This item is already in your wishlist!", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//       return;
//     }

//     try {
//       await axios.post(
//         "https://api.nithyaevent.com/api/wishlist/add-wishlist",
//         {
//           product_name: item.product_name,
//           product_id: item._id,
//           product_image: item.product_image[0],
//           product_price: item.product_price,
//           mrp_price: item.mrp_price,
//           discount: item.discount,
//           user_id: userId,
//         },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       setWishlist((prev) => [...prev, item._id]);
//       toast.success("Item added to wishlist!", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     } catch (error) {
//       let errorMessage = "Something went wrong. Please try again.";

//       if (error.response && error.response.data?.message) {
//         errorMessage = error.response.data.message.includes(
//           "Product already exists"
//         )
//           ? "This product is already in your wishlist!"
//           : `Error: ${error.response.data.message}`;
//       }

//       toast.error(errorMessage, {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchWishlist();
//     }
//   }, [userId]);

//   return (
//     <Box sx={{ marginTop: "2rem" }}>
//       <ToastContainer />
//       {showProduct && (
//         <Box className="product-container">
//           <Box
//             sx={{
//               display: "flex",
//               marginTop: "2rem",
//               gap: "10rem",
//               marginLeft: "4rem",
//               "@media(max-width:620px)": {
//                 flexDirection: "column",
//                 marginLeft: "0rem",
//               },
//               "@media(max-width:1100px)": {
//                 gap: "0rem",
//                 flexDirection: "column",
//               },
//               "@media(min-width:1800px)": {
//                 gap: "23rem",
//                 marginLeft: "26rem",
//               },
//             }}
//           >
//             <Box className="product-content">
//               <img
//                 className="image-container-01"
//                 src={mainImage}
//                 alt="Main Product Image"
//               />
//               <ImageSlider
//                 productImages={product.product_image || []}
//                 setMainImage={setMainImage}
//                 mainImage={mainImage}
//                 productVideo={product.product_video}
//               />
//             </Box>
//             <Box>
//               <Box
//                 sx={{
//                   width: "30rem",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "0.6rem",
//                   "@media(max-width:620px)": {
//                     width: "25rem",
//                   },
//                 }}
//               >
//                 <Box>
//                   <Typography variant="p" sx={{ fontSize: "1.4rem" }}>
//                     {product.product_name.includes("Rental")
//                       ? product.product_name
//                       : `${product.product_name} Rental`}
//                   </Typography>
//                   <Typography
//                     className="rating"
//                     variant="body2"
//                     sx={{ color: "text.secondary" }}
//                   ></Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "0.7rem",
//                     marginTop: "0.3rem",
//                   }}
//                 >
//                   <Typography
//                     variant="p"
//                     sx={{
//                       fontWeight: "bold",
//                       color: "#000",
//                       fontSize: "1.4rem",
//                     }}
//                   >
//                     ₹{product.product_price}
//                   </Typography>
//                   {product.discount < product.product_price && (
//                     <Typography
//                       variant="p"
//                       sx={{
//                         textDecoration: "line-through",
//                         color: "red",
//                         fontSize: "1.2rem",
//                         display: "flex",
//                         alignItems: "center",
//                       }}
//                     >
//                       ₹{product.mrp_rate || "2500"}
//                     </Typography>
//                   )}
//                   <Typography sx={{ color: "red", marginLeft: "-0.2rem" }}>
//                     Per day
//                   </Typography>
//                 </Box>
//                 <Box className="Rating-point">
//                   <Box
//                     sx={{ display: "flex", gap: "1rem", marginTop: "0.2rem" }}
//                   >
//                     <StarRating
//                       rating={parseFloat(
//                         calculateAverageRating(product.Reviews)
//                       )}
//                     />
//                     <Typography variant="p" style={{ fontSize: "0.8rem" }}>
//                       {product.Reviews.length > 0 ? product.Reviews.length : 0}{" "}
//                       Reviews
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Box display="flex" alignItems="center" gap={1} mb={2}>
//                   <Typography variant="p">Quantity:</Typography>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       border: "1px solid #ccc",
//                       borderRadius: "5px",
//                       padding: "0px 8px",
//                     }}
//                   >
//                     <IconButton
//                       size="small"
//                       onClick={handleDecrease}
//                       disabled={quantity === 1}
//                     >
//                       <RemoveIcon fontSize="small" />
//                     </IconButton>
//                     <Typography
//                       variant="h6"
//                       sx={{ margin: "0 10px", fontSize: "0.8rem" }}
//                     >
//                       {quantity}
//                     </Typography>
//                     <IconButton size="small" onClick={handleIncrease}>
//                       <AddIcon fontSize="small" />
//                     </IconButton>
//                   </Box>
//                 </Box>
//               </Box>
//               <Coupon />
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   gap: "1rem",
//                   alignItems: "baseline",
//                 }}
//               >
//                 <Button
//                   color="white"
//                   sx={{ backgroundColor: "#c026d3", color: "white" }}
//                   className="addToCart"
//                   onClick={handleAddToCart}
//                 >
//                   <ShoppingBagOutlinedIcon sx={{ marginRight: "8px" }} />
//                   Add to Cart
//                 </Button>
//                 {wishlist.some((id) => String(id) === String(product._id)) ? (
//                   <Button
//                     variant="outlined"
//                     color="secondary"
//                     onClick={() => navigate("/wishlist")}
//                     sx={{
//                       fontWeight: "bold",
//                       height: "37px",
//                       marginTop: "2rem",
//                       width: "18rem",
//                     }}
//                   >
//                     <FavoriteOutlinedIcon sx={{ marginRight: "8px" }} />
//                     View Wishlist
//                   </Button>
//                 ) : (
//                   <Button
//                     variant="outlined"
//                     color="red"
//                     className="addToWishlist"
//                     onClick={() => handleClick(product)}
//                   >
//                     <FavoriteBorderOutlinedIcon sx={{ marginRight: "8px" }} />
//                     Add to Wishlist
//                   </Button>
//                 )}
//               </Box>
//             </Box>
//           </Box>
//           <Tabs
//             value={activeTab}
//             onChange={handleTabChange}
//             className="tabs-container"
//             variant={isMobile ? "scrollable" : "standard"}
//             scrollButtons="auto"
//             allowScrollButtonsMobile
//             sx={{
//               color: "red",
//               background:
//                 "linear-gradient(rgb(255, 255, 255), rgb(245 232 247))",
//               padding: "0.8rem 5rem",
//               "& .MuiTabs-indicator": {
//                 backgroundColor: "#c026d3",
//               },
//               "& .MuiTab-root": {
//                 color: "#9c27b0",
//                 textTransform: "none",
//                 fontWeight: "bold",
//               },
//               "& .Mui-selected": {
//                 color: "#c026d3",
//               },
//             }}
//           >
//             <Tab label="Product Details" />
//             <Tab label="Reviews" />
//           </Tabs>
//           <Box
//             className="tab-content"
//             sx={{ padding: "0rem 7rem", gap: "30rem" }}
//           >
//             {activeTab === 0 && (
//               <Box sx={{ display: "flex", gap: "3rem" }}>
//                 <Box className="Product-detail-container">
//                   <Typography
//                     variant="p"
//                     sx={{ fontWeight: "600" }}
//                     className="Product-detail-heading"
//                   >
//                     Product Details
//                   </Typography>
//                   <Box className="Product-detail">
//                     <Box className="tab1-content">
//                       <Typography variant="p">Brand:</Typography>
//                       <Typography variant="p">Category:</Typography>
//                       <Typography variant="p">Model Name:</Typography>
//                       <Typography variant="p">Product Dimensions:</Typography>
//                       <Typography variant="p">Item Weight:</Typography>
//                       <Typography variant="p">Material Type:</Typography>
//                     </Box>
//                     <Box className="tab2-content">
//                       <Typography variant="p">{product.brand}</Typography>
//                       <Typography variant="p">
//                         {product.product_category}
//                       </Typography>
//                       <Typography variant="p">{product.model_name}</Typography>
//                       <Typography variant="p">
//                         {product.product_dimension}
//                       </Typography>
//                       <Typography variant="p">
//                         {product.product_weight}
//                       </Typography>
//                       <Typography variant="p">
//                         {product.material_type}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Box>
//                 <Box className="Spec-container">
//                   <Typography
//                     variant="p"
//                     sx={{ fontWeight: "600" }}
//                     className="Spec-detail-heading"
//                   >
//                     Other Details
//                   </Typography>
//                   <Box className="Spec-detail">
//                     <Box className="tab1-content">
//                       <Typography variant="p">Manufacturer:</Typography>
//                       <Typography variant="p">Color:</Typography>
//                       <Typography variant="p">Product Type:</Typography>
//                       <Typography variant="p">Shop Name:</Typography>
//                       <Typography variant="p">Vendor Name:</Typography>
//                       <Typography variant="p">Stock In Hand:</Typography>
//                       <Typography variant="p">Country of Origin:</Typography>
//                     </Box>
//                     <Box className="tab2-content">
//                       <Typography variant="p">
//                         {product.manufacturer_name}
//                       </Typography>
//                       <Typography variant="p">
//                         {product.product_color}
//                       </Typography>
//                       <Typography variant="p">
//                         {product.product_type}
//                       </Typography>
//                       <Typography variant="p">{product.shop_name}</Typography>
//                       <Typography variant="p">{product.vendor_name}</Typography>
//                       <Typography variant="p">
//                         {product.stock_in_hand}
//                       </Typography>
//                       <Typography variant="p">
//                         {product.country_of_orgin}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Box>
//               </Box>
//             )}
//             {activeTab === 1 && (
//               <Box>
//                 <Review
//                   onSubmit={handleReviewSubmit}
//                   productId={productId}
//                   userId={userId}
//                 />
//               </Box>
//             )}
//           </Box>
//           <Box className="related-products">
//             <Typography variant="h4">Related Products</Typography>
//             <Box className="related-product-container">
//               {relatedProduct?.map((item) => (
//                 <Box key={item._id} onClick={() => handleOpenProduct(item)}>
//                   <img
//                     className="related-product-image"
//                     src={item.product_image}
//                     alt="Not Found"
//                   />
//                   <Box
//                     sx={{ display: "flex", justifyContent: "space-between" }}
//                   >
//                     <Typography
//                       variant="h6"
//                       sx={{
//                         fontWeight: "bold",
//                         fontSize: "1rem",
//                         color: "#343a40",
//                       }}
//                     >
//                       {item.product_name.length > 15
//                         ? item.product_name.slice(0, 15) + "..."
//                         : item.product_name}
//                     </Typography>
//                     <Button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleWishlistClick(item);
//                       }}
//                       sx={{ color: "#c026d3", position: "relative" }}
//                     >
//                       {wishlist.includes(item._id) ? (
//                         <FavoriteOutlinedIcon
//                           style={{ position: "absolute" }}
//                         />
//                       ) : (
//                         <FavoriteBorderOutlinedIcon
//                           style={{ position: "absolute" }}
//                         />
//                       )}
//                     </Button>
//                   </Box>
//                   <Box
//                     sx={{ display: "flex", gap: "1rem", marginTop: "0.2rem" }}
//                   >
//                     <StarRating
//                       rating={parseFloat(calculateAverageRating(item.Reviews))}
//                     />
//                     <Typography variant="p" style={{ fontSize: "0.8rem" }}>
//                       {item.Reviews.length > 0 ? item.Reviews.length : 0}{" "}
//                       Reviews
//                     </Typography>
//                   </Box>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "0.7rem",
//                       marginTop: "0.3rem",
//                     }}
//                   >
//                     <Typography
//                       variant="p"
//                       sx={{
//                         fontWeight: "bold",
//                         color: "#000",
//                         fontSize: "1rem",
//                       }}
//                     >
//                       ₹{item.product_price}
//                     </Typography>
//                     {item.discount < item.product_price && (
//                       <Typography
//                         variant="p"
//                         sx={{
//                           textDecoration: "line-through",
//                           color: "red",
//                           fontSize: "1rem",
//                           display: "flex",
//                           alignItems: "center",
//                         }}
//                       >
//                         ₹{item.mrp_rate || "2500"}
//                       </Typography>
//                     )}
//                     <Typography sx={{ color: "red", marginLeft: "-0.2rem" }}>
//                       Per day
//                     </Typography>
//                   </Box>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "center",
//                       margin: "0 auto",
//                     }}
//                   >
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       sx={{
//                         width: "15rem",
//                         textTransform: "capitalize",
//                         fontWeight: "bold",
//                         marginTop: "1rem",
//                         backgroundColor: "#c026d3",
//                         color: "white",
//                         border: "none",
//                         "&:hover": {
//                           borderColor: "black",
//                           boxShadow: "none",
//                         },
//                       }}
//                     >
//                       View More
//                     </Button>
//                   </Box>
//                 </Box>
//               ))}
//             </Box>
//           </Box>
//           <Drawer
//             anchor="bottom"
//             open={bottomDrawerOpen}
//             onClose={() => setBottomDrawerOpen(false)}
//           >
//             <Box
//               sx={{
//                 width: "100%",
//                 maxHeight: "80vh",
//                 overflowY: "auto",
//                 padding: "1.5rem",
//                 bgcolor: "background.paper",
//                 borderTopLeftRadius: "16px",
//                 borderTopRightRadius: "16px",
//                 boxShadow: 24,
//               }}
//             >
//               <IconButton
//                 sx={{ position: "absolute", right: 10, top: 10 }}
//                 onClick={() => setBottomDrawerOpen(false)}
//               ></IconButton>
//               <Typography variant="h6" textAlign="center" gutterBottom>
//                 Select a Technician
//               </Typography>
//               <Technician
//                 selectedTechnicians={technicians}
//                 setSelectedTechnicians={setTechnicians}
//                 onSelectTechnician={setTechnicians}
//                 productCategory={product.product_category}
//               />
//               <Box textAlign="center" mt={2}>
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={handleContinue}
//                 >
//                   Continue
//                 </Button>
//               </Box>
//             </Box>
//           </Drawer>
//           <Modal
//             open={open}
//             onClose={() => setOpen(false)}
//             aria-labelledby="modal-title"
//             aria-describedby="modal-description"
//           >
//             <ModalItem modalMessage={modalMessage} modalType={modalType} />
//           </Modal>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default SingleProducts;


import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Modal,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import ProfileImg1 from "../../../assets/profileImg1.jpg";
import { addToCart } from "../../../redux/slice/CartSlice";
import authService from "../../../api/ApiService";
import { setLoading } from "../../../redux/slice/LoaderSlice";
import { getErrorMessage } from "../../../utils/helperFunc"
import Review from "./components/Review";
import Technician from "./components/Technician";
import ImageSlider from "./components/SliderImage";
import { addTechnician } from "../../../redux/slice/technicianSlice";
import "./styles.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Coupon from "./components/Coupon";
import StarRating from "../../../components/StarRating";
import axios from "axios";
import ModalItem from "./components/Modal";

const SingleProducts = () => {
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [technicianModalOpen, setTechnicianModalOpen] = useState(false);
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [showProduct, setShowProduct] = useState(false);
  const [productId, setProductId] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [relatedProduct, setRelatedProduct] = useState([]);
  const relatedScrollRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [successType, setSuccessType] = useState("");
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { startDate, endDate, numberOfDays } = useSelector(
    (state) => state.date
  );
  const [wishlist, setWishlist] = useState([]);

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

  // Video detection function
  const isVideoFile = (url) => {
    if (!url) return false;
    const videoExtensions = [
      "mp4", "mov", "avi", "mkv", "webm", "m4v", "flv",
      "wmv", "3gp", "mpeg"
    ];
    const ext = url.split("?")[0].split(".").pop().toLowerCase();
    return videoExtensions.includes(ext);
  };

  const fetchSingleProduct = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.rentalProduct();
      const allProducts = res.data.data || [];

      let normalizedProductSlug = params.productSlug;
      if (normalizedProductSlug.endsWith('-rental')) {
        normalizedProductSlug = normalizedProductSlug.slice(0, -7);
      }
      normalizedProductSlug = normalizedProductSlug.replace(/-/g, ' ').toLowerCase();

      const foundProduct = allProducts.find(
        (item) =>
          item.product_category.toLowerCase() === params.category.toLowerCase() &&
          item.product_name.toLowerCase() === normalizedProductSlug
      );

      if (foundProduct) {
        setProduct(foundProduct);
        setProductId(foundProduct._id);
        setShowProduct(true);
        
        // Set initial main image - prioritize first image, then video
        if (foundProduct.product_image && foundProduct.product_image.length > 0) {
          setMainImage(foundProduct.product_image[0]);
        } else if (foundProduct.product_video) {
          setMainImage(foundProduct.product_video);
        }
        
        if (foundProduct.product_category) {
          relatedProducts(foundProduct.product_category);
        }
      } else {
        toast.error("Product not found!");
        navigate("/products");
      }
      dispatch(setLoading(false));
    } catch (error) {
      getErrorMessage(error);
      dispatch(setLoading(false));
    }
  };

  const relatedProducts = async (category) => {
    try {
      dispatch(setLoading(true));
      const res = await authService.relatedRentalProduct(category);
      const filteredProducts = res.data.data.filter(
        (item) => item.product_category === category && item._id !== productId
      );

      setRelatedProduct(filteredProducts);
      dispatch(setLoading(false));
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      dispatch(setLoading(true));
      const res = await authService.reviewProduct(reviewData, productId);
      dispatch(setLoading(false));
    } catch (error) {
      getErrorMessage(error);
    }
  };

  useEffect(() => {
    if (product.product_category && productId) {
      relatedProducts(product.product_category);
    }
  }, [product.product_category, productId]);

  useEffect(() => {
    fetchSingleProduct();
  }, [params.category, params.productSlug]);

  const handleAddTechnician = (technician) => {
    const updatedTechnicians = [...technicians, technician];
    setTechnicians(updatedTechnicians);
    setTechnicianModalOpen(false);
    setSuccessModalOpen(true);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
  };

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  let TimeoutId;

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Please login", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate("/login", { state: { from: window.location.pathname } });
      }, 2000);
      return;
    }

    // Match the mobile booking flow: skip the technician-selection step and
    // add the product straight to the cart (no technician drawer).
    handleContinue();
  };

  const handleContinue = () => {
    if (!userId) {
      toast.error("Please login", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate("/login", { state: { from: window.location.pathname } });
      }, 2000);
      return;
    }

    if (product) {
      dispatch(
        addToCart({
          orderId: Date.now().toString(),
          id: product._id,
          productName: product.product_name,
          productPrice: product.product_price,
          mrpPrice: product.mrp_rate,
          store: product.shop_name,
          imageUrl: product.product_image,
          productDimension: product.product_dimension || "Not Specified",
          totalPrice: product.product_price * quantity,
          quantity: quantity,
          context: "product",
          sellerName: product.vendor_name,
          sellerId: product.vendor_id,
          eventStartDate: startDate,
          eventEndDate: endDate,
          commissionTax: product.commission_tax || 0,
          commissionPercentage: product.commission_percentage || 0,
        })
      );
    }

    if (technicians && technicians.length > 0) {
      technicians.forEach((technician) => {
        dispatch(
          addTechnician({
            orderId: Date.now().toString(),
            id: technician._id,
            product_image: technician.image || ProfileImg1,
            category: technician.category,
            price: technician.price,
            service_name: technician.service_name,
            shop_name: technician.shop_name,
            vendor_id: technician.vendor_id,
            vendor_name: technician.vendor_name,
            eventStartDate: startDate,
            eventEndDate: endDate,
            quantity: 1,
            totalPrice: technician.price * 1,
            commission_tax: technician.commission_tax || 0,
            commission_percentage: technician.commission_percentage || 0,
          })
        );
      });
    }
    toast.success("Item added to cart!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setBottomDrawerOpen(false);
    navigate("/cart")
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const calculateAverageRating = (review) => {
    const total = review.reduce((sum, curr) => sum + curr.ratings, 0);
    return review.length ? (total / review.length).toFixed(1) : 0;
  };

  // Scroll the related-products carousel by roughly one card width.
  const scrollRelated = (direction) => {
    const el = relatedScrollRef.current;
    if (!el) return;
    const amount = 260; // ~ one card + gap
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleClose = () => {
    clearTimeout(TimeoutId);
    setOpen(false);
  };

  const handleOpenProduct = (item) => {
    const categorySlug = item.product_category.toLowerCase();
    const productSlug = item.product_name.toLowerCase().replace(/\s+/g, "-") + "-rental";
    navigate(`/products/${categorySlug}/${productSlug}`);
  };

  const handleWishlistClick = async (item) => {
    if (!userId) {
      toast.error("Please login", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate("/login", { state: { from: window.location.pathname } });
      }, 2000);
      return;
    }

    const isInWishlist = wishlist.includes(item._id);

    if (isInWishlist) {
      toast.error("This item is already in your wishlist!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      await axios.post(
        "https://api.nithyaevent.com/api/wishlist/add-wishlist",
        {
          product_name: item.product_name,
          product_id: item._id,
          product_image: item.product_image[0],
          product_price: item.product_price,
          mrp_price: item.mrp_price,
          discount: item.discount,
          user_id: userId,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setWishlist((prev) => [...prev, item._id]);
      toast.success("Item added to wishlist!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response && error.response.data?.message) {
        errorMessage = error.response.data.message.includes(
          "Product already exists"
        )
          ? "This product is already in your wishlist!"
          : `Error: ${error.response.data.message}`;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const fetchWishlist = async () => {
    if (!userId) {
      console.log("No user ID, can't fetch wishlist.");
      return;
    }

    try {
      const res = await axios.get(
        `https://api.nithyaevent.com/api/wishlist/get-my-wishlist/${userId}`,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Fetched wishlist response:", res);

      if (res.data?.wishlist && Array.isArray(res.data.wishlist)) {
        const wishlistItems = res.data.wishlist.map((item) => item.product_id);
        setWishlist(wishlistItems);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  return (
    <Box sx={{ marginTop: "2rem" }}>
      <ToastContainer />
      {showProduct && (
        <Box className="product-container">
          <Box
            sx={{
              display: "flex",
              marginTop: "2rem",
              gap: "10rem",
              marginLeft: "4rem",
              "@media(max-width:620px)": {
                flexDirection: "column",
                marginLeft: "0rem",
              },
              "@media(max-width:1100px)": {
                gap: "0rem",
                flexDirection: "column",
              },
              "@media(min-width:1800px)": {
                gap: "23rem",
                marginLeft: "26rem",
              },
            }}
          >
            <Box className="product-content">
              {/* Main Image/Video Display */}
              {isVideoFile(mainImage) ? (
                <Box className="image-container-01">
                  <video
                    controls
                    autoPlay
                    muted
                    loop
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  >
                    <source src={mainImage} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              ) : (
                <img
                  className="image-container-01"
                  src={mainImage}
                  alt="Main Product Image"
                />
              )}
              
              <ImageSlider
                productImages={product.product_image || []}
                setMainImage={setMainImage}
                mainImage={mainImage}
                productVideo={product.product_video}
              />
            </Box>
            <Box>
              <Box
                sx={{
                  width: "30rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                  "@media(max-width:620px)": {
                    width: "25rem",
                  },
                }}
              >
                <Box>
                  <Typography variant="p" sx={{ fontSize: "1.4rem" }}>
                    {product.product_name.includes("Rental")
                      ? product.product_name
                      : `${product.product_name} Rental`}
                  </Typography>
                  <Typography
                    className="rating"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  ></Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.7rem",
                    marginTop: "0.3rem",
                  }}
                >
                  <Typography
                    variant="p"
                    sx={{
                      fontWeight: "bold",
                      color: "#000",
                      fontSize: "1.4rem",
                    }}
                  >
                    ₹{product.product_price}
                  </Typography>
                  {product.discount < product.product_price && (
                    <Typography
                      variant="p"
                      sx={{
                        textDecoration: "line-through",
                        color: "red",
                        fontSize: "1.2rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      ₹{product.mrp_rate || "2500"}
                    </Typography>
                  )}
                  <Typography sx={{ color: "red", marginLeft: "-0.2rem" }}>
                    Per day
                  </Typography>
                </Box>
                <Box className="Rating-point">
                  <Box
                    sx={{ display: "flex", gap: "1rem", marginTop: "0.2rem" }}
                  >
                    <StarRating
                      rating={parseFloat(
                        calculateAverageRating(product.Reviews)
                      )}
                    />
                    <Typography variant="p" style={{ fontSize: "0.8rem" }}>
                      {product.Reviews.length > 0 ? product.Reviews.length : 0}{" "}
                      Reviews
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Typography variant="p">Quantity:</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "0px 8px",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={handleDecrease}
                      disabled={quantity === 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography
                      variant="h6"
                      sx={{ margin: "0 10px", fontSize: "0.8rem" }}
                    >
                      {quantity}
                    </Typography>
                    <IconButton size="small" onClick={handleIncrease}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
              <Coupon />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  alignItems: "baseline",
                }}
              >
                <Button
                  color="white"
                  sx={{ backgroundColor: "#c026d3", color: "white" }}
                  className="addToCart"
                  onClick={handleAddToCart}
                >
                  <ShoppingBagOutlinedIcon sx={{ marginRight: "8px" }} />
                  Add to Cart
                </Button>
                {wishlist.some((id) => String(id) === String(product._id)) ? (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/wishlist")}
                    sx={{
                      fontWeight: "bold",
                      height: "37px",
                      marginTop: "2rem",
                      width: "18rem",
                    }}
                  >
                    <FavoriteOutlinedIcon sx={{ marginRight: "8px" }} />
                    View Wishlist
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="red"
                    className="addToWishlist"
                    onClick={() => handleWishlistClick(product)}
                  >
                    <FavoriteBorderOutlinedIcon sx={{ marginRight: "8px" }} />
                    Add to Wishlist
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
          
          {/* Rest of your component remains the same */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            className="tabs-container"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              color: "red",
              background:
                "linear-gradient(rgb(255, 255, 255), rgb(245 232 247))",
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
                color: "#c026d3",
              },
            }}
          >
            <Tab label="Product Details" />
            <Tab label="Reviews" />
          </Tabs>
          
           <Box
            className="tab-content"
            sx={{ padding: "0rem 7rem", gap: "30rem" }}
          >
            {activeTab === 0 && (
              <Box sx={{ display: "flex", gap: "3rem" }}>
                <Box className="Product-detail-container">
                  <Typography
                    variant="p"
                    sx={{ fontWeight: "600" }}
                    className="Product-detail-heading"
                  >
                    Product Details
                  </Typography>
                  <Box className="Product-detail">
                    <Box className="tab1-content">
                      <Typography variant="p">Brand:</Typography>
                      <Typography variant="p">Category:</Typography>
                      <Typography variant="p">Model Name:</Typography>
                      <Typography variant="p">Product Dimensions:</Typography>
                      <Typography variant="p">Item Weight:</Typography>
                      <Typography variant="p">Material Type:</Typography>
                    </Box>
                    <Box className="tab2-content">
                      <Typography variant="p">{product.brand}</Typography>
                      <Typography variant="p">
                        {product.product_category}
                      </Typography>
                      <Typography variant="p">{product.model_name}</Typography>
                      <Typography variant="p">
                        {product.product_dimension}
                      </Typography>
                      <Typography variant="p">
                        {product.product_weight}
                      </Typography>
                      <Typography variant="p">
                        {product.material_type}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className="Spec-container">
                  <Typography
                    variant="p"
                    sx={{ fontWeight: "600" }}
                    className="Spec-detail-heading"
                  >
                    Other Details
                  </Typography>
                  <Box className="Spec-detail">
                    <Box className="tab1-content">
                      <Typography variant="p">Manufacturer:</Typography>
                      <Typography variant="p">Color:</Typography>
                      <Typography variant="p">Product Type:</Typography>
                      <Typography variant="p">Shop Name:</Typography>
                      <Typography variant="p">Vendor Name:</Typography>
                      <Typography variant="p">Stock In Hand:</Typography>
                      <Typography variant="p">Country of Origin:</Typography>
                    </Box>
                    <Box className="tab2-content">
                      <Typography variant="p">
                        {product.manufacturer_name}
                      </Typography>
                      <Typography variant="p">
                        {product.product_color}
                      </Typography>
                      <Typography variant="p">
                        {product.product_type}
                      </Typography>
                      <Typography variant="p">{product.shop_name}</Typography>
                      <Typography variant="p">{product.vendor_name}</Typography>
                      <Typography variant="p">
                        {product.stock_in_hand}
                      </Typography>
                      <Typography variant="p">
                        {product.country_of_orgin}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
            {activeTab === 1 && (
              <Box>
                <Review
                  onSubmit={handleReviewSubmit}
                  productId={productId}
                  userId={userId}
                />
              </Box>
            )}
          </Box>
          <Box className="related-products">
            <Typography variant="h4">Related Products</Typography>
            <Box sx={{ position: "relative" }}>
              {relatedProduct.length > 4 && (
                <IconButton
                  aria-label="Previous related products"
                  onClick={() => scrollRelated("left")}
                  sx={{
                    position: "absolute",
                    left: -8,
                    top: "40%",
                    zIndex: 2,
                    backgroundColor: "#fff",
                    boxShadow: 2,
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
              )}
              <Box
                className="related-product-container"
                ref={relatedScrollRef}
                sx={{
                  overflowX: "auto",
                  scrollBehavior: "smooth",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {relatedProduct?.map((item) => (
                  <Box
                    key={item._id}
                    onClick={() => handleOpenProduct(item)}
                    sx={{ flexShrink: 0, minWidth: "13rem" }}
                  >
                  <img
                    className="related-product-image"
                    src={
                      Array.isArray(item.product_image)
                        ? item.product_image[0]
                        : item.product_image
                    }
                    alt={item.product_name || "Product"}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='180'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23eeeeee'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23999999'%20font-family='sans-serif'%20font-size='14'%20text-anchor='middle'%20dominant-baseline='middle'%3ENo%20Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        color: "#343a40",
                      }}
                    >
                      {item.product_name.length > 15
                        ? item.product_name.slice(0, 15) + "..."
                        : item.product_name}
                    </Typography>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistClick(item);
                      }}
                      sx={{ color: "#c026d3", position: "relative" }}
                    >
                      {wishlist.includes(item._id) ? (
                        <FavoriteOutlinedIcon
                          style={{ position: "absolute" }}
                        />
                      ) : (
                        <FavoriteBorderOutlinedIcon
                          style={{ position: "absolute" }}
                        />
                      )}
                    </Button>
                  </Box>
                  <Box
                    sx={{ display: "flex", gap: "1rem", marginTop: "0.2rem" }}
                  >
                    <StarRating
                      rating={parseFloat(calculateAverageRating(item.Reviews))}
                    />
                    <Typography variant="p" style={{ fontSize: "0.8rem" }}>
                      {item.Reviews.length > 0 ? item.Reviews.length : 0}{" "}
                      Reviews
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.7rem",
                      marginTop: "0.3rem",
                    }}
                  >
                    <Typography
                      variant="p"
                      sx={{
                        fontWeight: "bold",
                        color: "#000",
                        fontSize: "1rem",
                      }}
                    >
                      ₹{item.product_price}
                    </Typography>
                    {item.discount < item.product_price && (
                      <Typography
                        variant="p"
                        sx={{
                          textDecoration: "line-through",
                          color: "red",
                          fontSize: "1rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        ₹{item.mrp_rate || "2500"}
                      </Typography>
                    )}
                    <Typography sx={{ color: "red", marginLeft: "-0.2rem" }}>
                      Per day
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "0 auto",
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        width: "15rem",
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        marginTop: "1rem",
                        backgroundColor: "#c026d3",
                        color: "white",
                        border: "none",
                        "&:hover": {
                          borderColor: "black",
                          boxShadow: "none",
                        },
                      }}
                    >
                      View More
                    </Button>
                  </Box>
                  </Box>
                ))}
              </Box>
              {relatedProduct.length > 4 && (
                <IconButton
                  aria-label="Next related products"
                  onClick={() => scrollRelated("right")}
                  sx={{
                    position: "absolute",
                    right: -8,
                    top: "40%",
                    zIndex: 2,
                    backgroundColor: "#fff",
                    boxShadow: 2,
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
          <Drawer
            anchor="bottom"
            open={bottomDrawerOpen}
            onClose={() => setBottomDrawerOpen(false)}
          >
            <Box
              sx={{
                width: "100%",
                maxHeight: "80vh",
                overflowY: "auto",
                padding: "1.5rem",
                bgcolor: "background.paper",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                boxShadow: 24,
              }}
            >
              <IconButton
                sx={{ position: "absolute", right: 10, top: 10 }}
                onClick={() => setBottomDrawerOpen(false)}
              ></IconButton>
              <Typography variant="h6" textAlign="center" gutterBottom>
                Select a Technician
              </Typography>
              <Technician
                selectedTechnicians={technicians}
                setSelectedTechnicians={setTechnicians}
                onSelectTechnician={setTechnicians}
                productCategory={product.product_category}
              />
              <Box textAlign="center" mt={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          </Drawer>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <ModalItem modalMessage={modalMessage} modalType={modalType} />
          </Modal>
        </Box>
      )}
    </Box>
  );
};

export default SingleProducts;