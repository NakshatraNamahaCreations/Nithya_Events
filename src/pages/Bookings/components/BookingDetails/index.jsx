// React related imports
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// Third party Library
import { Box, Typography, Grid, Paper, Divider, Button } from "@mui/material";

// Custom Components
import authService from "../../../../api/ApiService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { setLoading } from "../../../../redux/slice/LoaderSlice";
import {
  formatCurrencyIntl,
  getErrorMessage,
  formatDate,
} from "../../../../utils/helperFunc";

// styles
import "./styles.scss";

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getBookingDetails = async () => {
      try {
        dispatch(setLoading(true));
        const res = await authService.getOrder(id);
        const order = res.data.orderId;

        // Combine all items into a single array
        const combinedItems = [
          ...(order.product_data || []).map((item) => ({
            id: item.id || item._id,
            name: item.productName || item.product_name || "N/A",
            price: item.productPrice || item.product_price || 0,
            quantity: item.quantity || 1,
            seller: item.sellerName || item.vendor_name || "Unknown",
            category: "Product",
          })),
          ...(order.service_data || []).map((item) => ({
            id: item.id || item._id,
            name: item.serviceName || "N/A",
            price: item.service_price || 0,
            quantity: item.quantity || 1,
            seller: item.sellerName || item.vendor_name || "Unknown",
            category: "Service",
          })),
          ...(order.tech_data || []).map((item) => ({
            id: item.id || item._id,
            name: item.product_name || "N/A",
            price: item.product_price || 0,
            quantity: item.quantity || 1,
            seller: item.vendor_name || "Unknown",
            category: "Technician",
          })),
        ];

        setItems(combinedItems);

        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setLoading(false));
        getErrorMessage(error);
      }
    };

    getBookingDetails();
  }, [id]);
  const numberOfDays = booking?.number_of_days || 1;
  const subTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity * numberOfDays,
    0
  );
  const cgst = booking?.gst_applied_value ? booking.gst_applied_value / 2 : 0;
  const sgst = booking?.gst_applied_value ? booking.gst_applied_value / 2 : 0;
  const grandTotal = booking?.paid_amount || subTotal + cgst + sgst;

  const downloadInvoice = () => {
    if (!booking) return;

    const doc = new jsPDF("p", "mm", "a4");

   
    doc.setDrawColor(0, 0, 0);
    doc.rect(10, 10, 190, 277); 

    // =========================
    //  COMPANY INFO (TOP-LEFT)
    // =========================
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
    doc.text(`Phone: ${booking.receiver_mobilenumber || "N/A"}`, startX, currentY);
    currentY += 5;
    doc.setFont(undefined, "normal");
    doc.text(`GST: ${booking.gst_number || "NA"}`, startX, currentY);
    currentY += 5;
    doc.text(
      booking.event_location
        ? booking.event_location
        : "No address provided",
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
      { label: "Venue Location", value: booking.event_location || "-" },
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
        price: formatCurrencyIntl(item.price),
        days: String(numberOfDays),
        amount: formatCurrencyIntl(amount),
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
      <Typography variant="h6" className="loading-message">
        Loading booking details...
      </Typography>
    );
  }

  return (
    <Box className="booking-details-container">
      <Grid container spacing={2}>
        {/* Left Section */}
        <Grid item xs={12} md={8}>
          <Paper className="booking-box" elevation={3}>
            <Typography variant="h6" className="section-title">
              Total: {items.length} items
            </Typography>
            <Box className="booking-product-container">
              {items.map((item) => (
                <Box className="booking-products" key={item.id}>
                  <Box className="product-details">
                    <Typography className="product-name">
                      Product Name: {item.name}
                    </Typography>
                    <Typography className="product-seller">
                      Seller: <strong>{item.seller}</strong>
                    </Typography>
                    <Typography className="product-store">
                      Category: {item.category}
                    </Typography>
                  </Box>
                  <Box className="product-price-quantity">
                    <Typography className="product-price">
                      ₹{item.price}
                    </Typography>
                    <Typography className="product-quantity">
                      Quantity: {item.quantity}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className="payment-details" elevation={3}>
            <Typography variant="h6" className="section-title">
              Payment Details
            </Typography>
            <Box>
              <Typography variant="p">
                Amount Paid: {formatCurrencyIntl(booking.paid_amount)}
              </Typography>
              <Typography variant="p">
                Payment Method: {booking.payment_method}
              </Typography>
              <Typography variant="p">
                Payment Status: {booking.payment_status}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              className="invoice-button"
              onClick={downloadInvoice}
            >
              Download Invoice
            </Button>
          </Paper>
        </Grid>
        <Grid>
          <Paper
            className="booking-box"
            sx={{ marginLeft: "2rem" }}
            elevation={3}
          >
            <Typography variant="h6" className="section-title">
              Event Summary
            </Typography>
            <Divider className="divider" />
            <Box className="event-info">
              <Typography variant="p" className="event-info-details">
                <strong className="event-info-title">Event Name:</strong> &nbsp;{" "}
                <span>{booking.event_name}</span>
              </Typography>
              <Typography variant="p" className="event-info-details">
                <strong className="event-info-title">Location:</strong> &nbsp;{" "}
                {booking.event_location}
              </Typography>
              <Typography variant="p" className="event-info-details">
                <strong className="event-info-title">Date:</strong> &nbsp;{" "}
                {formatDate(booking.event_start_date)}
              </Typography>
              <Typography variant="p" className="event-info-details">
                <strong className="event-info-title">Start Time:</strong> &nbsp;{" "}
                {booking.event_start_time}
              </Typography>
              <Typography variant="p" className="event-info-details">
                <strong className="event-info-title">End Time:</strong> &nbsp;{" "}
                {booking.event_end_time}
              </Typography>
              <Typography variant="p" className="event-info-details">
                <strong className="event-info-title">Venue Name:</strong> &nbsp;{" "}
                {booking.venue_name}
              </Typography>
              <Typography variant="p" className="event-info-details">
                <strong className="event-info-title">Venue Open At:</strong>{" "}
                &nbsp; {booking.venue_open_time}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingDetails;
