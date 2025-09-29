import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Divider,
  Grid,
  Paper,
  IconButton,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Table,
  TableBody,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
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
import Check from "../../assets/check.png";
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
  console.log(technicianItem, "technicianItem");
  console.log(servicesItem, "servicesItem");
  console.log(cartItems, "cartItems");

  const allItems = [...cartItems, ...servicesItem, ...technicianItem];
  const [wishlist, setWishlist] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const dispatch = useDispatch();
  const { startDate, endDate, numberOfDays } = useSelector(
    (state) => state.date
  );
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

  const breadcrumbPaths = [
    { label: "Home", link: "/" },
    { label: "Products", link: "/products" },
    { label: "Cart", link: "cart" },
  ];

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

  const getWishlist = async () => {
    try {
      const res = await axios.get(
        `${config.BASEURL}/wishlist/get-my-wishlist/${userId}`,
        { headers: { "Content-Type": "application/json" } }
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

  const handleWishlistClick = async (item) => {
    try {
      await axios.post(
        "https://api.nithyaevent.com/api/wishlist/add-wishlist",
        {
          product_name: item.productName,
          product_id: item.id,
          product_image: item.imageUrl[0],
          product_price: item.productPrice,
          mrp_price: item.mrpPrice,
          discount: item.discount,
          user_id: userId,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setWishlist((prev) => [...prev, item.id]);

      toast.success("Item added to wishlist!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        dispatch(removeFromCart(item.id));
      }, 1000);
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response && error.response.data?.message) {
        errorMessage = error.response.data.message.includes(
          "Product already exists"
        )
          ? "This product is already in your wishlist!"
          : `Error: ${error.response.data.message}`;

        toast.error(errorMessage, {
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

      toast.error("Failed to add item to cart. Try again!", {
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

const calculateItemTotal = (item) => {
  if (item.totalPrice) return item.totalPrice * (item.quantity || 1);
  if (item.productPrice) return item.productPrice * (item.quantity || 1);
  if (item.price) return item.price * (item.quantity || 1);
  return 0;
};

const productTotal = cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
const serviceTotal = servicesItem.reduce((total, item) => total + calculateItemTotal(item), 0);
const technicianTotal = technicianItem.reduce((total, item) => total + calculateItemTotal(item), 0);

const totalPrice = productTotal + serviceTotal + technicianTotal;

  const baseAmount = totalPrice * numberOfDays;
  const tdsCharges = baseAmount * 0.02;
  const cgst = baseAmount * 0.09;
  const sgst = baseAmount * 0.09;
  const amountAfterTds = baseAmount - tdsCharges;
  const totalGst = amountAfterTds * 0.18;

  const grandTotal = amountAfterTds + totalGst;

  const handleQuantityDecrement = (itemId, type) => {
    if (type === "product") {
      dispatch(quantityDecrement(itemId));
    } else if (type === "technicians") {
      dispatch(decrementTechnicianQuantity(itemId));
    } else if (type === "service") {
      dispatch(decrementServiceQuantity(itemId));
    }
  };

  const handleQuantityIncrement = (itemId, type) => {
    if (type === "product") {
      dispatch(quantityIncrement(itemId));
    } else if (type === "technicians") {
      dispatch(incrementTechnicianQuantity(itemId));
    } else if (type === "service") {
      dispatch(incrementServiceQuantity(itemId));
    }
  };

  const handleDeleteItem = (itemId) => {
    if (cartItems.some((item) => item.id === itemId)) {
      dispatch(removeFromCart(itemId));
    } else if (technicianItem.some((tech) => tech.id === itemId)) {
      dispatch(removeTechnician(itemId));
    } else if (servicesItem.some((service) => service.id === itemId)) {
      dispatch(removeService(itemId));
    }
  };

  const handleClearAll = () => {
    dispatch(clearCart());
    dispatch(clearTechnicians());
    dispatch(clearServices());
  };

  useEffect(() => {
    getTechnicians();
    getWishlist();
  }, []);

  return (
    <Box sx={{ padding: "2rem" }}>
      <ToastContainer />
        <BreadCrumb paths={breadcrumbPaths} />
      {allItems.length === 0 ? (
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
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                marginBottom: "1rem",
                color: "#c026d3",
              }}
            >
              Cart
            </Typography>
          </Box>
        
          <Grid container spacing={4}>
            <Grid item xs={12} md={9}>
              <TableContainer sx={{ width: "90%", mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Product Image
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Product Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Qty</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Subtotal</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.length > 0 && (
                      <>
                        {cartItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Box
                                sx={{ display: "flex", justifyContent: "center" }}
                              >
                                <img
                                  src={item.imageUrl}
                                  style={{
                                    width: "70px",
                                    padding: "0.5rem 0.5rem",
                                    textAlign: "center",
                                    marginRight: "30px",
                                  }}
                                  alt="Not found"
                                />
                              </Box>
                            </TableCell>
                            <TableCell>{item.productName.slice(0, 20)}</TableCell>
                            <TableCell>
                              ₹{item.productPrice?.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() =>
                                  handleQuantityDecrement(item.id, "product")
                                }
                              >
                                <RemoveIcon />
                              </IconButton>
                              <span style={{ fontSize: "0.9rem" }}>
                                {item.quantity || 1}
                              </span>
                              <IconButton
                                onClick={() =>
                                  handleQuantityIncrement(item.id, "product")
                                }
                              >
                                <AddIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              ₹{(item.productPrice * item.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", gap: "0.3rem" }}>
                                <IconButton
                                  onClick={() => handleDeleteItem(item.id)}
                                  color="error"
                                  sx={{ cursor: "pointer" }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                                <Button
                                  onClick={(e) => {
                                    handleWishlistClick(item);
                                  }}
                                  sx={{ color: "#c026d3", position: "relative" }}
                                >
                                  {wishlist.includes(item.id) ? (
                                    <FavoriteOutlinedIcon
                                      style={{ position: "absolute" }}
                                    />
                                  ) : (
                                    <FavoriteBorderIcon
                                      style={{ position: "absolute" }}
                                    />
                                  )}
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                    {technicianItem.length > 0 && (
                      <>
                        {technicianItem.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "0.3rem",
                                  alignItems: "center",
                                }}
                              >
                                <img
                                  src={TechnicianImg}
                                  style={{
                                    width: "70px",
                                    padding: "0.5rem 0.5rem",
                                    height: "70px",
                                    textAlign: "center",
                                    marginRight: "30px",
                                  }}
                                  alt="Not found"
                                />
                              </Box>
                            </TableCell>
                            <TableCell>{item.service_name}</TableCell>
                            <TableCell>₹{item.price?.toFixed(2)}</TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() =>
                                  handleQuantityDecrement(item.id, "technicians")
                                }
                              >
                                <RemoveIcon />
                              </IconButton>
                              {item.quantity || 1}
                              <IconButton
                                onClick={() =>
                                  handleQuantityIncrement(item.id, "technicians")
                                }
                              >
                                <AddIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "0.3rem",
                                  alignItems: "center",
                                }}
                              >
                                <IconButton
                                  onClick={() => handleDeleteItem(item.id)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                    {servicesItem.length > 0 && (
                      <>
                        {servicesItem.map((item) => (
                          <TableRow key={item?.orderId}>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "0.3rem",
                                  alignItems: "center",
                                }}
                              >
                                <img
                                  src={item.imageUrl}
                                  style={{
                                    width: "70px",
                                    padding: "0.5rem 0.5rem",
                                    textAlign: "center",
                                    marginRight: "30px",
                                  }}
                                  alt="Not found"
                                />
                              </Box>
                            </TableCell>
                         <TableCell>
  <Typography fontWeight="bold">{item?.productName}</Typography>

  {item?.addOns?.length > 0 && (
    <Box sx={{ marginTop: "0.5rem" }}>
    
      {item.addOns.map((addon, index) => (
        <Typography key={index} sx={{ fontSize: "0.85rem", color: "#444" }}>
          {addon.name} 
        </Typography>
      ))}
    </Box>
  )}
</TableCell>

                            <TableCell>
                              ₹{item?.productPrice?.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() =>
                                  handleQuantityDecrement(item.id, "service")
                                }
                              >
                                <RemoveIcon />
                              </IconButton>
                              {item.quantity || 1}
                              <IconButton
                                onClick={() =>
                                  handleQuantityIncrement(item.id, "service")
                                }
                              >
                                <AddIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell>
  ₹{(item.totalPrice || item.productPrice || 0) * (item.quantity || 1)}
</TableCell>

                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "0.3rem",
                                  alignItems: "center",
                                }}
                              >
                                <IconButton
                                  onClick={() =>
                                    handleDeleteItem(item.id, "service")
                                  }
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
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
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography
                variant="p"
                sx={{ fontWeight: 600, marginBottom: "1rem" }}
              >
                Order Summary
              </Typography>
              <Divider sx={{ marginBottom: "1rem" }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="p"
                  sx={{ color: "#626262", fontSize: "0.9rem", fontWeight: "600" }}
                >
                  Cart Value:
                </Typography>
                <Typography
  sx={{ color: "#626262", fontSize: "0.9rem", fontWeight: "600" }}
>
  ₹{totalPrice.toLocaleString()}
</Typography>

              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "1rem",
                }}
              >
                <Typography
                  variant="p"
                  sx={{ color: "#626262", fontSize: "0.9rem" }}
                >
                  Events Days
                </Typography>
                <Typography sx={{ fontSize: "0.9rem" }}>{numberOfDays}</Typography>
              </Box>
              <Divider sx={{ marginBottom: "1rem" }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="p"
                  sx={{ color: "#626262", fontSize: "0.9rem", fontWeight: "600" }}
                >
                  Base Amount:
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: "600" }}>
                  ₹{baseAmount.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="p"
                  sx={{ color: "#626262", fontSize: "0.9rem" }}
                >
                  TDS Charges (2%):
                </Typography>
                <Typography sx={{ fontSize: "0.9rem" }}>
                  -₹{tdsCharges.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="p"
                  sx={{ color: "#626262", fontSize: "0.9rem", fontWeight: "600" }}
                >
                  Amount After TDS Deduction:
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: "600" }}>
                  ₹{baseAmount - tdsCharges}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="p"
                  sx={{ color: "#626262", fontSize: "0.9rem" }}
                >
                  Gst: (18%)
                </Typography>
                <Typography sx={{ fontSize: "0.9rem" }}>
                  ₹{Math.floor(totalGst)}
                </Typography>
              </Box>
              <Divider sx={{ margin: "1rem 0" }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 600,
                }}
              >
                <Typography variant="p" sx={{ fontWeight: 500 }}>
                  Grand Total:
                  <div style={{ fontSize: "0.8rem" }}>(GST and TDS Deduction)</div>
                </Typography>
                <Typography>₹{Math.floor(grandTotal)}</Typography>
              </Box>
            </Grid>
          </Grid>
          {/* <Box sx={{ maxWidth: "350px", margin: "2rem 2rem" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Apply Coupon Code
              </Typography>
            </Box>
            <Divider sx={{ borderColor: "#d3d3d3", margin: "0.5rem 0 1rem 0" }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.5rem",
                backgroundColor: "#f0c8f5",
                borderRadius: "5px",
              }}
            >
              <TextField
                placeholder="Apply Coupon Code"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "5px",
                }}
              />
              <Button
                variant="text"
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Check
              </Button>
            </Box>
          </Box> */}
          <EventDetails
            cartItems={cartItems}
            technicianItems={technicianItem}
            servicesItems={servicesItem}
            billingDetails={{
              cartValue: totalPrice,
              eventDays: numberOfDays,
              totalPrice: totalPrice,
              baseAmount: baseAmount,
              tdsCharges: tdsCharges,
              amountAfterTds: baseAmount - tdsCharges,
              cgst: cgst,
              sgst: sgst,
              totalGst: totalGst,
              grandTotal: grandTotal,
            }}
            handleClearAll={handleClearAll}
          />
        </>
      )}
    </Box>
  );
};

export default Cart;