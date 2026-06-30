import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:9000";  // your backend

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Extract txn + status from backend redirect
  const query = new URLSearchParams(location.search);
  const txnId = query.get("txn");
  const status = query.get("status");

  useEffect(() => {
    if (!txnId) return;

    if (status === "PAYMENT_SUCCESS") {
      // ✅ AUTO CREATE ORDER
      axios.post(`${BASE_URL}/api/order/create`, { txnId })
        .then(() => navigate("/order-confirmed"))
        .catch(() => navigate("/payment-failed"));
    } else {
      navigate("/payment-failed");
    }
  }, [txnId, status]);

  return (
    <div style={{ textAlign: "center", marginTop: "10vh" }}>
      <h2 style={{ color: "#4CAF50" }}>Processing your order...</h2>
      <p>Please wait while we confirm your payment.</p>
    </div>
  );
}
