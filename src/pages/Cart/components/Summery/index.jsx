import { Box, Button, Modal, Typography, Divider } from "@mui/material";
import GoogleMapReact from "google-map-react"; // For embedding the map (optional)

const Summery = ({ open, onClose, eventDetails }) => {
  const mapCenter = { lat: 12.2958, lng: 76.6394 }; // Example coordinates for Mysore
  const mapZoom = 14;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="order-summary-modal-title"
      aria-describedby="order-summary-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "16px",
          p: 4,
          width: "90%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Title */}
        <Typography
          id="order-summary-modal-title"
          variant="h5"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#6A1B9A",
          }}
        >
          Order Summary
        </Typography>

        {/* Order Items */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
              fontWeight: "bold",
            }}
          >
            <Typography>Sound Engineer</Typography>
            <Typography>X1</Typography>
            <Typography>₹2000</Typography>
          </Box>
        </Box>

        <Divider />

        {/* Details Section */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>Total:</Typography>
            <Typography>₹2000.00</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>Event Days:</Typography>
            <Typography>3 Day</Typography>
          </Box>

          <Divider />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>Base Amount:</Typography>
            <Typography>₹6000.00</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>TDS Charges (2%):</Typography>
            <Typography>₹120.00</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>Amount After TDS Deduction:</Typography>
            <Typography>₹5880.00</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>CGST (9%):</Typography>
            <Typography>₹540.00</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>SGST (9%):</Typography>
            <Typography>₹540.00</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>Total GST (CGST + SGST):</Typography>
            <Typography>₹1080.00</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              fontWeight: "bold",
              color: "#4CAF50",
            }}
          >
            <Typography>Grand Total (GST & TDS Deduction):</Typography>
            <Typography>₹6960.00</Typography>
          </Box>
        </Box>

        {/* Event Details */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 2,
              color: "#6A1B9A",
              textAlign: "center",
            }}
          >
            Event Details
          </Typography>
          <Box
            sx={{
              height: "200px",
              borderRadius: "8px",
              overflow: "hidden",
              mb: 2,
            }}
          >
            <GoogleMapReact
              bootstrapURLKeys={{ key: "YOUR_GOOGLE_MAPS_API_KEY" }} 
              defaultCenter={mapCenter}
              defaultZoom={mapZoom}
            />
          </Box>
          <Typography variant="body1">Sample</Typography>
          <Typography variant="body2">Mysore event</Typography>
        </Box>

        {/* Close Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          fullWidth
          sx={{
            textTransform: "uppercase",
            fontWeight: "bold",
            py: 1.5,
            background:
              "linear-gradient(90deg, rgba(196, 70, 255, 1) 0%, rgba(120, 1, 251, 1) 50%, rgba(62, 0, 130, 1) 100%)",
            "&:hover": {
              opacity: 0.9,
            },
          }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default Summery;
