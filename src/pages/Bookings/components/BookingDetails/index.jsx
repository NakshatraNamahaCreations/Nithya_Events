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

        console.log(res);
        console.log(order);
        setBooking(order);

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
            name: item.service_name || "N/A",
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

  const downloadInvoice = () => {
    const doc = new jsPDF();

    // Add a border and title
    doc.setFillColor(240, 240, 240);
    doc.rect(5, 5, 200, 287, "F");
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Invoice", 105, 15, null, null, "center");

    // Event details
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    const leftMargin = 20;
    const lineSpacing = 7;
    let yPosition = 45;

    doc.text(`Event Name: ${booking.event_name}`, leftMargin, yPosition);
    yPosition += lineSpacing;
    doc.text(`Location: ${booking.event_location}`, leftMargin, yPosition);
    yPosition += lineSpacing;
    doc.text(
      `Date: ${formatDate(booking.event_start_date)}`,
      leftMargin,
      yPosition
    );
    yPosition += lineSpacing;
    doc.text(`Start Time: ${booking.event_start_time}`, leftMargin, yPosition);
    yPosition += lineSpacing;
    doc.text(`End Time: ${booking.event_end_time}`, leftMargin, yPosition);

    yPosition += 10;

    // Function to generate tables
    const generateTable = (title, data) => {
      if (data.length === 0) return;

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(title, leftMargin, yPosition);
      yPosition += lineSpacing;

      const tableColumn = [
        "Item Name",
        "Category",
        "Price",
        "Quantity",
        "Seller",
      ];
      const tableRows = [];

      data.forEach((item) => {
        tableRows.push([
          item.name,
          item.category,
          `₹${item.price}`,
          item.quantity,
          item.seller,
        ]);
      });

      doc.autoTable({
        startY: yPosition,
        head: [tableColumn],
        body: tableRows,
        styles: {
          headStyles: { fillColor: [40, 116, 240], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
        },
      });

      yPosition = doc.previousAutoTable.finalY + 10;
    };

    // Generate tables for each category
    generateTable(
      "Products",
      items.filter((item) => item.category === "Product")
    );
    generateTable(
      "Services",
      items.filter((item) => item.category === "Service")
    );
    generateTable(
      "Technicians",
      items.filter((item) => item.category === "Technician")
    );

    // Payment Details
    doc.setFontSize(12);
    doc.text(
      `Base Amount:${formatCurrencyIntl(booking.base_amount)}`,
      leftMargin,
      yPosition
    );
    yPosition += lineSpacing;
    doc.text(
      `Amount After TDS Deduction:${formatCurrencyIntl(
        booking.amount_after_deduction
      )}`,
      leftMargin,
      yPosition
    );
    yPosition += lineSpacing;
    doc.text(
      `GST Applied Value:${formatCurrencyIntl(booking.gst_applied_value)}`,
      leftMargin,
      yPosition
    );
    yPosition += lineSpacing;
    doc.text(
      `Total Paid Amount:${formatCurrencyIntl(booking.paid_amount)}`,
      leftMargin,
      yPosition
    );
    yPosition += lineSpacing;
    doc.text(
      `Payment Method: ${booking.payment_method}`,
      leftMargin,
      yPosition
    );
    yPosition += lineSpacing;
    doc.text(
      `Payment Status: ${booking.payment_status}`,
      leftMargin,
      yPosition
    );

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your business!", 105, 280, null, null, "center");
    doc.text(
      "Generated on: " + new Date().toLocaleString(),
      105,
      285,
      null,
      null,
      "center"
    );

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
