// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setLoading } from "../../../../redux/slice/LoaderSlice";
// import { login } from "../../../../redux/slice/authSlice";
// import authService from "../../../../api/ApiService";
// import { Box, Button, TextField, Typography, Grid, Paper } from "@mui/material";
// import SigninImg from "../../../../assets/logo2.png";
// import "./styles.scss";

// const LoginWithMobile = () => {
//   const [mobile, setMobile] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     try {
//       dispatch(setLoading(true));
//       const res = await authService.loginWithMobile({
//         mobilenumber: parseInt(mobile, 10),
//       });

//       navigate("/");
//       dispatch(login(res.data.user));
//     } catch (error) {
//       console.error(
//         "Error sending OTP:",
//         error.response?.data || error.message
//       );
//       alert("Failed to send OTP. Please try again.");
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   return (
//     <Grid container className="login-container">
//       {/* Left Side - Login Form */}
//       <Grid item xs={12} md={6} className="login-form">
//         <Box component={Paper} elevation={4} className="form-box">
//           <img src={SigninImg} className="logo" alt="Not Found" />
//           <Typography variant="h5" className="title">
//             Sign in to Nithya Event
//           </Typography>
//           <Typography variant="body2" className="subtitle">
//             Enter your mobile number to receive an OTP for login.
//           </Typography>

//           <form onSubmit={handleSendOtp} className="login-form-content">
//             <TextField
//               label="Mobile Number"
//               type="tel"
//               name="mobile"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               required
//               fullWidth
//               className="input-field"
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               className="primary-btn"
//             >
//               Login
//             </Button>
//           </form>

//           <Typography variant="body2" className="register-text">
//             Don't have an account?{" "}
//             <span className="register-link" onClick={() => navigate("/signup")}>
//               Register
//             </span>
//           </Typography>
//         </Box>
//       </Grid>

//       {/* Right Side - Background with Text */}
//       <Grid item xs={12} md={6} className="login-banner">
//         <Box className="banner-overlay">
//           <Typography variant="h4" className="banner-title">
//             Make Your Event Simple Now
//           </Typography>
//           <Typography variant="body1" className="banner-subtext">
//             Plan your events stress-free. Get everything you need, all in one
//             place.
//           </Typography>
//         </Box>
//       </Grid>
//     </Grid>
//   );
// };

// export default LoginWithMobile;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../../../redux/slice/LoaderSlice";
import { login } from "../../../../redux/slice/authSlice";
import authService from "../../../../api/ApiService";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  InputAdornment,
} from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import "./styles.scss"; // ✅ This will use the separate CSS you created

const LoginWithMobile = () => {
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [serverError, setServerError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Validate mobile number
  const validate = () => {
    if (!mobile.trim()) {
      setMobileError("Mobile number is required.");
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMobileError("Enter a valid 10-digit mobile number.");
      return false;
    }
    setMobileError("");
    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      dispatch(setLoading(true));
      const res = await authService.loginWithMobile({
        mobilenumber: parseInt(mobile, 10),
      });

      dispatch(login(res.data.user));
      navigate("/");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to send OTP. Please try again.";
      setServerError(msg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Grid container className="login-mobile-container">
      
      {/* ✅ LEFT SIDE FORM */}
      <Grid item xs={12} md={6} className="login-mobile-form-container">
        <Box className="login-mobile-form">
          <Box className="login-header">
            <Box className="brand-badge">Nithya Event</Box>

            <Typography variant="h4" className="title">
              Login with Mobile
            </Typography>

            <Typography variant="body2" className="subtitle">
              Enter your mobile number to receive OTP.
            </Typography>
          </Box>

          <form onSubmit={handleSendOtp} className="login-form-content">
            <TextField
              label="Mobile Number"
              type="tel"
              name="mobile"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value.trim());
                setMobileError("");
                setServerError("");
              }}
              fullWidth
              margin="normal"
              error={!!mobileError}
              helperText={mobileError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIphoneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
              className="ne-input"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login-btn gradient-btn"
            >
              Send OTP
            </Button>

            {serverError && (
              <Typography
                variant="body2"
                color="error"
                sx={{
                  mt: 2,
                  textAlign: "center",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                {serverError}
              </Typography>
            )}
          </form>

          <Typography variant="body2" className="register-text">
            Don’t have an account?
            <Typography
              component="span"
              className="register-link"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Typography>
          </Typography>
        </Box>
      </Grid>

      {/* ✅ RIGHT SIDE BANNER */}
      <Grid item xs={12} md={6} className="login-mobile-banner">
        <Box className="banner-overlay">
          <Typography variant="h4" className="banner-title">
            Make Your Event Simple
          </Typography>

          <Typography variant="body1" className="banner-subtext">
            Plan your events effortlessly and manage everything in one place.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginWithMobile;
