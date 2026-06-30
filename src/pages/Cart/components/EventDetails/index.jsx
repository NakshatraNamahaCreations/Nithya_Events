import React, { useEffect, useState } from "react";

// Third party library
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
  Modal,
  Alert,
  Snackbar,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  DatePicker,
  TimePicker,
  renderTimeViewClock,
} from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs"; // Import dayjs for setting minDate

// Custom Components
import Terms from "../Terms";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../../../redux/slice/CartSlice";
import CustomModal from "../../../../components/CustomModal";
import OrderSummery from "./components/OrderSummery";
import { config } from "../../../../api/config";
import axios from "axios";
import {
  formatDate,
  formatDate1,
  getCurrentCity,
} from "../../../../utils/helperFunc";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LocationSection from "./components/LocationSection";

const FieldLabel = ({ label }) => (
  <Typography component="span">
    {label}
    <Typography component="span" sx={{ color: "red", marginLeft: "4px" }}>
      *
    </Typography>
  </Typography>
);

const EventDetails = ({
  cartItems,
  technicianItems,
  serviceItems,
  billingDetails,
  handleClearAll,
}) => {
  const [eventDetails, setEventDetails] = useState({
    eventDate: null,
    eventSetupStartDate: null,
    eventSetupEndDate: null,
    rehearsalDate: null,
    startTime: null,
    endTime: null,
    eventName: "",
    eventVenue: "",
    venueSetupStartTime: null,
    venueSetupEndTime: null,
    venueStartTime: null,
    venueEndTime: null,
    receiverName: "",
    receiverMobile: "",
    address: null,
    upload_invitation: "",
    upload_gatepass: "",
    event_location: "",
    location_lat: null,
    location_long: null,
  });
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false); // Controlled by handleProceedToTerms
  const [isCheckoutAllowed, setIsCheckoutAllowed] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [addLocation, setAddLocation] = useState({
    address: "",
    lat: null,
    lng: null,
  });
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [termsAccepted, setTermsAccepted] = useState(false); // Sync with Terms component
  const { startDate, endDate, numberOfDays } = useSelector(
    (state) => state.date
  );
  const servicesItem = useSelector((state) => state.services.services);
  const technicianItem = useSelector((state) => state.technicians.technicians);
  const [currentLocation, setCurrentLocation] = useState({
    lat: null,
    lng: null,
    city: "",
    town: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileError, setMobileError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

    // Format dates to DD-MM-YYYY using moment.js
  const formatDate = (date) => {
    try {
      return moment(date).isValid() ? moment(date).format("DD-MM-YYYY") : "";
    } catch {
      return "";
    }
  };

  const formatedStartDate = formatDate(startDate);
  const formatedEndDate = formatDate(endDate);

  // Event date range as dayjs values, used to restrict the setup/rehearsal
  // date pickers so they can't fall outside the selected event period.
  const eventStart = startDate ? dayjs(startDate) : null;
  const eventEnd = endDate ? dayjs(endDate) : null;


  // Trigger the Terms modal
  const handleProceedToTerms = () => {
    if (
      !eventDetails.startTime ||
      !eventDetails.endTime ||
      !eventDetails.venueEndTime ||
      !eventDetails.venueStartTime ||
      !eventDetails.eventSetupStartDate ||
      !eventDetails.eventSetupEndDate ||
      !eventDetails.rehearsalDate ||
      !eventDetails.eventName.trim() ||
      !eventDetails.eventVenue.trim() ||
      !eventDetails.receiverName.trim() ||
      !eventDetails.receiverMobile.trim() ||
      !addLocation.address
    ) {
      setSnackbarOpen(true);
      return;
    }
    setShowTerms(true); // Open the Terms modal
  };

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

  // Handle terms acceptance and proceed
  const handleAcceptTerms = () => {
    if (!userId) {
      toast.error("Authentication is Required!");
      localStorage.setItem("previousPage", location.pathname);
      navigate("/login");
      return;
    }
    if (
      !eventDetails.startTime ||
      !eventDetails.endTime ||
      !eventDetails.venueEndTime ||
      !eventDetails.venueStartTime ||
      !eventDetails.eventSetupStartDate ||
      !eventDetails.eventSetupEndDate ||
      !eventDetails.rehearsalDate ||
      !eventDetails.eventName.trim() ||
      !eventDetails.eventVenue.trim() ||
      !eventDetails.receiverName.trim() ||
      !eventDetails.receiverMobile.trim() ||
      !addLocation.address
    ) {
      setSnackbarOpen(true);
      return;
    }
    if (eventDetails.receiverMobile.length < 10) {
      toast.error(
        "Please enter a valid 10-digit mobile number for the receiver."
      );
      return;
    }
    if (!termsAccepted) {
      toast.error("Please accept the Terms & Conditions.");
      return;
    }
    setIsOrderSummaryOpen(true);
    setShowTerms(false); // Close the Terms modal after acceptance
  };

  const handleLocationContinue = (locationData) => {
    if (!locationData || !locationData.lat || !locationData.lng) {
      console.error("Invalid location data received:", locationData);
      return;
    }
    setAddLocation({
      address: locationData.address,
      lat: locationData.lat,
      lng: locationData.lng,
    });
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      event_location: locationData.address,
      location_lat: locationData.lat,
      location_long: locationData.lng,
    }));
    setOpenLocation(false);
  };

  const handleAddressChange = (value) => {
    setEventDetails({ ...eventDetails, address: value });
    setIsAddressModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "receiverMobile") {
      if (value.length <= 10 && /^[0-9]*$/.test(value)) {
        setEventDetails({ ...eventDetails, [name]: value });
        setMobileError(false);
      } else if (value.length > 10) {
        setEventDetails({ ...eventDetails, [name]: value.slice(0, 10) });
        if (!mobileError) {
          toast.error("Mobile number cannot exceed 10 digits.", {
            position: "top-right",
            autoClose: 2000,
          });
          setMobileError(true);
        }
      }
    } else if (name === "receiverName") {
      const regex = /^[A-Za-z\s]*$/;
      if (regex.test(value) || value === "") {
        setEventDetails({ ...eventDetails, [name]: value });
      } else {
        toast.error("Name should only contain alphabets and spaces.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } else {
      setEventDetails({ ...eventDetails, [name]: value });
    }
  };

  const techniciansData = technicianItem?.map((item) => ({
    orderId: Date.now().toString(),
    service_id: item.service_id || item._id,
    category: item.category,
    price: item.price || item.product_price,
    service_name: item.service_name || item.product_name,
    shop_name: item.shop_name,
    vendor_id: item.vendor_id,
    vendor_name: item.vendor_name,
    eventStartDate: startDate,
    eventEndDate: endDate,
    quantity: item.quantity || 1,
    totalPrice: (item.price || item.product_price || 0) * (item.quantity || 1),
    commission_tax: item.commission_tax || 0,
    commission_percentage: item.commission_percentage || 0,
  }));

  const productData = cartItems?.map((item) => ({
    orderId: Date.now().toString(),
    id: item.id || "undefined",
    productName: item.productName || "Unknown",
    productPrice: item.productPrice || 0,
    mrpPrice: item.mrpPrice || 0,
    imageUrl:
      item.imageUrl ||
      "https://centrechurch.org/wp-content/uploads/2022/03/img-person-placeholder.jpeg",
    productDimension: item.productDimension || "Not Specified",
    totalPrice: (item.productPrice || 0) * (item.quantity || 1),
    quantity: item.quantity || 1,
    context: "product",
    sellerName: item.sellerName || "Unknown",
    sellerId: item.sellerId || "Unknown",
    eventStartDate: startDate,
    eventEndDate: endDate,
    commissionTax: item.commissionTax || 0,
    commissionPercentage: item.commissionPercentage || 0,
  }));

  const servicesData = servicesItem?.map((item) => ({
    orderId: Date.now().toString(),
    id: item.id || item._id,
    context: "service",
    store: "123rooms",
    sellerName: item.vendorName || item.sellerName || "Unknown Seller",
    sellerId: item.vendor_id || item.sellerId || "Unknown Vendor",
    productName: item.productName || item.service_name || "Service",
    productPrice: item.productPrice || item.price || 0,
    imageUrl: item.imageUrl || item.additional_images?.[0] || "",
    totalPrice:
      (item.pricing || item.productPrice || item.price || 0) *
      (item.quantity || 1),
    quantity: item.quantity || 1,
    eventStartDate:
      item.eventStartDate || new Date().toISOString().split("T")[0],
    eventEndDate: item.eventEndDate || new Date().toISOString().split("T")[0],
    commissionTax: item.commissionTax || 18,
    commissionPercentage: item.commissionPercentage || 22,
  }));

  const handleDateChange = (field, newDate) => {
    setEventDetails({ ...eventDetails, [field]: newDate });
  };

  // Returns true only when `date` falls within the selected event period.
  const isWithinEventRange = (date) => {
    if (!date || typeof date.isValid !== "function" || !date.isValid())
      return false;
    if (eventStart && date.isBefore(eventStart, "day")) return false;
    if (eventEnd && date.isAfter(eventEnd, "day")) return false;
    return true;
  };

  // Change handler for the setup/rehearsal dates that enforces the event range
  // (and the setup start <= setup end rule), so out-of-range values typed
  // manually are rejected too — not just disabled in the calendar.
  const handleEventDateChange = (field, newDate) => {
    // Allow clearing the field.
    if (!newDate) {
      setEventDetails((prev) => ({ ...prev, [field]: null }));
      return;
    }
    // Ignore incomplete/invalid input while typing.
    if (typeof newDate.isValid !== "function" || !newDate.isValid()) {
      return;
    }
    if (!isWithinEventRange(newDate)) {
      toast.error(
        `Date must be within the event period (${formatedStartDate} to ${formatedEndDate}).`,
        { position: "top-right", autoClose: 2500 }
      );
      return;
    }
    // Event Setup End Date must not be before Event Setup Start Date.
    if (
      field === "eventSetupEndDate" &&
      eventDetails.eventSetupStartDate &&
      newDate.isBefore(dayjs(eventDetails.eventSetupStartDate), "day")
    ) {
      toast.error(
        "Event Setup End Date cannot be before Event Setup Start Date.",
        { position: "top-right", autoClose: 2500 }
      );
      return;
    }
    setEventDetails((prev) => ({ ...prev, [field]: newDate }));
  };

  const handleTimeChange = (field, newTime) => {
    setEventDetails({ ...eventDetails, [field]: newTime });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setEventDetails((prevState) => ({
        ...prevState,
        [name]: files[0],
        [`${name}Preview`]: URL.createObjectURL(files[0]),
      }));
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const formData = new FormData();
      const userData = JSON.parse(sessionStorage.getItem("userDetails"));

      const orderedDate = moment().format("DD-MM-YYYY");
      // eventDate range in DD-MM-YYYY for display/payload
      const eventDate = `${moment(startDate).format("DD-MM-YYYY")} to ${moment(endDate).format("DD-MM-YYYY")}`;

      // ------------------ Event Details ------------------
      formData.append("product_data", JSON.stringify(productData));
      formData.append("service_data", JSON.stringify(servicesData));
      formData.append("tech_data", JSON.stringify(techniciansData));

      formData.append("receiver_mobilenumber", eventDetails.receiverMobile);
      formData.append("receiver_name", eventDetails.receiverName);
      formData.append("event_location", addLocation.address);
      formData.append("location_lat", addLocation.lat);
      formData.append("location_long", addLocation.lng);
      formData.append("venue_name", eventDetails.eventVenue);

      formData.append(
        "setup_date",
        eventDetails.eventSetupStartDate ? formatDate(eventDetails.eventSetupStartDate) : ""
      );
      formData.append(
        "setup_start_date",
        eventDetails.eventSetupStartDate ? formatDate(eventDetails.eventSetupStartDate) : ""
      );
      formData.append(
        "setup_end_date",
        eventDetails.eventSetupEndDate ? formatDate(eventDetails.eventSetupEndDate) : ""
      );
      formData.append(
        "rehearsal_date",
        eventDetails.rehearsalDate ? formatDate(eventDetails.rehearsalDate) : ""
      );

      formData.append(
        "setup_start_time",
        eventDetails.venueStartTime?.format("hh:mm A")
      );
      formData.append(
        "setup_end_time",
        eventDetails.venueEndTime?.format("hh:mm A")
      );
      formData.append(
        "event_start_time",
        eventDetails.startTime?.format("hh:mm A")
      );
      formData.append(
        "event_end_time",
        eventDetails.endTime?.format("hh:mm A")
      );

      formData.append("base_amount", billingDetails.baseAmount);
      formData.append("gst_applied_value", billingDetails.gst);
      formData.append("cart_total", billingDetails.cartValue);
      formData.append("tds_deduction", billingDetails.tdsCharges);
      formData.append("amount_after_deduction", billingDetails.amountAfterTds);
      formData.append("paid_amount", billingDetails.grandTotal);

      formData.append("event_name", eventDetails.eventName);
  formData.append("event_date", eventDate);
  // Ensure start/end dates are sent in DD-MM-YYYY format (not ISO)
  formData.append("event_start_date", formatDate(startDate));
  formData.append("event_end_date", formatDate(endDate));
      formData.append("number_of_days", numberOfDays);

      if (eventDetails.upload_gatepass)
        formData.append("upload_gatepass", eventDetails.upload_gatepass);
      if (eventDetails.upload_invitation)
        formData.append("upload_invitation", eventDetails.upload_invitation);

      formData.append("payment_method", "online");
      formData.append("payment_status", "success");
      formData.append("order_status", "Order Placed");

      formData.append("user_id", userData._id);
      formData.append("user_name", userData.username);
      formData.append("user_mailid", userData.email);
      formData.append("user_mobile_number", userData.mobilenumber);

      formData.append("vendors_message", "Website Booking");
      formData.append("booking_from", "web");
      formData.append("transaction_id", `WEB-TX-${Date.now()}`);
      formData.append("merchant_transaction_id", `WEB-MERCHANT-${Date.now()}`);
      formData.append("ordered_date", orderedDate);

      // ✅ Console payload
      console.log("🧾 FINAL BOOKING PAYLOAD (WEB):");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // ------------------ API Call ------------------
      const response = await axios.post(
        `${config.BASEURL}${config.CREATE_ORDER}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toast.success("Your order is placed!", {
          position: "top-right",
          autoClose: 2000,
        });
        setOpenModal(true);
        setModalMessage("Order Created Successfully");
        setModalType("success");
        setIsOrderSummaryOpen(false);
        handleClearAll();
      }
    } catch (error) {
      toast.error("Order failed", {
        position: "top-right",
        autoClose: 2000,
      });
      setOpenModal(true);
      setModalMessage("Order failed");
      setModalType("failure");
      setIsOrderSummaryOpen(false);
      console.error("❌ Error creating order:", error.response?.data || error);
    }
  };

  const handleModalClose = () => {
    setIsOrderSummaryOpen(false);
  };

  useEffect(() => {
    const isValid =
      eventDetails.startTime &&
      eventDetails.endTime &&
      eventDetails.venueEndTime &&
      eventDetails.venueStartTime &&
      eventDetails.eventSetupStartDate &&
      eventDetails.eventSetupEndDate &&
      eventDetails.rehearsalDate &&
      eventDetails.eventName.trim() &&
      eventDetails.eventVenue.trim() &&
      eventDetails.receiverName.trim() &&
      eventDetails.receiverMobile.trim() &&
      addLocation?.address &&
      eventDetails.receiverMobile.length === 10 &&
      termsAccepted;

    setIsCheckoutAllowed(isValid);
  }, [eventDetails, addLocation, termsAccepted]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const locationData = await getCurrentCity();
        setCurrentLocation({
          lat: locationData.lat,
          lng: locationData.lng,
          city: locationData.city,
          town: locationData.town,
        });
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchLocation();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f4f4f4",
          padding: "1rem",
          marginTop: "3rem",
        }}
      >
        <Paper
          elevation={5}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 600,
            borderRadius: 3,
            backgroundColor: "#fff",
            boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="bold"
            sx={{ mb: 3, fontSize: "1rem" }}
          >
            Event Details
          </Typography>

          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
            >
              <TextField
                label="Start Date"
                value={formatedStartDate}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: "0.8rem",
                    color: "#c026d3",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.8rem",
                    padding: "16px 18px",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c026d3" },
                    "&.Mui-focused fieldset": { borderColor: "#c026d3" },
                    "& input": { color: "black" },
                  },
                }}
              />
              <TextField
                label="End Date"
                value={formatedEndDate}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: "0.8rem",
                    color: "#c026d3",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.8rem",
                    padding: "16px 18px",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c026d3" },
                    "&.Mui-focused fieldset": { borderColor: "#c026d3" },
                    "& input": { color: "black" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label={<FieldLabel label="Event Setup Start Date" />}
                value={eventDetails.eventSetupStartDate}
                onChange={(newDate) =>
                  handleEventDateChange("eventSetupStartDate", newDate)
                }
                format="DD-MM-YYYY"
                minDate={eventStart || dayjs()} // within event range
                maxDate={eventEnd || undefined}
                renderInput={(params) => <TextField {...params} fullWidth />}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c026d3" },
                    "&.Mui-focused fieldset": { borderColor: "#c026d3" },
                    "& input": { color: "black" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label={<FieldLabel label="Event Setup End Date" />}
                value={eventDetails.eventSetupEndDate}
                onChange={(newDate) =>
                  handleEventDateChange("eventSetupEndDate", newDate)
                }
                format="DD-MM-YYYY"
                minDate={
                  eventDetails.eventSetupStartDate
                    ? dayjs(eventDetails.eventSetupStartDate)
                    : eventStart || dayjs()
                } // not before setup start, within event range
                maxDate={eventEnd || undefined}
                renderInput={(params) => <TextField {...params} fullWidth />}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c026d3" },
                    "&.Mui-focused fieldset": { borderColor: "#c026d3" },
                    "& input": { color: "black" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label={<FieldLabel label="Rehearsal Date" />}
                value={eventDetails.rehearsalDate}
                onChange={(newDate) =>
                  handleEventDateChange("rehearsalDate", newDate)
                }
                format="DD-MM-YYYY"
                minDate={eventStart || dayjs()} // within event range
                maxDate={eventEnd || undefined}
                renderInput={(params) => <TextField {...params} fullWidth />}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c026d3" },
                    "&.Mui-focused fieldset": { borderColor: "#c026d3" },
                    "& input": { color: "black" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label={<FieldLabel label="Event Setup Start Time" />}
                value={eventDetails.venueStartTime}
                onChange={(newTime) =>
                  handleTimeChange("venueStartTime", newTime)
                }
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c026d3" },
                    "&.Mui-focused fieldset": { borderColor: "#c026d3" },
                    "& input": { color: "black" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label={<FieldLabel label="Event Setup End Time" />}
                value={eventDetails.venueEndTime}
                onChange={(newTime) =>
                  handleTimeChange("venueEndTime", newTime)
                }
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c026d3" },
                    "&.Mui-focused fieldset": { borderColor: "#c026d3" },
                    "& input": { color: "black" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label={<FieldLabel label="Event Start Time" />}
                value={eventDetails.startTime}
                onChange={(newTime) => handleTimeChange("startTime", newTime)}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c026d3" },
                    "&.Mui-focused fieldset": { borderColor: "#c026d3" },
                    "& input": { color: "black" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label={<FieldLabel label="Event End Time" />}
                value={eventDetails.endTime}
                onChange={(newTime) => handleTimeChange("endTime", newTime)}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c026d3" },
                    "&.Mui-focused fieldset": { borderColor: "#c026d3" },
                    "& input": { color: "black" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={<FieldLabel label="Event Name" />}
                name="eventName"
                value={eventDetails.eventName}
                onChange={handleChange}
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: "0.8rem",
                    color: "#c026d3",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.8rem",
                    padding: "16px 18px",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c026d3" },
                    "&.Mui-focused fieldset": { borderColor: "#c026d3" },
                    "& input": { color: "black" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={<FieldLabel label="Event Venue Name" />}
                name="eventVenue"
                value={eventDetails.eventVenue}
                onChange={handleChange}
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: "0.8rem",
                    color: "#c026d3",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.8rem",
                    padding: "16px 18px",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c026d3" },
                    "&.Mui-focused fieldset": { borderColor: "#c026d3" },
                    "& input": { color: "black" },
                  },
                }}
              />
            </Grid>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1rem",
                width: "100%",
              }}
            >
              <Typography>
                {addLocation.address || "No address selected"}
              </Typography>
              <Button
                sx={{
                  width: "33.7rem",
                  marginTop: "2rem",
                  marginLeft: "1rem",
                  border: "1px solid #9c27b0",
                  color: "green",
                }}
                onClick={() => setOpenLocation(!openLocation)}
              >
                Select Address
                <Typography
                  variant="button"
                  sx={{
                    color: "red",
                    marginLeft: "0.5rem",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  *
                </Typography>
              </Button>
            </Box>
            <Grid item xs={6}>
              <TextField
                label={<FieldLabel label="Receiver Name" />}
                name="receiverName"
                value={eventDetails.receiverName}
                onChange={handleChange}
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: "0.8rem",
                    color: "#c026d3",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.8rem",
                    padding: "16px 18px",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c026d3" },
                    "&.Mui-focused fieldset": { borderColor: "#c026d3" },
                    "& input": { color: "black" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                label={<FieldLabel label="Receiver Mobile" />}
                name="receiverMobile"
                value={eventDetails.receiverMobile}
                onChange={handleChange}
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: "0.8rem",
                    color: "#c026d3",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.8rem",
                    padding: "16px 18px",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c026d3" },
                    "&.Mui-focused fieldset": { borderColor: "#c026d3" },
                    "& input": { color: "black" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ border: "1px solid #9c27b0", color: "#9c27b0" }}
              >
                Upload Invitation
                <input
                  type="file"
                  name="upload_invitation"
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
              {eventDetails.upload_invitationPreview && (
                <Typography
                  variant="body2"
                  sx={{ color: "#555", marginTop: "5px", textAlign: "center" }}
                >
                  {eventDetails.upload_invitation.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ border: "1px solid #9c27b0", color: "#9c27b0" }}
              >
                Upload Gate Pass
                <input
                  type="file"
                  name="upload_gatepass"
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
              {eventDetails.upload_gatepassPreview && (
                <Typography
                  variant="body2"
                  sx={{ color: "#555", marginTop: "5px", textAlign: "center" }}
                >
                  {eventDetails.upload_gatepass.name}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Box mt={4} textAlign="center">
            <Typography
              variant="body2"
              sx={{
                color: "#555",
                fontSize: "0.9rem",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              Before proceeding to place your order, you need to accept the
              Terms & Conditions.
            </Typography>
            <Terms
              open={showTerms}
              onClose={() => setShowTerms(false)}
              onContinue={handleAcceptTerms}
              onTermsAccepted={setTermsAccepted} // Sync terms acceptance
            />
          </Box>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity="error">Please fill in all mandatory fields!</Alert>
        </Snackbar>

        <Modal open={isOrderSummaryOpen} onClose={handleModalClose}>
          <OrderSummery
            cartItems={cartItems}
            technicianItems={technicianItems}
            servicesItem={servicesItem}
            billingDetails={billingDetails}
            startDate={formatedStartDate}
            endDate={formatedEndDate}
            eventName={eventDetails.eventName}
            venueName={eventDetails.eventVenue}
            // Pass dayjs objects when available so the summary can format them
            startTime={eventDetails.startTime || null}
            endTime={eventDetails.endTime || null}
            // Venue / setup times & dates
            venueStartTime={eventDetails.venueStartTime || null}
            venueEndTime={eventDetails.venueEndTime || null}
            eventSetupStartDate={eventDetails.eventSetupStartDate || null}
            eventSetupEndDate={eventDetails.eventSetupEndDate || null}
            rehearsalDate={eventDetails.rehearsalDate || null}
            // Location (address + lat/lng)
            location={addLocation.address}
            locationLat={addLocation.lat}
            locationLng={addLocation.lng}
            receiverName={eventDetails.receiverName}
            receiverMobile={eventDetails.receiverMobile}
            // Include previews if present
            uploadedFiles={{
              invitation: eventDetails.upload_invitation,
              invitationPreview: eventDetails.upload_invitationPreview,
              gatePass: eventDetails.upload_gatepass,
              gatePassPreview: eventDetails.upload_gatepassPreview,
            }}
            handleConfirmOrder={handleConfirmOrder}
            handleModalClose={handleModalClose}
          />
        </Modal>

        <Modal
          open={openLocation}
          onClose={() => setOpenLocation(false)}
          aria-labelledby="order-summary-title"
          aria-describedby="order-summary-description"
        >
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
              zIndex: 100,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              {currentLocation ? currentLocation.city : "Select Location"}
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

        <CustomModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          message={modalMessage}
          type={modalType}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default EventDetails;
