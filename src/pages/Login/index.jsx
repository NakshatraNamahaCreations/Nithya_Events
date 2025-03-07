import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Grid, Divider } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import authService from "../../api/ApiService";
import { setLoading } from "../../redux/slice/LoaderSlice";
import { login } from "../../redux/slice/authSlice";
import "./styles.scss";
import LoginLogo from "../../assets/logo2.png";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await authService.loginUser(data);
      dispatch(login(res.data.user));
      const previousPage = localStorage.getItem("previousPage");
    if (previousPage) {
    
      navigate(previousPage);
      localStorage.removeItem("previousPage");
    }
    else{
      navigate("/");
    }
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded User:", decoded);

      const idToken = credentialResponse.credential;
      const email = decoded.email;

      if (!idToken) throw new Error("Google ID Token is missing");
      if (!email) throw new Error("User email is missing");

      const res = await fetch(`${authService.BASEURL}/user/auth/validate-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken, email }),
      });

      const data = await res.json();
      if (data?.error) {
        alert("Login Failed: User does not exist.");
      } else if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch(login(data.user));
        navigate("/enable-location");
      }
    } catch (apiError) {
      console.error("Google Login API Error:", apiError);
      alert(apiError?.message || "Something went wrong");
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Sign-In Error:", error);
    alert("Google login failed. Please try again.");
  };


  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleFailure,
  });

  return (
    <Grid container className="login-container">
      <Grid item xs={12} md={6} className="login-form-container">
        <Box className="login-form">
          <Box className="login-header">
            <img src={LoginLogo} alt="Logo" className="logo" />
            <Typography variant="h5" className="title">Sign in to Nithya Event</Typography>
            <Typography variant="body2" className="subtitle">
              Get access to your orders, wishlist, and recommendations.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField label="Email" name="email" value={data.email} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Password" type="password" name="password" value={data.password} onChange={handleChange} fullWidth margin="normal" />
            <Typography variant="body2" className="forgot-password">Forgot Password?</Typography>
            <Button type="submit" fullWidth variant="contained" className="login-btn">Login</Button>
          </form>

          <Divider className="divider">OR</Divider>

          <Button fullWidth variant="outlined" className="social-btn" onClick={googleLogin}>
            Sign in with Google
          </Button>

          <Typography variant="body2" className="register-text">
            Don't have an account yet?
            <Typography component="span" className="register-link" style={{ marginLeft: "1rem" }} onClick={() => navigate("/signup")}>
              Sign Up
            </Typography>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
