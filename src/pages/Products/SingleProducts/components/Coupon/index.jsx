import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { config } from "../../../../../api/config";

// Human-readable offer line from a coupon record.
const buildOffer = (c) => {
  const amount =
    c.discount_type === "percentage"
      ? `${c.discount_value}% Off`
      : `₹${c.discount_value} Off`;
  const min = c.min_order_value
    ? ` on orders above ₹${Number(c.min_order_value).toLocaleString()}`
    : "";
  return `Get ${amount}${min}`;
};

const PromoCard = ({ coupon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = coupon?.code || "";
    if (!code) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older browsers / non-secure contexts.
        const el = document.createElement("textarea");
        el.value = code;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy coupon code:", err);
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        padding: "1rem",
        borderRadius: "8px",
        border: "1px solid #B0BEC5",
        width: "333px",
        boxSizing: "border-box",
        gap: "0.5rem",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography
          sx={{ fontWeight: "500", marginBottom: "0.5rem", fontSize: "0.75rem" }}
        >
          {buildOffer(coupon)}
        </Typography>
        <Link to="/TermsAndCondition" style={{ textDecoration: "none" }}>
          <Typography
            sx={{
              color: "#1976D2",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "0.6rem",
            }}
          >
            Terms &amp; Conditions
          </Typography>
        </Link>
      </Box>

      {/* Click the code to copy it */}
      <Tooltip title={copied ? "Copied!" : "Click to copy"} arrow>
        <Paper
          elevation={2}
          onClick={handleCopy}
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "0.5rem 0.75rem",
            backgroundColor: copied ? "#e8f5e9" : "#F5F5F5",
            borderRadius: "8px",
            alignItems: "center",
            cursor: "pointer",
            border: copied ? "1px dashed #2e7d32" : "1px dashed #B0BEC5",
            minWidth: "90px",
            transition: "background-color 0.2s ease",
          }}
        >
          <Typography sx={{ fontSize: "0.55rem", color: "#333", fontWeight: 500 }}>
            Use Code
          </Typography>
          <Typography
            sx={{ fontWeight: "bold", marginTop: "0.2rem", fontSize: "0.85rem" }}
          >
            {coupon.code}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              marginTop: "0.25rem",
              color: copied ? "#2e7d32" : "#1976D2",
            }}
          >
            {copied ? (
              <CheckIcon sx={{ fontSize: "0.8rem" }} />
            ) : (
              <ContentCopyIcon sx={{ fontSize: "0.8rem" }} />
            )}
            <Typography sx={{ fontSize: "0.55rem", fontWeight: 600 }}>
              {copied ? "Copied" : "Copy"}
            </Typography>
          </Box>
        </Paper>
      </Tooltip>
    </Paper>
  );
};

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    let mounted = true;
    axios
      .get(`${config.BASEURL}/coupon/get-active`)
      .then((res) => {
        if (mounted) setCoupons(res.data?.coupons || []);
      })
      .catch((err) => {
        console.error("Failed to load coupons:", err);
        if (mounted) setCoupons([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Nothing to show if there are no active coupons.
  if (!coupons.length) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        padding: "1rem 0",
        flexWrap: "wrap",
      }}
    >
      {coupons.map((coupon) => (
        <PromoCard key={coupon._id} coupon={coupon} />
      ))}
    </Box>
  );
};

export default Coupon;
