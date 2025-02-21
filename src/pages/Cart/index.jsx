// React Related Imports
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Third party library
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

// Custom Components
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
import { clearServices, removeService } from "../../redux/slice/serviceSlice";

// Assests
import Check from "../../assets/check.png";

// Styles
import "./styles.scss";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cart);
  const servicesItem = useSelector((state) => state.services.services);
  const technicianItem = useSelector((state) => state.technicians.technicians);
  const allItems = [...cartItems, ...servicesItem, ...technicianItem];
  const [technicians, setTechnicians] = useState([]);
  const dispatch = useDispatch();
  const { startDate, endDate, numberOfDays } = useSelector(
    (state) => state.date
  );
  const userDetails = useSelector((state) => state.auth.userDetails);

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

  const productTotal = cartItems.reduce(
    (total, item) => total + (item.productPrice || 0) * (item.quantity || 1),
    0
  );

  const serviceTotal = servicesItem.reduce(
    (total, item) => total + (item.pricing || 0) * (item.quantity || 1),
    0
  );

  const technicianTotal = technicianItem.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  const totalPrice = productTotal + serviceTotal + technicianTotal;

  const baseAmount = totalPrice * numberOfDays;
  const tdsCharges = baseAmount * 0.02;
  const cgst = baseAmount * 0.09;
  const sgst = baseAmount * 0.09;
  const totalGst = cgst + sgst;
  const amountAfterTds = baseAmount - tdsCharges;
  const grandTotal = amountAfterTds + totalGst;

  const handleQuantityDecrement = (itemId, type) => {
    if (type === "product") {
      dispatch(quantityDecrement(itemId));
    } else if (type === "technicians") {
      dispatch(decrementTechnicianQuantity(itemId));
    }
    // else if (servicesItem.some((service) => service._id === itemId)) {
    //   dispatch(decrementService(itemId));
    // }
  };

  const handleQuantityIncrement = (itemId, type) => {
    if (type === "product") {
      dispatch(quantityIncrement(itemId));
    } else if (type === "technicians") {
      dispatch(incrementTechnicianQuantity(itemId));
    }
  };

  const handleDeleteItem = (itemId) => {
    if (cartItems.some((cartItems) => cartItems._id === itemId)) {
      dispatch(removeFromCart(itemId));
    } else if (technicianItem.some((tech) => tech._id === itemId)) {
      dispatch(removeTechnician(itemId));
    } else if (servicesItem.some((service) => service._id === itemId)) {
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
  }, []);
  console.log("The cart item", servicesItem);

  return (
    <Box sx={{ padding: "2rem" }}>
      <BreadCrumb paths={breadcrumbPaths} />

      <Typography
        variant="h4"
        sx={{ fontWeight: 600, marginBottom: "1rem", color: "#1a365d" }}
      >
        Cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Product Section */}
        <Grid item xs={12} md={8}>
          {/* <Paper elevation={3} sx={{ padding: "1.5rem" }}> */}
          {allItems.length > 0 ? (
            <TableContainer sx={{ width: "90%", mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Item Name</TableCell>
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
                        <TableRow key={item._id}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>
                            ₹{item.productPrice?.toFixed(2)} / day
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() =>
                                handleQuantityDecrement(item._id, "product")
                              }
                            >
                              <RemoveIcon />
                            </IconButton>
                            {item.quantity || 1}
                            <IconButton
                              onClick={() =>
                                handleQuantityIncrement(item._id, "product")
                              }
                            >
                              <AddIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            ₹{(item.productPrice * item.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleDeleteItem(item._id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}

                  {technicianItem.length > 0 && (
                    <>
                      {technicianItem.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.service_name}</TableCell>
                          <TableCell>₹{item.price?.toFixed(2)}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() =>
                                handleQuantityDecrement(item._id, "technicians")
                              }
                            >
                              <RemoveIcon />
                            </IconButton>
                            {item.quantity || 1}
                            <IconButton
                              onClick={() =>
                                handleQuantityIncrement(item._id, "technicians")
                              }
                            >
                              <AddIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleDeleteItem(item._id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}

                  {servicesItem.length > 0 && (
                    <>
                      {servicesItem.map((item) => (
                        <TableRow key={item.orderId}>
                          <TableCell>{item.shopName}</TableCell>
                          <TableCell>₹{item.pricing?.toFixed(2)}</TableCell>
                          <TableCell>
                            <IconButton disabled={true}>
                              <RemoveIcon />
                            </IconButton>
                            {item.quantity || 1}
                            <IconButton disabled={true}>
                              <AddIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>₹{item.totalPrice?.toFixed(2)}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() =>
                                handleDeleteItem(item.orderId, "service")
                              }
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography textAlign="center" sx={{ marginTop: "3rem" }}>
              Your cart is empty.
            </Typography>
          )}
          {/* </Paper> */}
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, marginBottom: "1rem" }}
          >
            Order Summary
          </Typography>
          <Divider sx={{ marginBottom: "1rem" }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="p" sx={{ color: "#626262" }}>
              Cart Value:
            </Typography>
            <Typography>₹{totalPrice.toLocaleString()}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: "1rem",
            }}
          >
            <Typography variant="p" sx={{ color: "#626262" }}>
              Events Days
            </Typography>
            <Typography>{numberOfDays}</Typography>
          </Box>

          <Divider sx={{ marginBottom: "1rem" }} />

          {/* Base Amount */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="p" sx={{ color: "#626262" }}>
              Base Amount:
            </Typography>
            <Typography>₹{baseAmount.toLocaleString()}</Typography>
          </Box>

          {/* TDS Charges */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="p" sx={{ color: "#626262" }}>
              TDS Charges (2%):
            </Typography>
            <Typography>-₹{tdsCharges.toLocaleString()}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="p" sx={{ color: "#626262" }}>
              Amount After TDS Deduction:
            </Typography>
            <Typography>₹{baseAmount - tdsCharges}</Typography>
          </Box>

          {/* CGST (9%) */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="p" sx={{ color: "#626262" }}>
              CGST (9%):
            </Typography>
            <Typography>₹{cgst.toLocaleString()}</Typography>
          </Box>

          {/* SGST (9%) */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="p" sx={{ color: "#626262" }}>
              SGST (9%):
            </Typography>
            <Typography>₹{sgst.toLocaleString()}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="p" sx={{ color: "#626262" }}>
              Total Gst: (CGST + SGST)
            </Typography>
            <Typography>₹{totalGst.toLocaleString()}</Typography>
          </Box>

          <Divider sx={{ margin: "1rem 0" }} />

          {/* Grand Total */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 600,
            }}
          >
            <Typography variant="p" sx={{ fontWeight: 500 }}>
              Grand Total:
            </Typography>
            <Typography>₹{grandTotal.toLocaleString()}</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Event Details */}
      <EventDetails
        cartItems={cartItems}
        technicianItems={technicianItem}
        servicesItem={servicesItem}
        billingDetails={{
          cartValue: totalPrice,
          eventDays: numberOfDays,
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
    </Box>
  );
};

export default Cart;
