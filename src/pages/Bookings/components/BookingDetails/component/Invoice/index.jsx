import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./styles.scss";

const Invoice = ({ bookings, items, onClose }) => {

  const downloadInvoice = () => {
    const invoiceElement = document.getElementById("invoice");

    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = 290;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      pdf.save(`Invoice_${bookings._id.slice(-6)}.pdf`);
    });
  };

  return (
    <div id="invoice" className="invoice-container">
      <div className="header">
        <div className="company-info">
          <h2>KADAM VENTURES PRIVATE LIMITED</h2>
          <p>No. 150 1st floor, Venkatarappa Road, Bengaluru-560051</p>
          <p>Email: support@nithyaevents.com</p>
          <p>GSTIN: 29AAPCK0912B1ZW</p>
          <p>SAC CODE : CVWDCW</p>
        </div>
        <div className="invoice-info">
          <p><strong>Invoice #:</strong> {`INV${bookings._id.slice(-6)}`}</p>
          <p><strong>Event Name:</strong> {bookings.event_name || "N/A"}</p>
          <p><strong>Ordered Date:</strong> {bookings.ordered_date || "N/A"}</p>
        </div>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Size</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Days</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.dimension}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>{bookings.number_of_days}</td>
              <td>{item.price * item.quantity * bookings.number_of_days}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="terms">
        <h3>Terms & Conditions</h3>
        <ol>
          <li>Payment Terms: Payment is due before delivery.</li>
          <li>Reservation and Deposit: A 10% deposit is required.</li>
          <li>Cancellation Policy: Cancellations must be made at least 2 days in advance.</li>
          <li>Delivery and Pickup: Additional fees may apply.</li>
          <li>Condition of Equipment: Return in original condition.</li>
          <li>Liability: Customer assumes all liability for rented items.</li>
        </ol>
        <div className="signature">
          <p>Signature</p>
          <p>Sample</p>
        </div>
      </div>

      <div className="actions">
        <button onClick={onClose}>Back</button>
        <button onClick={downloadInvoice}>Download</button>
      </div>
    </div>
  );
};

export default Invoice;
