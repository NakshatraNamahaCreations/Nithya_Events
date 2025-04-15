import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Paper,
  Input,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Star } from "@mui/icons-material";
import axios from "axios";
import authService from "../../api/ApiService";

const reasonList = [
  { id: 1, reason: "Performance or quality not adequate" },
  { id: 2, reason: "Product damaged, but shipping box OK" },
  { id: 3, reason: "Missing parts or accessories" },
  { id: 4, reason: "Both product and shipping box damaged" },
  { id: 5, reason: "Wrong item was sent" },
  { id: 6, reason: "Item defective or doesn't work" },
];

const RaiseTicket = () => {
  const { bookingId } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);
  const [comment, setComment] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingProducts = async () => {
      try {
        const res = await authService.getOrder(bookingId);
        setProducts(res.data.orderId.product_data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setLoading(false);
      }
    };
    fetchBookingProducts();
  }, [bookingId]);

  let userDetail = sessionStorage.getItem("userDetails");
  let userId = null,
    userName = "",
    userEmail = "";
  if (userDetail) {
    try {
      const userDetails = JSON.parse(userDetail);
      userId = userDetails?._id || null;
      userName = userDetails?.username || "";
      userEmail = userDetails?.email || "";
    } catch (error) {
      console.error("Error parsing userDetails from sessionStorage:", error);
    }
  }

  const handleSubmit = async () => {
    if (!selectedProduct || !selectedReason) {
      alert("Please select a product and a reason.");
      return;
    }

    const formData = new FormData();
    formData.append("ticket_reason", selectedReason.reason);
    formData.append("ticket_command", comment);
    formData.append("user_id", userId);
    formData.append("user_name", userName);
    formData.append("user_email", userEmail);
    formData.append("product_id", selectedProduct.id);
    formData.append("product_name", selectedProduct.productName);
    formData.append("vendor_id", selectedProduct.vendor_id || "N/A");
    formData.append("vendor_name", selectedProduct.vendor_name || "N/A");
    if (attachment) {
      formData.append("attachment_file", attachment);
    }

    try {
      const res = await axios.post(
        "https://api.nithyaevent.com/api/ticket/create-ticket",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Ticket submitted successfully!");

      navigate("/my-tickets");
    } catch (error) {
      console.error("Error submitting ticket", error);
      alert("Failed to raise a ticket. Please try again.");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: 500, p: 3, mx: "auto", mt: 8, mb: 10 }}
    >
      <Typography variant="h5" gutterBottom>
        Raise a Ticket
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <CircularProgress />
          <Typography variant="body2">Loading booking products...</Typography>
        </Box>
      ) : (
        <>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Select a Product</FormLabel>
            <RadioGroup
              value={selectedProduct?.id || ""}
              onChange={(e) => {
                const product = products.find(
                  (item) => item.id === e.target.value
                );
                setSelectedProduct(product);
              }}
            >
              {products.map((product) => (
                <FormControlLabel
                  key={product.id}
                  value={product.id}
                  control={<Radio />}
                  label={product.productName}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {selectedProduct && (
            <>
              <Divider sx={{ my: 2 }} />
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Select a Reason</FormLabel>
                <RadioGroup
                  value={selectedReason?.id || ""}
                  onChange={(e) => {
                    const selected = reasonList.find(
                      (item) => item.id === parseInt(e.target.value)
                    );
                    setSelectedReason(selected);
                  }}
                >
                  {reasonList.map((item) => (
                    <Box key={item.id}>
                      <FormControlLabel
                        value={item.id}
                        control={<Radio />}
                        label={item.reason}
                      />
                      {selectedReason?.id === item.id && (
                        <Box sx={{ ml: 4, mt: 2, mb: 2 }}>
                          <TextField
                            label="Additional Comment (optional)"
                            multiline
                            rows={3}
                            fullWidth
                            variant="outlined"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body1">
                              Attachment:{" "}
                              <Star sx={{ color: "red", fontSize: "0.7rem" }} />
                            </Typography>
                            <Input
                              type="file"
                              fullWidth
                              onChange={(e) => setAttachment(e.target.files[0])}
                            />
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ))}
                </RadioGroup>
              </FormControl>
            </>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, background: "c026d3" }}
            onClick={handleSubmit}
            disabled={!selectedProduct || !selectedReason || !attachment}
          >
            Submit Ticket
          </Button>
        </>
      )}
    </Paper>
  );
};

export default RaiseTicket;
