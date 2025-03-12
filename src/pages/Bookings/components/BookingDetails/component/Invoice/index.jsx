import React, { useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Button,
} from "@mui/material";

const Invoice = ({ booking }) => {
  const invoiceRef = useRef();

  // Function to Download Invoice
  const handleDownloadInvoice = () => {
    const content = invoiceRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f1f1f1; }
            .header-box { display: flex; justify-content: space-between; padding: 10px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Box sx={{ p: 3, maxWidth: "900px", margin: "auto" }}>
      <Paper variant="outlined" sx={{ p: 3 }} ref={invoiceRef}>
        {/* Header Section */}
        <Grid container spacing={2}>
          {/* Left Side: Company Details */}
          <Grid item xs={8}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              KADAGAM VENTURES PRIVATE LIMITED
            </Typography>
            <Typography variant="body2">
              NO .34 1st Floor, Venkatappa Road, Tasker Town, Bengaluru - 560051
            </Typography>
            <Typography variant="body2">GSTIN: 29AADPI4078B1ZW</Typography>
            <Typography variant="body2">SAC CODE: CWWDCW</Typography>
          </Grid>

          {/* Right Side: Invoice Details */}
          <Grid item xs={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2">
                <b>Invoice #:</b> {booking.invoice_id}
              </Typography>
              <Typography variant="body2">
                <b>Event Name:</b> {booking.event_name}
              </Typography>
              <Typography variant="body2">
                <b>Ordered Date:</b> {booking.ordered_date}
              </Typography>
              <Typography variant="body2">
                <b>Venue Name:</b> {booking.venue_name}
              </Typography>
              <Typography variant="body2">
                <b>Venue Location:</b> {booking.event_location}
              </Typography>
              <Typography variant="body2">
                <b>Event Date:</b> {booking.event_date}
              </Typography>
              <Typography variant="body2">
                <b>Event Time:</b> {booking.event_time}
              </Typography>
              <Typography variant="body2">
                <b>No of Days:</b> {booking.number_of_days}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />

        {/* Customer Details */}
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          To:
        </Typography>
        <Typography variant="body2">{booking.receiver_name}</Typography>
        <Typography variant="body2">{booking.receiver_mobilenumber}</Typography>
        <Typography variant="body2">{booking.event_location}</Typography>
        <Divider sx={{ my: 2 }} />

        {/* Product Table */}
        <TableContainer component={Paper} sx={{ border: "1px solid #000" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1f1f1" }}>
              <TableRow>
                <TableCell><b>Product</b></TableCell>
                <TableCell><b>Size</b></TableCell>
                <TableCell><b>Qty</b></TableCell>
                <TableCell><b>Price</b></TableCell>
                <TableCell><b>Days</b></TableCell>
                <TableCell><b>Amount</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {booking?.products?.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.size}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>{booking.number_of_days}</TableCell>
                  <TableCell>₹{product.quantity * product.price * booking.number_of_days}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider sx={{ my: 2 }} />

        {/* Payment Summary */}
        <Box sx={{ textAlign: "right", p: 2 }}>
          <Typography variant="body2"><b>Total:</b> ₹{booking.cart_total}</Typography>
          <Typography variant="body2"><b>TDS Charges (2%):</b> ₹{booking.tds_charges}</Typography>
          <Typography variant="body2"><b>Amount After TDS Deduction:</b> ₹{booking.amount_after_tds}</Typography>
          <Typography variant="body2"><b>CGST (9%):</b> ₹{booking.cgst}</Typography>
          <Typography variant="body2"><b>SGST (9%):</b> ₹{booking.sgst}</Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Grand Total: ₹{booking.paid_amount}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* Terms & Conditions */}
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Terms & Conditions
        </Typography>
        <Typography variant="body2">1. Payment is due upon receipt.</Typography>
        <Typography variant="body2">2. A 100% deposit is required to secure your reservation.</Typography>
        <Typography variant="body2">3. Cancellations must be made at least 2 days in advance.</Typography>

        {/* Download Invoice Button */}
        <Box sx={{ textAlign: "right", mt: 3 }}>
          <Button variant="contained" onClick={handleDownloadInvoice}>
            Download Invoice
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Invoice;
