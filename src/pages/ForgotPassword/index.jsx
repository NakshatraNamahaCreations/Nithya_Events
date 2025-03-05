import React, { useState } from "react";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { config } from "../../api/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(`${config.BASEURL}/user/forgot-user-password`, { email });
        
      navigate("/verify-otp", { state: { email } }); 
      if (response.data.success) {
        console.log("check");

        setTimeout(() => {
          
        }, 1500);
      } else {
        setError(response.data.message || "Something went wrong!");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
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
        Forgot Password
      </Typography>

      <TextField
        fullWidth
        label="Enter your email"
        type="email"
        value={email}
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
        {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Submit"}
      </Button>
    </Box>
  );
};

export default ForgotPassword;
