import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useSelector } from "react-redux";

const OrderSummary = ({
  cartItems,
  technicianItems,
  servicesItem,
  billingDetails,
  eventDetails,
  handleConfirmOrder,
}) => {
  const { numberOfDays } = useSelector((state) => state.date);

  // const baseAmount = billingDetails.baseAmount * 3;
  const containerStyle = {
    width: "100%",
    height: "200px",
  };

  const center = {
    lat: 12.2958,
    lng: 76.6394,
  };

  console.log(technicianItems);

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        p: 3,
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
        overflowY: "auto",
        height: "570px",
        marginTop: "5rem",
      }}
    >
      <Typography
        variant="h6"
        sx={{ textAlign: "center", color: "#6c63ff", fontWeight: "bold" }}
      >
        Order Summary
      </Typography>
      <Divider sx={{ my: 2 }} />

      {cartItems?.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight="bold">
            🛍️ Products
          </Typography>
          {cartItems?.map((item, index) => (
            <Grid container key={index} sx={{ mb: 1 }}>
              <Grid item xs={8}>
                <Typography>
                  {item.productName}{" "}
                  <span style={{ fontWeight: "bold" }}>X{item.quantity}</span>
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                <Typography>₹{item.productPrice.toLocaleString()}</Typography>
              </Grid>
            </Grid>
          ))}
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* 👨‍🔧 Technicians */}
      {technicianItems?.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight="bold">
            🛠️ Technicians
          </Typography>
          {technicianItems?.map((item, index) => (
            <Grid container key={index} sx={{ mb: 1 }}>
              <Grid item xs={8}>
                <Typography>
                  {item.service_name}{" "}
                  <span style={{ fontWeight: "bold" }}>X{item.quantity}</span>
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                <Typography>₹{item.price.toLocaleString()}</Typography>
              </Grid>
            </Grid>
          ))}
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* 💼 Services */}
      {servicesItem?.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight="bold">
            🎯 Services
          </Typography>
          {servicesItem.map((item, index) => (
            <Grid container key={index} sx={{ mb: 1 }}>
              <Grid item xs={8}>
                <Typography>
                  {item.shopName}{" "}
                  <span style={{ fontWeight: "bold" }}>X{item.quantity}</span>
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                <Typography>₹{item.totalPrice.toLocaleString()}</Typography>
              </Grid>
            </Grid>
          ))}
          <Divider sx={{ my: 2 }} />
        </>
      )}

      <Grid container>
        <Grid item xs={6}>
          <Typography>Total</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography>
            ₹{billingDetails?.cartValue?.toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Event Days</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography>{numberOfDays} Days</Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />

      <Grid container>
        <Grid item xs={6}>
          <Typography>Base Amount</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography>
            ₹{billingDetails.baseAmount?.toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>TDS Charges (2%)</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography>
            -₹{billingDetails?.tdsCharges?.toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Amount After TDS Deduction</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography>
            ₹{billingDetails?.amountAfterTds?.toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>CGST (9%)</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography>₹{billingDetails?.cgst?.toLocaleString()}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>SGST (9%)</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography>₹{billingDetails?.sgst?.toLocaleString()}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Total GST (CGST + SGST)</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography>₹{billingDetails?.totalGst?.toLocaleString()}</Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" fontWeight="bold" sx={{ textAlign: "right" }}>
        Grand Total: ₹{billingDetails?.grandTotal?.toLocaleString()}
      </Typography>
      <Divider sx={{ my: 2 }} />

      {/* 📍 Event Details with Map */}
      <Typography
        variant="h6"
        sx={{ color: "#6c63ff", fontWeight: "bold", mt: 2 }}
      >
        Event Details
      </Typography>
      <LoadScript googleMapsApiKey="AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1">
          <strong>{eventDetails?.eventName}</strong>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          📍 {eventDetails?.eventVenue}, {eventDetails?.eventLocation}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          📅 {eventDetails?.startDate} to {eventDetails?.endDate} at ⏰{" "}
          {eventDetails?.startTime} to {eventDetails?.endTime}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          👤 {eventDetails?.contactName} 📞 {eventDetails?.contactNumber}
        </Typography>
      </Box>

      {/* 💬 Message Box */}
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Enter your message to vendor's (Optional)"
        variant="outlined"
        sx={{ mt: 2 }}
      />

      {/* 🚀 Action Buttons */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            background: "linear-gradient(to right, #6c63ff, #957dff)",
            mb: 2,
          }}
          onClick={handleConfirmOrder}
        >
          Proceed to Pay ₹{billingDetails.grandTotal.toLocaleString()}
        </Button>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Safe, easy, and secure Payments
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderSummary;
