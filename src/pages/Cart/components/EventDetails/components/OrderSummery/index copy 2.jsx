import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Calendar from "../../../../../Calender";

const OrderSummary = ({
  cartItems,
  technicianItems,
  servicesItem,
  billingDetails,
  startDate,
  endDate,
  eventName,
  venueName,
  startTime,
  endTime,
  receiverName,
  receiverMobile,
  location,
  uploadedFiles,
  handleConfirmOrder,
}) => {
  const { numberOfDays } = useSelector((state) => state.date);
  const [openModal, setOpenModal] = useState(false);
  const [isCalenderOpen, setIsCalenderOpen] = useState(false);

  // ✅ New states for address selection
  const [selectedAddress, setSelectedAddress] = useState(location || "");
  const [selectedPosition, setSelectedPosition] = useState(null);

  const containerStyle = {
    width: "100%",
    height: "200px",
  };

  // Default fallback if no location found
  const defaultCenter = {
    lat: 12.9716,
    lng: 77.5946,
  };

  const [center, setCenter] = useState(defaultCenter);

  useEffect(() => {
    if (
      location &&
      typeof location === "object" &&
      location.lat &&
      location.lng
    ) {
      setCenter({ lat: location.lat, lng: location.lng });
      setSelectedPosition({ lat: location.lat, lng: location.lng });
    } else if (typeof location === "string") {
      // If location is a string (address)
      setSelectedAddress(location);
    }
  }, [location]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleModify = () => {
    setIsCalenderOpen(true);
    handleCloseModal();
  };

  const handleCalendarClose = () => {
    setIsCalenderOpen(false);
  };

  // ✅ Handle map click to select location
  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedPosition({ lat, lng });

    // Reverse geocode for address
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g`
      );
      const data = await res.json();
      if (data.status === "OK" && data.results.length > 0) {
        setSelectedAddress(data.results[0].formatted_address);
      } else {
        setSelectedAddress("Unknown location");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const handleConfirm = () => {
    // ✅ Pass the selected location back to parent for saving
    const finalLocation = selectedPosition
      ? { ...selectedPosition, address: selectedAddress }
      : { address: selectedAddress };
    handleConfirmOrder(finalLocation);
    handleCloseModal();
  };

  const renderFilePreview = (file, previewUrl, label) => {
    if (!file) return null;
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";

    return (
      <Box sx={{ display: "flex" }}>
        <Box sx={{ margin: "1rem 0" }}>
          <Typography variant="subtitle1">{label}</Typography>
          {isImage && (
            <img
              src={previewUrl}
              alt={label}
              style={{ maxWidth: "60%", maxHeight: "200px" }}
            />
          )}
          {isPDF && (
            <iframe
              src={previewUrl}
              title={label}
              style={{ width: "140%", height: "300px" }}
            />
          )}
          {!isImage && !isPDF && (
            <Typography variant="body2">{file.name}</Typography>
          )}
        </Box>
      </Box>
    );
  };

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
        sx={{ textAlign: "center", fontWeight: "bold", color: "#c026d3" }}
      >
        Order Summary
      </Typography>
      <Divider sx={{ my: 2 }} />

      {/* Products Section */}
      {cartItems?.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight="bold">
            Products
          </Typography>
          {cartItems.map((item, index) => (
            <Grid container key={index} sx={{ mb: 1 }}>
              <Grid item xs={8}>
                <Typography sx={{ fontSize: "0.9rem" }}>
                  {item.productName}{" "}
                  <span style={{ fontWeight: "bold" }}>x{item.quantity}</span>
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                ₹{item.productPrice.toLocaleString()}
              </Grid>
            </Grid>
          ))}
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Technicians Section */}
      {technicianItems?.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight="bold">
            🛠️ Technicians
          </Typography>
          {technicianItems.map((item, index) => (
            <Grid container key={index} sx={{ mb: 1 }}>
              <Grid item xs={8}>
                {item.service_name}{" "}
                <span style={{ fontWeight: "bold" }}>x{item.quantity}</span>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                ₹{item.price.toLocaleString()}
              </Grid>
            </Grid>
          ))}
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Services Section */}
      {servicesItem?.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight="bold">
            Services
          </Typography>
          {servicesItem.map((item, index) => (
            <Grid container key={index} sx={{ mb: 1 }}>
              <Grid item xs={8}>
                {item.shopName}{" "}
                <span style={{ fontWeight: "bold" }}>x{item.quantity}</span>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                ₹{item.totalPrice.toLocaleString()}
              </Grid>
            </Grid>
          ))}
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Billing Details */}
      <Grid container>
        <Grid item xs={6}>
          <Typography>Total</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          ₹{billingDetails?.cartValue?.toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          Event Days
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          {numberOfDays} Days
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />

      <Grid container>
        <Grid item xs={6}>
          Base Amount
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          ₹{billingDetails.baseAmount?.toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          TDS Charges (2%)
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          -₹{billingDetails?.tdsCharges?.toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          Amount After TDS
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          ₹{billingDetails?.amountAfterTds?.toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          CGST (9%)
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          ₹{billingDetails?.cgst?.toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          SGST (9%)
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          ₹{billingDetails?.sgst?.toLocaleString()}
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography fontWeight="bold">Grand Total (GST + TDS)</Typography>
        <Typography fontWeight="bold">
          ₹{billingDetails?.grandTotal?.toLocaleString()}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Event & Location */}
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", mt: 2, color: "#c026d3" }}
      >
        Event Details
      </Typography>

      <LoadScript googleMapsApiKey="AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={selectedPosition || center}
          zoom={14}
          onClick={handleMapClick}
        >
          {selectedPosition && <Marker position={selectedPosition} />}
        </GoogleMap>
      </LoadScript>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body1">
          <strong>{eventName}</strong>
        </Typography>
        <Typography variant="p">
          <strong>{venueName}</strong>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {selectedAddress || "Click map to select location"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {startDate} to {endDate} | {startTime} - {endTime}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          👤 {receiverName} 📞 {receiverMobile}
        </Typography>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Enter your message to vendor (Optional)"
        variant="outlined"
        sx={{ mt: 2 }}
      />

      {/* File Previews */}
      <Box sx={{ display: "flex" }}>
        {renderFilePreview(
          uploadedFiles.invitation,
          uploadedFiles.invitationPreview,
          "Invitation Preview"
        )}
        {renderFilePreview(
          uploadedFiles.gatePass,
          uploadedFiles.gatePassPreview,
          "Gate Pass Preview"
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ background: "#c026d3", mb: 2 }}
          onClick={handleOpenModal}
        >
          Proceed to Pay ₹{billingDetails.grandTotal.toLocaleString()}
        </Button>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Safe, easy, and secure Payments
        </Typography>
      </Box>

      {/* Confirmation Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "bold", color: "#c026d3" }}
          >
            Setup and Rehearsal
          </Typography>
          <Typography sx={{ mb: 3, color: "#555" }}>
            Ensure the selected date and address are correct.
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleModify}
                sx={{
                  borderColor: "#c026d3",
                  color: "#c026d3",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                }}
              >
                Modify Date
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={handleConfirm}
                sx={{
                  backgroundColor: "#c026d3",
                  color: "white",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                }}
              >
                Confirm & Pay
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Calendar Modal */}
      <Modal open={isCalenderOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: "16px",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
            p: 4,
            width: "450px",
            maxWidth: "95%",
            textAlign: "center",
          }}
        >
          <Calendar
            handleCalendarClose={handleCalendarClose}
            calendarClose={handleCalendarClose}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default OrderSummary;
