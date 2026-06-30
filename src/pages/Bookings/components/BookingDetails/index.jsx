// // React related imports
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch } from "react-redux";

// // Third Party Library
// import {
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   Button,
//   CircularProgress,
//   Chip,
//   Divider,
//   Card,
//   CardContent,
//   FormControlLabel,
//   Checkbox,
//   Modal,
//   TextField,
//   IconButton,
// } from "@mui/material";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// // assests
// import TechnicianImg from "../../../../assets/profileImg1.jpg";

// // Custom Components
// import authService from "../../../../api/ApiService";
// import { setLoading } from "../../../../redux/slice/LoaderSlice";
// import {
//   formatCurrencyIntl,
//   getErrorMessage,
//   formatDate,
//   formatProperDate,
// } from "../../../../utils/helperFunc";
// import Banner from "./component/Banner";
// import WhatsAppIcon from "@mui/icons-material/WhatsApp";
// import PhoneIcon from "@mui/icons-material/Phone";

// // styles
// import "./styles.scss";
// import Invoice from "./component/Invoice";
// import { config } from "../../../../api/config";
// import axios from "axios";
// import RescheduleModal from "./component/RescheduleModal";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import logo from "../../../../assets/logo2.png";

// const BookingDetails = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const [products, setProducts] = useState([]);
//   const [services, setServices] = useState([]);
//   const [technicians, setTechnicians] = useState([]);
//   const [booking, setBooking] = useState(null);
//   const [items, setItems] = useState([]);
//   const [eventStatus, setEventStatus] = useState("Upcoming Event");
//   const [canCancel, setCanCancel] = useState(false);
//   const [canReschedule, setCanReschedule] = useState(false);
//   const [loading, setLoadingState] = useState(true);
//   const [open, setOpen] = useState(false);
//   const [openReschedule, setOpenReschedule] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//   const [reason, setReason] = useState("");
//   const [days, setDays] = useState(0);
//   const [formData, setFormData] = useState({
//     receiver_mobilenumber: "",
//     receiver_name: "",
//     event_location: "",
//     location_lat: "",
//     lacation_long: "",
//     venue_open_time: "",
//     event_start_time: "",
//     event_end_time: "",
//     event_name: "",
//     event_date: "",
//     event_start_date: "",
//     event_end_date: "",
//     reschedule_remark: "",
//     upload_gatepass: "",
//     upload_invitation: "",
//     order_status: "Order Rescheduled",
//     rescheduled_date: "",
//   });
//   // const [companyDetails, setCompanyDetails] = useState({})
//   const [panNumber, setPanNumber] = useState("");
//   const [gstNumber, setGstNumber] = useState("");
//   const navigate = useNavigate();
//   const userDetail = sessionStorage.getItem("userDetails");

//   let userName = null;
//   let userMobile = null;
//   let userId = null;

//   if (userDetail) {
//     try {
//       const userDetails = JSON.parse(userDetail);
//       userName = userDetails?.username || null;
//       userMobile = userDetails?.mobilenumber || null;
//       userId = userDetails?._id || null;
//     } catch (error) {
//       console.error("Error parsing userDetails from sessionStorage:", error);
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//   console.log("The bookings", booking);
//   const handleReasonChange = (event) => {
//     setReason(event.target.value);
//   };

//   const handleOpenReschedule = () => setOpenReschedule(true);
//   const handleCloseReschedule = () => setOpenReschedule(false);

//   const getUser = async () => {
//     try {
//       const res = await authService.getCompanyDetail(userId);
//       const companyDetails = res.data.company_profile[0];
//       if (companyDetails) {
//         setPanNumber(companyDetails.pan_number || "N/A");
//         setGstNumber(companyDetails.gst_number || "N/A");
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };
//   useEffect(() => {
//     const getBookingDetails = async () => {
//       try {
//         dispatch(setLoading(true));
//         const res = await authService.getOrder(id);
//         const order = res.data.orderId;
//         setBooking(order);
//         console.log("The check order", order);
//         setDays(order.number_of_days);
//         setProducts(order?.product_data || []);
//         setServices(order?.service_data || []);
//         setTechnicians(order?.tech_data || []);
//         const combinedItems = [
//           ...(order?.product_data || [])?.map((item) => ({
//             id: item?.id || item._id,
//             image:
//               item?.imageUrl ||
//               "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEbmNxhl6aFUDwBtyelBzun4EnBJLblVb56w&s",
//             name: item?.productName || item.product_name || "N/A",
//             dimension: item?.productDimension || "N/A",
//             price: item?.productPrice || item.product_price || 0,
//             quantity: item?.quantity || 1,
//           })),
//           ...(order?.service_data || [])?.map((item) => ({
//             id: item?.id || item?._id,
//             image: item?.imageUrl || "",
//             name: item?.service_name || "N/A",
//             dimension: "—",
//             price: item?.service_price || 0,
//             quantity: item?.quantity || 1,
//           })),
//           ...(order?.tech_data || []).map((item) => ({
//             id: item?.id || item._id,
//             image: item?.imageUrl || TechnicianImg,
//             name: item?.service_name || "N/A",
//             category: item?.video,
//             price: item?.price || 0,
//             quantity: item?.quantity || 1,
//           })),
//         ];
//         setItems(combinedItems);

//         setLoadingState(false);
//         dispatch(setLoading(false));
//       } catch (error) {
//         setLoadingState(false);
//         dispatch(setLoading(false));
//         getErrorMessage(error);
//       }
//     };
//     getBookingDetails();
//     getUser();
//   }, [id, dispatch]);

//   useEffect(() => {
//     if (booking) {
//       const rangeStr = booking.event_date
//         ? booking.event_date
//         : `${booking.event_start_date || ""} to ${booking.event_end_date || ""}`;
//       calculateEventStatus(rangeStr, booking.event_start_time);
//     }
//   }, [booking]);
//   const numberOfDays = booking?.number_of_days || 1;

//   const subTotal = items.reduce(
//     (acc, item) => acc + item.price * item.quantity * numberOfDays,
//     0
//   );
//   const baseAmount = booking?.base_amount;
//   const tdsCharges = booking?.tds_deduction;
//   const amountAfterDeduction = baseAmount - tdsCharges;
//   const gst = amountAfterDeduction * 0.18;

//   const grandTotal = amountAfterDeduction + gst;

//   if (loading) {
//     return (
//       <Box sx={{ textAlign: "center", mt: 4 }}>
//         <CircularProgress />
//         <Typography variant="body1">Loading booking details...</Typography>
//       </Box>
//     );
//   }
//   // Helper: parse DD-MM-YYYY into a Date object at local time
//   const parseDMY = (dateStr) => {
//     if (!dateStr) return null;
//     const [dd, mm, yyyy] = dateStr.split("-").map((v) => Number(v));
//     if (!dd || !mm || !yyyy) return null;
//     return new Date(yyyy, mm - 1, dd);
//   };

//   // Helper: convert "hh:mm AM/PM" to {h, m}
//   const parse12hTime = (time12h = "12:00 AM") => {
//     try {
//       const [time, period] = time12h.split(" ");
//       let [h, m] = time.split(":").map(Number);
//       if (period === "PM" && h !== 12) h += 12;
//       if (period === "AM" && h === 12) h = 0;
//       return { h, m };
//     } catch {
//       return { h: 12, m: 0 };
//     }
//   };

//   // Helper: format DD-MM-YYYY safely for display as DD/MM/YYYY
// //  const formatAnyDateToDisplay = (dateStr) => {
// //   if (!dateStr) return "N/A";

// //   // Handle ISO (YYYY-MM-DD)
// //   if (dateStr.includes("-") && dateStr.split("-")[0].length === 4) {
// //     const date = new Date(dateStr);
// //     if (isNaN(date)) return "N/A";
// //     return date.toLocaleDateString("en-GB", {
// //       day: "2-digit",
// //       month: "2-digit",
// //       year: "numeric",
// //     });
// //   }

// //   // Handle DD-MM-YYYY
// //   const [dd, mm, yyyy] = dateStr.split("-").map((v) => parseInt(v, 10));
// //   if (!dd || !mm || !yyyy) return "N/A";
// //   const dmyDate = new Date(yyyy, mm - 1, dd);
// //   if (isNaN(dmyDate)) return "N/A";

// //   return dmyDate.toLocaleDateString("en-GB", {
// //     day: "2-digit",
// //     month: "2-digit",
// //     year: "numeric",
// //   });
// // };
// const formatISOToDMY = (isoDate) => {
//   if (!isoDate) return "N/A";
//   const date = new Date(isoDate);
//   if (isNaN(date)) return "N/A";

//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();

//   return `${day}-${month}-${year}`;
// };

//   const calculateEventStatus = (
//     eventDateRange,
//     eventStartTime = "12:00 AM"
//   ) => {
//     const now = new Date();

//     // Split eventDateRange into start and end dates like "12-11-2025 to 13-11-2025"
//     const [startDateStr, endDateStr] = (eventDateRange || "").split(" to ");
//     const startDate = parseDMY((startDateStr || "").trim());
//     const endDate = parseDMY((endDateStr || "").trim());

//     if (!startDate || !endDate) {
//       setEventStatus("Upcoming Event");
//       return;
//     }

//     const { h, m } = parse12hTime(eventStartTime);
//     startDate.setHours(h, m, 0, 0);
//     endDate.setHours(23, 59, 59, 999);

//     const diffToStartHours = Math.floor((startDate - now) / (1000 * 60 * 60));
//     const diffToEndHours = Math.floor((endDate - now) / (1000 * 60 * 60));

//     // Business rules:
//     // >48 hours before start => both Cancel and Reschedule available
//     // 24–48 hours before start => only Cancel available
//     // <=24 hours before start => none available
//     // between start and end => Event Started
//     // after end => Event Completed
//     if (diffToEndHours < 0) {
//       setEventStatus("Event Completed");
//       setCanCancel(false);
//       setCanReschedule(false);
//     } else if (diffToStartHours > 48) {
//       setEventStatus("Upcoming Event");
//       setCanCancel(true);
//       setCanReschedule(true);
//     } else if (diffToStartHours > 24) {
//       setEventStatus("Upcoming Event");
//       setCanCancel(true);
//       setCanReschedule(false);
//     } else if (diffToStartHours <= 0 && diffToEndHours > 0) {
//       setEventStatus("Event Started");
//       setCanCancel(false);
//       setCanReschedule(false);
//     } else {
//       // <=24 hours before start: neither reschedule nor cancel allowed
//       setEventStatus("Upcoming Event");
//       setCanCancel(false);
//       setCanReschedule(false);
//     }
//   };

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => {
//     setOpen(false);
//     setIsChecked(false);
//   };

//   const handleCheckboxChange = (event) => {
//     setIsChecked(event.target.checked);
//   };

//   const getFormattedCancellationDate = () => {
//     const options = {
//       year: "numeric",
//       month: "long",
//       day: "2-digit",
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     };
//     return new Date().toLocaleString("en-US", options);
//   };

//   const handleStatus = async (eventStatus) => {
//     try {
//       const payload = {
//         cancel_reason: reason,
//         cancelled_date: getFormattedCancellationDate(),
//       };

//       const res = await authService.cancelOrder(booking._id, payload);
//     } catch (error) {
//       getErrorMessage(error);
//     }
//   };

//   const handleRescheduleOrder = async () => {
//     const formDataToSend = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (formData[key]) {
//         if (key === "upload_gatepass" || key === "upload_invitation") {
//           // Check if a file is selected before appending
//           if (formData[key] instanceof File) {
//             formDataToSend.append(key, formData[key]);
//           }
//         } else {
//           formDataToSend.append(key, formData[key]);
//         }
//       }
//     });

//     try {
//       const res = await axios.put(
//         `${config.BASEURL}/user-order/reschedule-order/${booking._id}`,
//         formDataToSend,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       // const res = await authService.rescheduleOrder(booking._id, formDataToSend, {
//       //   headers: {
//       //     "Content-Type": "multipart/form-data",
//       //   },
//       // });

//       toast.success("Item is Rescheduled!", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//       window.location.reload();
//       handleClose();
//       handleCloseReschedule();
//     } catch (error) {
//       console.error("Error in rescheduling the event:", error);
//     }
//   };

//   const formatTime = (timeString) => {
//     const [time, period] = timeString.split(" ");
//     let [hours, minutes] = time.split(":").map(Number);

//     if (period === "PM" && hours !== 12) hours += 12;
//     if (period === "AM" && hours === 12) hours = 0;

//     return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
//       2,
//       "0"
//     )}`;
//   };

//   console.log("The start", booking.event_start_time);

//   const downloadInvoice = () => {
//     const doc = new jsPDF("p", "mm", "a4");
//     doc.setFontSize(10);
//     let startX = 15;
//     let currentY = 20;

//     const img = new Image();
//     img.src = logo;
//     img.onload = function () {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       ctx.drawImage(img, 0, 0);
//       const logoBase64 = canvas.toDataURL("image/png");

//       doc.addImage(logoBase64, "PNG", 15, 10, 30, 25);
//       currentY += 15;
//       // Company Information
//       doc.setFont("helvetica", "bold");
//       doc.text("KADAGAM VENTURES PRIVATE LIMITED", startX, currentY);
//       doc.setFont("helvetica", "normal");
//       currentY += 5;
//       doc.text("#345 3rd Vishwapriya Road,", startX, currentY);
//       currentY += 5;
//       doc.text("Bengaluru, Karnataka 560068, India", startX, currentY);
//       currentY += 5;
//       doc.text("GST: 29AABCK9472B1ZW", startX, currentY);
//       currentY += 5;
//       doc.text("SAC CODE: 998597", startX, currentY);
//       currentY += 7;

//       // Customer Details
//       doc.setFont("helvetica", "bold");
//       doc.text(`To: ${userName || "N/A"}`, startX, currentY);
//       currentY += 5;
//       doc.setFont("helvetica", "normal");
//       doc.text(`Phone: ${userMobile || "N/A"}`, startX, currentY);
//       currentY += 5;
//       doc.text(
//         booking.event_location || "No address provided",
//         startX,
//         currentY
//       );
//       currentY += 5;
//       if (panNumber) {
//         doc.setFont("helvetica", "bold");
//         doc.setFont("helvetica", "normal");
//         doc.text(`PAN Number: ${panNumber}`, startX, currentY);
//         // doc.setFont("helvetica", "normal");
//         // doc.text(`Pan card details has been uploaded`, startX, currentY);
//       }
//       if (gstNumber) {
//         currentY += 5;
//         doc.setFont("helvetica", "normal");
//         doc.text(`GST Number: ${gstNumber}`, startX, currentY);
//         currentY += 5;
//       }
//       doc.setFont("helvetica", "normal");
//       doc.text(
//         `Kind Attn: ${booking.receiver_name || "N/A"}`,
//         startX,
//         currentY
//       );
//       currentY += 10;

//       // Invoice Details Box
//       let infoBoxX = 120;
//       let infoBoxY = 20;
//       let infoBoxWidth = 88;
//       let infoBoxHeight = 55;
//       doc.rect(infoBoxX, infoBoxY, infoBoxWidth, infoBoxHeight);

//       let infoTextX = infoBoxX + 5;
//       let infoTextY = infoBoxY + 6;

//       const invoiceDetails = [
//         { label: "Invoice #", value: `INV${booking._id.slice(-6)}` },
//         { label: "Event Name", value: booking.event_name || "N/A" },
//         {
//           label: "Ordered Date",
//           value: formatDate(booking.ordered_date) || "-",
//         },
//         { label: "Venue Name", value: booking.venue_name || "-" },
//         { label: "Venue Location", value: booking.event_location || "N/A" },
//         {
//           label: "Event Date",
//           value: `${formatDate(booking.event_start_date)} - ${formatDate(
//             booking.event_end_date
//           )}`,
//         },
//         // { label: "Event Time", value: `${booking.event_start_date} - ${booking.event_end_date}` },
//         {
//           label: "Event Time",
//           value: `${formatTime(booking.event_start_time)} - ${formatTime(
//             booking.event_end_time
//           )}`,
//         },
//         { label: "No of Days", value: String(booking.number_of_days) },
//       ];

//       doc.setFontSize(9);
//       invoiceDetails.forEach((item) => {
//         doc.setFont("helvetica", "bold");

//         doc.text(`${item.label}:`, infoTextX, infoTextY);

//         doc.setFont("helvetica", "normal");

//         let splitValue = doc.splitTextToSize(String(item.value), 36);

//         doc.text(splitValue, infoTextX + 45, infoTextY);

//         infoTextY += splitValue.length * 5;
//       });

//       // Product Table
//       let tableStartY = infoBoxY + infoBoxHeight + 15;
//       const columns = [
//         { header: "Product", dataKey: "name" },
//         { header: "Size", dataKey: "dimension" },
//         { header: "Qty", dataKey: "quantity" },
//         { header: "Price", dataKey: "price" },
//         { header: "Days", dataKey: "days" },
//         { header: "Amount", dataKey: "amount" },
//       ];
//       const rows = items.map((item) => ({
//         name: item.name,
//         dimension: item.dimension,
//         quantity: item.quantity,
//         price: item.price,
//         days: String(numberOfDays),
//         amount: item.price * item.quantity * numberOfDays,
//       }));

//       doc.autoTable({
//         startY: tableStartY,
//         theme: "grid",
//         head: [columns.map((col) => col.header)],
//         body: rows.map((r) => columns.map((col) => r[col.dataKey])),
//         headStyles: {
//           fillColor: [255, 255, 0],
//           textColor: [0, 0, 0],
//           fontStyle: "bold",
//         },
//         styles: {
//           fontSize: 9,
//         },
//         margin: { left: 15 },
//         tableWidth: 180,
//       });

//       let finalY = doc.lastAutoTable.finalY + 5;

//       // Payment Summary
//       doc.setFontSize(10);
//       doc.setFont(undefined, "bold");
//       doc.text("Sub Total", 100, finalY);
//       doc.setFont(undefined, "normal");
//       doc.text(String(subTotal), 190, finalY, { align: "right" });
//       finalY += 5;

//       doc.setFont(undefined, "bold");
//       doc.text("TDS(2%)", 100, finalY);
//       doc.setFont(undefined, "normal");
//       doc.text(String(tdsCharges), 190, finalY, { align: "right" });
//       finalY += 5;

//       doc.setFont("helvetica", "bold");
//       doc.text("Amount After TDS Deduction", 100, finalY);
//       doc.setFont("helvetica", "normal");
//       doc.text(String(amountAfterDeduction), 190, finalY, { align: "right" });

//       finalY += 5;
//       doc.setFont("helvetica", "bold");
//       doc.text("GST:", 100, finalY);
//       doc.setFont("helvetica", "normal");
//       doc.text(String(Math.round(amountAfterDeduction * 0.18)), 190, finalY, {
//         align: "right",
//       });
//       finalY += 5;

//       doc.setFont(undefined, "bold");
//       doc.text("Grand Total", 100, finalY);
//       doc.setFont(undefined, "normal");
//       doc.text(String(grandTotal), 190, finalY, { align: "right" });
//       finalY += 15;

//       // Terms & Conditions with Text Wrapping
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "bold");
//       doc.text("Terms & Conditions", 15, finalY);
//       finalY += 5;

//       doc.setFont("helvetica", "normal");
//       const terms = [
//         "1. Payment Terms: Payment is due upon receipt.",
//         "2. Reservation & Deposit: A 100% deposit is required to secure your reservation",
//         "3. Cancellation Policy: Cancellations must be made at least 2 days in advance. Cancellation made within a day will be no refund.",
//         `4. Rental Period: The rental period starts from ${booking.event_start_time} to ${booking.event_end_time}. Any extensions must be arranged in advance and is subject to availabilty`,
//         "5. Delivery & Pickup: Delivery and pickup services are available for an additional fee. The customer must ensure the rental location is accessible for delivery.",
//         "6. Condition of Equipment: Rented items should be returned in their original condition. Customers are responsible for any damage or loss incurred during the rental period.",
//         "7. Liability: The customer agrees to assume all liability for rented items during the rental period.[Include any insurance requirements if applicable.]",
//         "8. Indemnification: The customer agrees to indemnify and hold Nithya Events or Kadagam Ventures Pvt Ltd harmless from any claims or damages arising from the use of rented items.",
//         "9. Governing Law: This agreement follows the laws of Bangalore, Karnataka.",
//         "10. Changes to Terms: Nithya Events or Kadagam Ventures Pvt Ltd reserves the right to change these terms and conditions at any time. Customers will be notified of any significant changes.",
//         "11. Contact: For questions, contact support@nithyaevent.com.",
//       ];

//       terms.forEach((line) => {
//         let splitText = doc.splitTextToSize(line, 180);
//         doc.text(splitText, 15, finalY);
//         finalY += splitText.length * 5;
//       });

//       doc.save("invoice.pdf");
//     };
//   };

//   if (!booking) {
//     return (
//       <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
//         No booking data found.
//       </Typography>
//     );
//   }

//   const getChipColor = (eventStatus) => {
//     switch (eventStatus) {
//       case "Cancel Event":
//         return "#f44336";
//       case "Reschedule":
//         return "#ff9800";
//       case "Event Started":
//         return "#FFA500";
//       case "Event Completed":
//         return "#4caf50";
//       default:
//         return "#9e9e9e";
//     }
//   };
//   const handleRaiseTicket = () => {
//     navigate(`/raise-ticket/${id}`);
//   };

//   return (
//     <Box sx={{ p: 6, maxWidth: "1200px", margin: "auto" }}>
//       <ToastContainer />
//       <Grid
//         container
//         spacing={2}
//         sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}
//       >
//         <Grid item xs={8}>
//           {/* <Paper variant="outlined" sx={{ p: 3 }}> */}
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               gap: "4rem",
//             }}
//           >
//             {booking.order_status !== "Order Cancelled" &&
//             booking.order_status !== "Order Rescheduled" &&
//             (canCancel || canReschedule) ? (
//               <Box sx={{ display: "flex", gap: 2 }}>
//                 {canCancel && (
//                   <Button
//                     variant="contained"
//                     onClick={handleOpen}
//                     sx={{
//                       fontWeight: "bold",
//                       fontSize: "14px",
//                       mb: 2,
//                       color: "#fff",
//                       backgroundColor: "#f44336",
//                       "&:hover": { backgroundColor: "#d32f2f", opacity: 0.9 },
//                     }}
//                   >
//                     Cancel Event
//                   </Button>
//                 )}
//                 {canReschedule && (
//                   <Button
//                     variant="contained"
//                     onClick={handleOpenReschedule}
//                     sx={{
//                       fontWeight: "bold",
//                       fontSize: "14px",
//                       mb: 2,
//                       color: "#fff",
//                       backgroundColor: "#ff9800",
//                       "&:hover": { backgroundColor: "#e68a00", opacity: 0.9 },
//                     }}
//                   >
//                     Reschedule Event
//                   </Button>
//                 )}
//               </Box>
//             ) : (
//               <Chip
//                 label={
//                   booking.order_status === "Order Cancelled"
//                     ? "Event Cancelled"
//                     : booking.order_status === "Order Rescheduled"
//                     ? "Order Rescheduled"
//                     : eventStatus
//                 }
//                 sx={{
//                   fontWeight: "bold",
//                   fontSize: "14px",
//                   mb: 2,
//                   color: "#fff",
//                   backgroundColor:
//                     booking.order_status === "Order Cancelled"
//                       ? "#f44336"
//                       : booking.order_status === "Order Rescheduled"
//                       ? "#ff9800"
//                       : "#9e9e9e",
//                 }}
//               />
//             )}
//             <Box>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <Button
//                   variant="contained"
//                   sx={{ backgroundColor: "#c026d3", borderRadius: "20px" }}
//                   onClick={handleRaiseTicket}
//                 >
//                   Raise Ticket
//                 </Button>

//                 <IconButton
//                   href="https://wa.me/919980137001"
//                   target="_blank"
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     flexDirection: "column",
//                     marginLeft: "1rem",
//                   }}
//                 >
//                   <WhatsAppIcon sx={{ color: "#25D366", fontSize: "1.5rem" }} />
//                   <Typography variant="p" sx={{ fontSize: "0.7rem" }}>
//                     WhatsApp
//                   </Typography>
//                 </IconButton>
//               </Box>
//             </Box>
//           </Box>

//           <Box sx={{ p: 2, maxWidth: "1200px", margin: "auto" }}>
//             <Grid
//               container
//               spacing={2}
//               sx={{ display: "flex", flexDirection: "column" }}
//             >
//               {/* Products Section */}
//               <Grid item xs={12}>
//                 {products.length > 0 &&
//                   products.map((item) => (
//                     <Paper variant="outlined" sx={{ p: 3, width: "40rem" }}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <Typography
//                           variant="h6"
//                           sx={{ mb: 2, fontWeight: "bold" }}
//                         >
//                           Products
//                         </Typography>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             gap: "0.5rem",
//                           }}
//                         >
//                           {/* <IconButton
//                               href={`https://wa.me/${9773828339}`}
//                               target="_blank"
//                               sx={{
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 flexDirection: "column",
//                               }}
//                             >
//                               <WhatsAppIcon
//                                 sx={{ color: "#25D366", fontSize: "1.5rem" }}
//                               />
//                             </IconButton> */}
//                           <IconButton
//                             href={`tel:${87328228}`}
//                             target="_blank"
//                             sx={{
//                               display: "flex",
//                               justifyContent: "center",
//                               flexDirection: "column",
//                             }}
//                           >
//                             <PhoneIcon
//                               sx={{ color: "#c026d3", fontSize: "1.5rem" }}
//                             />
//                             <Typography variant="p" sx={{ fontSize: "0.7rem" }}>
//                               Call Now
//                             </Typography>
//                           </IconButton>
//                         </Box>
//                       </Box>

//                       <Box
//                         key={item.id}
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           borderBottom: "1px solid #ccc",
//                           py: 1,
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             display: "flex",
//                             gap: "1.4rem",
//                             flexDirection: { xs: "column", sm: "row" },
//                           }}
//                         >
//                           <Box>
//                             <img
//                               src={item.imageUrl[0]}
//                               style={{
//                                 width: "60px",
//                                 borderRadius: "10px",
//                               }}
//                               alt="Not found"
//                             />
//                           </Box>
//                           <Box>
//                             <Typography variant="body2">
//                               <strong>Product:</strong> {item.productName}
//                             </Typography>
//                             <Typography variant="body2">
//                               <strong>Size:</strong> {item.productDimension}
//                             </Typography>
//                             <Typography variant="body2">
//                               <strong>Qty:</strong> {item.quantity}
//                             </Typography>
//                           </Box>
//                         </Box>
//                         <Box>
//                           <Box textAlign="right">
//                             <Typography variant="body2">
//                               <strong>Price:</strong>{" "}
//                               {formatCurrencyIntl(item.productPrice)}
//                             </Typography>
//                             <Typography variant="body2">
//                               <strong>Days:</strong> {numberOfDays}
//                             </Typography>
//                             {/* <Typography variant="body2">
//                         <strong>Amount:</strong> {formatCurrencyIntl(amount)}
//                       </Typography> */}
//                           </Box>

//                           <Box></Box>
//                         </Box>
//                       </Box>
//                     </Paper>
//                   ))}
//               </Grid>

//               {/* Services Section */}
//               <Grid item xs={12}>
//                 {services.length > 0 &&
//                   services.map((item) => (
//                     <Paper variant="outlined" sx={{ p: 3 }}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <Typography
//                           variant="h6"
//                           sx={{ mb: 2, fontWeight: "bold" }}
//                         >
//                           Services
//                         </Typography>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             gap: "0.5rem",
//                           }}
//                         >
//                           {/* <IconButton
//                               href={`https://wa.me/${9773828339}`}
//                               target="_blank"
//                               sx={{
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 flexDirection: "column",
//                               }}
//                             >
//                               <WhatsAppIcon
//                                 sx={{ color: "#25D366", fontSize: "1.5rem" }}
//                               />
//                               <Typography
//                                 variant="p"
//                                 sx={{ fontSize: "0.7rem" }}
//                               >
//                                 Whatsapp
//                               </Typography>
//                             </IconButton> */}
//                           <IconButton
//                             href={`tel:${87328228}`}
//                             target="_blank"
//                             sx={{
//                               display: "flex",
//                               justifyContent: "center",
//                               flexDirection: "column",
//                             }}
//                           >
//                             <PhoneIcon
//                               sx={{ color: "#c026d3", fontSize: "1.5rem" }}
//                             />
//                             <Typography variant="p" sx={{ fontSize: "0.7rem" }}>
//                               Call Now
//                             </Typography>
//                           </IconButton>
//                         </Box>
//                       </Box>
//                       <Box
//                         key={item.id}
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           borderBottom: "1px solid #ccc",
//                           py: 1,
//                           flexDirection: { xs: "column", sm: "row" },
//                         }}
//                       >
//                         <Box sx={{ display: "flex", gap: "1.4rem" }}>
//                           <Box>
//                             <img
//                               src={item.imageUrl}
//                               style={{
//                                 width: "60px",
//                                 borderRadius: "10px",
//                               }}
//                               alt="Not found"
//                             />
//                           </Box>
//                           <Box>
//                             <Typography variant="body2">
//                               <strong>Product:</strong> {item.productName}
//                             </Typography>
//                             <Typography variant="body2">
//                               <strong>Qty:</strong> {item.quantity}
//                             </Typography>
//                           </Box>
//                         </Box>
//                         <Box>
//                           <Box textAlign="right">
//                             <Typography variant="body2">
//                               <strong>Price:</strong>{" "}
//                               {formatCurrencyIntl(item.productPrice)}
//                             </Typography>
//                             <Typography variant="body2">
//                               <strong>Days:</strong> {numberOfDays}
//                             </Typography>
//                             {/* <Typography variant="body2">
//                <strong>Amount:</strong> {formatCurrencyIntl(amount)}
//              </Typography> */}
//                           </Box>

//                           <Box></Box>
//                         </Box>
//                       </Box>
//                     </Paper>
//                   ))}
//               </Grid>

//               {/* Technicians Section */}
//               <Grid item xs={12}>
//                 {technicians.length > 0 &&
//                   technicians.map((item) => (
//                     <Paper variant="outlined" sx={{ p: 3 }}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <Typography
//                           variant="h6"
//                           sx={{ mb: 2, fontWeight: "bold" }}
//                         >
//                           Technicians
//                         </Typography>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             gap: "0.5rem",
//                           }}
//                         >
//                           <IconButton
//                             href={`tel:${87328228}`}
//                             target="_blank"
//                             sx={{
//                               display: "flex",
//                               justifyContent: "center",
//                               flexDirection: "column",
//                             }}
//                           >
//                             <PhoneIcon
//                               sx={{ color: "#c026d3", fontSize: "1.5rem" }}
//                             />
//                             <Typography variant="p" sx={{ fontSize: "0.7rem" }}>
//                               Call Now
//                             </Typography>
//                           </IconButton>
//                         </Box>
//                       </Box>
//                       <Box
//                         key={item.id}
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           borderBottom: "1px solid #ccc",
//                           py: 1,
//                         }}
//                       >
//                         <Box sx={{ display: "flex", gap: "1.4rem" }}>
//                           <Box>
//                             <img
//                               src={item.imageUrl || TechnicianImg}
//                               style={{
//                                 width: "60px",
//                                 borderRadius: "10px",
//                               }}
//                               alt="Not found"
//                             />
//                           </Box>
//                           <Box>
//                             <Typography variant="body2">
//                               <strong>Product:</strong> {item.service_name}
//                             </Typography>
//                             {/* <Typography variant="body2">
//                <strong>Size:</strong> {item.productDimension}
//              </Typography> */}
//                             <Typography variant="body2">
//                               <strong>Qty:</strong> {item.quantity}
//                             </Typography>
//                           </Box>
//                         </Box>
//                         <Box>
//                           <Box textAlign="right">
//                             <Typography variant="body2">
//                               <strong>Price:</strong>{" "}
//                               {formatCurrencyIntl(item.price)}
//                             </Typography>
//                             <Typography variant="body2">
//                               <strong>Days:</strong> {numberOfDays}
//                             </Typography>
//                             {/* <Typography variant="body2">
//                <strong>Amount:</strong> {formatCurrencyIntl(amount)}
//              </Typography> */}
//                           </Box>

//                           <Box></Box>
//                         </Box>
//                       </Box>
//                     </Paper>
//                   ))}
//               </Grid>
//             </Grid>
//           </Box>
//           {/* </Paper> */}

//           {/* <Paper
//             variant="outlined"
//             sx={{ p: 2, mb: 2, backgroundColor: "#fff3cd" }}
//           >
//             <Typography variant="h6" sx={{ mb: 1, color: "#856404" }}>
//               Important Information
//             </Typography>
//             <Typography variant="body2">
//               1. Payment is due upon receipt.
//             </Typography>
//             <Typography variant="body2">
//               2. A 100% deposit is required to secure your reservation.
//             </Typography>
//             <Typography variant="body2">
//               3. Cancellations must be made at least 2 days in advance.
//             </Typography>
//           </Paper> */}
//         </Grid>

//         <Grid item xs={4}>
//           <Paper
//             variant="outlined"
//             sx={{ mb: 2, p: 3, width: { xs: "16.5rem", sm: "auto" } }}
//           >
//             <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
//               Payment Summary
//             </Typography>

//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 1,
//                 width: "300px",
//               }}
//             >
//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography variant="body2">Total</Typography>
//                 <Typography variant="body2">{booking?.cart_total}</Typography>
//               </Box>

//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography variant="body2">Event Days</Typography>
//                 <Typography variant="body2">{numberOfDays}</Typography>
//               </Box>

//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography variant="body2">Base Amount</Typography>
//                 <Typography variant="body2">
//                   {formatCurrencyIntl(baseAmount)}
//                 </Typography>
//               </Box>

//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography variant="body2">TDS Charges (2%)</Typography>
//                 <Typography variant="body2">
//                   {Math.floor(tdsCharges)}
//                 </Typography>
//               </Box>

//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography variant="body2">Amount After Deductions</Typography>
//                 <Typography variant="body2">
//                   {Math.floor(amountAfterDeduction)}
//                 </Typography>
//               </Box>

//               {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography variant="body2">CGST (9%)</Typography>
//                 <Typography variant="body2">
//                   {formatCurrencyIntl(cgst)}
//                 </Typography>
//               </Box> */}
//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography variant="body2">GST (18%)</Typography>
//                 <Typography variant="body2">
//                   {Math.floor(amountAfterDeduction * 0.18)}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                   Bill Total
//                 </Typography>
//                 <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                   {Math.floor(String(grandTotal))}
//                 </Typography>
//               </Box>
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//       <Banner />
//       <Paper
//         variant="outlined"
//         sx={{ p: 2, mb: 2, display: "flex", flexDirection: "column" }}
//       >
//         <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
//           Order Details
//         </Typography>
//         <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
//           <strong>Order Id:</strong> {`INV${booking._id.slice(-6)}`}
//         </Typography>
//         <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
//           <strong>Event Name</strong> {booking.event_name || "N/A"}
//         </Typography>
//         <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
//           <strong>Payment:</strong> {booking.payment_method || "N/A"}
//         </Typography>
//         <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
//           <strong>Event Location:</strong> {booking.event_location || "N/A"}
//         </Typography>
//         <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
//           <strong>Event Start Date:</strong>{" "}
//           {formatISOToDMY(booking.event_start_date)}{" "}
//         </Typography>
//         <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
//           <strong>Event End Date:</strong>{" "}
//           {formatISOToDMY(booking.event_end_date)}{" "}
//         </Typography>
//         <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
//           <strong>Event Time:</strong>
//           {booking.event_start_time} - {booking.event_end_time}
//         </Typography>
//         <Typography variant="p" sx={{ mb: 1, fontSize: "0.9rem" }}>
//           <strong>Contact:</strong> {booking.receiver_mobilenumber || "N/A"}
//         </Typography>
//         <Box sx={{ display: "flex", gap: 4, mb: 1 }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Typography sx={{ fontSize: "0.9rem" }}>
//               <strong>Invitation Pass:</strong>
//             </Typography>
//             {booking.upload_invitation ? (
//               <img
//                 src={booking.upload_invitation}
//                 style={{ width: "160px" }}
//                 alt="Not found"
//               />
//             ) : (
//               <Typography sx={{ fontSize: "0.9rem" }}>N/A</Typography>
//             )}
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Typography sx={{ fontSize: "0.9rem" }}>
//               <strong>Gate Pass:</strong>
//             </Typography>
//             {booking.upload_gatepass ? (
//               <img
//                 src={booking.upload_gatepass}
//                 style={{ width: "160px" }}
//                 alt="Not found"
//               />
//             ) : (
//               <Typography sx={{ fontSize: "0.9rem" }}>N/A</Typography>
//             )}
//           </Box>
//         </Box>
//         <Button
//           variant="contained"
//           sx={{
//             backgroundColor: "#c026d3",
//             color: "#fff",
//             mt: 2,
//             width: "22rem",
//           }}
//           onClick={downloadInvoice}
//         >
//           Download Invoice
//         </Button>
//       </Paper>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="cancellation-policy-title"
//         aria-describedby="cancellation-policy-description"
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             p: 4,
//             borderRadius: "8px",
//           }}
//         >
//           <Typography
//             id="cancellation-policy-title"
//             variant="h6"
//             sx={{ mb: 2 }}
//           >
//             Cancellation & Reschedule Policy
//           </Typography>

//           <TextField
//             fullWidth
//             label="Reason for Cancellation"
//             variant="outlined"
//             value={reason}
//             onChange={handleReasonChange}
//             required
//             sx={{ mb: 2 }}
//           />

//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={isChecked}
//                 onChange={handleCheckboxChange}
//                 name="policyCheck"
//               />
//             }
//             label="I agree to the cancellation/reschedule policy"
//           />

//           {/* Cancel Event Button */}
//           {canCancel && (
//             <Button
//               variant="contained"
//               color="error"
//               onClick={() => {
//                 handleStatus(eventStatus);
//                 handleClose();
//               }}
//               disabled={!isChecked}
//               sx={{ mt: 2, mr: 2 }}
//             >
//               Cancel Event
//             </Button>
//           )}

//           {/* Reschedule Button - Only visible if eventStatus is "Reschedule" */}
//           {/* {canReschedule && booking.order_status !== "Order Cancelled" && (
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleRescheduleOrder}
//               disabled={!isChecked}
//               sx={{ mt: 2 }}
//             >
//               Reschedule Event
//             </Button>
//           )} */}
//         </Box>
//       </Modal>
//       <RescheduleModal
//         open={openReschedule}
//         handleClose={handleCloseReschedule}
//         formData={formData}
//         setFormData={setFormData}
//         handleRescheduleOrder={handleRescheduleOrder}
//         days={days}
//       />{" "}
//     </Box>
//   );
// };

// export default BookingDetails;

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
  CardHeader,
  Stack,
  Modal,
  TextField,
  IconButton,
  Tooltip,
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
import logo from "../../../../assets/logo2.png";

// Extra icons for premium headers (optional)
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PlaceIcon from "@mui/icons-material/Place";
import PaymentIcon from "@mui/icons-material/Payment";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const BookingDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [booking, setBooking] = useState(null);
  const [items, setItems] = useState([]);
  const [eventStatus, setEventStatus] = useState("Upcoming Event");
  const [canCancel, setCanCancel] = useState(false);
  const [canReschedule, setCanReschedule] = useState(false);
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

  const [panNumber, setPanNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  const navigate = useNavigate();
  const userDetail = sessionStorage.getItem("userDetails");

  let userName = null;
  let userMobile = null;
  let userId = null;

  if (userDetail) {
    try {
      const userDetails = JSON.parse(userDetail);
      userName = userDetails?.username || null;
      userMobile = userDetails?.mobilenumber || null;
      userId = userDetails?._id || null;
    } catch (error) {
      console.error("Error parsing userDetails from sessionStorage:", error);
    }
  }

  const handleInputChange = (e) => {
    try {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } catch (err) {
      console.error("handleInputChange error:", err);
    }
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleOpenReschedule = () => setOpenReschedule(true);
  const handleCloseReschedule = () => setOpenReschedule(false);

  const getUser = async () => {
    try {
      const res = await authService.getCompanyDetail(userId);
      const companyDetails = res.data.company_profile[0];
      if (companyDetails) {
        setPanNumber(companyDetails.pan_number || "N/A");
        setGstNumber(companyDetails.gst_number || "N/A");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const getBookingDetails = async () => {
      try {
        dispatch(setLoading(true));
        const res = await authService.getOrder(id);
        const order = res.data.orderId;
        setBooking(order);
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
    getUser();
  }, [id, dispatch]);

  useEffect(() => {
    if (booking) {
      const rangeStr = booking.event_date
        ? booking.event_date
        : `${booking.event_start_date || ""} to ${
            booking.event_end_date || ""
          }`;
      calculateEventStatus(rangeStr, booking.event_start_time);
    }
  }, [booking]);

  const numberOfDays = booking?.number_of_days || 1;

  const subTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity * numberOfDays,
    0
  );
  const baseAmount = booking?.base_amount;
  const tdsCharges = booking?.tds_deduction;
  const amountAfterDeduction = baseAmount - tdsCharges;
  const gst = amountAfterDeduction * 0.18;
  const grandTotal = amountAfterDeduction + gst;

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="body1">Loading booking details...</Typography>
      </Box>
    );
  }

  // Helper: parse DD-MM-YYYY into a Date object at local time
  const parseDMY = (dateStr) => {
    try {
      if (!dateStr) return null;
      const [dd, mm, yyyy] = dateStr.split("-").map((v) => Number(v));
      if (!dd || !mm || !yyyy) return null;
      return new Date(yyyy, mm - 1, dd);
    } catch {
      return null;
    }
  };

  // Helper: convert "hh:mm AM/PM" to {h, m}
  const parse12hTime = (time12h = "12:00 AM") => {
    try {
      const [time, period] = time12h.split(" ");
      let [h, m] = time.split(":").map(Number);
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      return { h, m };
    } catch {
      return { h: 12, m: 0 };
    }
  };

  const formatISOToDMY = (isoDate) => {
    try {
      if (!isoDate) return "N/A";
      const date = new Date(isoDate);
      if (isNaN(date)) return "N/A";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return "N/A";
    }
  };

  const calculateEventStatus = (
    eventDateRange,
    eventStartTime = "12:00 AM"
  ) => {
    const now = new Date();

    const [startDateStr, endDateStr] = (eventDateRange || "").split(" to ");
    const startDate = parseDMY((startDateStr || "").trim());
    const endDate = parseDMY((endDateStr || "").trim());

    if (!startDate || !endDate) {
      setEventStatus("Upcoming Event");
      return;
    }

    const { h, m } = parse12hTime(eventStartTime);
    startDate.setHours(h, m, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const diffToStartHours = Math.floor((startDate - now) / (1000 * 60 * 60));
    const diffToEndHours = Math.floor((endDate - now) / (1000 * 60 * 60));

    if (diffToEndHours < 0) {
      setEventStatus("Event Completed");
      setCanCancel(false);
      setCanReschedule(false);
    } else if (diffToStartHours > 48) {
      setEventStatus("Upcoming Event");
      setCanCancel(true);
      setCanReschedule(true);
    } else if (diffToStartHours > 24) {
      setEventStatus("Upcoming Event");
      setCanCancel(true);
      setCanReschedule(false);
    } else if (diffToStartHours <= 0 && diffToEndHours > 0) {
      setEventStatus("Event Started");
      setCanCancel(false);
      setCanReschedule(false);
    } else {
      setEventStatus("Upcoming Event");
      setCanCancel(false);
      setCanReschedule(false);
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
    try {
      const options = {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      return new Date().toLocaleString("en-US", options);
    } catch {
      return new Date().toISOString();
    }
  };

  const handleStatus = async (eventStatus) => {
    try {
      const payload = {
        cancel_reason: reason,
        cancelled_date: getFormattedCancellationDate(),
      };
      await authService.cancelOrder(booking._id, payload);
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const handleRescheduleOrder = async () => {
    const formDataToSend = new FormData();
    try {
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          if (key === "upload_gatepass" || key === "upload_invitation") {
            if (formData[key] instanceof File) {
              formDataToSend.append(key, formData[key]);
            }
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      await axios.put(
        `${config.BASEURL}/user-order/reschedule-order/${booking._id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

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

  const formatTime = (timeString) => {
    try {
      const [time, period] = (timeString || "").split(" ");
      let [hours, minutes] = (time || "12:00").split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    } catch {
      return "00:00";
    }
  };

  const downloadInvoice = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(10);
    let startX = 15;
    let currentY = 20;

    const img = new Image();
    img.src = logo;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const logoBase64 = canvas.toDataURL("image/png");

      doc.addImage(logoBase64, "PNG", 15, 10, 30, 25);
      currentY += 15;
      doc.setFont("helvetica", "bold");
      doc.text("KADAGAM VENTURES PRIVATE LIMITED", startX, currentY);
      doc.setFont("helvetica", "normal");
      currentY += 5;
      doc.text("#345 3rd Vishwapriya Road,", startX, currentY);
      currentY += 5;
      doc.text("Bengaluru, Karnataka 560068, India", startX, currentY);
      currentY += 5;
      doc.text("GST: 29AABCK9472B1ZW", startX, currentY);
      currentY += 5;
      doc.text("SAC CODE: 998597", startX, currentY);
      currentY += 7;

      doc.setFont("helvetica", "bold");
      doc.text(`To: ${userName || "N/A"}`, startX, currentY);
      currentY += 5;
      doc.setFont("helvetica", "normal");
      doc.text(`Phone: ${userMobile || "N/A"}`, startX, currentY);
      currentY += 5;
      doc.text(
        booking.event_location || "No address provided",
        startX,
        currentY
      );
      currentY += 5;
      if (panNumber) {
        doc.setFont("helvetica", "normal");
        doc.text(`PAN Number: ${panNumber}`, startX, currentY);
      }
      if (gstNumber) {
        currentY += 5;
        doc.setFont("helvetica", "normal");
        doc.text(`GST Number: ${gstNumber}`, startX, currentY);
        currentY += 5;
      }
      doc.setFont("helvetica", "normal");
      doc.text(
        `Kind Attn: ${booking.receiver_name || "N/A"}`,
        startX,
        currentY
      );
      currentY += 10;

      let infoBoxX = 120;
      let infoBoxY = 20;
      let infoBoxWidth = 88;
      let infoBoxHeight = 55;
      doc.rect(infoBoxX, infoBoxY, infoBoxWidth, infoBoxHeight);

      let infoTextX = infoBoxX + 5;
      let infoTextY = infoBoxY + 6;

      const invoiceDetails = [
        { label: "Invoice #", value: `INV${booking._id.slice(-6)}` },
        { label: "Event Name", value: booking.event_name || "N/A" },
        {
          label: "Ordered Date",
          value: formatDate(booking.ordered_date) || "-",
        },
        { label: "Venue Name", value: booking.venue_name || "-" },
        { label: "Venue Location", value: booking.event_location || "N/A" },
        {
          label: "Event Date",
          value: `${formatDate(booking.event_start_date)} - ${formatDate(
            booking.event_end_date
          )}`,
        },
        {
          label: "Event Time",
          value: `${formatTime(booking.event_start_time)} - ${formatTime(
            booking.event_end_time
          )}`,
        },
        { label: "No of Days", value: String(booking.number_of_days) },
      ];

      doc.setFontSize(9);
      invoiceDetails.forEach((item) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${item.label}:`, infoTextX, infoTextY);
        doc.setFont("helvetica", "normal");
        let splitValue = doc.splitTextToSize(String(item.value), 36);
        doc.text(splitValue, infoTextX + 45, infoTextY);
        infoTextY += splitValue.length * 5;
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
      const rows = items.map((item) => ({
        name: item.name,
        dimension: item.dimension,
        quantity: item.quantity,
        price: item.price,
        days: String(numberOfDays),
        amount: item.price * item.quantity * numberOfDays,
      }));

      // @ts-ignore
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
      doc.text("Sub Total", 100, finalY);
      doc.setFont(undefined, "normal");
      doc.text(String(subTotal), 190, finalY, { align: "right" });
      finalY += 5;

      doc.setFont(undefined, "bold");
      doc.text("TDS(2%)", 100, finalY);
      doc.setFont(undefined, "normal");
      doc.text(String(tdsCharges), 190, finalY, { align: "right" });
      finalY += 5;

      doc.setFont("helvetica", "bold");
      doc.text("Amount After TDS Deduction", 100, finalY);
      doc.setFont("helvetica", "normal");
      doc.text(String(amountAfterDeduction), 190, finalY, { align: "right" });

      finalY += 5;
      doc.setFont("helvetica", "bold");
      doc.text("GST:", 100, finalY);
      doc.setFont("helvetica", "normal");
      doc.text(String(Math.round(amountAfterDeduction * 0.18)), 190, finalY, {
        align: "right",
      });
      finalY += 5;

      doc.setFont(undefined, "bold");
      doc.text("Grand Total", 100, finalY);
      doc.setFont(undefined, "normal");
      doc.text(String(grandTotal), 190, finalY, { align: "right" });
      finalY += 15;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Terms & Conditions", 15, finalY);
      finalY += 5;

      doc.setFont("helvetica", "normal");
      const terms = [
        "1. Payment Terms: Payment is due upon receipt.",
        "2. Reservation & Deposit: A 100% deposit is required to secure your reservation",
        "3. Cancellation Policy: Cancellations must be made at least 2 days in advance. Cancellation made within a day will be no refund.",
        `4. Rental Period: The rental period starts from ${booking.event_start_time} to ${booking.event_end_time}. Any extensions must be arranged in advance and is subject to availabilty`,
        "5. Delivery & Pickup: Delivery and pickup services are available for an additional fee. The customer must ensure the rental location is accessible for delivery.",
        "6. Condition of Equipment: Rented items should be returned in their original condition. Customers are responsible for any damage or loss incurred during the rental period.",
        "7. Liability: The customer agrees to assume all liability for rented items during the rental period.[Include any insurance requirements if applicable.]",
        "8. Indemnification: The customer agrees to indemnify and hold Nithya Events or Kadagam Ventures Pvt Ltd harmless from any claims or damages arising from the use of rented items.",
        "9. Governing Law: This agreement follows the laws of Bangalore, Karnataka.",
        "10. Changes to Terms: Nithya Events or Kadagam Ventures Pvt Ltd reserves the right to change these terms and conditions at any time. Customers will be notified of any significant changes.",
        "11. Contact: For questions, contact support@nithyaevent.com.",
      ];

      terms.forEach((line) => {
        let splitText = doc.splitTextToSize(line, 180);
        doc.text(splitText, 15, finalY);
        finalY += splitText.length * 5;
      });

      doc.save("invoice.pdf");
    };
  };

  if (!booking) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
        No booking data found.
      </Typography>
    );
  }

  const getChipColor = (st) => {
    switch (st) {
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

  // -------- UI helpers for Premium Cards --------
  const SectionCard = ({ icon, title, children, action }) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #eee",
        boxShadow: "0px 6px 18px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      <CardHeader
        avatar={icon}
        title={
          <Typography sx={{ fontWeight: 700, color: "#2d2a32" }}>
            {title}
          </Typography>
        }
        action={action || null}
        sx={{
          bgcolor: "#f8f4fb",
          borderBottom: "1px solid #eee",
          "& .MuiCardHeader-avatar": { color: "#7c3aed" },
        }}
      />
      <CardContent sx={{ p: 3 }}>{children}</CardContent>
    </Card>
  );

  const Field = ({ label, value }) => (
    <Box sx={{ display: "grid", gridTemplateColumns: "160px 1fr", mb: 1.25 }}>
      <Typography sx={{ color: "#6b7280", fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography sx={{ color: "#111827" }}>{value ?? "N/A"}</Typography>
    </Box>
  );

  const lat =
    booking?.location_lat?.$numberDecimal || booking?.location_lat || "N/A";
  const lng =
    booking?.location_long?.$numberDecimal || booking?.location_long || "N/A";

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, maxWidth: "1300px", margin: "auto" }}>
      <ToastContainer />

      {/* Top Bar: Actions + Status */}
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          mb: 2,
        }}
      >
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {booking.order_status !== "Order Cancelled" &&
            booking.order_status !== "Order Rescheduled" &&
            (canCancel || canReschedule) ? (
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                {canCancel && (
                  <Button
                    variant="contained"
                    onClick={() => setOpen(true)}
                    sx={{
                      fontWeight: "bold",
                      color: "#fff",
                      backgroundColor: "#ef4444",
                      borderRadius: 2,
                      px: 2.5,
                      "&:hover": { backgroundColor: "#dc2626", opacity: 0.95 },
                    }}
                  >
                    Cancel Event
                  </Button>
                )}
                {canReschedule && (
                  <Button
                    variant="contained"
                    onClick={handleOpenReschedule}
                    sx={{
                      fontWeight: "bold",
                      color: "#fff",
                      backgroundColor: "#f59e0b",
                      borderRadius: 2,
                      px: 2.5,
                      "&:hover": { backgroundColor: "#d97706", opacity: 0.95 },
                    }}
                  >
                    Reschedule Event
                  </Button>
                )}
              </Box>
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
                  color: "#fff",
                  backgroundColor:
                    booking.order_status === "Order Cancelled"
                      ? "#ef4444"
                      : booking.order_status === "Order Rescheduled"
                      ? "#f59e0b"
                      : getChipColor(eventStatus),
                }}
              />
            )}

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#7c3aed",
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: 700,
                }}
                onClick={handleRaiseTicket}
              >
                Raise Ticket
              </Button>

              <Tooltip title="WhatsApp">
                <IconButton
                  href="https://wa.me/919980137001"
                  target="_blank"
                  sx={{ ml: 1 }}
                >
                  <WhatsAppIcon sx={{ color: "#25D366" }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={8}>
        

          {/* Items */}
          <SectionCard title="Order Items" icon={<PersonOutlineIcon />}>
            <Grid container spacing={2}>
              {/* Products */}
              {products.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Products
                  </Typography>
                  {products.map((item) => (
                    <Paper
                      key={item.orderId || item.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 2,
                        borderColor: "#eee",
                        boxShadow: "0 4px 14px rgba(0,0,0,.04)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <img
                            src={item.imageUrl?.[0]}
                            alt={item.productName}
                            style={{
                              width: 64,
                              height: 64,
                              objectFit: "cover",
                              borderRadius: 10,
                            }}
                          />
                          <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                              {item.productName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.productDimension}
                            </Typography>
                            <Typography variant="body2">
                              Qty: {item.quantity}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box textAlign="right">
                          <Typography variant="body2">
                            Price: {formatCurrencyIntl(item.productPrice)}
                          </Typography>
                          <Typography variant="body2">
                            Days: {numberOfDays}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Grid>
              )}

              {/* Services */}
              {services.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Services
                  </Typography>
                  {services.map((item) => (
                    <Paper
                      key={item.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 2,
                        borderColor: "#eee",
                        boxShadow: "0 4px 14px rgba(0,0,0,.04)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <img
                            src={item.imageUrl}
                            alt={item.service_name}
                            style={{
                              width: 64,
                              height: 64,
                              objectFit: "cover",
                              borderRadius: 10,
                            }}
                          />
                          <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                              {item.service_name}
                            </Typography>
                            <Typography variant="body2">
                              Qty: {item.quantity}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box textAlign="right">
                          <Typography variant="body2">
                            Price: {formatCurrencyIntl(item.service_price)}
                          </Typography>
                          <Typography variant="body2">
                            Days: {numberOfDays}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Grid>
              )}

              {/* Technicians */}
              {technicians.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Technicians
                  </Typography>
                  {technicians.map((item) => (
                    <Paper
                      key={item.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 2,
                        borderColor: "#eee",
                        boxShadow: "0 4px 14px rgba(0,0,0,.04)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <img
                            src={item.imageUrl || TechnicianImg}
                            alt={item.service_name}
                            style={{
                              width: 64,
                              height: 64,
                              objectFit: "cover",
                              borderRadius: 10,
                            }}
                          />
                          <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                              {item.service_name}
                            </Typography>
                            <Typography variant="body2">
                              Qty: {item.quantity}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box textAlign="right">
                          <Typography variant="body2">
                            Price: {formatCurrencyIntl(item.price)}
                          </Typography>
                          <Typography variant="body2">
                            Days: {numberOfDays}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Grid>
              )}
            </Grid>
          </SectionCard>

            {/* Event Overview */}
          <SectionCard
            icon={<EventAvailableIcon />}
            title="Event Overview"
            action={
              <Chip
                label={booking?.order_status || "Status"}
                sx={{
                  bgcolor: "#ede9fe",
                  color: "#7c3aed",
                  fontWeight: 700,
                }}
              />
            }
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Field label="Order ID" value={booking.order_id} />
                <Field label="Event Name" value={booking.event_name} />
                <Field
                  label="Event Date"
                  value={
                    booking.event_date ||
                    `${formatISOToDMY(
                      booking.event_start_date
                    )} to ${formatISOToDMY(booking.event_end_date)}`
                  }
                />
                <Field
                  label="Event Time"
                  value={`${booking.event_start_time} - ${booking.event_end_time}`}
                />
                <Field label="Number of Days" value={booking.number_of_days} />
               
              </Grid>
              <Grid item xs={12} md={6}>
                <Field label="Venue Name" value={booking.venue_name} />
                <Field label="Event Location" value={booking.event_location} />
                <Field label="Receiver Name" value={booking.receiver_name} />
                <Field
                  label="Receiver Mobile"
                  value={booking.receiver_mobilenumber}
                />
               
              </Grid>
            </Grid>
          </SectionCard>

          {/* Schedule & Setup */}
          <SectionCard icon={<ScheduleIcon />} title="Schedule & Setup">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Field
                  label="Setup Start Date"
                  value={booking.setup_start_date}
                />
                <Field
                  label="Setup Start Time"
                  value={booking.setup_start_time}
                />
                <Field label="Rehearsal Date" value={booking.rehearsal_date} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field label="Setup End Date" value={booking.setup_end_date} />
                <Field label="Setup End Time" value={booking.setup_end_time} />
                <Field label="Setup Date" value={booking.setup_date} />
              </Grid>
            </Grid>
          </SectionCard>

      
          {/* Payment Details (Full) */}
          <SectionCard icon={<PaymentIcon />} title="Payment Details">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Field label="Payment Method" value={booking.payment_method} />
              
                <Field
                  label="Paid Amount"
                  value={formatCurrencyIntl(booking.paid_amount)}
                />
                <Field
                  label="Cart Total"
                  value={formatCurrencyIntl(booking.cart_total)}
                />
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <Field
                  label="Base Amount"
                  value={formatCurrencyIntl(booking.base_amount)}
                />
                <Field
                  label="TDS Deduction"
                  value={formatCurrencyIntl(booking.tds_deduction)}
                />
                <Field
                  label="Amount After Deduction"
                  value={formatCurrencyIntl(booking.amount_after_deduction)}
                />
                <Field
                  label="GST Applied Value"
                  value={formatCurrencyIntl(booking.gst_applied_value)}
                />
                <Field
                  label="Grand Total (Recalc)"
                  value={formatCurrencyIntl(grandTotal)}
                />
              </Grid> */}
            </Grid>
          </SectionCard>

        

          {/* Attachments */}
          <SectionCard icon={<ReceiptLongIcon />} title="Attachments">
            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
              <Box>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  Invitation
                </Typography>
                {booking.upload_invitation ? (
                  <img
                    src={booking.upload_invitation}
                    alt="Invitation"
                    style={{
                      width: 220,
                      borderRadius: 12,
                      border: "1px solid #eee",
                    }}
                  />
                ) : (
                  <Typography color="text.secondary">N/A</Typography>
                )}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  Gate Pass
                </Typography>
                {booking.upload_gatepass ? (
                  <img
                    src={booking.upload_gatepass}
                    alt="Gate Pass"
                    style={{
                      width: 220,
                      borderRadius: 12,
                      border: "1px solid #eee",
                    }}
                  />
                ) : (
                  <Typography color="text.secondary">N/A</Typography>
                )}
              </Box>
            </Stack>
          </SectionCard>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={4}>
          {/* Payment Summary (your original block kept, just styled) */}
          <Paper
            variant="outlined"
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 3,
              borderColor: "#eee",
              boxShadow: "0px 6px 18px rgba(0,0,0,0.06)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Payment Summary
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <RowKV k="Total" v={booking?.cart_total} />
              <RowKV k="Event Days" v={numberOfDays} />
              <RowKV k="Base Amount" v={formatCurrencyIntl(baseAmount)} />
              <RowKV k="TDS Charges (2%)" v={Math.floor(tdsCharges)} />
              <RowKV
                k="Amount After Deductions"
                v={Math.floor(amountAfterDeduction)}
              />
              <RowKV
                k="GST (18%)"
                v={Math.floor(amountAfterDeduction * 0.18)}
              />
              <Divider sx={{ my: 1 }} />
              <RowKV
                k={<Typography sx={{ fontWeight: 800 }}>Bill Total</Typography>}
                v={
                  <Typography sx={{ fontWeight: 800 }}>
                    {Math.floor(String(grandTotal))}
                  </Typography>
                }
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#7c3aed",
                color: "#fff",
                mt: 2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
              }}
              onClick={downloadInvoice}
            >
              Download Invoice
            </Button>
          </Paper>

          {/* Customer Info */}
          {/* <SectionCard icon={<PersonOutlineIcon />} title="Customer">
            <Field label="User Name" value={booking.user_name} />
            <Field label="User Email" value={booking.user_mailid} />
            <Field label="User Mobile" value={booking.user_mobile_number} />
            <Field label="User ID" value={booking.user_id} />
          </SectionCard> */}
        </Grid>
      </Grid>

      <Banner />

      {/* Cancellation Modal */}
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
            width: 420,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "16px",
          }}
        >
          <Typography
            id="cancellation-policy-title"
            variant="h6"
            sx={{ mb: 2 }}
          >
            Cancellation & Reschedule Policy
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

          <Stack direction="row" spacing={1} alignItems="center">
            <CheckboxLike checked={isChecked} onChange={handleCheckboxChange} />
            <Typography>
              I agree to the cancellation/reschedule policy
            </Typography>
          </Stack>

          {canCancel && (
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
        </Box>
      </Modal>

      {/* Reschedule Modal */}
      <RescheduleModal
        open={openReschedule}
        handleClose={handleCloseReschedule}
        formData={formData}
        setFormData={setFormData}
        handleRescheduleOrder={handleRescheduleOrder}
        days={days}
      />
    </Box>
  );
};

// ------------- Small UI helpers -------------
const RowKV = ({ k, v }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
    <Typography variant="body2">{k}</Typography>
    <Typography variant="body2">{v}</Typography>
  </Box>
);

const CheckboxLike = ({ checked, onChange }) => (
  <Box
    onClick={(e) => onChange({ target: { checked: !checked } })}
    sx={{
      width: 20,
      height: 20,
      borderRadius: 0.8,
      border: "1.5px solid #7c3aed",
      bgcolor: checked ? "#7c3aed" : "#fff",
      cursor: "pointer",
    }}
  />
);

export default BookingDetails;
