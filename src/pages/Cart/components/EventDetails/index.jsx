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
    eventMainDate: null,
    eventSetupStartDate: null,
    eventSetupEndDate: null,
    rehearsalDate: null,
    rehearsalStartTime: null,
    rehearsalEndTime: null,
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
  // Per-field validation messages, shown beside each field instead of a
  // single generic "fill all fields" message.
  const [fieldErrors, setFieldErrors] = useState({});

  // renderInput for MUI pickers that surfaces the field's validation message
  // beside/below the picker.
  const pickerInput = (field) => (params) =>
    (
      <TextField
        {...params}
        fullWidth
        error={!!fieldErrors[field]}
        helperText={fieldErrors[field]}
      />
    );

  // Clear a single field's error (called as fields are edited).
  const clearFieldError = (field) =>
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  // Build a per-field error map for the whole form. Empty map = valid.
  const validateEventDetails = () => {
    const errs = {};
    const req = {
      eventSetupStartDate: "Please select the setup start date.",
      eventSetupEndDate: "Please select the setup end date.",
      venueStartTime: "Please select the setup start time.",
      venueEndTime: "Please select the setup end time.",
      rehearsalDate: "Please select the rehearsal date.",
      rehearsalStartTime: "Please select the rehearsal start time.",
      rehearsalEndTime: "Please select the rehearsal end time.",
      eventMainDate: "Please select the event main date.",
      startTime: "Please select the event start time.",
      endTime: "Please select the event end time.",
    };
    Object.keys(req).forEach((k) => {
      if (!eventDetails[k]) errs[k] = req[k];
    });
    if (!eventDetails.eventName.trim())
      errs.eventName = "Please enter the event name.";
    if (!eventDetails.eventVenue.trim())
      errs.eventVenue = "Please enter the venue name.";
    if (!eventDetails.receiverName.trim())
      errs.receiverName = "Please enter the receiver name.";
    if (!eventDetails.receiverMobile.trim())
      errs.receiverMobile = "Please enter the receiver mobile number.";
    else if (eventDetails.receiverMobile.length !== 10)
      errs.receiverMobile = "Enter a valid 10-digit mobile number.";
    if (!addLocation.address) errs.location = "Please select an address.";

    // End time must be after its start time.
    const pairs = [
      { start: "venueStartTime", end: "venueEndTime", label: "Setup" },
      {
        start: "rehearsalStartTime",
        end: "rehearsalEndTime",
        label: "Rehearsal",
      },
      { start: "startTime", end: "endTime", label: "Event" },
    ];
    pairs.forEach(({ start, end, label }) => {
      const s = eventDetails[start];
      const e = eventDetails[end];
      if (s && e && typeof e.isAfter === "function" && !e.isAfter(s))
        errs[end] = `${label} end time must be after the start time.`;
    });
    return errs;
  };

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

  // Auto-fill Event Main Date with the event's start date by default (editable),
  // mirroring the User App. Only sets it while empty so a manual pick is kept.
  useEffect(() => {
    if (!eventDetails.eventMainDate && eventStart) {
      setEventDetails((prev) => ({ ...prev, eventMainDate: eventStart }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  // Shared style for the grouped-section subheadings (Event Setup / Rehearsal /
  // Event) so related date + time fields read as one logical block.
  const sectionHeadingSx = {
    fontWeight: "bold",
    color: "#c026d3",
    fontSize: "0.9rem",
    mt: 1,
    borderBottom: "1px solid #f0d3f5",
    pb: 0.5,
  };


  // Trigger the Terms modal
  const handleProceedToTerms = () => {
    if (
      !eventDetails.startTime ||
      !eventDetails.endTime ||
      !eventDetails.venueEndTime ||
      !eventDetails.venueStartTime ||
      !eventDetails.eventMainDate ||
      !eventDetails.eventSetupStartDate ||
      !eventDetails.eventSetupEndDate ||
      !eventDetails.rehearsalDate ||
      !eventDetails.rehearsalStartTime ||
      !eventDetails.rehearsalEndTime ||
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
    // Field-level validation: show messages beside each field, not a single
    // generic error.
    const errs = validateEventDetails();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
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
    clearFieldError("location");
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
    clearFieldError(name);

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
    clearFieldError(field);
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
    clearFieldError(field);
    // Map each END time to its START time and a human label, for validation.
    const endToStart = {
      venueEndTime: { start: "venueStartTime", label: "Event Setup" },
      rehearsalEndTime: { start: "rehearsalStartTime", label: "Rehearsal" },
      endTime: { start: "startTime", label: "Event" },
    };
    // Map each START time to its END time, so changing a start can clear a now
    // invalid end.
    const startToEnd = {
      venueStartTime: "venueEndTime",
      rehearsalStartTime: "rehearsalEndTime",
      startTime: "endTime",
    };

    // Map each START time to the date it belongs to, so we can reject a start
    // time that falls in the past when that date is today.
    const startToDate = {
      venueStartTime: "eventSetupStartDate",
      rehearsalStartTime: "rehearsalDate",
      startTime: "eventMainDate",
    };

    // Ignore incomplete/invalid time while the user is still typing.
    if (newTime && typeof newTime.isValid === "function" && !newTime.isValid()) {
      return;
    }

    // Reject a start time in the past (only when its date is today).
    if (newTime && startToDate[field]) {
      const dateVal = eventDetails[startToDate[field]];
      const now = dayjs();
      if (dateVal && dateVal.isSame(now, "day")) {
        const combined = dateVal
          .hour(newTime.hour())
          .minute(newTime.minute())
          .second(0);
        if (combined.isBefore(now)) {
          toast.error("Start Time cannot be in the past.", {
            position: "top-right",
            autoClose: 2500,
          });
          return;
        }
      }
    }

    // Validate an end time against its start time (must be after; start first).
    if (newTime && endToStart[field]) {
      const { start, label } = endToStart[field];
      const startVal = eventDetails[start];
      if (!startVal) {
        toast.error(`Please select ${label} Start Time first.`, {
          position: "top-right",
          autoClose: 2500,
        });
        return;
      }
      if (!newTime.isAfter(startVal)) {
        toast.error(`${label} End Time must be after ${label} Start Time.`, {
          position: "top-right",
          autoClose: 2500,
        });
        return;
      }
    }

    setEventDetails((prev) => {
      const next = { ...prev, [field]: newTime };
      // If a start time changed and an end time is now no longer after it, clear
      // the end so the user must re-select a valid one.
      if (newTime && startToEnd[field]) {
        const endVal = prev[startToEnd[field]];
        if (endVal && !endVal.isAfter(newTime)) {
          next[startToEnd[field]] = null;
        }
      }
      return next;
    });
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

  // Convert an uploaded File to a base64 data URI so the order payload can be
  // stored in sessionStorage and survive the full-page redirect to PhonePe.
  const fileToBase64 = (file) =>
    new Promise((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });

  // Builds the full booking payload and STASHES it in sessionStorage (does NOT
  // create the order). The order is created only AFTER a successful payment,
  // from the payment-success page. Returns true when stashed successfully.
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
        "rehearsal_start_time",
        eventDetails.rehearsalStartTime?.format("hh:mm A") || ""
      );
      formData.append(
        "rehearsal_end_time",
        eventDetails.rehearsalEndTime?.format("hh:mm A") || ""
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

      // Apply any coupon selected on the Order Summary (bridged via sessionStorage).
      const appliedCoupon = JSON.parse(
        sessionStorage.getItem("appliedCoupon") || "null"
      );
      const couponDiscount = Number(appliedCoupon?.discount) || 0;
      const payableAmount = Math.max(
        0,
        Number(billingDetails.grandTotal) - couponDiscount
      );
      formData.append("paid_amount", payableAmount);
      formData.append("coupon_code", appliedCoupon?.code || "");
      formData.append("coupon_discount", couponDiscount);

      formData.append("event_name", eventDetails.eventName);
  // Send the single Event Main Date as event_date (matches the User App); the
  // full range is still sent via event_start_date / event_end_date below.
  formData.append(
    "event_date",
    eventDetails.eventMainDate ? formatDate(eventDetails.eventMainDate) : eventDate
  );
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

      // ------------------ Stash payload (create AFTER payment) ------------------
      // Convert the FormData into a plain, serializable object. Files are
      // skipped here and re-added below as base64 so the whole payload survives
      // the redirect to PhonePe in sessionStorage.
      const payload = {};
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) continue;
        payload[key] = value;
      }
      if (eventDetails.upload_gatepass) {
        payload.upload_gatepass_b64 = await fileToBase64(
          eventDetails.upload_gatepass
        );
        payload.upload_gatepass_name =
          eventDetails.upload_gatepass.name || "gatepass.jpg";
      }
      if (eventDetails.upload_invitation) {
        payload.upload_invitation_b64 = await fileToBase64(
          eventDetails.upload_invitation
        );
        payload.upload_invitation_name =
          eventDetails.upload_invitation.name || "invitation.jpg";
      }

      sessionStorage.setItem("pendingOrderPayload", JSON.stringify(payload));
      return true;
    } catch (error) {
      console.error("❌ Error preparing order:", error);
      toast.error("Could not prepare your order. Please try again.", {
        position: "top-right",
        autoClose: 2500,
      });
      return false;
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
      eventDetails.eventMainDate &&
      eventDetails.eventSetupStartDate &&
      eventDetails.eventSetupEndDate &&
      eventDetails.rehearsalDate &&
      eventDetails.rehearsalStartTime &&
      eventDetails.rehearsalEndTime &&
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
            <Grid item xs={12}>
              <Typography sx={sectionHeadingSx}>Event Setup</Typography>
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
                renderInput={pickerInput("eventSetupStartDate")}
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
                renderInput={pickerInput("eventSetupEndDate")}
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
                renderInput={pickerInput("venueStartTime")}
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
                renderInput={pickerInput("venueEndTime")}
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
              <Typography sx={sectionHeadingSx}>Rehearsal</Typography>
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
                renderInput={pickerInput("rehearsalDate")}
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
                label={<FieldLabel label="Rehearsal Start Time" />}
                value={eventDetails.rehearsalStartTime}
                onChange={(newTime) =>
                  handleTimeChange("rehearsalStartTime", newTime)
                }
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                renderInput={pickerInput("rehearsalStartTime")}
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
                label={<FieldLabel label="Rehearsal End Time" />}
                value={eventDetails.rehearsalEndTime}
                onChange={(newTime) =>
                  handleTimeChange("rehearsalEndTime", newTime)
                }
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                renderInput={pickerInput("rehearsalEndTime")}
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
              <Typography sx={sectionHeadingSx}>Event</Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", gap: "1rem" }}
            >
              <TextField
                label="Event Start Date"
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
                label="Event End Date"
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
                label={<FieldLabel label="Event Main Date" />}
                value={eventDetails.eventMainDate}
                onChange={(newDate) =>
                  handleEventDateChange("eventMainDate", newDate)
                }
                format="DD-MM-YYYY"
                minDate={eventStart || dayjs()}
                maxDate={eventEnd || undefined}
                renderInput={pickerInput("eventMainDate")}
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
                renderInput={pickerInput("startTime")}
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
                renderInput={pickerInput("endTime")}
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
                error={!!fieldErrors.eventName}
                helperText={fieldErrors.eventName}
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
                error={!!fieldErrors.eventVenue}
                helperText={fieldErrors.eventVenue}
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
              {fieldErrors.location && (
                <Typography
                  variant="caption"
                  sx={{ color: "#d32f2f", mt: 0.5 }}
                >
                  {fieldErrors.location}
                </Typography>
              )}
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
                error={!!fieldErrors.receiverName}
                helperText={fieldErrors.receiverName}
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
                error={!!fieldErrors.receiverMobile}
                helperText={fieldErrors.receiverMobile}
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
                <Box sx={{ marginTop: "5px", textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    {eventDetails.upload_invitation.name}
                  </Typography>
                  {eventDetails.upload_invitation?.type?.startsWith(
                    "image/"
                  ) && (
                    <Box
                      component="img"
                      src={eventDetails.upload_invitationPreview}
                      alt="Invitation preview"
                      onClick={() =>
                        window.open(
                          eventDetails.upload_invitationPreview,
                          "_blank"
                        )
                      }
                      sx={{
                        marginTop: "6px",
                        maxWidth: "100%",
                        maxHeight: 120,
                        borderRadius: "6px",
                        border: "1px solid #eee",
                        cursor: "pointer",
                      }}
                    />
                  )}
                  <Button
                    size="small"
                    onClick={() =>
                      window.open(
                        eventDetails.upload_invitationPreview,
                        "_blank"
                      )
                    }
                    sx={{ color: "#9c27b0", textTransform: "none" }}
                  >
                    View
                  </Button>
                </Box>
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
                <Box sx={{ marginTop: "5px", textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    {eventDetails.upload_gatepass.name}
                  </Typography>
                  {eventDetails.upload_gatepass?.type?.startsWith("image/") && (
                    <Box
                      component="img"
                      src={eventDetails.upload_gatepassPreview}
                      alt="Gate pass preview"
                      onClick={() =>
                        window.open(
                          eventDetails.upload_gatepassPreview,
                          "_blank"
                        )
                      }
                      sx={{
                        marginTop: "6px",
                        maxWidth: "100%",
                        maxHeight: 120,
                        borderRadius: "6px",
                        border: "1px solid #eee",
                        cursor: "pointer",
                      }}
                    />
                  )}
                  <Button
                    size="small"
                    onClick={() =>
                      window.open(eventDetails.upload_gatepassPreview, "_blank")
                    }
                    sx={{ color: "#9c27b0", textTransform: "none" }}
                  >
                    View
                  </Button>
                </Box>
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
            eventMainDate={eventDetails.eventMainDate || null}
            rehearsalDate={eventDetails.rehearsalDate || null}
            rehearsalStartTime={eventDetails.rehearsalStartTime || null}
            rehearsalEndTime={eventDetails.rehearsalEndTime || null}
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
