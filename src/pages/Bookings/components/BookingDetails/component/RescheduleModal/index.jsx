import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useSelector } from "react-redux";
import LocationSection from "../../../../../Cart/components/EventDetails/components/LocationSection";
import dayjs from "dayjs";

const RescheduleModal = ({
  open,
  handleClose,
  formData,
  setFormData,
  handleRescheduleOrder,
  days,
}) => {
  const [openLocation, setOpenLocation] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "event_end_date") {
      const startDate = dayjs(formData.event_start_date);
      const endDate = dayjs(value);
      const selectedDays = endDate.diff(startDate, "day") + 1;

      if (selectedDays > days) {
        alert(`You cannot select more than ${days} days.`);
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleLocationContinue = (locationData) => {
    if (!locationData || !locationData.lat || !locationData.lng) {
      console.error("Invalid location data received:", locationData);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      event_location: locationData.address,
      location_lat: locationData.lat,
      location_long: locationData.lng,
    }));

    setOpenLocation(false);
  };

  return (
    <>
      {/* Reschedule Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            height: "600px",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Reschedule Event
          </Typography>

          <TextField
            fullWidth
            label="Event Name"
            variant="outlined"
            name="event_name"
            value={formData.event_name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              mb: 2,
            }}
          >
            <Typography>
              {formData.event_location || "Select a location"}
            </Typography>
            <Button
              sx={{
                width: "100%",
                border: "1px solid #9c27b0",
                color: "green",
              }}
              onClick={() => setOpenLocation(true)}
            >
              Select Address
            </Button>
          </Box>

          <TextField
            fullWidth
            label="Receiver Name"
            variant="outlined"
            name="receiver_name"
            value={formData.receiver_name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Receiver Mobile Number"
            variant="outlined"
            name="receiver_mobilenumber"
            value={formData.receiver_mobilenumber}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="date"
            label="Event Start Date"
            variant="outlined"
            name="event_start_date"
            InputLabelProps={{ shrink: true }}
            value={formData.event_start_date}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            inputProps={{ min: dayjs().format("YYYY-MM-DD") }}
          />

          <TextField
            fullWidth
            type="date"
            label="Event End Date"
            variant="outlined"
            name="event_end_date"
            InputLabelProps={{ shrink: true }}
            value={formData.event_end_date}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            inputProps={{ min: dayjs().format("YYYY-MM-DD") }}
          />

          <TextField
            fullWidth
            type="time"
            label="Event Start Time"
            variant="outlined"
            name="event_start_time"
            InputLabelProps={{ shrink: true }}
            value={formData.event_start_time}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="time"
            label="Event End Time"
            variant="outlined"
            name="event_end_time"
            InputLabelProps={{ shrink: true }}
            value={formData.event_end_time}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="time"
            label="Venue Open Time"
            variant="outlined"
            name="venue_open_time"
            InputLabelProps={{ shrink: true }}
            value={formData.venue_open_time}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Reschedule Remark"
            variant="outlined"
            name="reschedule_remark"
            value={formData.reschedule_remark}
            onChange={handleInputChange}
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            Upload Gatepass:
          </Typography>
          <input
            type="file"
            accept="image/*,application/pdf"
            name="upload_gatepass"
            onChange={handleFileChange}
            style={{ marginBottom: "1rem" }}
          />

          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            Upload Invitation:
          </Typography>
          <input
            type="file"
            accept="image/*,application/pdf"
            name="upload_invitation"
            onChange={handleFileChange}
            style={{ marginBottom: "1rem" }}
          />

          <FormControlLabel
            control={<Checkbox name="policyCheck" />}
            label="I agree to the reschedule policy"
          />

          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button variant="contained" onClick={handleClose} color="error">
              Cancel
            </Button>

            <Button
              variant="contained"
              sx={{ backgroundColor: "#c026d3" }}
              onClick={handleRescheduleOrder}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Location Modal */}
      <Modal open={openLocation} onClose={() => setOpenLocation(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Select Location
          </Typography>
          <LocationSection
            onContinue={handleLocationContinue}
            setOpenLocation={setOpenLocation}
          />
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="primary"
            onClick={() => setOpenLocation(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default RescheduleModal;
