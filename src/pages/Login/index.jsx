// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// // import { FaFacebook, FaGoogle } from 'react-icons/fa';
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Grid,
//   Divider,
// } from "@mui/material";
// import { useGoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import authService from "../../api/ApiService";
// import { setLoading } from "../../redux/slice/LoaderSlice";
// import { login } from "../../redux/slice/authSlice";
// import "./styles.scss";
// import LoginLogo from "../../assets/logo2.png";
// import axios from "axios";
// import { config } from "../../api/config";
// import { IconButton, InputAdornment } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import GoogleIcon from "@mui/icons-material/Google"; // Google "G" logo (Material icon)
// import FacebookIcon from "@mui/icons-material/Facebook"; // Official FB logo
// import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone"; // Phone icon


// const Login = () => {
//   const [data, setData] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       dispatch(setLoading(true));
//       const res = await authService.loginUser(data);
//       dispatch(login(res.data.user));
//       const previousPage = localStorage.getItem("previousPage");
//       if (previousPage) {
//         navigate(previousPage);
//         localStorage.removeItem("previousPage");
//       } else {
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Login error:", error.response?.data || error.message);
//       alert("Failed to login. Please try again.");
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setData({ ...data, [name]: value });
//   };

//   // const handleGoogleSuccess = async (credentialResponse) => {
//   //   try {
//   //     const decoded = jwtDecode(credentialResponse.credential);
//   //     console.log("Decoded User:", decoded);

//   //     const idToken = credentialResponse.credential;
//   //     const email = decoded.email;

//   //     if (!idToken) throw new Error("Google ID Token is missing");
//   //     if (!email) throw new Error("User email is missing");

//   //     const res = await fetch(`${authService.BASEURL}/user/auth/validate-token`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ token: idToken, email }),
//   //     });

//   //     const data = await res.json();
//   //     if (data?.error) {
//   //       alert("Login Failed: User does not exist.");
//   //     } else if (data?.user) {
//   //       localStorage.setItem("user", JSON.stringify(data.user));
//   //       dispatch(login(data.user));
//   //       navigate("/enable-location");
//   //     }
//   //   } catch (apiError) {
//   //     console.error("Google Login API Error:", apiError);
//   //     alert(apiError?.message || "Something went wrong");
//   //   }
//   // };

//   const handleGoogleFailure = (error) => {
//     console.error("Google Sign-In Error:", error);
//     alert("Google login failed. Please try again.");
//   };

//   const googleLogin = useGoogleLogin({
//     onSuccess: async (response) => {
//       if (!response || !response.access_token) {
//         alert("Google login failed: No access token received.");
//         return;
//       }

//       try {
//         const userInfoRes = await axios.get(
//           `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`,
//           {
//             headers: { Authorization: `Bearer ${response.access_token}` },
//           }
//         );

//         const userInfo = userInfoRes.data;

//         const idTokenRes = await fetch(
//           `https://oauth2.googleapis.com/tokeninfo?access_token=${response.access_token}`
//         );

//         const idTokenData = await idTokenRes.json();

//         if (!idTokenData || !idTokenData.email) {
//           throw new Error("Failed to retrieve ID Token.");
//         }

//         const validateResponse = await fetch(
//           `${config.BASEURL}/user/auth/validate-token`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               token: idTokenData.id_token,
//               email: userInfo.email,
//             }),
//           }
//         );

//         if (!validateResponse.ok) {
//           throw new Error(
//             `Server responded with ${validateResponse.status} - ${validateResponse.statusText}`
//           );
//         }

//         const validateData = await validateResponse.json();

//         if (validateData?.error) {
//           alert("Login Failed: " + validateData.error);
//         } else if (validateData?.user) {
//           sessionStorage.setItem("user", JSON.stringify(validateData.user));
//           dispatch(login(validateData.user));
//           navigate("/");
//         }
//       } catch (error) {
//         alert(error.message || "Google authentication failed.");
//       }
//     },
//     onError: (error) => {
//       alert("Google login failed. Please try again.");
//     },
//     scope: "openid email profile",
//   });
//   return (
//     <Grid container className="login-container">
//       <Grid item xs={12} md={6} className="login-form-container">
//         <Box className="login-form">
//           <Box className="login-header">
//             <img src={LoginLogo} alt="Logo" className="logo" />
//             <Typography variant="h5" className="title">
//               Sign in to Nithya Event
//             </Typography>
//             <Typography variant="body2" className="subtitle">
//               Get access to your orders, wishlist, and recommendations.
//             </Typography>
//           </Box>

//           <form onSubmit={handleSubmit}>
//             <TextField
//               label="Email"
//               name="email"
//               value={data.email}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//             />
//             {/* <TextField label="Password" type="password" name="password" value={data.password} onChange={handleChange} fullWidth margin="normal" /> */}
//             <TextField
//               label="Password"
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={data.password}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={() => setShowPassword((prev) => !prev)}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Typography
//               onClick={() => navigate("/forgotPassword")}
//               variant="body2"
//               className="forgot-password"
//             >
//               Forgot Password?
//             </Typography>
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               className="login-btn"
//             >
//               Login
//             </Button>
//           </form>

//           <Divider className="divider">OR</Divider>

//           <Button
//             fullWidth
//             variant="outlined"
//             className="social-btn"
//             onClick={googleLogin}
//              startIcon={<GoogleIcon />}
//           >
//             Sign in with Google
//           </Button>
//           <Button
//             fullWidth
//             variant="outlined"
//             className="social-btn"
//             onClick={() => navigate("/loginMobile")}
//              startIcon={<PhoneIphoneIcon />}
//           >
//             Sign in with Mobile Number
//           </Button>
//           <Button
//             fullWidth
//             variant="outlined"
//             className="social-btn"
//             // onClick={() => navigate("/loginMobile")}
//             startIcon={<FacebookIcon />}
//           >
//             Sign in with Facebook
//           </Button>
//           <Typography variant="body2" className="register-text">
//             Don't have an account yet?
//             <Typography
//               component="span"
//               className="register-link"
//               style={{ marginLeft: "1rem" }}
//               onClick={() => navigate("/signup")}
//             >
//               Sign Up
//             </Typography>
//           </Typography>
//         </Box>
//       </Grid>

//       <Grid item xs={12} md={6} className="login-banner">
//         <Box className="banner-overlay">
//           <Typography variant="h4" className="banner-title">
//             Plan Your Events Effortlessly
//           </Typography>
//           <Typography variant="body1" className="banner-subtext">
//             Sign up today and make your event planning a seamless experience!
//           </Typography>
//         </Box>
//       </Grid>
//     </Grid>
//   );
// };

// export default Login;


  // import React, { useState } from "react";
  // import { useDispatch } from "react-redux";
  // import { useNavigate } from "react-router-dom";
  // import {
  //   Box,
  //   Button,
  //   TextField,
  //   Typography,
  //   Grid,
  //   Divider,
  //   IconButton,
  //   InputAdornment,
  // } from "@mui/material";
  // import { useGoogleLogin } from "@react-oauth/google";
  // import authService from "../../api/ApiService";
  // import { setLoading } from "../../redux/slice/LoaderSlice";
  // import { login } from "../../redux/slice/authSlice";
  // import "./styles.scss";
  // import LoginLogo from "../../assets/logo2.png";
  // import axios from "axios";
  // import { config } from "../../api/config";
  // import { Visibility, VisibilityOff } from "@mui/icons-material";
  // import GoogleIcon from "@mui/icons-material/Google";
  // import FacebookIcon from "@mui/icons-material/Facebook";
  // import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

  // const Login = () => {
  //   const [data, setData] = useState({ email: "", password: "" });
  //   const [showPassword, setShowPassword] = useState(false);
  //   const [emailError, setEmailError] = useState("");
  //   const [passwordError, setPasswordError] = useState("");
  //   const [serverError, setServerError] = useState("");
  //   const dispatch = useDispatch();
  //   const navigate = useNavigate();

  //   // ✅ Input change handler
  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setData({ ...data, [name]: value });
  //     setEmailError("");
  //     setPasswordError("");
  //     setServerError("");
  //   };

  //   // ✅ Form submission with field-level validation
  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     let valid = true;
  //     setEmailError("");
  //     setPasswordError("");
  //     setServerError("");

  //     // --- Email Validation ---
  //     if (!data.email.trim()) {
  //       setEmailError("Email is required.");
  //       valid = false;
  //     } else if (
  //       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)
  //     ) {
  //       setEmailError("Please enter a valid email address.");
  //       valid = false;
  //     }

  //     // --- Password Validation ---
  //     if (!data.password.trim()) {
  //       setPasswordError("Password is required.");
  //       valid = false;
  //     } else if (data.password.length < 6) {
  //       setPasswordError("Password must be at least 6 characters long.");
  //       valid = false;
  //     }

  //     if (!valid) return;

  //     try {
  //       dispatch(setLoading(true));
  //       const res = await authService.loginUser(data);

  //       if (res?.data?.user) {
  //         dispatch(login(res.data.user));
  //         const previousPage = localStorage.getItem("previousPage");
  //         if (previousPage) {
  //           navigate(previousPage);
  //           localStorage.removeItem("previousPage");
  //         } else {
  //           navigate("/");
  //         }
  //       } else {
  //         setServerError("Unexpected response from server. Please try again.");
  //       }
  //     } catch (error) {
  //       console.error("Login error:", error);
  //       const msg =
  //         error?.response?.data?.message ||
  //         error?.response?.data?.error ||
  //         "Invalid email or password.";
  //       setServerError(msg);
  //     } finally {
  //       dispatch(setLoading(false));
  //     }
  //   };

  //   // ✅ Google Login
  //   const googleLogin = useGoogleLogin({
  //     onSuccess: async (response) => {
  //       if (!response || !response.access_token) {
  //         setServerError("Google login failed: No access token received.");
  //         return;
  //       }

  //       try {
  //         const userInfoRes = await axios.get(
  //           `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`,
  //           {
  //             headers: { Authorization: `Bearer ${response.access_token}` },
  //           }
  //         );

  //         const userInfo = userInfoRes.data;
  //         const idTokenRes = await fetch(
  //           `https://oauth2.googleapis.com/tokeninfo?access_token=${response.access_token}`
  //         );
  //         const idTokenData = await idTokenRes.json();

  //         if (!idTokenData || !idTokenData.email) {
  //           throw new Error("Failed to retrieve ID Token.");
  //         }

  //         const validateResponse = await fetch(
  //           `${config.BASEURL}/user/auth/validate-token`,
  //           {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify({
  //               token: idTokenData.id_token,
  //               email: userInfo.email,
  //             }),
  //           }
  //         );

  //         if (!validateResponse.ok) {
  //           throw new Error(
  //             `Server responded with ${validateResponse.status} - ${validateResponse.statusText}`
  //           );
  //         }

  //         const validateData = await validateResponse.json();

  //         if (validateData?.error) {
  //           setServerError(validateData.error);
  //         } else if (validateData?.user) {
  //           sessionStorage.setItem("user", JSON.stringify(validateData.user));
  //           dispatch(login(validateData.user));
  //           navigate("/");
  //         }
  //       } catch (error) {
  //         setServerError(error.message || "Google authentication failed.");
  //       }
  //     },
  //     onError: () => setServerError("Google login failed. Please try again."),
  //     scope: "openid email profile",
  //   });

  //   return (
  //     <Grid container className="login-container">
  //       {/* Left Side: Login Form */}
  //       <Grid item xs={12} md={6} className="login-form-container">
  //         <Box className="login-form">
  //           {/* Header */}
  //           <Box className="login-header">
  //             <img src={LoginLogo} alt="Logo" className="logo" />
  //             <Typography variant="h5" className="title">
  //               Sign in to Nithya Event
  //             </Typography>
  //             <Typography variant="body2" className="subtitle">
  //               Get access to your orders, wishlist, and recommendations.
  //             </Typography>
  //           </Box>

  //           {/* Form */}
  //           <form onSubmit={handleSubmit}>
  //             {/* Email Field */}
  //             <TextField
  //               label="Email"
  //               name="email"
  //               value={data.email}
  //               onChange={handleChange}
  //               fullWidth
  //               margin="normal"
  //               error={!!emailError}
  //               helperText={emailError}
  //             />

  //             {/* Password Field */}
  //             <TextField
  //               label="Password"
  //               type={showPassword ? "text" : "password"}
  //               name="password"
  //               value={data.password}
  //               onChange={handleChange}
  //               fullWidth
  //               margin="normal"
  //               error={!!passwordError}
  //               helperText={passwordError}
  //               InputProps={{
  //                 endAdornment: (
  //                   <InputAdornment position="end">
  //                     <IconButton
  //                       onClick={() => setShowPassword((prev) => !prev)}
  //                       edge="end"
  //                     >
  //                       {showPassword ? <VisibilityOff /> : <Visibility />}
  //                     </IconButton>
  //                   </InputAdornment>
  //                 ),
  //               }}
  //             />

  //             {/* Forgot Password */}
  //             <Typography
  //               onClick={() => navigate("/forgotPassword")}
  //               variant="body2"
  //               className="forgot-password"
  //             >
  //               Forgot Password?
  //             </Typography>

  //             {/* Login Button */}
  //             <Button
  //               type="submit"
  //               fullWidth
  //               variant="contained"
  //               className="login-btn"
  //             >
  //               Login
  //             </Button>

  //             {/* Server Error */}
  //             {serverError && (
  //               <Typography
  //                 variant="body2"
  //                 color="error"
  //                 sx={{
  //                   mt: 2,
  //                   textAlign: "center",
  //                   fontWeight: 500,
  //                   fontSize: "0.9rem",
  //                 }}
  //               >
  //                 {serverError}
  //               </Typography>
  //             )}
  //           </form>

  //           {/* Divider */}
  //           <Divider className="divider">OR</Divider>

  //           {/* Social Logins */}
  //           <Button
  //             fullWidth
  //             variant="outlined"
  //             className="social-btn"
  //             onClick={googleLogin}
  //             startIcon={<GoogleIcon />}
  //           >
  //             Sign in with Google
  //           </Button>

  //           <Button
  //             fullWidth
  //             variant="outlined"
  //             className="social-btn"
  //             onClick={() => navigate("/loginMobile")}
  //             startIcon={<PhoneIphoneIcon />}
  //           >
  //             Sign in with Mobile Number
  //           </Button>

  //           <Button
  //             fullWidth
  //             variant="outlined"
  //             className="social-btn"
  //             startIcon={<FacebookIcon />}
  //           >
  //             Sign in with Facebook
  //           </Button>

  //           {/* Sign Up Link */}
  //           <Typography variant="body2" className="register-text">
  //             Don’t have an account yet?
  //             <Typography
  //               component="span"
  //               className="register-link"
  //               sx={{ marginLeft: "1rem", cursor: "pointer" }}
  //               onClick={() => navigate("/signup")}
  //             >
  //               Sign Up
  //             </Typography>
  //           </Typography>
  //         </Box>
  //       </Grid>

  //       {/* Right Side: Banner */}
  //       <Grid item xs={12} md={6} className="login-banner">
  //         <Box className="banner-overlay">
  //           <Typography variant="h4" className="banner-title">
  //             Plan Your Events Effortlessly
  //           </Typography>
  //           <Typography variant="body1" className="banner-subtext">
  //             Sign up today and make your event planning a seamless experience!
  //           </Typography>
  //         </Box>
  //       </Grid>
  //     </Grid>
  //   );
  // };

  // export default Login;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
} from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import authService from "../../api/ApiService";
import { setLoading } from "../../redux/slice/LoaderSlice";
import { login } from "../../redux/slice/authSlice";
import "./styles.scss";
import LoginLogo from "../../assets/logo2.png";
import axios from "axios";
import { config } from "../../api/config";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      const clean = value.replace(/\s/g, "").toLowerCase();
      if (clean.length <= 50) setData((prev) => ({ ...prev, [name]: clean }));
      setEmailError("");
      setServerError("");
      return;
    }

    if (name === "password") {
      setData((prev) => ({ ...prev, [name]: value.trimStart() }));
      setPasswordError("");
      setServerError("");
      return;
    }

    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Validation function
  const validate = () => {
    let isValid = true;
    let emailErr = "";
    let passErr = [];

    const email = data.email.trim();
    const password = data.password.trim();

    // --- EMAIL VALIDATION ---
    if (!email) {
      emailErr = "Email ID is required.";
      isValid = false;
    } else if (email.includes(" ")) {
      emailErr = "Email should not contain spaces.";
      isValid = false;
    } else if (email.length > 50) {
      emailErr = "Email cannot exceed 50 characters.";
      isValid = false;
    } else if (email !== email.toLowerCase()) {
      emailErr = "Email must be lowercase only.";
      isValid = false;
    } else {
      const atCount = (email.match(/@/g) || []).length;
      if (atCount !== 1) {
        emailErr = "Email must contain exactly one '@'.";
        isValid = false;
      } else {
        // Local part: letters and digits only, at least 1
        // Domain: letters only with dot-separated labels (e.g., gmail.com, yahoo.com)
        const emailRegex = /^[a-z0-9]+@[a-z]+(\.[a-z]{2,})+$/;
        if (!emailRegex.test(email)) {
          emailErr = "Invalid email. Use letters/digits before '@' and a valid domain (e.g., name@gmail.com).";
          isValid = false;
        }
      }
    }

    // --- PASSWORD VALIDATION ---
    if (!password) {
      passErr.push("Password is required.");
      isValid = false;
    } else {
      if (password.length < 8)
        passErr.push("Must be at least 8 characters long.");
      if (!/[A-Z]/.test(password))
        passErr.push("Must contain at least one uppercase letter (A–Z).");
      if (!/[a-z]/.test(password))
        passErr.push("Must contain at least one lowercase letter (a–z).");
      if (!/[0-9]/.test(password))
        passErr.push("Must contain at least one digit (0–9).");
      if (!/[@$!%*?&#]/.test(password))
        passErr.push(
          "Must contain at least one special character (@, $, !, %, *, ?, &, #)."
        );

      if (passErr.length > 0) isValid = false;
    }

    setEmailError(emailErr);
    setPasswordError(passErr);
    return isValid;
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    try {
      dispatch(setLoading(true));
      const res = await authService.loginUser({
        email: data.email.trim(),
        password: data.password.trim(),
      });

      if (res?.data?.user) {
        dispatch(login(res.data.user));
        const previousPage = localStorage.getItem("previousPage");
        if (previousPage) {
          navigate(previousPage);
          localStorage.removeItem("previousPage");
        } else {
          navigate("/");
        }
      } else {
        setServerError("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Invalid email or password.";
      setServerError(msg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ✅ Google login
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfoRes = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`,
          {
            headers: { Authorization: `Bearer ${response.access_token}` },
          }
        );
        const userInfo = userInfoRes.data;

        const idTokenRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?access_token=${response.access_token}`
        );
        const idTokenData = await idTokenRes.json();

        if (!idTokenData?.email) throw new Error("Failed to retrieve ID Token.");

        const validateResponse = await fetch(
          `${config.BASEURL}/user/auth/validate-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: idTokenData.id_token,
              email: userInfo.email,
            }),
          }
        );

        if (!validateResponse.ok) {
          throw new Error(
            `Server responded with ${validateResponse.status} - ${validateResponse.statusText}`
          );
        }

        const validateData = await validateResponse.json();

        if (validateData?.error) setServerError(validateData.error);
        else if (validateData?.user) {
          sessionStorage.setItem("user", JSON.stringify(validateData.user));
          dispatch(login(validateData.user));
          navigate("/");
        }
      } catch (error) {
        setServerError(error.message || "Google authentication failed.");
      }
    },
    onError: () => setServerError("Google login failed. Please try again."),
    scope: "openid email profile",
  });

  return (
    <Grid container className="login-container">
      {/* Left Side: Login Form */}
      <Grid item xs={12} md={6} className="login-form-container">
        <Box className="login-form glass-card">
          <Box className="login-header">
            {/* <img src={LoginLogo} alt="Logo" className="logo" /> */}
            <Box className="brand-badge">Nithya Event</Box>
            <Typography variant="h4" className="title">
              Welcome Back
            </Typography>
            <Typography variant="body2" className="subtitle">
              Sign in to manage your bookings and wishlist.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} className="login-form-content">
            {/* Email */}
            <TextField
              label="Email"
              name="email"
              value={data.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!emailError}
              helperText={emailError}
              InputLabelProps={{ shrink: true }}
              className="ne-input"
            />

            {/* Password */}
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!passwordError.length}
              helperText={
                Array.isArray(passwordError) && passwordError.length > 0 ? (
                  <List dense sx={{ m: 0, p: 0 }}>
                    {passwordError.map((err, i) => (
                      <ListItem
                        key={i}
                        sx={{
                          color: "#d32f2f",
                          fontSize: "0.8rem",
                          lineHeight: 1.2,
                          pl: 0,
                        }}
                      >
                        • {err}
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  passwordError
                )
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
              className="ne-input"
            />

            <Typography
              onClick={() => navigate("/forgotPassword")}
              variant="body2"
              className="forgot-password"
            >
              Forgot Password?
            </Typography>

            <Button type="submit" fullWidth variant="contained" className="login-btn gradient-btn">
              Login
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

          <Divider className="divider">OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            className="social-btn social-btn-outline"
            onClick={googleLogin}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>

          <Button
            fullWidth
            variant="outlined"
            className="social-btn social-btn-outline"
            onClick={() => navigate("/loginMobile")}
            startIcon={<PhoneIphoneIcon />}
          >
            Sign in with Mobile Number
          </Button>

          <Button
            fullWidth
            variant="outlined"
            className="social-btn social-btn-outline"
            startIcon={<FacebookIcon />}
          >
            Sign in with Facebook
          </Button>

          <Typography variant="body2" className="register-text">
            Don’t have an account yet?
            <Typography
              component="span"
              className="register-link"
              sx={{ marginLeft: "1rem", cursor: "pointer" }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Typography>
          </Typography>
        </Box>
      </Grid>

        {/* Right Side: Banner */}
        <Grid item xs={12} md={6} className="login-banner">
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

export default Login;
