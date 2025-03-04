// React related imports
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
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Custom Components
import authService from "../../../../api/ApiService";
import Terms from "../Terms";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../../../redux/slice/CartSlice";
import CustomAlert from "../../../../components/CustomAlerts";
import LocationSection from "./components/LocationSection";
import CustomModal from "../../../../components/CustomModal";
import OrderSummery from "./components/OrderSummery";
import { config } from "../../../../api/config";
import axios from "axios";
import { formatDate, getCurrentCity } from "../../../../utils/helperFunc";
import moment from "moment";

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
  billingDetails,
  handleClearAll,
}) => {
  const [eventDetails, setEventDetails] = useState({
    eventDate: null,
    // venueStart:null,
    startTime: null,
    endTime: null,
    eventName: "",
    eventVenue: "",
    venueStartTime: null,
    venueEndTime: null,
    receiverName: "",
    receiverMobile: "",
    address: null,
    upload_invitation: "",
    upload_gatepass: "",
  });
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isCheckoutAllowed, setIsCheckoutAllowed] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [addLocation, setAddLocation] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
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

  const dispatch = useDispatch();
  const formatedStartDate = formatDate(startDate);
  const formatedEndDate = formatDate(endDate);

  const handleProceedToTerms = () => {
    //   if (
    //     !eventDetails.startTime ||
    //     !eventDetails.endTime ||
    //     !eventDetails.eventName.trim() ||
    //     !eventDetails.eventVenue.trim() ||
    //     !eventDetails.receiverName.trim() ||
    //     !eventDetails.receiverMobile.trim()
    //   ) {
    //     setSnackbarOpen(true);
    //     return;
    //   } else {
    setShowTerms(true);
    //   }
  };

  const handleAcceptTerms = () => {
        if (
      !eventDetails.startTime ||
      !eventDetails.endTime ||
      !eventDetails.venueEndTime ||
      !eventDetails.venueStartTime ||
      !eventDetails.eventName.trim() ||
      !eventDetails.eventVenue.trim() ||
      !eventDetails.receiverName.trim() ||
      !eventDetails.receiverMobile.trim()
    ) {
      setSnackbarOpen(true);
      return;
    }
    setShowTerms(false);
    setIsOrderSummaryOpen(true);
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
    setEventDetails({ ...eventDetails, [name]: value });
  };
  console.log("The prodcut data",cartItems);
  
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

  // _id: `tech_${technician._id}`,
  // product_image:
  //   technician.image ||
  //   "https://centrechurch.org/wp-content/uploads/2022/03/img-person-placeholder.jpeg",
  // product_name: `${technician.service_name}`,
  // product_price: technician.price,
  // vendor_name: technician.vendor_name,
  // shop_name: technician.shop_name,
  // vendor_id: technician.vendor_id,
  // category: technician.category,
  // commission_percentage: technician.commission_percentage,
  // commission_tax: technician.commission_tax,
  // quantity: 1,

  const productData = cartItems?.map((item) => ({
    orderId: Date.now().toString(),
    id: item.id || "undefined",
    productName: item.productName || "Unknown",
    productPrice: item.productPrice || 0,
    mrpPrice: item.mrpPrice || 0,
    // store: item.shop_name || "Unknown",
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
    id: item.id,
    context: "service",
    shopName: item.shopName,
    storeImage:
      item.storeImage ||
      "https://centrechurch.org/wp-content/uploads/2022/03/img-person-placeholder.jpeg",
    vendorName: item.vendorName,
    pricing: item.pricing,
    totalPrice: (item.pricing || 0) * (item.quantity || 1),
    orderDate: moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
    commissionTax: item.commissionTax || 0,
    commissionPercentage: item.commissionPercentage || 0,
  }));

  const handleDateChange = (newDate) => {
    setEventDetails({ ...eventDetails, eventDate: newDate });
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
    const formData = new FormData();
    const userData = JSON.parse(sessionStorage.getItem("userDetails"));
    // formData.append("event_date", `432424 to 324324}`); //static
    // formData.append(
    //   "venue_start",
    //   eventDetails.eventDate?.format("YYYY-MM-DD")
    // );

    formData.append("event_start_date", startDate);
    formData.append("event_end_date", endDate);
    formData.append("event_name", eventDetails.eventName);
    formData.append("number_of_days", numberOfDays);
    const orderedDate = moment().utc().format("YYYY-MM-DD");

    const eventDate = `${moment(startDate).format("YYYY-MM-DD")} to ${moment(
      endDate
    ).format("YYYY-MM-DD")}`;
    formData.append("booking_from", "Website"),
      formData.append("ordered_date", orderedDate);
    formData.append("event_date", eventDate);
    formData.append("upload_invitation", eventDetails.upload_invitation);

    formData.append("upload_gatepass", eventDetails.upload_gatepass);

    formData.append("receiver_name", eventDetails.receiverName);
    formData.append("receiver_mobilenumber", eventDetails.receiverMobile);
    formData.append("product_data", JSON.stringify(productData));
    formData.append("service_data", JSON.stringify(servicesData));
    formData.append("tech_data", JSON.stringify(techniciansData));
    formData.append("user_id", userData._id);
    formData.append("user_name", userData.username);
    formData.append("user_mailid", userData.email);
    formData.append("venue_name", eventDetails.eventVenue);
    formData.append(
      "venue_open_time",
      eventDetails.startTime?.format("hh:mm A")
    );
    formData.append("event_location", addLocation.address);
    formData.append("location_lat", addLocation.lat);
    formData.append("location_long", addLocation.lng);

    formData.append(
      "event_start_time",
      eventDetails.startTime?.format("hh:mm A")
    );
    formData.append("event_end_time", eventDetails.endTime?.format("hh:mm A"));
    formData.append("venue_start_time", eventDetails.venueStartTime?.format("hh:mm A"));
    formData.append("venue_end_time", eventDetails.venueEndTime?.format("hh:mm A"));
    formData.append(
      "cart_total",
      cartItems.reduce(
        (total, item) =>
          total + (item.product_price || 0) * (item.quantity || 1),
        0
      )
    );
    formData.append("base_amount", billingDetails?.baseAmount);
    formData.append("gst_applied_value", "15120");
    formData.append("tds_deduction", billingDetails.tdsCharges);
    formData.append("amount_after_deduction", billingDetails.amountAfterTds);
    formData.append("paid_amount", billingDetails.grandTotal);
    formData.append("payment_method", "offline"); //Need to change once I get api
    formData.append("order_status", "Order Placed"); //Need to change once I get api
    formData.append("payment_status", "success"); //Need to change once I get api
    formData.append("vendors_message", "Test");

    try {
      // const response = await authService.createOrder(formData);
      const response = await axios.post(
        `${config.BASEURL}${config.CREATE_ORDER}`,
        formData,
        {
          headers: {
            content: "multipart/form-data",
          },
        }
      );
      setEventDetails({
        eventDate: null,
        startTime: null,
        endTime: null,
        eventName: "",
        eventVenue: "",
        receiverName: "",
        receiverMobile: "",
        address: null,
        upload_invitation: "",
        upload_gatepass: "",
      });
      setOpenModal(true);
      setModalMessage("Order Created Successfully");
      setModalType("success");
      setIsOrderSummaryOpen(false);
      handleClearAll();
    } catch (error) {
      setOpenModal(true);
      setModalMessage("Order failed");
      setModalType("failure");
      setIsOrderSummaryOpen(false);
      console.error(
        "Error creating order:",
        error.response?.data || error.message
      );
    }
    handleClearAll();
  };

  const handleModalClose = () => {
    setIsOrderSummaryOpen(false);
  };
  useEffect(() => {
    const isValid =
      eventDetails.startTime &&
      eventDetails.endTime &&
      eventDetails.eventName.trim() &&
      eventDetails.eventVenue.trim() &&
      eventDetails.receiverName.trim() &&
      eventDetails.receiverMobile.trim() &&
      addLocation?.address; // Ensure address is selected
  
    setIsCheckoutAllowed(isValid);
  }, [eventDetails, addLocation]); // Re-run when eventDetails or location changes
  
  const handleCheckout = async () => {
    // if (
    //   !eventDetails.startTime ||
    //   !eventDetails.endTime ||
    //   !eventDetails.eventName.trim() ||
    //   !eventDetails.eventVenue.trim() ||
    //   !eventDetails.receiverName.trim() ||
    //   !eventDetails.receiverMobile.trim()
    // ) {
    //   setSnackbarOpen(true);
    //   return;
    // }
    setIsOrderSummaryOpen(true);
  };
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const locationData = await getCurrentCity();
        // setCityData(locationData);
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
            sx={{ mb: 3, fontSize: '1rem' }}
          >
            Event Details
          </Typography>

          <Grid container spacing={2}>
            <Grid
              item
              xs={10}

              sx={{ display: "flex", gap: "1rem", marginBottom: "1rem", fontSize: '1rem' }}
            >
              <TextField
                label="Start Date"
                value={formatedStartDate}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                    color: '#c026d3',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.8rem',
                    padding: '16px 18px',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#c026d3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#c026d3',
                    },
                    '& input': {
                      color: 'black',
                    },
                  },
                }}
              />

              <TextField
                label="End Date"
                value={formatedEndDate}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                    color: '#c026d3',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.8rem',
                    padding: '16px 18px',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#c026d3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#c026d3',
                    },
                    '& input': {
                      color: 'black', // Input text color
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label={<Typography
                  component="span"
                  sx={{ color: '#c026d3', fontSize: '0.8rem' }}
                >
                  Venue Start Time <span style={{ color: 'red' }}>*</span>
                </Typography>}
                value={eventDetails.venueStartTime}
                onChange={(newTime) => handleTimeChange("venueStartTime", newTime)}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                renderInput={(params) => <TextField {...params} fullWidth

                />}
                InputLabelProps={{
                  style: { color: '#c026d3' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#c026d3', // Default border color
                    },

                    '&.Mui-focused fieldset': {
                      borderColor: '#c026d3', // Border color when focused
                    },
                    '& input': {
                      color: 'black', // Input text color
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label={<Typography
                  component="span"
                  sx={{ color: '#c026d3', fontSize: '0.8rem' }}
                >
                  Venue End Time <span style={{ color: 'red' }}>*</span>
                </Typography>}
                value={eventDetails.venueEndTime}
                onChange={(newTime) => handleTimeChange("venueEndTime", newTime)}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
                InputLabelProps={{
                  style: { color: '#c026d3' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#c026d3', // Default border color
                    },

                    '&.Mui-focused fieldset': {
                      borderColor: '#c026d3', // Border color when focused
                    },
                    '& input': {
                      color: 'black', // Input text color
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TimePicker
                label={<Typography
                  component="span"
                  sx={{ color: '#c026d3', fontSize: '0.8rem' }}
                >
                  Event Start Time <span style={{ color: 'red' }}>*</span>
                </Typography>}
                value={eventDetails.startTime}
                onChange={(newTime) => handleTimeChange("startTime", newTime)}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
                InputLabelProps={{
                  style: { color: '#c026d3' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#c026d3', // Default border color
                    },

                    '&.Mui-focused fieldset': {
                      borderColor: '#c026d3', // Border color when focused
                    },
                    '& input': {
                      color: 'black', // Input text color
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label={<Typography
                  component="span"
                  sx={{ color: '#c026d3', fontSize: '0.8rem' }}
                >
                  Event End Time <span style={{ color: 'red' }}>*</span>
                </Typography>}
                value={eventDetails.endTime}
                onChange={(newTime) => handleTimeChange("endTime", newTime)}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
                InputLabelProps={{
                  style: { color: '#c026d3' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#c026d3', // Default border color
                    },

                    '&.Mui-focused fieldset': {
                      borderColor: '#c026d3', // Border color when focused
                    },
                    '& input': {
                      color: 'black', // Input text color
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={<Typography
                  component="span"
                  sx={{ color: '#c026d3', fontSize: '0.8rem' }}
                >
                  Event Name <span style={{ color: 'red' }}>*</span>
                </Typography>}
                name="eventName"
                value={eventDetails.eventName}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  style: { color: '#c026d3' }
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                    color: '#c026d3',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.8rem',
                    padding: '16px 18px',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#c026d3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#c026d3',
                    },
                    '& input': {
                      color: 'black', // Input text color
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={<Typography
                  component="span"
                  sx={{ color: '#c026d3', fontSize: '0.8rem' }}
                >
                  Event Venue Name <span style={{ color: 'red' }}>*</span>
                </Typography>}
                name="eventVenue"
                value={eventDetails.eventVenue}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  style: { color: '#c026d3' }, // Red label color

                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                    color: '#c026d3',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.8rem',
                    padding: '16px 18px',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#c026d3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#c026d3',
                    },
                    '& input': {
                      color: 'black', // Input text color
                    },
                  },
                }}

              />
            </Grid>
            <Box sx={{display:"flex", flexDirection:'column',alignItems:'center', justifyContent:'center', marginTop:'1rem'}}>
            <Typography>{addLocation  ? `${addLocation.address}` : ""}</Typography>
            <Button
              sx={{
                width: "33.7rem",
                marginTop: "2rem",
                marginLeft: "1rem",
                border: "1px solid #9c27b0",
                color: 'green'
              }}
              onClick={() => setOpenLocation(!openLocation)}
            >
             Select Address
              <Typography
                variant="button"
                sx={{ color: 'red', marginLeft: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}
              >
                *
              </Typography>
            </Button>
               
            </Box>
            <Grid item xs={6}>
              <TextField
                label={<Typography
                  component="span"
                  sx={{ color: '#c026d3', fontSize: '0.8rem' }}
                >
                  Receiver Name <span style={{ color: 'red' }}>*</span>
                </Typography>}
                name="receiverName"
                value={eventDetails?.receiverName}
                onChange={handleChange}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                    color: '#c026d3',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.8rem',
                    padding: '16px 18px',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#c026d3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#c026d3',
                    },
                    '& input': {
                      color: 'black', 
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={<Typography
                  component="span"
                  sx={{ color: '#c026d3', fontSize: '0.8rem' }}
                >
                  Receiver Mobile <span style={{ color: 'red' }}>*</span>
                </Typography>}
                name="receiverMobile"
                value={eventDetails?.receiverMobile}
                onChange={handleChange}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                    color: '#c026d3',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.8rem',
                    padding: '16px 18px',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#c026d3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#c026d3',
                    },
                    '& input': {
                      color: 'black',
                    },
                  },
                }}
              />
            </Grid>



            <Grid item xs={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ border: '1px solid #9c27b0', color: '#9c27b0' }}
              // startIcon={<UploadFileIcon />}
              >
                Upload Invitation
                <input
                  type="file"
                  name="upload_invitation"
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
              {eventDetails.upload_invitation.name && (
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
                sx={{ border: '1px solid #9c27b0', color: '#9c27b0' }}
              // startIcon={<UploadFileIcon />}
              >
                Upload Gate Pass
                <input
                  type="file"
                  name="upload_gatepass"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {eventDetails.upload_gatepass.name && (
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
            {isCheckoutAllowed ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleCheckout}
                sx={{ width: "100%", py: 1.5 }}
              >
                Checkout
              </Button>
            ) : (
              <Box mt={4} textAlign="center">
                {/* 🔹 Informational Message */}
                <Typography
                  variant="body2"
                  sx={{
                    color: "#555",
                    fontSize: "0.9rem",
                    marginBottom: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {/* ⚠️ Before proceeding to place your order, you need to accept
                  the Terms & Conditions. */}

                  {/* TERMS AND CONDITIONS  */}

                  <Terms onContinue={handleAcceptTerms} />
                </Typography>
                {/* <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleProceedToTerms}
                  sx={{ width: "100%", py: 1.5 }}
                >
                  Accept Terms
                </Button> */}
              </Box>
            )}
          </Box>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity="error">Please fill in all mandatory fields!</Alert>
        </Snackbar>


        <Modal
          open={isOrderSummaryOpen}
          onClose={handleModalClose}
          aria-labelledby="order-summary-title"
          aria-describedby="order-summary-description"
        >
          <OrderSummery
            cartItems={cartItems}
            technicianItems={technicianItems}
            servicesItem={servicesItem}
            billingDetails={billingDetails}
            startDate={formatedStartDate}
            endDate={formatedEndDate}
            eventName={eventDetails?.eventName}
            venueName={eventDetails?.eventVenue}
            startTime={eventDetails.startTime ? eventDetails.startTime.format('HH:mm') : ''}
            endTime={eventDetails.endTime ? eventDetails.endTime.format('HH:mm') : ''}
            location={addLocation.address}
            receiverName={eventDetails?.receiverName}
            receiverMobile={eventDetails?.receiverMobile}
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

<Typography></Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
             {currentLocation ? currentLocation.city : 'Select Location '}
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
