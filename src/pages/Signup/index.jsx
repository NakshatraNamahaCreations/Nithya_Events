import React, { useEffect, useState } from "react";
import "./styles.scss";
import authService from "../../api/ApiService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slice/authSlice";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobilenumber: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const register = async () => {
    try {
      const response = await authService.registerUser(formData);
      console.log(response);

      dispatch(login(response.data.newUser));
      navigate("/company");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register();
  };

  useEffect(() => {}, []);

  return (
    <Grid container className="signup-container">
      <Grid item xs={12} md={6} className="signup-form">
        <Box component={Paper} elevation={4} className="form-box">
          <Typography variant="h5" className="title">
            Create Your Account
          </Typography>
          <Typography variant="body2" className="subtitle">
            Sign up to start planning your events seamlessly.
          </Typography>

          <form onSubmit={handleSubmit} className="signup-form-content">
            <TextField
              label="User Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
              className="input-field"
            />
            <TextField
              label="Mobile Number"
              name="mobilenumber"
              type="tel"
              value={formData.mobilenumber}
              onChange={handleChange}
              fullWidth
              required
              className="input-field"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              className="input-field"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              className="input-field"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="primary-btn"
            >
              Sign Up
            </Button>
          </form>

          <Typography variant="body2" className="or-text">
            OR
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            className="social-btn google-btn"
          >
            Sign Up with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            className="social-btn facebook-btn"
          >
            Sign Up with Facebook
          </Button>

          <Typography variant="body2" className="login-text">
            Already have an account?{" "}
            <span className="login-link" onClick={() => navigate("/login")}>
              Log in
            </span>
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} md={6} className="signup-banner">
        <Box className="banner-overlay">
          <Typography variant="h4" className="banner-title">
            Plan Your Events Effortlessly
          </Typography>
          <Typography variant="body1" className="banner-subtext">
            Sign up today and make your event planning a seamless experience!
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Signup;
