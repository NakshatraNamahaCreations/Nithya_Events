import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import authService from "../../api/ApiService";
import { setLoading } from "../../redux/slice/LoaderSlice";
import { login } from "../../redux/slice/authSlice";
import "./styles.scss";
import LoginLogo from "../../assets/logo2.png";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
console.log("redirection",location.state);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await authService.loginUser(data);
      dispatch(login(res.data.user));
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Failed to login. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <Grid container className="login-container">
      {/* Left Side - Sign in Form */}
      <Grid item xs={12} md={6} className="login-form-container">
        <Box className="login-form">
          <Box className="login-header">
            <img src={LoginLogo} alt="Logo" className="logo" />
            <Typography variant="h5" className="title">
              Sign in to Nithya Event
            </Typography>
            <Typography variant="body2" className="subtitle">
              Get access to your orders, wishlist, and recommendations.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              value={data.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Typography variant="body2" className="forgot-password">
              Forgot Password?
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login-btn"
            >
              Login
            </Button>
          </form>

          <Divider className="divider">OR</Divider>
          <Link to={"/loginMobile"}>
            <Button fullWidth variant="outlined" className="social-btn">
              Sign in with OTP
            </Button>
          </Link>

          <Typography variant="body2" className="register-text">
            Don't have an account yet?
            <Typography
              component="span"
              className="register-link"
              style={{marginLeft:'1rem'}}
              onClick={() => navigate("/signup")}
            >
              SignUp
            </Typography>
          </Typography>
        </Box>
      </Grid>

      {/* Right Side - Marketing Image & Text */}
      <Grid item xs={12} md={6} className="login-banner">
        {/* <img src={LoginImg} className="login-banner-image" alt="Not found" /> */}
        <Box className="banner-content">
          <Typography variant="h4" className="banner-title">
            Make Your Event Simple Now
          </Typography>
          <Typography variant="body1" className="banner-text">
            Make your event planning stress-free. Streamline every detail with
            ease. Focus on what truly matters—celebrating!
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
