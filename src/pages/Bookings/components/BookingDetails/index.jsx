// React related imports
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// Third Party Library
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

// assests
import TechnicianImg from "../../../../assets/profileImg1.jpg";

// Custom Components
import authService from "../../../../api/ApiService";
import { setLoading } from "../../../../redux/slice/LoaderSlice";
import {
  formatCurrencyIntl,
  getErrorMessage,
  formatDate,
  formatProperDate,
} from "../../../../utils/helperFunc";
import Banner from "./component/Banner";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";

// styles
import "./styles.scss";
import Invoice from "./component/Invoice";
import { config } from "../../../../api/config";
import axios from "axios";
import RescheduleModal from "./component/RescheduleModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [booking, setBooking] = useState(null);
  const [items, setItems] = useState([]);
  const [eventStatus, setEventStatus] = useState("Upcoming Event");
  const [loading, setLoadingState] = useState(true);
  const [open, setOpen] = useState(false);
  const [openReschedule, setOpenReschedule] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [reason, setReason] = useState("");
  const [days, setDays] = useState(0);
  const [formData, setFormData] = useState({
    receiver_mobilenumber: "",
    receiver_name: "",
    event_location: "",
    location_lat: "",
    lacation_long: "",
    venue_open_time: "",
    event_start_time: "",
    event_end_time: "",
    event_name: "",
    event_date: "",
    event_start_date: "",
    event_end_date: "",
    reschedule_remark: "",
    upload_gatepass: "",
    upload_invitation: "",
    order_status: "Order Rescheduled",
    rescheduled_date: "",
  });
const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleOpenReschedule = () => setOpenReschedule(true);
  const handleCloseReschedule = () => setOpenReschedule(false);

  useEffect(() => {
    const getBookingDetails = async () => {
      try {
        dispatch(setLoading(true));
        const res = await authService.getOrder(id);
        const order = res.data.orderId;
        setBooking(order);
        console.log("The check order", order);
        setDays(order.number_of_days);
        setProducts(order?.product_data || []);
        setServices(order?.service_data || []);
        setTechnicians(order?.tech_data || []);
        const combinedItems = [
          ...(order?.product_data || [])?.map((item) => ({
            id: item?.id || item._id,
            image:
              item?.imageUrl ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEbmNxhl6aFUDwBtyelBzun4EnBJLblVb56w&s",
            name: item?.productName || item.product_name || "N/A",
            dimension: item?.productDimension || "N/A",
            price: item?.productPrice || item.product_price || 0,
            quantity: item?.quantity || 1,
          })),
          ...(order?.service_data || [])?.map((item) => ({
            id: item?.id || item?._id,
            image: item?.imageUrl || "",
            name: item?.service_name || "N/A",
            dimension: "—",
            price: item?.service_price || 0,
            quantity: item?.quantity || 1,
          })),
          ...(order?.tech_data || []).map((item) => ({
            id: item?.id || item._id,
            image: item?.imageUrl || TechnicianImg,
            name: item?.service_name || "N/A",
            category: item?.video,
            price: item?.price || 0,
            quantity: item?.quantity || 1,
          })),
        ];
        setItems(combinedItems);

        setLoadingState(false);
        dispatch(setLoading(false));
      } catch (error) {
        setLoadingState(false);
        dispatch(setLoading(false));
        getErrorMessage(error);
      }
    };
    getBookingDetails();
  }, [id, dispatch]);

  useEffect(() => {
    if (booking && booking.event_date) {
      calculateEventStatus(booking.event_date);
    }

    // if (booking) {
    //   calculateEventStatus(booking.event_date, booking.event_start_time);

    //   setFormData({
    //     receiver_mobilenumber: booking.receiver_mobilenumber || "",
    //     receiver_name: booking.receiver_name || "",
    //     event_location: booking.event_location || "",
    //     location_lat: "434343" || "",
    //     location_long: "34533" || "",
    //     venue_open_time: booking.venue_open_time || "",
    //     event_start_time: booking.event_start_time || "",
    //     event_end_time: booking.event_end_time || "",
    //     event_name: booking.event_name || "",
    //     event_date: booking.event_date || "",
    //     event_start_date: booking.event_start_date || "",
    //     event_end_date: booking.event_end_date || "",
    //     reschedule_remark: booking.reschedule_remark || "",
    //     upload_gatepass: booking.upload_gatepass || null,
    //     upload_invitation: booking.upload_invitation || null,
    //     order_status: "Order Rescheduled" || "",
    //     rescheduled_date: booking.rescheduled_date || "",
    //   });
    // }
  }, [booking]);
  const numberOfDays = booking?.number_of_days || 1;

  const subTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity * numberOfDays,
    0
  );
  const baseAmount = booking?.base_amount;
  const tdsCharges = booking?.tds_deduction;
  const amountAfterDeduction = baseAmount - tdsCharges;

  const cgst = booking?.gst_applied_value ? booking.gst_applied_value / 2 : 0;
  const sgst = booking?.gst_applied_value ? booking.gst_applied_value / 2 : 0;
  const grandTotal = booking?.paid_amount;

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="body1">Loading booking details...</Typography>
      </Box>
    );
  }
  const calculateEventStatus = (
    eventDateRange,
    eventStartTime = "12:00:00"
  ) => {
    const currentDate = new Date();

    // Split eventDateRange into start and end dates
    const [startDateStr, endDateStr] = eventDateRange.split(" to ");

    // Convert the start and end dates to Date objects
    const eventStartDate = new Date(`${startDateStr.trim()}T${eventStartTime}`);
    const eventEndDate = new Date(`${endDateStr.trim()}T23:59:59`);

    // Calculate time difference in HOURS
    const diffToStart = Math.floor(
      (eventStartDate - currentDate) / (1000 * 60 * 60)
    );
    const diffToEnd = Math.floor(
      (eventEndDate - currentDate) / (1000 * 60 * 60)
    );

    console.log("Hours Until Start:", diffToStart);
    console.log("Hours Until End:", diffToEnd);

    // Determine event status
    if (diffToEnd < 0) {
      setEventStatus("Event Completed");
    } else if (diffToStart > 24) {
      setEventStatus("Cancel Event"); // More than 24 hours left
    } else if (diffToStart > 0 && diffToStart <= 24) {
      setEventStatus("Reschedule"); // Event is within 24 hours
    } else if (diffToStart <= 0 && diffToEnd > 0) {
      setEventStatus("Event Started"); // Event is happening now
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsChecked(false);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const getFormattedCancellationDate = () => {
    const options = {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return new Date().toLocaleString("en-US", options);
  };

  const handleStatus = async (eventStatus) => {
    try {
      const payload = {
        cancel_reason: reason,
        cancelled_date: getFormattedCancellationDate(),
      };

      const res = await authService.cancelOrder(booking._id, payload);
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const handleRescheduleOrder = async () => {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        if (key === "upload_gatepass" || key === "upload_invitation") {
          // Check if a file is selected before appending
          if (formData[key] instanceof File) {
            formDataToSend.append(key, formData[key]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    });

    try {
      const res = await axios.put(
        `${config.BASEURL}/user-order/reschedule-order/${booking._id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // const res = await authService.rescheduleOrder(booking._id, formDataToSend, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      toast.success("Item is Rescheduled!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      window.location.reload();
      handleClose();
      handleCloseReschedule();
    } catch (error) {
      console.error("Error in rescheduling the event:", error);
    }
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    let startX = 15;
    let currentY = 20;

    doc.setFont(undefined, "bold");
    doc.text("KADAGAM VENTURES PRIVATE LIMITED", startX, currentY);
    doc.setFont(undefined, "normal");
    currentY += 5;
    doc.text("#345 3rd Vishwapriya Road,", startX, currentY);
    currentY += 5;
    doc.text("Bengaluru, Karnataka 560068, India", startX, currentY);
    currentY += 5;
    doc.text("GST: 29AABCK9472B1ZW", startX, currentY); // Example GST
    currentY += 5;
    doc.text("SACCODE: 998597", startX, currentY);
    currentY += 7;

    // Add phone & user details
    doc.setFont(undefined, "bold");
    doc.text(
      `Phone: ${booking.receiver_mobilenumber || "N/A"}`,
      startX,
      currentY
    );
    currentY += 5;
    doc.setFont(undefined, "normal");
    doc.text(`GST: ${booking.gst_number || "NA"}`, startX, currentY);
    currentY += 5;
    doc.text(
      booking.event_location ? booking.event_location : "No address provided",
      startX,
      currentY
    );
    currentY += 5;

    let infoBoxX = 120;
    let infoBoxY = 20;
    let infoBoxWidth = 75;
    let infoBoxHeight = 50;
    doc.rect(infoBoxX, infoBoxY, infoBoxWidth, infoBoxHeight);

    let infoTextX = infoBoxX + 6;
    let infoTextY = infoBoxY + 5;

    const invoiceDetails = [
      { label: "Invoice #", value: "INV77KS19" },
      { label: "Event Name", value: booking.event_name || "N/A" },
      { label: "Ordered Date", value: formatDate(booking.ordered_date) || "-" },
      { label: "Venue Name", value: booking.venue_name || "-" },
      // { label: "Venue Location", value: booking.event_location || "-" },
      {
        label: "Venue Available Time",
        value: booking.venue_open_time || "00:00",
      },
      {
        label: "Event Date/Time",
        value:
          formatDate(booking.event_start_date) +
          " " +
          (booking.event_start_time || ""),
      },
      { label: "No of Days", value: String(numberOfDays) },
    ];

    doc.setFontSize(9);
    invoiceDetails.forEach((item, idx) => {
      doc.setFont(undefined, "bold");
      doc.text(`${item.label}`, infoTextX, infoTextY);
      doc.setFont(undefined, "normal");
      doc.text(item.value, infoTextX + 40, infoTextY);
      infoTextY += 5;
    });

    let tableStartY = infoBoxY + infoBoxHeight + 15;
    const columns = [
      { header: "Product", dataKey: "name" },
      { header: "Size", dataKey: "dimension" },
      { header: "Qty", dataKey: "quantity" },
      { header: "Price", dataKey: "price" },
      { header: "Days", dataKey: "days" },
      { header: "Amount", dataKey: "amount" },
    ];
    const rows = items.map((item) => {
      const amount = item.price * item.quantity * numberOfDays;
      return {
        name: item.name,
        dimension: item.dimension,
        quantity: item.quantity,
        price: item.price,
        days: String(numberOfDays),
        amount: amount,
      };
    });

    doc.autoTable({
      startY: tableStartY,
      theme: "grid",
      head: [columns.map((col) => col.header)],
      body: rows.map((r) => columns.map((col) => r[col.dataKey])),
      headStyles: {
        fillColor: [255, 255, 0],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
      },
      margin: { left: 15 },
      tableWidth: 180,
    });

    let finalY = doc.lastAutoTable.finalY + 5;

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text("Sub Total", 125, finalY);
    doc.setFont(undefined, "normal");
    doc.text(formatCurrencyIntl(subTotal), 170, finalY, { align: "right" });
    finalY += 5;

    doc.setFont(undefined, "bold");
    doc.text("CGST(9%)", 125, finalY);
    doc.setFont(undefined, "normal");
    doc.text(formatCurrencyIntl(cgst), 170, finalY, { align: "right" });
    finalY += 5;

    doc.setFont(undefined, "bold");
    doc.text("SGST(9%)", 125, finalY);
    doc.setFont(undefined, "normal");
    doc.text(formatCurrencyIntl(sgst), 170, finalY, { align: "right" });
    finalY += 5;

    doc.setFont(undefined, "bold");
    doc.text("Grand Total", 125, finalY);
    doc.setFont(undefined, "normal");
    doc.text(formatCurrencyIntl(grandTotal), 170, finalY, { align: "right" });
    finalY += 10;

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text("Terms & Condition", 15, finalY);
    finalY += 5;

    doc.setFont(undefined, "normal");
    const terms = [
      "Payment Terms: Payment is due [e.g., upon receipt].",
      "Reservation & Deposit: A 100% deposit is required.",
      "Cancellation Policy: Cancellations must be made at least 2 days in advance.",
      "Rental Period: The rental period starts from event start time.",
      "Delivery & Pickup: Additional fee may apply.",
      "Condition of Equipment: Returned in original condition.",
      "Liability: The customer agrees to assume all liability.",
    ];

    terms.forEach((line, index) => {
      doc.text(`${index + 1}. ${line}`, 15, finalY);
      finalY += 5;
    });

    doc.save("invoice.pdf");
  };

  if (!booking) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
        No booking data found.
      </Typography>
    );
  }

  const getChipColor = (eventStatus) => {
    switch (eventStatus) {
      case "Cancel Event":
        return "#f44336";
      case "Reschedule":
        return "#ff9800";
      case "Event Started":
        return "#FFA500";
      case "Event Completed":
        return "#4caf50";
      default:
        return "#9e9e9e";
    }
  };
  const handleRaiseTicket = () => {
    navigate(`/raise-ticket/${id}`);
  };

  return (
    <Box sx={{ p: 2, maxWidth: "1200px", margin: "auto" }}>
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Box sx={{display:'flex', alignItems:'center',justifyContent:'space-between'}}>
              {eventStatus === "Cancel Event" &&
              booking.order_status !== "Order Cancelled" &&
              booking.order_status !== "Order Rescheduled" ? (
                <Button
                  variant="contained"
                  onClick={handleOpen}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    mb: 2,
                    color: "#fff",
                    backgroundColor: "#f44336", 
                    "&:hover": {
                      backgroundColor: "#d32f2f",
                      opacity: 0.9,
                    },
                  }}
                >
                  Cancel Event
                </Button>
              ) : eventStatus === "Reschedule" &&
                booking.order_status !== "Order Cancelled" &&
                booking.order_status !== "Order Rescheduled" ? (
                <Button
                  variant="contained"
                  onClick={handleOpenReschedule}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    mb: 2,
                    color: "#fff",
                    backgroundColor: "#ff9800",
                    "&:hover": {
                      backgroundColor: "#e68a00",
                      opacity: 0.9,
                    },
                  }}
                >
                  Reschedule Event
                </Button>
              ) : (
                <Chip
                  label={
                    booking.order_status === "Order Cancelled"
                      ? "Event Cancelled"
                      : booking.order_status === "Order Rescheduled"
                      ? "Order Rescheduled"
                      : eventStatus
                  }
                  sx={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    mb: 2,
                    color: "#fff",
                    backgroundColor:
                      booking.order_status === "Order Cancelled"
                        ? "#f44336"
                        : booking.order_status === "Order Rescheduled"
                        ? "#ff9800"
                        : "#9e9e9e",
                  }}
                />
              )}
              <Box>

              <Button variant="contained" sx={{backgroundColor:'#c026d3', borderRadius:'20px'}} onClick={handleRaiseTicket}>Raise Ticket</Button>
              </Box>
            </Box>

            {/* <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                {eventStatus === "Cancel Event" &&
                booking.order_status !== "Order Cancelled" &&
                booking.order_status !== "Order Rescheduled" && (
                  <Button
                    variant="contained"
                    onClick={handleOpen}
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      mb: 2,
                      color: "#fff",
                      backgroundColor: getChipColor(eventStatus),
                      "&:hover": {
                        backgroundColor: getChipColor(eventStatus),
                        opacity: 0.9,
                      },
                    }}
                  >
                   {"Cancel Event"}
                  </Button>
                ) }
              </Box>
            </Box>
            <Box>
              {eventStatus === "Order Reschedule" ? (
                <Button
                  variant="contained"
                  onClick={handleOpenReschedule}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    mb: 2,
                    color: "#fff",
                    backgroundColor: "#ff9800",
                  }}
                >
                  Reschedule
                </Button>
              ) : (
                <Chip
                  label={
                    booking.order_status === "Order Rescheduled"
                      ? "Order Rescheduled"
                      : eventStatus
                  }
                  sx={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    mb: 2,
                    color: "#fff",
                    backgroundColor: getChipColor(eventStatus),
                  }}
                />
              )}
            </Box> */}
            {/* {items.map((item) => {
              const amount = item.price * item.quantity * numberOfDays;
              return (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #ccc",
                    py: 1,
                  }}
                >
                  <Box sx={{ display: "flex", gap: "1.4rem" }}>
                    <Box>
                      <img
                        src={item.image}
                        style={{ width: "60px", borderRadius: "10px" }}
                        alt="Not found"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2">
                        <strong>Product:</strong> {item.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Size:</strong> {item.dimension}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Qty:</strong> {item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Box textAlign="right">
                      <Typography variant="body2">
                        <strong>Price:</strong> {formatCurrencyIntl(item.price)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Days:</strong> {numberOfDays}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Amount:</strong> {formatCurrencyIntl(amount)}
                      </Typography>
                    </Box>

                    <Box></Box>
                  </Box>
                </Box>
              );
            })} */}

            <Box sx={{ p: 2, maxWidth: "1200px", margin: "auto" }}>
              <Grid container spacing={2}>
                {/* Products Section */}
                <Grid item xs={12}>
                  {products.length > 0 &&
                    products.map((item) => (
                      <Paper variant="outlined" sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: "bold" }}
                          >
                            Products
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: "0.5rem",
                            }}
                          >
                            <IconButton
                              href={`https://wa.me/${9773828339}`}
                              target="_blank"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                              }}
                            >
                              <WhatsAppIcon
                                sx={{ color: "#25D366", fontSize: "1.5rem" }}
                              />
                              <Typography
                                variant="p"
                                sx={{ fontSize: "0.7rem" }}
                              >
                                Whatsapp
                              </Typography>
                            </IconButton>
                            <IconButton
                              href={`tel:${87328228}`}
                              target="_blank"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                              }}
                            >
                              <PhoneIcon
                                sx={{ color: "#c026d3", fontSize: "1.5rem" }}
                              />
                              <Typography
                                variant="p"
                                sx={{ fontSize: "0.7rem" }}
                              >
                                Call Now
                              </Typography>
                            </IconButton>
                          </Box>
                        </Box>

                        <Box
                          key={item.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #ccc",
                            py: 1,
                          }}
                        >
                          <Box sx={{ display: "flex", gap: "1.4rem" }}>
                            <Box>
                              <img
                                src={item.imageUrl}
                                style={{
                                  width: "60px",
                                  borderRadius: "10px",
                                }}
                                alt="Not found"
                              />
                            </Box>
                            <Box>
                              <Typography variant="body2">
                                <strong>Product:</strong> {item.productName}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Size:</strong> {item.productDimension}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Qty:</strong> {item.quantity}
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            <Box textAlign="right">
                              <Typography variant="body2">
                                <strong>Price:</strong>{" "}
                                {formatCurrencyIntl(item.productPrice)}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Days:</strong> {numberOfDays}
                              </Typography>
                              {/* <Typography variant="body2">
                        <strong>Amount:</strong> {formatCurrencyIntl(amount)}
                      </Typography> */}
                            </Box>

                            <Box></Box>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                </Grid>

                {/* Services Section */}
                <Grid item xs={12}>
                  {services.length > 0 &&
                    services.map((item) => (
                      <Paper variant="outlined" sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: "bold" }}
                          >
                            Services
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: "0.5rem",
                            }}
                          >
                            <IconButton
                              href={`https://wa.me/${9773828339}`}
                              target="_blank"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                              }}
                            >
                              <WhatsAppIcon
                                sx={{ color: "#25D366", fontSize: "1.5rem" }}
                              />
                              <Typography
                                variant="p"
                                sx={{ fontSize: "0.7rem" }}
                              >
                                Whatsapp
                              </Typography>
                            </IconButton>
                            <IconButton
                              href={`tel:${87328228}`}
                              target="_blank"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                              }}
                            >
                              <PhoneIcon
                                sx={{ color: "#c026d3", fontSize: "1.5rem" }}
                              />
                              <Typography
                                variant="p"
                                sx={{ fontSize: "0.7rem" }}
                              >
                                Call Now
                              </Typography>
                            </IconButton>
                          </Box>
                        </Box>
                        <Box
                          key={item.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #ccc",
                            py: 1,
                          }}
                        >
                          <Box sx={{ display: "flex", gap: "1.4rem" }}>
                            <Box>
                              <img
                                src={item.imageUrl}
                                style={{
                                  width: "60px",
                                  borderRadius: "10px",
                                }}
                                alt="Not found"
                              />
                            </Box>
                            <Box>
                              <Typography variant="body2">
                                <strong>Product:</strong> {item.productName}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Qty:</strong> {item.quantity}
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            <Box textAlign="right">
                              <Typography variant="body2">
                                <strong>Price:</strong>{" "}
                                {formatCurrencyIntl(item.productPrice)}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Days:</strong> {numberOfDays}
                              </Typography>
                              {/* <Typography variant="body2">
               <strong>Amount:</strong> {formatCurrencyIntl(amount)}
             </Typography> */}
                            </Box>

                            <Box></Box>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                </Grid>

                {/* Technicians Section */}
                <Grid item xs={12}>
                  {technicians.length > 0 &&
                    technicians.map((item) => (
                      <Paper variant="outlined" sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: "bold" }}
                          >
                            Technicians
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: "0.5rem",
                            }}
                          >
                            <IconButton
                              href={`https://wa.me/${9773828339}`}
                              target="_blank"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                              }}
                            >
                              <WhatsAppIcon
                                sx={{ color: "#25D366", fontSize: "1.5rem" }}
                              />
                              <Typography
                                variant="p"
                                sx={{ fontSize: "0.7rem" }}
                              >
                                Whatsapp
                              </Typography>
                            </IconButton>
                            <IconButton
                              href={`tel:${87328228}`}
                              target="_blank"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                              }}
                            >
                              <PhoneIcon
                                sx={{ color: "#c026d3", fontSize: "1.5rem" }}
                              />
                              <Typography
                                variant="p"
                                sx={{ fontSize: "0.7rem" }}
                              >
                                Call Now
                              </Typography>
                            </IconButton>
                          </Box>
                        </Box>
                        <Box
                          key={item.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #ccc",
                            py: 1,
                          }}
                        >
                          <Box sx={{ display: "flex", gap: "1.4rem" }}>
                            <Box>
                              <img
                                src={item.imageUrl || TechnicianImg}
                                style={{
                                  width: "60px",
                                  borderRadius: "10px",
                                }}
                                alt="Not found"
                              />
                            </Box>
                            <Box>
                              <Typography variant="body2">
                                <strong>Product:</strong> {item.service_name}
                              </Typography>
                              {/* <Typography variant="body2">
               <strong>Size:</strong> {item.productDimension}
             </Typography> */}
                              <Typography variant="body2">
                                <strong>Qty:</strong> {item.quantity}
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            <Box textAlign="right">
                              <Typography variant="body2">
                                <strong>Price:</strong>{" "}
                                {formatCurrencyIntl(item.price)}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Days:</strong> {numberOfDays}
                              </Typography>
                              {/* <Typography variant="body2">
               <strong>Amount:</strong> {formatCurrencyIntl(amount)}
             </Typography> */}
                            </Box>

                            <Box></Box>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* <Paper
            variant="outlined"
            sx={{ p: 2, mb: 2, backgroundColor: "#fff3cd" }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: "#856404" }}>
              Important Information
            </Typography>
            <Typography variant="body2">
              1. Payment is due upon receipt.
            </Typography>
            <Typography variant="body2">
              2. A 100% deposit is required to secure your reservation.
            </Typography>
            <Typography variant="body2">
              3. Cancellations must be made at least 2 days in advance.
            </Typography>
          </Paper> */}
        </Grid>

        <Grid item xs={4}>
          <Paper variant="outlined" sx={{ mb: 2, p: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
              Payment Summary
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "200px",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Total</Typography>
                <Typography variant="body2">{booking?.cart_total}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Event Days</Typography>
                <Typography variant="body2">{numberOfDays}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Base Amount</Typography>
                <Typography variant="body2">
                  {formatCurrencyIntl(baseAmount)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">TDS Charges (2%)</Typography>
                <Typography variant="body2">{tdsCharges}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Amount After Deductions</Typography>
                <Typography variant="body2">{amountAfterDeduction}</Typography>
              </Box>

              {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">CGST (9%)</Typography>
                <Typography variant="body2">
                  {formatCurrencyIntl(cgst)}
                </Typography>
              </Box> */}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">GST (18%)</Typography>
                <Typography variant="body2">
                  {Math.floor(amountAfterDeduction * 0.18)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Bill Total
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {formatCurrencyIntl(grandTotal)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Banner />
      <Paper
        variant="outlined"
        sx={{ p: 2, mb: 2, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
          Order Details
        </Typography>
        <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
          <strong>Order Id:</strong> {`INV${booking._id.slice(-6)}`}
        </Typography>
        <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
          <strong>Event Name</strong> {booking.event_name || "N/A"}
        </Typography>
        <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
          <strong>Payment:</strong> {booking.payment_method || "N/A"}
        </Typography>
        <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
          <strong>Event Location:</strong> {booking.event_location || "N/A"}
        </Typography>
        <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
          <strong>Event Start Date:</strong>{" "}
          {formatProperDate(booking.event_start_date)}{" "}
        </Typography>
        <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
          <strong>Event End Date:</strong>{" "}
          {formatProperDate(booking.event_end_date)}{" "}
        </Typography>
        <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
          <strong>Event Time:</strong>
          {booking.event_start_time} - {booking.event_end_time}
        </Typography>
        <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
          <strong>Contact:</strong> {booking.receiver_mobilenumber || "N/A"}
        </Typography>
        <Typography
          variant="p"
          sx={{
            mb: 1,
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <strong>Invitation Pass:</strong>
          {booking.upload_gatepass ? (
            <img
              src={booking.upload_gatepass}
              style={{ width: "160px" }}
              alt="Not found"
            />
          ) : (
            "N/A"
          )}
        </Typography>{" "}
        <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
          <strong>Gate Pass:</strong>{" "}
          {booking.upload_inivitaion ? (
            <img src={booking.upload_inivitaion} alt="Not found" />
          ) : (
            "N/A"
          )}
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#c026d3",
            color: "#fff",
            mt: 2,
            width: "22rem",
          }}
          onClick={downloadInvoice}
        >
          Download Invoice
        </Button>
      </Paper>
      {/* <Invoice bookings={booking} items={items}/> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="cancellation-policy-title"
        aria-describedby="cancellation-policy-description"
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
            borderRadius: "8px",
          }}
        >
          <Typography
            id="cancellation-policy-title"
            variant="h6"
            sx={{ mb: 2 }}
          >
            Cancellation & Reschedule Policy
          </Typography>

          <Typography sx={{ mb: 2 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            vestibulum interdum dolor, sed dapibus ligula ultricies non.
          </Typography>

          <TextField
            fullWidth
            label="Reason for Cancellation"
            variant="outlined"
            value={reason}
            onChange={handleReasonChange}
            required
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                onChange={handleCheckboxChange}
                name="policyCheck"
              />
            }
            label="I agree to the cancellation/reschedule policy"
          />

          {/* Cancel Event Button */}
          {eventStatus === "Cancel Event" && (
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleStatus(eventStatus);
                handleClose();
              }}
              disabled={!isChecked}
              sx={{ mt: 2, mr: 2 }}
            >
              Cancel Event
            </Button>
          )}

          {/* Reschedule Button - Only visible if eventStatus is "Reschedule" */}
          {eventStatus === "Reschedule" && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleRescheduleOrder}
              disabled={!isChecked}
              sx={{ mt: 2 }}
            >
              Reschedule Event
            </Button>
          )}
        </Box>
      </Modal>
      <RescheduleModal
        open={openReschedule}
        handleClose={handleCloseReschedule}
        formData={formData}
        setFormData={setFormData}
        handleRescheduleOrder={handleRescheduleOrder}
        days={days}
      />{" "}
    </Box>
  );
};

export default BookingDetails;
