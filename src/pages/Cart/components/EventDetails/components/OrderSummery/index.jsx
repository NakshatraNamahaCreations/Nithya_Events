// import {
//   Box,
//   Button,
//   Divider,
//   Grid,
//   Modal,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import Calendar from "../../../../../Calender";

// const OrderSummary = ({
//   cartItems,
//   technicianItems,
//   servicesItem,
//   billingDetails,
//   startDate,
//   endDate,
//   eventName,
//   venueName,
//   startTime,
//   endTime,
//   receiverName,
//   receiverMobile,
//   location,
//   uploadedFiles,
//   handleConfirmOrder,
// }) => {
//   const { numberOfDays } = useSelector((state) => state.date);
//   const [openModal, setOpenModal] = useState(false);
//   const [isCalenderOpen, setIsCalenderOpen] = useState(false);

//   // ✅ New states for address selection
//   const [selectedAddress, setSelectedAddress] = useState(location || "");
//   const [selectedPosition, setSelectedPosition] = useState(null);

//   const containerStyle = {
//     width: "100%",
//     height: "200px",
//   };

//   // Default fallback if no location found
//   const defaultCenter = {
//     lat: 12.9716,
//     lng: 77.5946,
//   };

//   const [center, setCenter] = useState(defaultCenter);

//   useEffect(() => {
//     if (
//       location &&
//       typeof location === "object" &&
//       location.lat &&
//       location.lng
//     ) {
//       setCenter({ lat: location.lat, lng: location.lng });
//       setSelectedPosition({ lat: location.lat, lng: location.lng });
//     } else if (typeof location === "string") {
//       // If location is a string (address)
//       setSelectedAddress(location);
//     }
//   }, [location]);

//   const handleOpenModal = () => setOpenModal(true);
//   const handleCloseModal = () => setOpenModal(false);

//   const handleModify = () => {
//     setIsCalenderOpen(true);
//     handleCloseModal();
//   };

//   const handleCalendarClose = () => {
//     setIsCalenderOpen(false);
//   };

//   // ✅ Handle map click to select location
//   const handleMapClick = async (event) => {
//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();
//     setSelectedPosition({ lat, lng });

//     // Reverse geocode for address
//     try {
//       const res = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g`
//       );
//       const data = await res.json();
//       if (data.status === "OK" && data.results.length > 0) {
//         setSelectedAddress(data.results[0].formatted_address);
//       } else {
//         setSelectedAddress("Unknown location");
//       }
//     } catch (error) {
//       console.error("Geocoding error:", error);
//     }
//   };

// const handleConfirm = () => {
//   // ✅ Pass the selected location back to parent for saving
//   const finalLocation = selectedPosition
//     ? { ...selectedPosition, address: selectedAddress }
//     : { address: selectedAddress };
//   handleConfirmOrder(finalLocation);
//   handleCloseModal();
// };

//   const renderFilePreview = (file, previewUrl, label) => {
//     if (!file) return null;
//     const isImage = file.type.startsWith("image/");
//     const isPDF = file.type === "application/pdf";

//     return (
//       <Box sx={{ display: "flex" }}>
//         <Box sx={{ margin: "1rem 0" }}>
//           <Typography variant="subtitle1">{label}</Typography>
//           {isImage && (
//             <img
//               src={previewUrl}
//               alt={label}
//               style={{ maxWidth: "60%", maxHeight: "200px" }}
//             />
//           )}
//           {isPDF && (
//             <iframe
//               src={previewUrl}
//               title={label}
//               style={{ width: "140%", height: "300px" }}
//             />
//           )}
//           {!isImage && !isPDF && (
//             <Typography variant="body2">{file.name}</Typography>
//           )}
//         </Box>
//       </Box>
//     );
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 500,
//         mx: "auto",
//         p: 3,
//         bgcolor: "background.paper",
//         boxShadow: 3,
//         borderRadius: 2,
//         overflowY: "auto",
//         height: "570px",
//         marginTop: "5rem",
//       }}
//     >
//       <Typography
//         variant="h6"
//         sx={{ textAlign: "center", fontWeight: "bold", color: "#c026d3" }}
//       >
//         Order Summary
//       </Typography>
//       <Divider sx={{ my: 2 }} />

//       {/* Products Section */}
//       {cartItems?.length > 0 && (
//         <>
//           <Typography variant="subtitle1" fontWeight="bold">
//             Products
//           </Typography>
//           {cartItems.map((item, index) => (
//             <Grid container key={index} sx={{ mb: 1 }}>
//               <Grid item xs={8}>
//                 <Typography sx={{ fontSize: "0.9rem" }}>
//                   {item.productName}{" "}
//                   <span style={{ fontWeight: "bold" }}>x{item.quantity}</span>
//                 </Typography>
//               </Grid>
//               <Grid item xs={4} sx={{ textAlign: "right" }}>
//                 ₹{item.productPrice.toLocaleString()}
//               </Grid>
//             </Grid>
//           ))}
//           <Divider sx={{ my: 2 }} />
//         </>
//       )}

//       {/* Technicians Section */}
//       {technicianItems?.length > 0 && (
//         <>
//           <Typography variant="subtitle1" fontWeight="bold">
//             🛠️ Technicians
//           </Typography>
//           {technicianItems.map((item, index) => (
//             <Grid container key={index} sx={{ mb: 1 }}>
//               <Grid item xs={8}>
//                 {item.service_name}{" "}
//                 <span style={{ fontWeight: "bold" }}>x{item.quantity}</span>
//               </Grid>
//               <Grid item xs={4} sx={{ textAlign: "right" }}>
//                 ₹{item.price.toLocaleString()}
//               </Grid>
//             </Grid>
//           ))}
//           <Divider sx={{ my: 2 }} />
//         </>
//       )}

//       {/* Services Section */}
//       {servicesItem?.length > 0 && (
//         <>
//           <Typography variant="subtitle1" fontWeight="bold">
//             Services
//           </Typography>
//           {servicesItem.map((item, index) => (
//             <Grid container key={index} sx={{ mb: 1 }}>
//               <Grid item xs={8}>
//                 {item.shopName}{" "}
//                 <span style={{ fontWeight: "bold" }}>x{item.quantity}</span>
//               </Grid>
//               <Grid item xs={4} sx={{ textAlign: "right" }}>
//                 ₹{item.totalPrice.toLocaleString()}
//               </Grid>
//             </Grid>
//           ))}
//           <Divider sx={{ my: 2 }} />
//         </>
//       )}

//       {/* Billing Details */}
//       <Grid container>
//         <Grid item xs={6}>
//           <Typography>Total</Typography>
//         </Grid>
//         <Grid item xs={6} sx={{ textAlign: "right" }}>
//           ₹{billingDetails?.cartValue?.toLocaleString()}
//         </Grid>
//         <Grid item xs={6}>
//           Event Days
//         </Grid>
//         <Grid item xs={6} sx={{ textAlign: "right" }}>
//           {numberOfDays} Days
//         </Grid>
//       </Grid>
//       <Divider sx={{ my: 2 }} />

//       <Grid container>
//         <Grid item xs={6}>
//           Base Amount
//         </Grid>
//         <Grid item xs={6} sx={{ textAlign: "right" }}>
//           ₹{billingDetails.baseAmount?.toLocaleString()}
//         </Grid>
//         <Grid item xs={6}>
//           TDS Charges (2%)
//         </Grid>
//         <Grid item xs={6} sx={{ textAlign: "right" }}>
//           -₹{billingDetails?.tdsCharges?.toLocaleString()}
//         </Grid>
//         <Grid item xs={6}>
//           Amount After TDS
//         </Grid>
//         <Grid item xs={6} sx={{ textAlign: "right" }}>
//           ₹{billingDetails?.amountAfterTds?.toLocaleString()}
//         </Grid>
//         <Grid item xs={6}>
//           CGST (9%)
//         </Grid>
//         <Grid item xs={6} sx={{ textAlign: "right" }}>
//           ₹{billingDetails?.cgst?.toLocaleString()}
//         </Grid>
//         <Grid item xs={6}>
//           SGST (9%)
//         </Grid>
//         <Grid item xs={6} sx={{ textAlign: "right" }}>
//           ₹{billingDetails?.sgst?.toLocaleString()}
//         </Grid>
//       </Grid>
//       <Divider sx={{ my: 2 }} />

//       <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//         <Typography fontWeight="bold">Grand Total (GST + TDS)</Typography>
//         <Typography fontWeight="bold">
//           ₹{billingDetails?.grandTotal?.toLocaleString()}
//         </Typography>
//       </Box>

//       <Divider sx={{ my: 2 }} />

//       {/* Event & Location */}
//       <Typography
//         variant="h6"
//         sx={{ fontWeight: "bold", mt: 2, color: "#c026d3" }}
//       >
//         Event Details
//       </Typography>

//       <LoadScript googleMapsApiKey="AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g">
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={selectedPosition || center}
//           zoom={14}
//           onClick={handleMapClick}
//         >
//           {selectedPosition && <Marker position={selectedPosition} />}
//         </GoogleMap>
//       </LoadScript>

//       <Box sx={{ mt: 2 }}>
//         <Typography variant="body1">
//           <strong>{eventName}</strong>
//         </Typography>
//         <Typography variant="p">
//           <strong>{venueName}</strong>
//         </Typography>
//         <Typography variant="body2" color="textSecondary">
//           {selectedAddress || "Click map to select location"}
//         </Typography>
//         <Typography variant="body2" color="textSecondary">
//           {startDate} to {endDate} | {startTime} - {endTime}
//         </Typography>
//         <Typography variant="body2" color="textSecondary">
//           👤 {receiverName} 📞 {receiverMobile}
//         </Typography>
//       </Box>

//       <TextField
//         fullWidth
//         multiline
//         rows={3}
//         placeholder="Enter your message to vendor (Optional)"
//         variant="outlined"
//         sx={{ mt: 2 }}
//       />

//       {/* File Previews */}
//       <Box sx={{ display: "flex" }}>
//         {renderFilePreview(
//           uploadedFiles.invitation,
//           uploadedFiles.invitationPreview,
//           "Invitation Preview"
//         )}
//         {renderFilePreview(
//           uploadedFiles.gatePass,
//           uploadedFiles.gatePassPreview,
//           "Gate Pass Preview"
//         )}
//       </Box>

//       {/* Action Buttons */}
//       <Box sx={{ mt: 3, textAlign: "center" }}>
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           sx={{ background: "#c026d3", mb: 2 }}
//           onClick={handleOpenModal}
//         >
//           Proceed to Pay ₹{billingDetails.grandTotal.toLocaleString()}
//         </Button>
//         <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//           Safe, easy, and secure Payments
//         </Typography>
//       </Box>

//       {/* Confirmation Modal */}
//       <Modal open={openModal} onClose={handleCloseModal}>
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
//             borderRadius: 2,
//             textAlign: "center",
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{ mb: 2, fontWeight: "bold", color: "#c026d3" }}
//           >
//             Setup and Rehearsal
//           </Typography>
//           <Typography sx={{ mb: 3, color: "#555" }}>
//             Ensure the selected date and address are correct.
//           </Typography>
//           <Grid container spacing={2} justifyContent="center">
//             <Grid item>
//               <Button
//                 variant="outlined"
//                 onClick={handleModify}
//                 sx={{
//                   borderColor: "#c026d3",
//                   color: "#c026d3",
//                   textTransform: "none",
//                   fontWeight: "bold",
//                   px: 3,
//                 }}
//               >
//                 Modify Date
//               </Button>
//             </Grid>
//             <Grid item>
//               <Button
//                 variant="contained"
//                 onClick={handleConfirm}
//                 sx={{
//                   backgroundColor: "#c026d3",
//                   color: "white",
//                   textTransform: "none",
//                   fontWeight: "bold",
//                   px: 3,
//                 }}
//               >
//                 Confirm & Pay
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//       </Modal>

//       {/* Calendar Modal */}
//       <Modal open={isCalenderOpen}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             bgcolor: "background.paper",
//             borderRadius: "16px",
//             boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
//             p: 4,
//             width: "450px",
//             maxWidth: "95%",
//             textAlign: "center",
//           }}
//         >
//           <Calendar
//             handleCalendarClose={handleCalendarClose}
//             calendarClose={handleCalendarClose}
//           />
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default OrderSummary;

// import {
//   Box,
//   Button,
//   Divider,
//   Grid,
//   Modal,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import dayjs from "dayjs";
// import Calendar from "../../../../../Calender";
// import { useNavigate } from "react-router-dom";

// const OrderSummary = ({
//   cartItems = [],
//   technicianItems = [],
//   servicesItem = [],
//   billingDetails = {},
//   startDate = "",
//   endDate = "",
//   eventName = "",
//   venueName = "",
//   startTime = null,
//   endTime = null,
//   venueStartTime = null,
//   venueEndTime = null,
//   eventSetupStartDate = null,
//   eventSetupEndDate = null,
//   rehearsalDate = null,
//   receiverName = "",
//   receiverMobile = "",
//   location = "",
//   locationLat = null,
//   locationLng = null,
//   uploadedFiles = {},
//   handleConfirmOrder,
// }) => {
//   const { numberOfDays } = useSelector((state) => state.date);
//   const [openModal, setOpenModal] = useState(false);
//   const [isCalenderOpen, setIsCalenderOpen] = useState(false);
//   const [selectedAddress, setSelectedAddress] = useState("");
//   const [selectedPosition, setSelectedPosition] = useState(null);
//   const defaultCenter = { lat: 12.9716, lng: 77.5946 };
//   const [center, setCenter] = useState(defaultCenter);
//   const navigate = useNavigate();
//   // Function to geocode address
//   // const geocodeAddress = async (address) => {
//   //   try {
//   //     const response = await fetch(
//   //       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//   //         address
//   //       )}&key=AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g`
//   //     );
//   //     const data = await response.json();
//   //     if (data.status === "OK" && data.results[0]) {
//   //       const { lat, lng } = data.results[0].geometry.location;
//   //       setCenter({ lat, lng });
//   //       setSelectedPosition({ lat, lng });
//   //       setSelectedAddress(data.results[0].formatted_address);
//   //     }
//   //   } catch (error) {
//   //     console.error("Geocoding error:", error);
//   //   }
//   // };

//   useEffect(() => {
//     const initializeMap = async () => {
//       // Use the complete venue address
//       const venueAddress = "2nd & 4th Floor, 199/20/1/A, Dr.Vishnuvardhan Rd, Reflex Housing Layout, Hemmigepura Ward 198, Rajarajeshwari Nagar, Bengaluru, Karnataka 560060, India";

//       try {
//         // First try to use provided coordinates
//         if (location && typeof location === "object" && location.lat && location.lng) {
//           setCenter({ lat: location.lat, lng: location.lng });
//           setSelectedPosition({ lat: location.lat, lng: location.lng });
//           setSelectedAddress(location.address || "");
//         } else if (locationLat && locationLng) {
//           const lat = parseFloat(locationLat);
//           const lng = parseFloat(locationLng);
//           setCenter({ lat, lng });
//           setSelectedPosition({ lat, lng });
//           setSelectedAddress(venueAddress);
//         } else {
//           // If no coordinates, geocode the venue address
//           const response = await fetch(
//             `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//               venueAddress
//             )}&key=AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g`
//           );
//           const data = await response.json();

//           if (data.status === "OK" && data.results[0]) {
//             const { lat, lng } = data.results[0].geometry.location;
//             console.log("Geocoding successful:", { lat, lng });
//             setCenter({ lat, lng });
//             setSelectedPosition({ lat, lng });
//             setSelectedAddress(data.results[0].formatted_address);
//           } else {
//             console.error("Geocoding failed:", data);
//             // Fallback to default Bangalore coordinates
//             setCenter(defaultCenter);
//             setSelectedPosition(defaultCenter);
//             setSelectedAddress(venueAddress);
//           }
//         }
//       } catch (error) {
//         console.error("Map initialization error:", error);
//         // Fallback to default Bangalore coordinates
//         setCenter(defaultCenter);
//         setSelectedPosition(defaultCenter);
//         setSelectedAddress(venueAddress);
//       }
//     };

//     initializeMap();
//   }, [location, locationLat, locationLng]);

//   const handleMapClick = async (event) => {
//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();
//     setSelectedPosition({ lat, lng });
//     try {
//       const res = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g`
//       );
//       const data = await res.json();
//       if (data.status === "OK" && data.results.length > 0) {
//         setSelectedAddress(data.results[0].formatted_address);
//       } else {
//         setSelectedAddress("Unknown location");
//       }
//     } catch (error) {
//       console.error("Geocoding error:", error);
//     }
//   };

//   const handleOpenModal = () => setOpenModal(true);
//   const handleCloseModal = () => setOpenModal(false);
//   const handleModify = () => {
//     setIsCalenderOpen(true);
//     handleCloseModal();
//   };
//   const handleCalendarClose = () => setIsCalenderOpen(false);

// const handleConfirm = () => {
//   const finalLocation = selectedPosition
//     ? { ...selectedPosition, address: selectedAddress }
//     : { address: selectedAddress };
//   handleConfirmOrder(finalLocation);
//   handleCloseModal();
//   navigate("/booking")
// };

//   const calculateTax = (amount) => (amount ? (amount * 0.09).toFixed(2) : 0);
//   const baseAmount = billingDetails.baseAmount || 0;
//   const tdsCharges =
//     billingDetails.tdsCharges || (baseAmount * 0.02).toFixed(2);
//   const amountAfterTds =
//     billingDetails.amountAfterTds ||
//     (baseAmount - parseFloat(tdsCharges)).toFixed(2);
//   const cgst = billingDetails.cgst || calculateTax(amountAfterTds);
//   const sgst = billingDetails.sgst || calculateTax(amountAfterTds);
//   const grandTotal =
//     billingDetails.grandTotal ||
//     (parseFloat(amountAfterTds) + parseFloat(cgst) + parseFloat(sgst)).toFixed(
//       2
//     );

//   const formatTime = (time) =>
//     time
//       ? dayjs(time).isValid()
//         ? dayjs(time).format("hh:mm A")
//         : String(time)
//       : "";
//   const formatDate = (date) =>
//     date
//       ? dayjs(date).isValid()
//         ? dayjs(date).format("DD/MM/YYYY")
//         : String(date)
//       : "";

//   const formattedStartTime = formatTime(startTime);
//   const formattedEndTime = formatTime(endTime);
//   const formattedVenueStartTime = formatTime(venueStartTime);
//   const formattedVenueEndTime = formatTime(venueEndTime);
//   const formattedSetupStartDate = formatDate(eventSetupStartDate);
//   const formattedSetupEndDate = formatDate(eventSetupEndDate);
//   const formattedRehearsalDate = formatDate(rehearsalDate);

//   const renderFilePreview = (file, previewUrl, label) => {
//     if (!file) return null;
//     const isImage = file.type?.startsWith("image/");
//     const isPDF = file.type === "application/pdf";

//     return (
//       <Box sx={{ marginRight: 2 }}>
//         <Typography variant="subtitle2">{label}</Typography>
//         {isImage && (
//           <img
//             src={previewUrl}
//             alt={label}
//             style={{ maxWidth: 160, borderRadius: 8 }}
//           />
//         )}
//         {isPDF && (
//           <iframe
//             src={previewUrl}
//             title={label}
//             style={{ width: 160, height: 200, borderRadius: 8 }}
//           />
//         )}
//         {!isImage && !isPDF && (
//           <Typography variant="body2">{file.name}</Typography>
//         )}
//       </Box>
//     );
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 500,
//         mx: "auto",
//         p: 3,
//         bgcolor: "background.paper",
//         boxShadow: 3,
//         borderRadius: 2,
//         overflowY: "auto",
//         height: "90vh",
//         mt: 5,
//       }}
//     >
//       <Typography variant="h5" align="center" fontWeight="bold" color="#c026d3">
//         Order Summary
//       </Typography>

//       {/* Products */}
//       {cartItems.length > 0 && (
//         <Box sx={{ mt: 3, mb: 2, p: 2, bgcolor: "#f9f9fc", borderRadius: 2 }}>
//           <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
//             Products
//           </Typography>
//           {cartItems.map((item, index) => (
//             <Grid container key={index}>
//               <Grid item xs={8}>
//                 <Typography>
//                   {item.productName} x{item.quantity}
//                 </Typography>
//               </Grid>
//               <Grid item xs={4} sx={{ textAlign: "right" }}>
//                 ₹{item.productPrice.toLocaleString()}
//               </Grid>
//             </Grid>
//           ))}
//         </Box>
//       )}

//       {/* Technicians */}
//       {technicianItems.length > 0 && (
//         <Box sx={{ mb: 2, p: 2, bgcolor: "#f9f9fc", borderRadius: 2 }}>
//           <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
//             Technicians
//           </Typography>
//           {technicianItems.map((item, index) => (
//             <Grid container key={index}>
//               <Grid item xs={8}>
//                 <Typography>
//                   {item.service_name} x{item.quantity}
//                 </Typography>
//               </Grid>
//               <Grid item xs={4} sx={{ textAlign: "right" }}>
//                 ₹{item.price.toLocaleString()}
//               </Grid>
//             </Grid>
//           ))}
//         </Box>
//       )}

//       {/* Services */}
//       {servicesItem.length > 0 && (
//         <Box sx={{ mb: 2, p: 2, bgcolor: "#f9f9fc", borderRadius: 2 }}>
//           <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
//             Services
//           </Typography>
//           {servicesItem.map((item, index) => (
//             <Grid container key={index}>
//               <Grid item xs={8}>
//                 <Typography>
//                   {item.shopName} x{item.quantity}
//                 </Typography>
//               </Grid>
//               <Grid item xs={4} sx={{ textAlign: "right" }}>
//                 ₹{item.totalPrice.toLocaleString()}
//               </Grid>
//             </Grid>
//           ))}
//         </Box>
//       )}

//       {/* Billing */}
//       <Box
//         sx={{
//           mb: 2,
//           p: 2,
//           bgcolor: "#fff7ed",
//           border: "1px solid #ffd8a8",
//           borderRadius: 2,
//         }}
//       >
//         <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
//           Billing Summary
//         </Typography>
//         <Grid container>
//           <Grid item xs={6}>
//             Total
//           </Grid>
//           <Grid item xs={6} sx={{ textAlign: "right" }}>
//             ₹{billingDetails.cartValue?.toLocaleString() || "0"}
//           </Grid>
//           <Grid item xs={6}>
//             Event Days
//           </Grid>
//           <Grid item xs={6} sx={{ textAlign: "right" }}>
//             {numberOfDays || 1} Days
//           </Grid>
//           <Grid item xs={6}>
//             Base Amount
//           </Grid>
//           <Grid item xs={6} sx={{ textAlign: "right" }}>
//             ₹{baseAmount.toLocaleString()}
//           </Grid>
//           <Grid item xs={6}>
//             TDS (2%)
//           </Grid>
//           <Grid item xs={6} sx={{ textAlign: "right" }}>
//             -₹{tdsCharges.toLocaleString()}
//           </Grid>
//           <Grid item xs={6}>
//             Amount After TDS
//           </Grid>
//           <Grid item xs={6} sx={{ textAlign: "right" }}>
//             ₹{amountAfterTds.toLocaleString()}
//           </Grid>
//           <Grid item xs={6}>
//             CGST (9%)
//           </Grid>
//           <Grid item xs={6} sx={{ textAlign: "right" }}>
//             ₹{cgst.toLocaleString()}
//           </Grid>
//           <Grid item xs={6}>
//             SGST (9%)
//           </Grid>
//           <Grid item xs={6} sx={{ textAlign: "right" }}>
//             ₹{sgst.toLocaleString()}
//           </Grid>
//         </Grid>
//         <Divider sx={{ my: 1 }} />
//         <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Typography fontWeight="bold">Grand Total</Typography>
//           <Typography fontWeight="bold">
//             ₹{grandTotal.toLocaleString()}
//           </Typography>
//         </Box>
//       </Box>

//       {/* Event Info */}
//       <Box sx={{ mt: 3 }}>
//         <Typography variant="h6" fontWeight="bold" color="#c026d3">
//           Event Details
//         </Typography>
//         <Typography variant="body2" fontWeight="bold">
//           {eventName}
//         </Typography>
//         <Typography variant="body2">Venue: {venueName}</Typography>
//         <Typography variant="body2">
//           Address: {selectedAddress || location}
//         </Typography>
//         <Typography variant="body2">
//           📆 {startDate} to {endDate}
//         </Typography>
//         <Typography variant="body2">
//           ⏰ {formattedStartTime} - {formattedEndTime}
//         </Typography>
//         {formattedSetupStartDate && (
//           <Typography variant="body2">
//             Setup: {formattedSetupStartDate} to {formattedSetupEndDate}
//           </Typography>
//         )}
//         {formattedRehearsalDate && (
//           <Typography variant="body2">
//             Rehearsal: {formattedRehearsalDate}
//           </Typography>
//         )}
//         <Typography variant="body2">
//           👤 {receiverName} 📞 {receiverMobile}
//         </Typography>
//       </Box>

//       {/* Map */}
//       {/* <LoadScript googleMapsApiKey="AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g">
//         <GoogleMap
//           mapContainerStyle={{
//             width: "100%",
//             height: "200px",
//             borderRadius: 8,
//             marginTop: 10,
//           }}
//           center={selectedPosition || center}
//           zoom={16}
//           options={{
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: false,
//           }}
//         >
//           {selectedPosition && (
//             <Marker
//               position={selectedPosition}
//               title="Big barrel"
//               label={{
//                 text: "Big barrel",
//                 color: "white",
//                 fontSize: "14px",
//                 fontWeight: "bold"
//               }}
//             />
//           )}
//         </GoogleMap>
//       </LoadScript> */}

//       {/* Message */}
//       <TextField
//         fullWidth
//         multiline
//         rows={3}
//         placeholder="Enter your message to vendor (Optional)"
//         variant="outlined"
//         sx={{ mt: 3 }}
//       />

//       {/* File Previews */}
//       <Box sx={{ display: "flex", mt: 2 }}>
//         {renderFilePreview(
//           uploadedFiles.invitation,
//           uploadedFiles.invitationPreview,
//           "Invitation"
//         )}
//         {renderFilePreview(
//           uploadedFiles.gatePass,
//           uploadedFiles.gatePassPreview,
//           "Gate Pass"
//         )}
//       </Box>

//       {/* Action */}
//       <Button
//         variant="contained"
//         fullWidth
//         sx={{
//           mt: 3,
//           backgroundColor: "#c026d3",
//           fontWeight: "bold",
//           fontSize: "1rem",
//           py: 1.2,
//           "&:hover": {
//             backgroundColor: "#a21caf",
//           },
//         }}
//         onClick={handleOpenModal}
//       >
//         Proceed to Pay ₹{grandTotal.toLocaleString()}
//       </Button>

//       {/* Modal */}
//       <Modal open={openModal} onClose={handleCloseModal}>
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
//             borderRadius: 3,
//             textAlign: "center",
//           }}
//         >
//           <Typography
//             variant="h6"
//             fontWeight="bold"
//             color="#c026d3"
//             gutterBottom
//           >
//             Confirm & Pay
//           </Typography>
//           <Typography variant="body2" sx={{ mb: 3 }}>
//             Please confirm your event and billing details before continuing.
//           </Typography>
//           <Button
//             variant="contained"
//             fullWidth
//             sx={{ backgroundColor: "#c026d3", fontWeight: "bold" }}
//             onClick={handleConfirm}
//           >
//             Confirm & Pay ₹{grandTotal.toLocaleString()}
//           </Button>
//         </Box>
//       </Modal>

//       {/* Calendar Modal */}
//       <Modal open={isCalenderOpen}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             bgcolor: "background.paper",
//             borderRadius: 2,
//             boxShadow: 24,
//             p: 4,
//             width: 450,
//             maxWidth: "95%",
//           }}
//         >
//           <Calendar
//             handleCalendarClose={handleCalendarClose}
//             calendarClose={handleCalendarClose}
//           />
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default OrderSummary;

// Mine code without Payment Gagtway
// import {
//   Box,
//   Button,
//   Divider,
//   Grid,
//   Modal,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import dayjs from "dayjs";
// import Calendar from "../../../../../Calender";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const OrderSummary = ({
//   cartItems = [],
//   technicianItems = [],
//   servicesItem = [],
//   billingDetails = {},
//   startDate = "",
//   endDate = "",
//   eventName = "",
//   venueName = "",
//   startTime = null,
//   endTime = null,
//   venueStartTime = null,
//   venueEndTime = null,
//   eventSetupStartDate = null,
//   eventSetupEndDate = null,
//   rehearsalDate = null,
//   receiverName = "",
//   receiverMobile = "",
//   location = "",
//   locationLat = null,
//   locationLng = null,
//   uploadedFiles = {},
//   handleConfirmOrder,
// }) => {
//   const { numberOfDays } = useSelector((state) => state.date);
//   const [openModal, setOpenModal] = useState(false);
//   const [isCalenderOpen, setIsCalenderOpen] = useState(false);
//   const [selectedAddress, setSelectedAddress] = useState("");
//   const [selectedPosition, setSelectedPosition] = useState(null);

//   const defaultCenter = { lat: 12.9716, lng: 77.5946 };
//   const [center, setCenter] = useState(defaultCenter);

//   const navigate = useNavigate();

//   // ✅ Get User from sessionStorage
//   const userDetail = sessionStorage.getItem("userDetails");
//   let userId = null;
//   let mobileNumber = null;

//   if (userDetail) {
//     try {
//       const userDetails = JSON.parse(userDetail);
//       userId = userDetails?._id || null;
//       mobileNumber = userDetails?.mobilenumber || null;
//     } catch (err) {
//       console.error("Error parsing userDetails:", err);
//     }
//   }

//   // ✅ Validate phone number
//   const validateMobileNumber = () => {
//     if (!mobileNumber || mobileNumber.length !== 10) {
//       alert("Mobile number must be 10 digits.");
//       return false;
//     }
//     return true;
//   };

//   const BASE_URL = "https://api.nithyaevent.com/api";

//   // ✅ Payment Integration
//   const startPayment = async () => {
//     if (!validateMobileNumber()) return;

//     try {
//       const payload = {
//         userId: userId,
//         amount: Number(grandTotal) * 100, // ✅ convert to paise
//         mobileNumber: mobileNumber,
//       };

//       console.log("Sending payment payload:", payload);

//       const res = await axios.post(
//         "https://api.nithyaevent.com/api/payment/initiate-payment",
//         payload
//       );

//       if (!res.data.success) {
//         alert("Unable to start payment");
//         return;
//       }

//       const { base64, sha256encode } = res.data;

//       // ✅ Create form for PhonePe redirection
//       const form = document.createElement("form");
//       form.method = "POST";
//       form.action = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

//       const input1 = document.createElement("input");
//       input1.type = "hidden";
//       input1.name = "request";
//       input1.value = base64;

//       const input2 = document.createElement("input");
//       input2.type = "hidden";
//       input2.name = "X-VERIFY";
//       input2.value = sha256encode;

//       form.appendChild(input1);
//       form.appendChild(input2);

//       document.body.appendChild(form);
//       form.submit();
//     } catch (error) {
//       console.error("Payment error:", error);
//       alert("Unable to start payment");
//     }
//   };

//   useEffect(() => {
//     const venueAddress =
//       "2nd & 4th Floor, 199/20/1/A, Dr.Vishnuvardhan Rd, Reflex Housing Layout, Hemmigepura Ward 198, Rajarajeshwari Nagar, Bengaluru, Karnataka 560060, India";

//     const initMap = async () => {
//       try {
//         if (
//           location &&
//           typeof location === "object" &&
//           location.lat &&
//           location.lng
//         ) {
//           setCenter({ lat: location.lat, lng: location.lng });
//           setSelectedPosition({ lat: location.lat, lng: location.lng });
//           setSelectedAddress(location.address || "");
//         } else if (locationLat && locationLng) {
//           const lat = parseFloat(locationLat);
//           const lng = parseFloat(locationLng);
//           setCenter({ lat, lng });
//           setSelectedPosition({ lat, lng });
//           setSelectedAddress(venueAddress);
//         } else {
//           setCenter(defaultCenter);
//           setSelectedPosition(defaultCenter);
//           setSelectedAddress(venueAddress);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     initMap();
//   }, [location, locationLat, locationLng]);

//   const handleOpenModal = () => setOpenModal(true);
//   const handleCloseModal = () => setOpenModal(false);
//   const handleModify = () => {
//     setIsCalenderOpen(true);
//     setOpenModal(false);
//   };

//   const handleCalendarClose = () => setIsCalenderOpen(false);

//   const handleConfirm = () => {
//     const finalLocation = selectedPosition
//       ? { ...selectedPosition, address: selectedAddress }
//       : { address: selectedAddress };
//     handleConfirmOrder(finalLocation);
//     handleCloseModal();
//     navigate("/booking");
//   };

//   const calculateTax = (amount) => (amount ? (amount * 0.09).toFixed(2) : 0);
//   const baseAmount = billingDetails.baseAmount || 0;
//   const tdsCharges =
//     billingDetails.tdsCharges || (baseAmount * 0.02).toFixed(2);
//   const amountAfterTds =
//     billingDetails.amountAfterTds ||
//     (baseAmount - parseFloat(tdsCharges)).toFixed(2);
//   const cgst = billingDetails.cgst || calculateTax(amountAfterTds);
//   const sgst = billingDetails.sgst || calculateTax(amountAfterTds);
//   const grandTotal =
//     billingDetails.grandTotal ||
//     (parseFloat(amountAfterTds) + parseFloat(cgst) + parseFloat(sgst)).toFixed(
//       2
//     );

//   const formatTime = (time) =>
//     time
//       ? dayjs(time).isValid()
//         ? dayjs(time).format("hh:mm A")
//         : String(time)
//       : "";
//   const formatDate = (date) =>
//     date
//       ? dayjs(date).isValid()
//         ? dayjs(date).format("DD/MM/YYYY")
//         : String(date)
//       : "";

//   const formattedStartTime = formatTime(startTime);
//   const formattedEndTime = formatTime(endTime);
//   const formattedSetupStartDate = formatDate(eventSetupStartDate);
//   const formattedSetupEndDate = formatDate(eventSetupEndDate);
//   const formattedRehearsalDate = formatDate(rehearsalDate);

//   const renderFilePreview = (file, previewUrl, label) => {
//     if (!file) return null;
//     const isImage = file.type?.startsWith("image/");
//     const isPDF = file.type === "application/pdf";
//     return (
//       <Box sx={{ marginRight: 2 }}>
//         <Typography variant="subtitle2">{label}</Typography>
//         {isImage && (
//           <img
//             src={previewUrl}
//             alt={label}
//             style={{ maxWidth: 160, borderRadius: 8 }}
//           />
//         )}
//         {isPDF && (
//           <iframe
//             src={previewUrl}
//             title={label}
//             style={{ width: 160, height: 200, borderRadius: 8 }}
//           />
//         )}
//         {!isImage && !isPDF && (
//           <Typography variant="body2">{file.name}</Typography>
//         )}
//       </Box>
//     );
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 500,
//         mx: "auto",
//         p: 3,
//         bgcolor: "background.paper",
//         boxShadow: 3,
//         borderRadius: 2,
//         overflowY: "auto",
//         height: "90vh",
//         mt: 5,
//       }}
//     >
//       <Typography variant="h5" align="center" fontWeight="bold" color="#c026d3">
//         Order Summary
//       </Typography>

//       {/* ✅ Products, Technicians, Services UI remains unchanged */}
//       {/* Products */}
//       {cartItems.length > 0 && (
//         <Box sx={{ mt: 3, mb: 2, p: 2, bgcolor: "#f9f9fc", borderRadius: 2 }}>
//           <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
//             Products
//           </Typography>
//           {cartItems.map((item, index) => (
//             <Grid container key={index}>
//               <Grid item xs={8}>
//                 <Typography>
//                   {item.productName} x{item.quantity}
//                 </Typography>
//               </Grid>
//               <Grid item xs={4} sx={{ textAlign: "right" }}>
//                 ₹{item.productPrice.toLocaleString()}
//               </Grid>
//             </Grid>
//           ))}
//         </Box>
//       )}

//       {/* Technicians */}
//       {technicianItems.length > 0 && (
//         <Box sx={{ mb: 2, p: 2, bgcolor: "#f9f9fc", borderRadius: 2 }}>
//           <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
//             Technicians
//           </Typography>
//           {technicianItems.map((item, index) => (
//             <Grid container key={index}>
//               <Grid item xs={8}>
//                 <Typography>
//                   {item.service_name} x{item.quantity}
//                 </Typography>
//               </Grid>
//               <Grid item xs={4} sx={{ textAlign: "right" }}>
//                 ₹{item.price.toLocaleString()}
//               </Grid>
//             </Grid>
//           ))}
//         </Box>
//       )}

//       {/* Services */}
//       {servicesItem.length > 0 && (
//         <Box sx={{ mb: 2, p: 2, bgcolor: "#f9f9fc", borderRadius: 2 }}>
//           <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
//             Services
//           </Typography>
//           {servicesItem.map((item, index) => (
//             <Grid container key={index}>
//               <Grid item xs={8}>
//                 <Typography>
//                   {item.shopName} x{item.quantity}
//                 </Typography>
//               </Grid>
//               <Grid item xs={4} sx={{ textAlign: "right" }}>
//                 ₹{item.totalPrice.toLocaleString()}
//               </Grid>
//             </Grid>
//           ))}
//         </Box>
//       )}

//       {/* Billing */}
//       <Box
//         sx={{
//           mb: 2,
//           p: 2,
//           bgcolor: "#fff7ed",
//           border: "1px solid #ffd8a8",
//           borderRadius: 2,
//         }}
//       >
//         <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
//           Billing Summary
//         </Typography>
//         <Grid container>
//           <Grid item xs={6}>
//             Total
//           </Grid>
//           <Grid item xs={6} sx={{ textAlign: "right" }}>
//             ₹{billingDetails.cartValue?.toLocaleString() || "0"}
//           </Grid>
//           <Grid item xs={6}>
//             Event Days
//           </Grid>
//           <Grid item xs={6} sx={{ textAlign: "right" }}>
//             {numberOfDays || 1} Days
//           </Grid>
//           <Grid item xs={6}>
//             Base Amount
//           </Grid>
//           <Grid item xs={6} sx={{ textAlign: "right" }}>
//             ₹{baseAmount.toLocaleString()}
//           </Grid>
//           <Grid item xs={6}>
//             TDS (2%)
//           </Grid>
//           <Grid item xs={6} sx={{ textAlign: "right" }}>
//             -₹{tdsCharges.toLocaleString()}
//           </Grid>
//           <Grid item xs={6}>
//             Amount After TDS
//           </Grid>
//           <Grid item xs={6} sx={{ textAlign: "right" }}>
//             ₹{amountAfterTds.toLocaleString()}
//           </Grid>
//           <Grid item xs={6}>
//             CGST (9%)
//           </Grid>
//           <Grid item xs={6} sx={{ textAlign: "right" }}>
//             ₹{cgst.toLocaleString()}
//           </Grid>
//           <Grid item xs={6}>
//             SGST (9%)
//           </Grid>
//           <Grid item xs={6} sx={{ textAlign: "right" }}>
//             ₹{sgst.toLocaleString()}
//           </Grid>
//         </Grid>
//         <Divider sx={{ my: 1 }} />
//         <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Typography fontWeight="bold">Grand Total</Typography>
//           <Typography fontWeight="bold">
//             ₹{grandTotal.toLocaleString()}
//           </Typography>
//         </Box>
//       </Box>

//       {/* Event Info */}
//       <Box sx={{ mt: 3 }}>
//         <Typography variant="h6" fontWeight="bold" color="#c026d3">
//           Event Details
//         </Typography>
//         <Typography variant="body2" fontWeight="bold">
//           {eventName}
//         </Typography>
//         <Typography variant="body2">Venue: {venueName}</Typography>
//         <Typography variant="body2">
//           Address: {selectedAddress || location}
//         </Typography>
//         <Typography variant="body2">
//           📆 {startDate} to {endDate}
//         </Typography>
//         <Typography variant="body2">
//           ⏰ {formattedStartTime} - {formattedEndTime}
//         </Typography>
//         {formattedSetupStartDate && (
//           <Typography variant="body2">
//             Setup: {formattedSetupStartDate} to {formattedSetupEndDate}
//           </Typography>
//         )}
//         {formattedRehearsalDate && (
//           <Typography variant="body2">
//             Rehearsal: {formattedRehearsalDate}
//           </Typography>
//         )}
//         <Typography variant="body2">
//           👤 {receiverName} 📞 {receiverMobile}
//         </Typography>
//       </Box>

//       {/* Message */}
//       <TextField
//         fullWidth
//         multiline
//         rows={3}
//         placeholder="Enter your message to vendor (Optional)"
//         variant="outlined"
//         sx={{ mt: 3 }}
//       />

//       {/* File Previews */}
//       <Box sx={{ display: "flex", mt: 2 }}>
//         {renderFilePreview(
//           uploadedFiles.invitation,
//           uploadedFiles.invitationPreview,
//           "Invitation"
//         )}
//         {renderFilePreview(
//           uploadedFiles.gatePass,
//           uploadedFiles.gatePassPreview,
//           "Gate Pass"
//         )}
//       </Box>

//       {/* ✅ PAY BUTTON */}
//       <Button
//         variant="contained"
//         fullWidth
//         sx={{
//           mt: 3,
//           backgroundColor: "#c026d3",
//           fontWeight: "bold",
//           fontSize: "1rem",
//           py: 1.2,
//           "&:hover": {
//             backgroundColor: "#a21caf",
//           },
//         }}
//         onClick={handleOpenModal}
//       >
//         Proceed to Pay ₹{grandTotal.toLocaleString()}
//       </Button>

//       {/* ✅ CONFIRM PAYMENT MODAL */}
//       <Modal open={openModal} onClose={handleCloseModal}>
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
//             borderRadius: 3,
//             textAlign: "center",
//           }}
//         >
//           <Typography
//             variant="h6"
//             fontWeight="bold"
//             color="#c026d3"
//             gutterBottom
//           >
//             Confirm & Pay
//           </Typography>

//           <Typography variant="body2" sx={{ mb: 3 }}>
//             Please confirm your event and billing details before continuing.
//           </Typography>

//           <Button
//             variant="contained"
//             fullWidth
//             sx={{ backgroundColor: "#c026d3", fontWeight: "bold" }}
//             onClick={handleConfirm}
//           >
//             Confirm & Pay ₹{grandTotal.toLocaleString()}
//           </Button>
//         </Box>
//       </Modal>

//       {/* Calendar Modal */}
//       <Modal open={isCalenderOpen}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             bgcolor: "background.paper",
//             borderRadius: 2,
//             boxShadow: 24,
//             p: 4,
//             width: 450,
//             maxWidth: "95%",
//           }}
//         >
//           <Calendar
//             handleCalendarClose={handleCalendarClose}
//             calendarClose={handleCalendarClose}
//           />
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default OrderSummary;

// Mine code with Payment Gagtway - 10-11-25

import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Calendar from "../../../../../Calender";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrderSummary = ({
  cartItems = [],
  technicianItems = [],
  servicesItem = [],
  billingDetails = {},
  startDate = "",
  endDate = "",
  eventName = "",
  venueName = "",
  startTime = null,
  endTime = null,
  venueStartTime = null,
  venueEndTime = null,
  eventSetupStartDate = null,
  eventSetupEndDate = null,
  rehearsalDate = null,
  receiverName = "",
  receiverMobile = "",
  location = "",
  locationLat = null,
  locationLng = null,
  uploadedFiles = {},
  handleConfirmOrder,
}) => {
  const { numberOfDays } = useSelector((state) => state.date);
  const [openModal, setOpenModal] = useState(false);
  const [isCalenderOpen, setIsCalenderOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(null);

  const defaultCenter = { lat: 12.9716, lng: 77.5946 };
  const [center, setCenter] = useState(defaultCenter);

  const BASE_URL = "http://localhost:9000";

  const navigate = useNavigate();

  // ✅ Get User from sessionStorage
  const userDetail = sessionStorage.getItem("userDetails");
  let userId = null;
  let mobileNumber = null;

  if (userDetail) {
    try {
      const userDetails = JSON.parse(userDetail);
      userId = userDetails?._id || null;
      mobileNumber = userDetails?.mobilenumber || null;
    } catch (err) {
      console.error("Error parsing userDetails:", err);
    }
  }

  // ✅ Validate phone number
  const validateMobileNumber = () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      alert("Mobile number must be 10 digits.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const venueAddress =
      "2nd & 4th Floor, 199/20/1/A, Dr.Vishnuvardhan Rd, Reflex Housing Layout, Hemmigepura Ward 198, Rajarajeshwari Nagar, Bengaluru, Karnataka 560060, India";

    const initMap = async () => {
      try {
        if (
          location &&
          typeof location === "object" &&
          location.lat &&
          location.lng
        ) {
          setCenter({ lat: location.lat, lng: location.lng });
          setSelectedPosition({ lat: location.lat, lng: location.lng });
          setSelectedAddress(location.address || "");
        } else if (locationLat && locationLng) {
          const lat = parseFloat(locationLat);
          const lng = parseFloat(locationLng);
          setCenter({ lat, lng });
          setSelectedPosition({ lat, lng });
          setSelectedAddress(venueAddress);
        } else {
          setCenter(defaultCenter);
          setSelectedPosition(defaultCenter);
          setSelectedAddress(venueAddress);
        }
      } catch (err) {
        console.error(err);
      }
    };

    initMap();
  }, [location, locationLat, locationLng]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleModify = () => {
    setIsCalenderOpen(true);
    setOpenModal(false);
  };

  const handleCalendarClose = () => setIsCalenderOpen(false);

  // ✅ ✅ PAYMENT GATEWAY INTEGRATION (PhonePe)
  const handleConfirm = async () => {
    try {
      if (!userId) {
        alert("User not logged in");
        return;
      }

      const initRes = await axios.post(`${BASE_URL}/api/payment/web-initiate`, {
        MUID: userId,
        name: receiverName,
        // amount: grandTotal,
        amount: 1,
        number: receiverMobile,
      });

      if (!initRes.data.success) {
        alert("Payment initiation failed");
        return;
      }

      const { paymentUrl, merchantTransactionId } = initRes.data;

      // ✅ store txn id to check status later
      sessionStorage.setItem("txnId", merchantTransactionId);

      // ✅ redirect user to PhonePe page
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Payment error:", error);
      alert("Unable to start payment");
    }
  };

  const calculateTax = (amount) => (amount ? (amount * 0.09).toFixed(2) : 0);
  const baseAmount = billingDetails.baseAmount || 0;
  const tdsCharges =
    billingDetails.tdsCharges || (baseAmount * 0.02).toFixed(2);
  const amountAfterTds =
    billingDetails.amountAfterTds ||
    (baseAmount - parseFloat(tdsCharges)).toFixed(2);
  const cgst = billingDetails.cgst || calculateTax(amountAfterTds);
  const sgst = billingDetails.sgst || calculateTax(amountAfterTds);
  const grandTotal =
    billingDetails.grandTotal ||
    (parseFloat(amountAfterTds) + parseFloat(cgst) + parseFloat(sgst)).toFixed(
      2
    );

  const formatTime = (time) =>
    time
      ? dayjs(time).isValid()
        ? dayjs(time).format("hh:mm A")
        : String(time)
      : "";
  const formatDate = (date) =>
    date
      ? dayjs(date).isValid()
        ? dayjs(date).format("DD/MM/YYYY")
        : String(date)
      : "";

  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = formatTime(endTime);
  const formattedSetupStartDate = formatDate(eventSetupStartDate);
  const formattedSetupEndDate = formatDate(eventSetupEndDate);
  const formattedRehearsalDate = formatDate(rehearsalDate);

  const renderFilePreview = (file, previewUrl, label) => {
    if (!file) return null;
    const isImage = file.type?.startsWith("image/");
    const isPDF = file.type === "application/pdf";
    return (
      <Box sx={{ marginRight: 2 }}>
        <Typography variant="subtitle2">{label}</Typography>
        {isImage && (
          <img
            src={previewUrl}
            alt={label}
            style={{ maxWidth: 160, borderRadius: 8 }}
          />
        )}
        {isPDF && (
          <iframe
            src={previewUrl}
            title={label}
            style={{ width: 160, height: 200, borderRadius: 8 }}
          />
        )}
        {!isImage && !isPDF && (
          <Typography variant="body2">{file.name}</Typography>
        )}
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
        height: "90vh",
        mt: 5,
      }}
    >
      <Typography variant="h5" align="center" fontWeight="bold" color="#c026d3">
        Order Summary
      </Typography>

      {/* ✅ Products, Technicians, Services UI remains unchanged */}
      {/* Products */}
      {cartItems.length > 0 && (
        <Box sx={{ mt: 3, mb: 2, p: 2, bgcolor: "#f9f9fc", borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Products
          </Typography>
          {cartItems.map((item, index) => (
            <Grid container key={index}>
              <Grid item xs={8}>
                <Typography>
                  {item.productName} x{item.quantity}
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                ₹{item.productPrice.toLocaleString()}
              </Grid>
            </Grid>
          ))}
        </Box>
      )}

      {/* Technicians */}
      {technicianItems.length > 0 && (
        <Box sx={{ mb: 2, p: 2, bgcolor: "#f9f9fc", borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Technicians
          </Typography>
          {technicianItems.map((item, index) => (
            <Grid container key={index}>
              <Grid item xs={8}>
                <Typography>
                  {item.service_name} x{item.quantity}
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                ₹{item.price.toLocaleString()}
              </Grid>
            </Grid>
          ))}
        </Box>
      )}

      {/* Services */}
      {servicesItem.length > 0 && (
        <Box sx={{ mb: 2, p: 2, bgcolor: "#f9f9fc", borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Services
          </Typography>
          {servicesItem.map((item, index) => (
            <Grid container key={index}>
              <Grid item xs={8}>
                <Typography>
                  {item.shopName} x{item.quantity}
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                ₹{item.totalPrice.toLocaleString()}
              </Grid>
            </Grid>
          ))}
        </Box>
      )}

      {/* Billing */}
      <Box
        sx={{
          mb: 2,
          p: 2,
          bgcolor: "#fff7ed",
          border: "1px solid #ffd8a8",
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Billing Summary
        </Typography>
        <Grid container>
          <Grid item xs={6}>
            Total
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            ₹{billingDetails.cartValue?.toLocaleString() || "0"}
          </Grid>
          <Grid item xs={6}>
            Event Days
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            {numberOfDays || 1} Days
          </Grid>
          <Grid item xs={6}>
            Base Amount
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            ₹{baseAmount.toLocaleString()}
          </Grid>
          <Grid item xs={6}>
            TDS (2%)
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            -₹{tdsCharges.toLocaleString()}
          </Grid>
          <Grid item xs={6}>
            Amount After TDS
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            ₹{amountAfterTds.toLocaleString()}
          </Grid>
          <Grid item xs={6}>
            CGST (9%)
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            ₹{cgst.toLocaleString()}
          </Grid>
          <Grid item xs={6}>
            SGST (9%)
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            ₹{sgst.toLocaleString()}
          </Grid>
        </Grid>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontWeight="bold">Grand Total</Typography>
          <Typography fontWeight="bold">
            ₹{grandTotal.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* Event Info */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="#c026d3">
          Event Details
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {eventName}
        </Typography>
        <Typography variant="body2">Venue: {venueName}</Typography>
        <Typography variant="body2">
          Address: {selectedAddress || location}
        </Typography>
        <Typography variant="body2">
          📆 {startDate} to {endDate}
        </Typography>
        <Typography variant="body2">
          ⏰ {formattedStartTime} - {formattedEndTime}
        </Typography>
        {formattedSetupStartDate && (
          <Typography variant="body2">
            Setup: {formattedSetupStartDate} to {formattedSetupEndDate}
          </Typography>
        )}
        {formattedRehearsalDate && (
          <Typography variant="body2">
            Rehearsal: {formattedRehearsalDate}
          </Typography>
        )}
        <Typography variant="body2">
          👤 {receiverName} 📞 {receiverMobile}
        </Typography>
      </Box>

      {/* Message */}
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Enter your message to vendor (Optional)"
        variant="outlined"
        sx={{ mt: 3 }}
      />

      {/* File Previews */}
      <Box sx={{ display: "flex", mt: 2 }}>
        {renderFilePreview(
          uploadedFiles.invitation,
          uploadedFiles.invitationPreview,
          "Invitation"
        )}
        {renderFilePreview(
          uploadedFiles.gatePass,
          uploadedFiles.gatePassPreview,
          "Gate Pass"
        )}
      </Box>

      {/* ✅ PAY BUTTON */}
      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 3,
          backgroundColor: "#c026d3",
          fontWeight: "bold",
          fontSize: "1rem",
          py: 1.2,
          "&:hover": {
            backgroundColor: "#a21caf",
          },
        }}
        onClick={handleOpenModal}
      >
        Proceed to Pay ₹{grandTotal.toLocaleString()}
      </Button>

      {/* ✅ CONFIRM PAYMENT MODAL */}
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
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#c026d3"
            gutterBottom
          >
            Confirm & Pay
          </Typography>

          <Typography variant="body2" sx={{ mb: 3 }}>
            Please confirm your event and billing details before continuing.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{ backgroundColor: "#c026d3", fontWeight: "bold" }}
            onClick={handleConfirm}
          >
            Confirm & Pay ₹{grandTotal.toLocaleString()}
          </Button>
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
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: 450,
            maxWidth: "95%",
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

