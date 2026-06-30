// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Box,
//   Typography,
//   Button,
//   Divider,
//   Grid,
//   IconButton,
//   TableCell,
//   TableHead,
//   TableRow,
//   TableContainer,
//   Table,
//   TableBody,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import DeleteIcon from "@mui/icons-material/Delete";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import authService from "../../api/ApiService";
// import {
//   addToCart,
//   clearCart,
//   quantityDecrement,
//   quantityIncrement,
//   removeFromCart,
// } from "../../redux/slice/CartSlice";
// import { getErrorMessage } from "../../utils/helperFunc";
// import EventDetails from "./components/EventDetails";
// import { setLoading } from "../../redux/slice/LoaderSlice";
// import BreadCrumb from "../../components/BreadCrumb";
// import {
//   clearTechnicians,
//   decrementTechnicianQuantity,
//   incrementTechnicianQuantity,
//   removeTechnician,
// } from "../../redux/slice/technicianSlice";
// import {
//   clearServices,
//   decrementServiceQuantity,
//   incrementServiceQuantity,
//   removeService,
// } from "../../redux/slice/serviceSlice";
// import TechnicianImg from "../../assets/profileImg1.jpg";
// import "./styles.scss";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { config } from "../../api/config";

// const Cart = () => {
//   const cartItems = useSelector((state) => state.cart.cart);
//   const servicesItem = useSelector((state) => state.services.services);
//   const technicianItem = useSelector((state) => state.technicians.technicians);
//   const dispatch = useDispatch();

//   const { startDate, endDate, numberOfDays } = useSelector(
//     (state) => state.date
//   );

//   const [wishlist, setWishlist] = useState([]);
//   const [technicians, setTechnicians] = useState([]);

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

//   const breadcrumbPaths = [
//     { label: "Home", link: "/" },
//     { label: "Products", link: "/products" },
//     { label: "Cart", link: "cart" },
//   ];

//   // ✅ Fetch Technicians
//   const getTechnicians = async () => {
//     dispatch(setLoading(true));
//     try {
//       const res = await authService.getAllTechnicians();
//       setTechnicians(res.data.tech);
//       dispatch(setLoading(false));
//     } catch (error) {
//       dispatch(setLoading(false));
//       getErrorMessage(error);
//     }
//   };

//   // ✅ Fetch Wishlist
//   const getWishlist = async () => {
//     try {
//       const res = await axios.get(
//         `${config.BASEURL}/wishlist/get-my-wishlist/${userId}`,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       if (res.data?.wishlist) {
//         const wishlistItems = res.data.wishlist.map((item) => item.product_id);
//         setWishlist(wishlistItems);
//       } else {
//         setWishlist([]);
//       }
//     } catch (error) {
//       getErrorMessage(error);
//     }
//   };

//   // ✅ Wishlist Click
//   const handleWishlistClick = async (item) => {
//     try {
//       await axios.post(
//         "https://api.nithyaevent.com/api/wishlist/add-wishlist",
//         {
//           product_name: item.productName,
//           product_id: item.id,
//           product_image: item.imageUrl[0],
//           product_price: item.productPrice,
//           mrp_price: item.mrpPrice,
//           discount: item.discount,
//           user_id: userId,
//         },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       setWishlist((prev) => [...prev, item.id]);
//       toast.success("Item added to wishlist!", { position: "top-right" });

//       setTimeout(() => {
//         dispatch(removeFromCart(item.id));
//       }, 1000);
//     } catch (error) {
//       toast.error("Failed to add item to wishlist!", { position: "top-right" });
//     }
//   };

//   // ✅ Quantity Handlers
//   const handleQuantityDecrement = (itemId, type) => {
//     if (type === "product") {
//       dispatch(quantityDecrement(itemId));
//     } else if (type === "technicians") {
//       dispatch(decrementTechnicianQuantity(itemId));
//     } else if (type === "service") {
//       dispatch(decrementServiceQuantity(itemId));
//     }
//   };

//   const handleQuantityIncrement = (itemId, type) => {
//     if (type === "product") {
//       dispatch(quantityIncrement(itemId));
//     } else if (type === "technicians") {
//       dispatch(incrementTechnicianQuantity(itemId));
//     } else if (type === "service") {
//       dispatch(incrementServiceQuantity(itemId));
//     }
//   };

//   const handleDeleteItem = (itemId) => {
//     if (cartItems.some((item) => item.id === itemId)) {
//       dispatch(removeFromCart(itemId));
//     } else if (technicianItem.some((tech) => tech.id === itemId)) {
//       dispatch(removeTechnician(itemId));
//     } else if (servicesItem.some((service) => service.id === itemId)) {
//       dispatch(removeService(itemId));
//     }
//   };

//   const handleClearAll = () => {
//     dispatch(clearCart());
//     dispatch(clearTechnicians());
//     dispatch(clearServices());
//   };

//   // ✅ Total Calculation Logic
//   const calculateItemTotal = (item) => {
//     if (item.totalPrice) return item.totalPrice * (item.quantity || 1);
//     if (item.productPrice) return item.productPrice * (item.quantity || 1);
//     if (item.price) return item.price * (item.quantity || 1);
//     return 0;
//   };

//   const productTotal = cartItems.reduce(
//     (total, item) => total + calculateItemTotal(item),
//     0
//   );
//   const serviceTotal = servicesItem.reduce(
//     (total, item) => total + calculateItemTotal(item),
//     0
//   );
//   const technicianTotal = technicianItem.reduce(
//     (total, item) => total + calculateItemTotal(item),
//     0
//   );

//   const totalPrice = productTotal + serviceTotal + technicianTotal;

//   const days = numberOfDays && numberOfDays > 0 ? numberOfDays : 1;

//   const baseAmount = totalPrice * days;
//   const tdsCharges = baseAmount * 0.02;
//   const amountAfterTds = baseAmount - tdsCharges;
//   const gst = amountAfterTds * 0.18;
//   const grandTotal = amountAfterTds + gst;

//   useEffect(() => {
//     getTechnicians();
//     getWishlist();
//   }, []);

//   return (
//     <Box sx={{ padding: "2rem" }}>
//       <ToastContainer />
//       <BreadCrumb paths={breadcrumbPaths} />

//       {/* Empty Cart */}
//       {cartItems.length + servicesItem.length + technicianItem.length === 0 ? (
//         <Box sx={{ textAlign: "center", marginTop: "3rem" }}>
//           <ShoppingCartIcon sx={{ fontSize: "8rem", color: "#c026d3" }} />
//           <Typography sx={{ marginTop: "1rem" }}>Your cart is empty.</Typography>
//           <Button
//             variant="contained"
//             href="/products"
//             sx={{
//               marginTop: "1rem",
//               backgroundColor: "#c026d3",
//               "&:hover": { backgroundColor: "#a21caf" },
//             }}
//           >
//             Continue Shopping
//           </Button>
//         </Box>
//       ) : (
//         <>
//           {/* Header */}
//           <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//             <ShoppingCartIcon sx={{ fontSize: "2rem", color: "#c026d3" }} />
//             <Typography
//               variant="h4"
//               sx={{
//                 fontWeight: 600,
//                 marginBottom: "1rem",
//                 color: "#c026d3",
//               }}
//             >
//               Cart
//             </Typography>
//           </Box>

//           <Grid container spacing={4}>
//             {/* Left: Cart Items */}
//             <Grid item xs={12} md={9}>
//               <TableContainer sx={{ width: "90%", mt: 3 }}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>Qty</TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>Subtotal</TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {/* Products */}
//                     {cartItems.map((item) => (
//                       <TableRow key={item.id}>
//                         <TableCell>
//                           <img
//                             src={item.imageUrl}
//                             alt="product"
//                             style={{ width: "70px", height: "70px" }}
//                           />
//                         </TableCell>
//                         <TableCell>{item.productName}</TableCell>
//                         <TableCell>₹{item.productPrice}</TableCell>
//                         <TableCell>
//                           <IconButton
//                             onClick={() =>
//                               handleQuantityDecrement(item.id, "product")
//                             }
//                           >
//                             <RemoveIcon />
//                           </IconButton>
//                           {item.quantity || 1}
//                           <IconButton
//                             onClick={() =>
//                               handleQuantityIncrement(item.id, "product")
//                             }
//                           >
//                             <AddIcon />
//                           </IconButton>
//                         </TableCell>
//                         <TableCell>
//                           ₹{(item.productPrice * item.quantity).toFixed(2)}
//                         </TableCell>
//                         <TableCell>
//                           <IconButton
//                             onClick={() => handleDeleteItem(item.id)}
//                             color="error"
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}

//                     {/* Technicians */}
//                     {technicianItem.map((item) => (
//                       <TableRow key={item.id}>
//                         <TableCell>
//                           <img
//                             src={TechnicianImg}
//                             alt="technician"
//                             style={{ width: "70px", height: "70px" }}
//                           />
//                         </TableCell>
//                         <TableCell>{item.service_name}</TableCell>
//                         <TableCell>₹{item.price}</TableCell>
//                         <TableCell>
//                           <IconButton
//                             onClick={() =>
//                               handleQuantityDecrement(item.id, "technicians")
//                             }
//                           >
//                             <RemoveIcon />
//                           </IconButton>
//                           {item.quantity || 1}
//                           <IconButton
//                             onClick={() =>
//                               handleQuantityIncrement(item.id, "technicians")
//                             }
//                           >
//                             <AddIcon />
//                           </IconButton>
//                         </TableCell>
//                         <TableCell>
//                           ₹{(item.price * item.quantity).toFixed(2)}
//                         </TableCell>
//                         <TableCell>
//                           <IconButton
//                             onClick={() => handleDeleteItem(item.id)}
//                             color="error"
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}

//                     {/* Services */}
//                     {servicesItem.map((item) => (
//                       <TableRow key={item.id}>
//                         <TableCell>
//                           <img
//                             src={item.imageUrl}
//                             alt="service"
//                             style={{ width: "70px", height: "70px" }}
//                           />
//                         </TableCell>
//                         <TableCell>{item.productName}</TableCell>
//                         <TableCell>₹{item.totalPrice}</TableCell>
//                         <TableCell>
//                           <IconButton
//                             onClick={() =>
//                               handleQuantityDecrement(item.id, "service")
//                             }
//                           >
//                             <RemoveIcon />
//                           </IconButton>
//                           {item.quantity || 1}
//                           <IconButton
//                             onClick={() =>
//                               handleQuantityIncrement(item.id, "service")
//                             }
//                           >
//                             <AddIcon />
//                           </IconButton>
//                         </TableCell>
//                         <TableCell>
//                           ₹{(item.totalPrice * item.quantity).toFixed(2)}
//                         </TableCell>
//                         <TableCell>
//                           <IconButton
//                             onClick={() => handleDeleteItem(item.id)}
//                             color="error"
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Grid>

//             {/* Right: Order Summary */}
//             <Grid item xs={12} md={3}>
//               <Typography variant="p" sx={{ fontWeight: 600 }}>
//                 Order Summary
//               </Typography>
//               <Divider sx={{ marginBottom: "1rem" }} />

//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography sx={{ fontSize: "0.9rem", fontWeight: "600" }}>
//                   Cart Value:
//                 </Typography>
//                 <Typography sx={{ fontSize: "0.9rem", fontWeight: "600" }}>
//                   ₹{totalPrice.toLocaleString()}
//                 </Typography>
//               </Box>

//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   paddingBottom: "1rem",
//                 }}
//               >
//                 <Typography sx={{ fontSize: "0.9rem" }}>Events Days</Typography>
//                 <Typography sx={{ fontSize: "0.9rem" }}>{days}</Typography>
//               </Box>

//               <Divider sx={{ marginBottom: "1rem" }} />

//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography sx={{ fontSize: "0.9rem", fontWeight: "600" }}>
//                   Base Amount:
//                 </Typography>
//                 <Typography sx={{ fontSize: "0.9rem", fontWeight: "600" }}>
//                   ₹{baseAmount.toLocaleString()}
//                 </Typography>
//               </Box>

//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography sx={{ fontSize: "0.9rem" }}>
//                   TDS Charges (2%):
//                 </Typography>
//                 <Typography sx={{ fontSize: "0.9rem" }}>
//                   -₹{tdsCharges.toLocaleString()}
//                 </Typography>
//               </Box>

//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography sx={{ fontSize: "0.9rem", fontWeight: "600" }}>
//                   Amount After TDS Deduction:
//                 </Typography>
//                 <Typography sx={{ fontSize: "0.9rem", fontWeight: "600" }}>
//                   ₹{amountAfterTds.toLocaleString()}
//                 </Typography>
//               </Box>

//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography sx={{ fontSize: "0.9rem" }}>Gst: (18%)</Typography>
//                 <Typography sx={{ fontSize: "0.9rem" }}>
//                   ₹{gst.toLocaleString()}
//                 </Typography>
//               </Box>

//               <Divider sx={{ margin: "1rem 0" }} />

//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   fontWeight: 600,
//                 }}
//               >
//                 <Typography sx={{ fontWeight: 500 }}>
//                   Grand Total:
//                   <div style={{ fontSize: "0.8rem" }}>
//                     (GST and TDS Deduction)
//                   </div>
//                 </Typography>
//                 <Typography>₹{grandTotal.toLocaleString()}</Typography>
//               </Box>
//             </Grid>
//           </Grid>

//           {/* Pass Billing Info to EventDetails */}
//           <EventDetails
//             cartItems={cartItems}
//             technicianItems={technicianItem}
//             servicesItems={servicesItem}
//             billingDetails={{
//               cartValue: totalPrice,
//               eventDays: days,
//               baseAmount,
//               tdsCharges,
//               amountAfterTds,
//               gst,
//               grandTotal,
//             }}
//             handleClearAll={handleClearAll}
//           />
//         </>
//       )}
//     </Box>
//   );
// };

// export default Cart;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Divider,
  Grid,
  IconButton,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Table,
  TableBody,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import authService from "../../api/ApiService";
import {
  addToCart,
  clearCart,
  quantityDecrement,
  quantityIncrement,
  removeFromCart,
} from "../../redux/slice/CartSlice";
import { getErrorMessage } from "../../utils/helperFunc";
import EventDetails from "./components/EventDetails";
import { setLoading } from "../../redux/slice/LoaderSlice";
import BreadCrumb from "../../components/BreadCrumb";
import {
  clearTechnicians,
  decrementTechnicianQuantity,
  incrementTechnicianQuantity,
  removeTechnician,
} from "../../redux/slice/technicianSlice";
import {
  clearServices,
  decrementServiceQuantity,
  incrementServiceQuantity,
  removeService,
} from "../../redux/slice/serviceSlice";
import TechnicianImg from "../../assets/profileImg1.jpg";
import "./styles.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { config } from "../../api/config";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cart);
  const servicesItem = useSelector((state) => state.services.services);
  const technicianItem = useSelector((state) => state.technicians.technicians);
  const dispatch = useDispatch();
  const { startDate, endDate, numberOfDays } = useSelector(
    (state) => state.date
  );

  const [wishlist, setWishlist] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [companyType, setCompanyType] = useState(""); // ✅ NEW state for company type

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

  // ✅ Fetch Company Type
  const getUserProfile = async () => {
    if (!userId) return;
    try {
      const res = await authService.getUserProfile(userId);
      const companyProfile = res.data.company_profile?.[0] || {};
      setCompanyType(companyProfile.company_type || "");
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

   const breadcrumbPaths = [
    { label: "Home", link: "/" },
    { label: "Products", link: "/products" },
    { label: "Cart", link: "cart" },
  ];
  // ✅ Fetch Technicians
  const getTechnicians = async () => {
    dispatch(setLoading(true));
    try {
      const res = await authService.getAllTechnicians();
      setTechnicians(res.data.tech);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      getErrorMessage(error);
    }
  };

  // ✅ Fetch Wishlist
  const getWishlist = async () => {
    try {
      const res = await axios.get(
        `${config.BASEURL}/wishlist/get-my-wishlist/${userId}`
      );
      if (res.data?.wishlist) {
        const wishlistItems = res.data.wishlist.map((item) => item.product_id);
        setWishlist(wishlistItems);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const handleQuantityDecrement = (itemId, type) => {
    if (type === "product") dispatch(quantityDecrement(itemId));
    else if (type === "technicians")
      dispatch(decrementTechnicianQuantity(itemId));
    else if (type === "service") dispatch(decrementServiceQuantity(itemId));
  };

  const handleQuantityIncrement = (itemId, type) => {
    if (type === "product") dispatch(quantityIncrement(itemId));
    else if (type === "technicians")
      dispatch(incrementTechnicianQuantity(itemId));
    else if (type === "service") dispatch(incrementServiceQuantity(itemId));
  };

  const handleDeleteItem = (itemId) => {
    if (cartItems.some((item) => item.id === itemId))
      dispatch(removeFromCart(itemId));
    else if (technicianItem.some((tech) => tech.id === itemId))
      dispatch(removeTechnician(itemId));
    else if (servicesItem.some((service) => service.id === itemId))
      dispatch(removeService(itemId));
  };

  const handleClearAll = () => {
    dispatch(clearCart());
    dispatch(clearTechnicians());
    dispatch(clearServices());
  };

  // ✅ Total Calculation Logic
  const calculateItemTotal = (item) => {
    if (item.totalPrice) return item.totalPrice * (item.quantity || 1);
    if (item.productPrice) return item.productPrice * (item.quantity || 1);
    if (item.price) return item.price * (item.quantity || 1);
    return 0;
  };

  const productTotal = cartItems.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );
  const serviceTotal = servicesItem.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );
  const technicianTotal = technicianItem.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );

  const totalPrice = productTotal + serviceTotal + technicianTotal;
  const days = numberOfDays && numberOfDays > 0 ? numberOfDays : 1;
  const baseAmount = totalPrice * days;

  // ✅ Conditional TDS (only apply if not “Self / Others”)
  const isSelfOrOthers = companyType?.toLowerCase()?.includes("self");
  const tdsCharges = isSelfOrOthers ? 0 : baseAmount * 0.02;
  const amountAfterTds = baseAmount - tdsCharges;
  const gst = amountAfterTds * 0.18;
  // Split GST into CGST (9%) + SGST (9%) to match the mobile app's breakdown.
  const cgst = amountAfterTds * 0.09;
  const sgst = amountAfterTds * 0.09;
  const grandTotal = amountAfterTds + gst;

  useEffect(() => {
    getTechnicians();
    getWishlist();
    getUserProfile();
  }, []);

  return (
    <Box sx={{ padding: "2rem" }}>
      <ToastContainer />
      <BreadCrumb paths={breadcrumbPaths} />

      {cartItems.length + servicesItem.length + technicianItem.length === 0 ? (
        <Box sx={{ textAlign: "center", marginTop: "3rem" }}>
          <ShoppingCartIcon sx={{ fontSize: "8rem", color: "#c026d3" }} />
          <Typography sx={{ marginTop: "1rem" }}>
            Your cart is empty.
          </Typography>
          <Button
            variant="contained"
            href="/products"
            sx={{
              marginTop: "1rem",
              backgroundColor: "#c026d3",
              "&:hover": { backgroundColor: "#a21caf" },
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <ShoppingCartIcon sx={{ fontSize: "2rem", color: "#c026d3" }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: "#c026d3" }}>
              Cart
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={9}>
              <TableContainer sx={{ width: "90%", mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Qty</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Subtotal
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...cartItems, ...technicianItem, ...servicesItem].map(
                      (item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <img
                              src={item?.imageUrl?.[0] || TechnicianImg}
                              alt="product"
                              style={{ width: "70px", height: "70px" }}
                            />
                          </TableCell>
                          <TableCell>
                            {item.productName || item.service_name}
                          </TableCell>
                          <TableCell>
                            ₹
                            {item.productPrice || item.totalPrice || item.price}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() =>
                                handleQuantityDecrement(item.id, "product")
                              }
                            >
                              <RemoveIcon />
                            </IconButton>
                            {item.quantity || 1}
                            <IconButton
                              onClick={() =>
                                handleQuantityIncrement(item.id, "product")
                              }
                            >
                              <AddIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            ₹{calculateItemTotal(item).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleDeleteItem(item.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* ✅ Order Summary Section */}
            <Grid item xs={12} md={3}>
              <Typography variant="p" sx={{ fontWeight: 600 }}>
                Order Summary
              </Typography>
              <Divider sx={{ marginBottom: "1rem" }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Cart Value:</Typography>
                <Typography>₹{totalPrice.toLocaleString()}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Event Days:</Typography>
                <Typography>{days}</Typography>
              </Box>

              <Divider sx={{ marginBottom: "1rem" }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Base Amount:</Typography>
                <Typography>₹{baseAmount.toLocaleString()}</Typography>
              </Box>

              {/* ✅ Hide TDS if Self/Others */}
              {!isSelfOrOthers && (
                <>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>TDS Charges (2%):</Typography>
                    <Typography>-₹{tdsCharges.toLocaleString()}</Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Amount After TDS Deduction:</Typography>
                    <Typography>₹{amountAfterTds.toLocaleString()}</Typography>
                  </Box>
                </>
              )}

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>CGST (9%):</Typography>
                <Typography>₹{cgst.toLocaleString()}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>SGST (9%):</Typography>
                <Typography>₹{sgst.toLocaleString()}</Typography>
              </Box>

              <Divider sx={{ margin: "1rem 0" }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>
                  Grand Total:
                  <div style={{ fontSize: "0.8rem" }}>
                    (GST {isSelfOrOthers ? "" : "and TDS Deduction"})
                  </div>
                </Typography>
                <Typography>₹{grandTotal.toLocaleString()}</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Pass billing info to EventDetails */}
          <EventDetails
            cartItems={cartItems}
            technicianItems={technicianItem}
            servicesItems={servicesItem}
            billingDetails={{
              cartValue: totalPrice,
              eventDays: days,
              baseAmount,
              tdsCharges,
              amountAfterTds,
              gst,
              cgst,
              sgst,
              grandTotal,
            }}
            handleClearAll={handleClearAll}
          />
        </>
      )}
    </Box>
  );
};

export default Cart;
