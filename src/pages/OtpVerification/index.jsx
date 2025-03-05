import React, { useState } from "react";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { config } from "../../api/config";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const email = location.state?.email || "";
  const navigate = useNavigate();

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(`${config.BASEURL}/api/user/verify-email-otp`, {
        email,
        otp,
      });

      
        setMessage("OTP Verified! You can now reset your password.");
     
        navigate("/reset-password", { state: { email } });

   
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 4,
        backgroundColor: "#fff",
        borderRadius: 4,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Verify OTP
      </Typography>

      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Enter the OTP sent to <strong>{email}</strong>
      </Typography>

      <TextField
        fullWidth
        label="Enter OTP"
        type="text"
        value={otp}
        onChange={handleChange}
        variant="outlined"
        sx={{ marginBottom: 2 }}
      />

      {error && <Typography color="error">{error}</Typography>}
      {message && <Typography color="green">{message}</Typography>}

      <Button
        variant="contained"
        fullWidth
        sx={{
          marginTop: 2,
          paddingY: 1.5,
          fontWeight: "bold",
          backgroundColor: "#6A0DAD",
          "&:hover": { backgroundColor: "#5a0c95" },
        }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Verify OTP"}
      </Button>
    </Box>
  );
};

export default OtpVerification;
