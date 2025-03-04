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
import { useState } from "react";
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
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleModify = () => {
    setIsCalenderOpen(true);
    handleCloseModal();
  };

  const handleCalendarClose = () => {
    setIsCalenderOpen(false);
  };


  const handleConfirm = () => {
    handleConfirmOrder();
    handleCloseModal();
  };

  // const baseAmount = billingDetails.baseAmount * 3;
  const containerStyle = {
    width: "100%",
    height: "200px",
  };

  const center = {
    lat: 12.2958,
    lng: 76.6394,
  };
  const renderFilePreview = (file, previewUrl, label) => {
    if (!file) return null;

    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';

    return (
      <Box sx={{display:'flex'}}>
   
      <Box sx={{ margin: '1rem 0' }}>
        <Typography variant="subtitle1">{label}</Typography>
        {isImage && <img src={previewUrl} alt={label} style={{ maxWidth: '60%', maxHeight: '200px' }} />}
        {isPDF && (
          <iframe
            src={previewUrl}
            title={label}
            style={{ width: '140%', height: '300px' }}
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
        sx={{ textAlign: "center", fontWeight: "bold", color: '#c026d3' }}
      >
        Order Summary
      </Typography>
      <Divider sx={{ my: 2 }} />

      {cartItems?.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight="bold">
            Products
          </Typography>
          {cartItems?.map((item, index) => (
            <Grid container key={index} sx={{ mb: 1 }}>
              <Grid item xs={8}>
                <Typography variant="p" sx={{ fontSize: '0.9rem' }}>
                  {item.productName}{" "}
                  <span style={{ fontWeight: "bold", fontSize: '0.9rem' }}>X{item.quantity}</span>
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                <Typography variant="p" sx={{ fontSize: '0.9rem' }}>₹{item.productPrice.toLocaleString()}</Typography>
              </Grid>
            </Grid>
          ))}
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Technicians  */}
      {technicianItems?.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight="bold">
            🛠️ Technicians
          </Typography>
          {technicianItems?.map((item, index) => (
            <Grid container key={index} sx={{ mb: 1 }}>
              <Grid item xs={8}>
                <Typography variant="p" sx={{ fontSize: '0.9rem' }}>
                  {item.service_name}{" "}
                  <span style={{ fontWeight: "bold", fontSize: '0.9rem' }}>X{item.quantity}</span>
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                <Typography variant="p" sx={{ fontSize: '0.9rem' }}>₹{item.price.toLocaleString()}</Typography>
              </Grid>
            </Grid>
          ))}
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Services  */}
      {servicesItem?.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight="bold">
            Services
          </Typography>
          {servicesItem.map((item, index) => (
            <Grid container key={index} sx={{ mb: 1 }}>
              <Grid item xs={8}>
                <Typography variant="p" sx={{ fontSize: '0.9rem' }}>
                  {item.shopName}{" "}
                  <span style={{ fontWeight: "bold", fontSize: '0.9rem' }}>X{item.quantity}</span>
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                <Typography variant="p" sx={{ fontSize: '0.9rem' }}>₹{item.totalPrice.toLocaleString()}</Typography>
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
          <Typography variant="p" sx={{ fontSize: '0.9rem' }}>
            ₹{billingDetails?.cartValue?.toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p" sx={{ fontSize: '0.9rem' }}>Event Days</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="p" sx={{ fontSize: '0.9rem' }}>{numberOfDays} Days</Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />

      <Grid container>
        <Grid item xs={6}>
          <Typography variant="p" sx={{ fontSize: '0.85rem' }}>Base Amount</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="p" sx={{ fontSize: '0.85rem' }}>
            ₹{billingDetails.baseAmount?.toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p" sx={{ fontSize: '0.85rem' }}>TDS Charges (2%)</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="p" sx={{ fontSize: '0.85rem' }}>
            -₹{billingDetails?.tdsCharges?.toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p" sx={{ fontSize: '0.85rem' }}>Amount After TDS Deduction</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="p" sx={{ fontSize: '0.85rem' }}>
            ₹{billingDetails?.amountAfterTds?.toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p" sx={{ fontSize: '0.85rem' }}>CGST (9%)</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="p" sx={{ fontSize: '0.85rem' }}>₹{billingDetails?.cgst?.toLocaleString()}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p" sx={{ fontSize: '0.9rem' }}>SGST (9%)</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="p" sx={{ fontSize: '0.9rem' }}>₹{billingDetails?.sgst?.toLocaleString()}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="p" sx={{ fontSize: '0.9rem' }}>Total GST (CGST + SGST)</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="p" sx={{ fontSize: '0.9rem' }}>₹{billingDetails?.totalGst?.toLocaleString()}</Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" fontWeight="bold">
            Grand Total: <br />

          </Typography>
          <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>(GST and TDS Deduction)</span>
        </Box>

        <Typography fontWeight="bold">₹{billingDetails?.grandTotal?.toLocaleString()}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />


      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", mt: 2, color: '#c026d3', fontSize: '1.2rem' }}
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
          <strong>{eventName}</strong>
        </Typography>
        <Typography variant="p">
          <strong>{venueName}</strong>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {/* {locationTown} {" "} {locationCity}{" "}  */}
          {location}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {startDate} to {endDate} at {" "}
          {startTime} to {endTime}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          👤 {receiverName} 📞 {receiverMobile}
        </Typography>
      </Box>

      {/*  Message Box */}
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Enter your message to vendor's (Optional)"
        variant="outlined"
        sx={{ mt: 2 }}
      />
      <Box sx={{display:'flex'}}>
        
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
  
      {/*  Action Buttons */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            background: "#c026d3",
            mb: 2
          }}
          onClick={handleOpenModal}
        >
          Proceed to Pay ₹{billingDetails.grandTotal.toLocaleString()}
        </Button>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Safe, easy, and secure Payments
        </Typography>
      </Box>
      <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
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
          id="confirmation-modal-title"
          variant="h6"
          sx={{ mb: 2, fontWeight: "bold", color: "#c026d3" }}
        >
          Setup and Rehearsal
        </Typography>
        <Typography
          id="confirmation-modal-description"
          sx={{ mb: 3, color: "#555" }}
        >
          Please ensure the selected date is correct. Otherwise, you may modify
          the date if needed.
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
              Modify
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
                '&:hover': {
                  backgroundColor: "#9c27b0",
                },
              }}
            >
              Yes! Confirm
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
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
            border: "none",
          }}
        >
          <Box
            sx={{
              marginBottom: "20px",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <Calendar
              handleCalendarClose={handleCalendarClose}
              calendarClose={handleCalendarClose}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              marginTop: "20px",
            }}
          >
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default OrderSummary;
