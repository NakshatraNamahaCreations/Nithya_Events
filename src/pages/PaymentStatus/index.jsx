import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function PaymentStatus() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const txnId = new URLSearchParams(location.search).get("txn");

  useEffect(() => {
    if (txnId) verifyPayment();
  }, [txnId]);

  const verifyPayment = async () => {
    const BASE_URL = "http://localhost:9000";
    try {
      const userDetail = JSON.parse(sessionStorage.getItem("userDetails"));
      const userId = userDetail?._id;

      const res = await axios.get(
        `${BASE_URL}/payment/status/M22E0HWMLLIYY/${txnId}/${userId}`
      );

      setStatus(res.data);

      // ✅ If SUCCESS → Create Order
      if (res?.data?.responseData?.code === "PAYMENT_SUCCESS") {
        await createOrder();
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const createOrder = async () => {
    // ✅ call your order creation API
    await axios.post(`${BASE_URL}/order/create`, {
      cartItems,
      technicianItems,
      servicesItem,
      billingDetails,
      startDate,
      endDate,
      eventName,
      venueName,
      receiverName,
      receiverMobile,
      location,
      locationLat,
      locationLng,
      uploadedFiles,
      numberOfDays,
    });

    // redirect to success page
    navigate("/order-success");
  };

  if (loading)
    return <h2 style={{ textAlign: "center" }}>Checking Payment...</h2>;

  return (
    <div>
      <h2>Payment Status</h2>
      <pre>{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
}
