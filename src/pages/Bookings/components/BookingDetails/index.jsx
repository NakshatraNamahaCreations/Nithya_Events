// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import {
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   Button,
//   CircularProgress,
// } from "@mui/material";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// import authService from "../../../../api/ApiService";
// import { setLoading } from "../../../../redux/slice/LoaderSlice";
// import {
//   formatCurrencyIntl,
//   getErrorMessage,
//   formatDate,
// } from "../../../../utils/helperFunc";
// import "./styles.scss";

// const BookingDetails = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const [booking, setBooking] = useState(null);
//   const [items, setItems] = useState([]);
//   const [loading, setLoadingState] = useState(true);

//   useEffect(() => {
//     const getBookingDetails = async () => {
//       try {
//         dispatch(setLoading(true));
//         const res = await authService.getOrder(id);
//         const order = res.data.orderId;
//         setBooking(order);

//         // Combine items
//         const combinedItems = [
//           ...(order.product_data || []).map((item) => ({
//             id: item.id || item._id,
//             name: item.productName || item.product_name || "N/A",
//             dimension: item.productDimension || "N/A", // or "—" if no dimension
//             price: item.productPrice || item.product_price || 0,
//             quantity: item.quantity || 1,
//           })),
//           ...(order.service_data || []).map((item) => ({
//             id: item.id || item._id,
//             name: item.service_name || "N/A",
//             dimension: "—",
//             price: item.service_price || 0,
//             quantity: item.quantity || 1,
//           })),
//           ...(order.tech_data || []).map((item) => ({
//             id: item.id || item._id,
//             name: item.product_name || "N/A",
//             dimension: "—",
//             price: item.product_price || 0,
//             quantity: item.quantity || 1,
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
//   }, [id, dispatch]);

//   // Simple calculations (adjust if your backend already provides these)
//   const numberOfDays = booking?.number_of_days || 1;

//   // If you have TDS, CGST, SGST, etc. from your backend, use those. 
//   // Otherwise, you can calculate them similarly:
//   const subTotal = items.reduce(
//     (acc, item) => acc + item.price * item.quantity * numberOfDays,
//     0
//   );
//   // Suppose half of booking.gst_applied_value is CGST and the other half is SGST:
//   const cgst = booking?.gst_applied_value ? booking.gst_applied_value / 2 : 0;
//   const sgst = booking?.gst_applied_value ? booking.gst_applied_value / 2 : 0;
//   const grandTotal = booking?.paid_amount || subTotal + cgst + sgst;

//   // Generate PDF invoice matching the layout from the screenshot
//   const downloadInvoice = () => {
//     if (!booking) return;

//     // Create a new PDF (A4 size)
//     const doc = new jsPDF("p", "mm", "a4");

//     // Title at the top
//     doc.setFontSize(16);
//     doc.setTextColor(40, 40, 40);
//     doc.text("Invoice", doc.internal.pageSize.getWidth() / 2, 15, {
//       align: "center",
//     });

//     // Left column info (x=10, y starts at 30)
//     let leftY = 30;
//     doc.setFontSize(10);
//     doc.text(`Phone: ${booking.receiver_mobilenumber || ""}`, 10, leftY);
//     leftY += 5;
//     doc.text(`${booking.event_location || "Address not available"}, India`, 10, leftY);
//     leftY += 5;
//     doc.text(`GST: ${booking.gst_number || "NA"}`, 10, leftY);
//     leftY += 10;

//     // Right column info (x=120, y starts at 30)
//     let rightY = 30;
//     doc.text(
//       `Venue Available Time: ${booking.venue_open_time || "00:00"}`,
//       120,
//       rightY
//     );
//     rightY += 5;
//     doc.text(
//       `Event Date/Time: ${formatDate(booking.event_start_date)} ${
//         booking.event_start_time
//       }`,
//       120,
//       rightY
//     );
//     rightY += 5;
//     doc.text(`No of Days: ${numberOfDays}`, 120, rightY);
//     rightY += 10;

//     // Table columns
//     const columns = ["Product", "Size", "Qty", "Price", "Days", "Amount"];
//     // Table rows
//     const rows = items.map((item) => {
//       const amount = item.price * item.quantity * numberOfDays;
//       return [
//         item.name,
//         item.dimension,
//         String(item.quantity),
//         formatCurrencyIntl(item.price),
//         String(numberOfDays),
//         formatCurrencyIntl(amount),
//       ];
//     });

//     // Draw the table
//     const startY = Math.max(leftY, rightY);
//     doc.autoTable({
//       startY,
//       head: [columns],
//       body: rows,
//       theme: "grid",
//       headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
//       styles: { fontSize: 9 },
//       tableWidth: "auto",
//     });

//     let finalY = doc.lastAutoTable.finalY + 10;

//     // Totals Section
//     doc.setFontSize(10);
//     doc.text(`Sub Total: ${formatCurrencyIntl(subTotal)}`, 10, finalY);
//     finalY += 5;
//     doc.text(`CGST: ${formatCurrencyIntl(cgst)}`, 10, finalY);
//     finalY += 5;
//     doc.text(`SGST: ${formatCurrencyIntl(sgst)}`, 10, finalY);
//     finalY += 5;
//     doc.setFontSize(10);
//     doc.text(
//       `Grand Total: ${formatCurrencyIntl(grandTotal)}`,
//       10,
//       finalY
//     );
//     finalY += 10;

//     // Terms & Conditions
//     doc.setFontSize(10);
//     doc.text("Terms & Conditions:", 10, finalY);
//     finalY += 5;
//     doc.text("1. Payment is due upon receipt.", 10, finalY);
//     finalY += 5;
//     doc.text("2. A 100% deposit is required to secure your reservation.", 10, finalY);
//     finalY += 5;
//     doc.text("3. Cancellations must be made at least 2 days in advance.", 10, finalY);
//     // Add more T&Cs as needed

//     // Save the PDF
//     doc.save("invoice.pdf");
//   };

//   if (loading) {
//     return (
//       <Box sx={{ textAlign: "center", mt: 4 }}>
//         <CircularProgress />
//         <Typography variant="body1">Loading booking details...</Typography>
//       </Box>
//     );
//   }

//   if (!booking) {
//     return (
//       <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
//         No booking data found.
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ p: 2 }}>
//       <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
//         <Typography variant="h6" sx={{ mb: 1 }}>
//           Booking Details
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={6}>
//             <Typography variant="body2">
//               <strong>Phone:</strong> {booking.receiver_mobilenumber || ""}
//             </Typography>
//             <Typography variant="body2">
//               <strong>Location:</strong> {booking.event_location || ""}
//             </Typography>
//             <Typography variant="body2">
//               <strong>GST:</strong> {booking.gst_number || "NA"}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Typography variant="body2">
//               <strong>Venue Available Time:</strong>{" "}
//               {booking.venue_open_time || "00:00"}
//             </Typography>
//             <Typography variant="body2">
//               <strong>Event Date/Time:</strong> {formatDate(booking.event_start_date)}{" "}
//               {booking.event_start_time}
//             </Typography>
//             <Typography variant="body2">
//               <strong>No of Days:</strong> {numberOfDays}
//             </Typography>
//           </Grid>
//         </Grid>
//       </Paper>

//       <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
//         <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
//           Items
//         </Typography>
//         {items.map((item) => {
//           const amount = item.price * item.quantity * numberOfDays;
//           return (
//             <Box
//               key={item.id}
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 borderBottom: "1px solid #ccc",
//                 py: 1,
//               }}
//             >
//               <Box>
//                 <Typography variant="body2">
//                   <strong>Product:</strong> {item.name}
//                 </Typography>
//                 <Typography variant="body2">
//                   <strong>Size:</strong> {item.dimension}
//                 </Typography>
//                 <Typography variant="body2">
//                   <strong>Qty:</strong> {item.quantity}
//                 </Typography>
//               </Box>
//               <Box textAlign="right">
//                 <Typography variant="body2">
//                   <strong>Price:</strong> {formatCurrencyIntl(item.price)}
//                 </Typography>
//                 <Typography variant="body2">
//                   <strong>Days:</strong> {numberOfDays}
//                 </Typography>
//                 <Typography variant="body2">
//                   <strong>Amount:</strong> {formatCurrencyIntl(amount)}
//                 </Typography>
//               </Box>
//             </Box>
//           );
//         })}
//       </Paper>

      // <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      //   <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
      //     Payment Summary
      //   </Typography>
      //   <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "200px" }}>
      //     <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      //       <Typography variant="body2">Sub Total</Typography>
      //       <Typography variant="body2">
      //         {formatCurrencyIntl(subTotal)}
      //       </Typography>
      //     </Box>
      //     <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      //       <Typography variant="body2">CGST</Typography>
      //       <Typography variant="body2">
      //         {formatCurrencyIntl(cgst)}
      //       </Typography>
      //     </Box>
      //     <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      //       <Typography variant="body2">SGST</Typography>
      //       <Typography variant="body2">
      //         {formatCurrencyIntl(sgst)}
      //       </Typography>
      //     </Box>
      //     <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      //       <Typography variant="body2" sx={{ fontWeight: "bold" }}>
      //         Grand Total
      //       </Typography>
      //       <Typography variant="body2" sx={{ fontWeight: "bold" }}>
      //         {formatCurrencyIntl(grandTotal)}
      //       </Typography>
      //     </Box>
      //   </Box>
      // </Paper>

//       <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
//           Terms & Conditions
//         </Typography>
//         <Typography variant="body2">
//           1. Payment is due upon receipt.
//         </Typography>
//         <Typography variant="body2">
//           2. A 100% deposit is required to secure your reservation.
//         </Typography>
//         <Typography variant="body2">
//           3. Cancellations must be made at least 2 days in advance.
//         </Typography>
//       </Paper>

//       <Button variant="contained" onClick={downloadInvoice}>
//         Download Invoice
//       </Button>
//     </Box>
//   );
// };

// export default BookingDetails;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
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
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

import authService from "../../../../api/ApiService";
import { setLoading } from "../../../../redux/slice/LoaderSlice";
import {
  formatCurrencyIntl,
  getErrorMessage,
  formatDate,
} from "../../../../utils/helperFunc";
import "./styles.scss";

const BookingDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [booking, setBooking] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoadingState] = useState(true);

  useEffect(() => {
    const getBookingDetails = async () => {
      try {
        dispatch(setLoading(true));
        const res = await authService.getOrder(id);
        const order = res.data.orderId;
        setBooking(order);

        const combinedItems = [
          ...(order.product_data || []).map((item) => ({
            id: item.id || item._id,
            name: item.productName || item.product_name || "N/A",
            dimension: item.productDimension || "N/A",
            price: item.productPrice || item.product_price || 0,
            quantity: item.quantity || 1,
          })),
          ...(order.service_data || []).map((item) => ({
            id: item.id || item._id,
            name: item.service_name || "N/A",
            dimension: "—",
            price: item.service_price || 0,
            quantity: item.quantity || 1,
          })),
          ...(order.tech_data || []).map((item) => ({
            id: item.id || item._id,
            name: item.product_name || "N/A",
            dimension: "—",
            price: item.product_price || 0,
            quantity: item.quantity || 1,
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
  const numberOfDays = booking?.number_of_days || 1;

  const subTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity * numberOfDays,
    0
  );
  const baseAmount = booking?.base_amount;
  const tdsCharges = booking?.tds_deduction;
  const amountAfterDeduction = baseAmount-tdsCharges;

  const cgst = booking?.gst_applied_value ? booking.gst_applied_value / 2 : 0;
  const sgst = booking?.gst_applied_value ? booking.gst_applied_value / 2 : 0;
  const grandTotal = booking?.paid_amount;
console.log(booking);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="body1">Loading booking details...</Typography>
      </Box>
    );
  }

  if (!booking) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
        No booking data found.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 2, maxWidth: "1200px", margin: "auto" }}>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
          {booking.event_name} 
          <Chip
            label={booking.status || "N/A"}
            sx={{ ml: 2, backgroundColor: "#fcb900", color: "#333" }}
          />
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Event Location:</strong> {booking.event_location || "N/A"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Event Date:</strong> {formatDate(booking.event_start_date)}{" "}
          {booking.event_start_time} - {booking.event_end_time}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Contact:</strong> {booking.receiver_mobilenumber || "N/A"}
        </Typography>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={8}>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
          Items
        </Typography>
        {items.map((item) => {
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
            </Box>
          );
        })}
      </Paper>

          <Paper
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
          </Paper>
        </Grid>

        <Grid item xs={4}>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
          Payment Summary
        </Typography>
        
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "200px" }}>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Total</Typography>
            <Typography variant="body2">
              {booking?.cart_total}
            </Typography>
          </Box>


        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Event Days</Typography>
            <Typography variant="body2">
              {numberOfDays}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Base Amount</Typography>
            <Typography variant="body2">
            {formatCurrencyIntl(baseAmount)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">TDS Charges (2%)</Typography>
            <Typography variant="body2">
              {tdsCharges}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Amount After Deductions</Typography>
            <Typography variant="body2">
              {amountAfterDeduction}
            </Typography>
          </Box>
        
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">CGST (9%)</Typography>
            <Typography variant="body2">
              {formatCurrencyIntl(cgst)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">SGST (9%)</Typography>
            <Typography variant="body2">
              {formatCurrencyIntl(sgst)}
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

      <Button
        variant="contained"
        sx={{ backgroundColor: "#c026d3", color: "#fff", mt: 2 }}
      >
        Download Invoice
      </Button>
    </Box>
  );
};

export default BookingDetails;
