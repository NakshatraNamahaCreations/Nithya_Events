import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { config } from "../../api/config";
import { clearCart } from "../../redux/slice/CartSlice";
import { clearServices } from "../../redux/slice/serviceSlice";
import { clearTechnicians } from "../../redux/slice/technicianSlice";

// Convert a base64 data URI (stored before the redirect) back into a Blob so it
// can be uploaded as a file in the order's multipart request.
const dataUriToBlob = (dataUri) => {
  try {
    const [meta, b64] = dataUri.split(",");
    const mime = (meta.match(/:(.*?);/) || [])[1] || "image/jpeg";
    const bytes = atob(b64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mime });
  } catch {
    return null;
  }
};

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const ranRef = useRef(false); // guard against double-run (StrictMode)
  const [message, setMessage] = useState("Confirming your payment…");

  // The backend redirects here as ?txn=...&status=success|failed after it has
  // verified the payment with PhonePe.
  const query = new URLSearchParams(location.search);
  const status = (query.get("status") || "").toLowerCase();

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const finalize = async () => {
      // Payment failed / cancelled → do NOT create the booking.
      if (status && status !== "success") {
        setMessage("Payment was not completed. Your booking was not created.");
        setTimeout(() => navigate("/cart"), 2500);
        return;
      }

      const raw = sessionStorage.getItem("pendingOrderPayload");
      if (!raw) {
        setMessage("No pending booking found.");
        setTimeout(() => navigate("/"), 2500);
        return;
      }

      try {
        const payload = JSON.parse(raw);
        const formData = new FormData();

        Object.entries(payload).forEach(([k, v]) => {
          // The base64 blobs + their name fields are handled separately below.
          if (
            k === "upload_gatepass_b64" ||
            k === "upload_invitation_b64" ||
            k.endsWith("_name")
          ) {
            return;
          }
          formData.append(k, v);
        });

        if (payload.upload_gatepass_b64) {
          const blob = dataUriToBlob(payload.upload_gatepass_b64);
          if (blob)
            formData.append(
              "upload_gatepass",
              blob,
              payload.upload_gatepass_name || "gatepass.jpg"
            );
        }
        if (payload.upload_invitation_b64) {
          const blob = dataUriToBlob(payload.upload_invitation_b64);
          if (blob)
            formData.append(
              "upload_invitation",
              blob,
              payload.upload_invitation_name || "invitation.jpg"
            );
        }

        const res = await axios.post(
          `${config.BASEURL}${config.CREATE_ORDER}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res.status === 200) {
          // Redeem the coupon (best-effort) and clear the stash so refreshing
          // the page can't create a duplicate booking.
          if (payload.coupon_code) {
            axios
              .post(`${config.BASEURL}/coupon/redeem`, {
                code: payload.coupon_code,
                user_id: payload.user_id,
              })
              .catch(() => {});
          }
          sessionStorage.removeItem("pendingOrderPayload");
          sessionStorage.removeItem("appliedCoupon");
          sessionStorage.removeItem("txnId");
          // Empty the cart now that the booking is placed.
          dispatch(clearCart());
          dispatch(clearServices());
          dispatch(clearTechnicians());
          setMessage("Payment successful — your booking is confirmed!");
          setTimeout(() => navigate("/order-confirmed"), 1800);
        } else {
          throw new Error("Order create returned " + res.status);
        }
      } catch (err) {
        console.error("Order creation after payment failed:", err);
        setMessage(
          "Payment succeeded but we couldn't create your booking. Please contact support with your transaction id."
        );
      }
    };

    finalize();
  }, [status, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "12vh", padding: "0 1rem" }}>
      <h2 style={{ color: "#4CAF50" }}>{message}</h2>
      <p>Please wait…</p>
    </div>
  );
}
