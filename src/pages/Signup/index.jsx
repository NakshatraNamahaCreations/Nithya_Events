// // import React, { useEffect, useState } from "react";
// // import "./styles.scss";
// // import authService from "../../api/ApiService";
// // import { useNavigate } from "react-router-dom";
// // import { useDispatch } from "react-redux";
// // import { login } from "../../redux/slice/authSlice";
// // import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // const Signup = () => {
// //   const [formData, setFormData] = useState({
// //     username: "",
// //     email: "",
// //     mobilenumber: "",
// //     password: "",
// //   });
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({ ...formData, [name]: value });
// //   };

// //   const register = async () => {
// //     try {
// //       const response = await authService.registerUser(formData);
// //       console.log(response);

// //       dispatch(login(response.data.newUser));
// //       navigate("/company");
// //     } catch (error) {
// //       if (error.response && error.response.data.message) {
// //         // Check if the error message indicates that the user already exists
// //         if (error.response.data.message.includes("User already exists")) {
// //           toast.error("User already exists. Please log in.", {
// //             position: "top-right",
// //             autoClose: 2000,
// //             hideProgressBar: false,
// //             closeOnClick: true,
// //             pauseOnHover: true,
// //             draggable: true,
// //             progress: undefined,
// //           });
// //         } else {
// //           toast.error(error.response.data.message, {
// //             position: "top-right",
// //             autoClose: 2000,
// //             hideProgressBar: false,
// //             closeOnClick: true,
// //             pauseOnHover: true,
// //             draggable: true,
// //             progress: undefined,
// //           });
// //         }
// //       } else {
// //         toast.error("Sign up failed. Please try again.", {
// //           position: "top-right",
// //           autoClose: 2000,
// //           hideProgressBar: false,
// //           closeOnClick: true,
// //           pauseOnHover: true,
// //           draggable: true,
// //           progress: undefined,
// //         });
// //       }
// //     }
// //   }

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     register();
// //   };

// //   useEffect(() => {}, []);

// //   return (
// //     <Grid container className="signup-container" mb={20}>
// //       <ToastContainer/>
// //       <Grid item xs={12} md={6} className="signup-form">
// //         <Box component={Paper} elevation={4} className="form-box">
// //           <Typography variant="h5" className="title">
// //             Create Your Account
// //           </Typography>
// //           <Typography variant="body2" className="subtitle">
// //             Sign up to start planning your events seamlessly.
// //           </Typography>

// //           <form onSubmit={handleSubmit} className="signup-form-content">
// //             <TextField
// //               label="User Name"
// //               name="username"
// //               value={formData.username}
// //               onChange={handleChange}
// //               fullWidth
// //               required
// //               className="input-field"
// //             />
// //             <TextField
// //               label="Mobile Number"
// //               name="mobilenumber"
// //               type="tel"
// //               value={formData.mobilenumber}
// //               onChange={handleChange}
// //               fullWidth
// //               required
// //               className="input-field"
// //             />
// //             <TextField
// //               label="Email"
// //               name="email"
// //               type="email"
// //               value={formData.email}
// //               onChange={handleChange}
// //               fullWidth
// //               required
// //               className="input-field"
// //             />
// //             <TextField
// //               label="Password"
// //               name="password"
// //               type="password"
// //               value={formData.password}
// //               onChange={handleChange}
// //               fullWidth
// //               required
// //               className="input-field"
// //             />
// //             <Button
// //               type="submit"
// //               fullWidth
// //               variant="contained"
// //               className="primary-btn"
// //             >
// //               Sign Up
// //             </Button>
// //           </form>

// //           <Typography variant="body2" className="or-text">
// //             OR
// //           </Typography>

// //           <Button
// //             fullWidth
// //             variant="outlined"
// //             className="social-btn google-btn"
// //           >
// //             Sign Up with Google
// //           </Button>
// //           <Button
// //             fullWidth
// //             variant="outlined"
// //             className="social-btn facebook-btn"
// //           >
// //             Sign Up with Facebook
// //           </Button>

// //           <Typography variant="body2" className="login-text">
// //             Already have an account?{" "}
// //             <span className="login-link" onClick={() => navigate("/login")}>
// //               Log in
// //             </span>
// //           </Typography>
// //         </Box>
// //       </Grid>

// //       <Grid item xs={12} md={6} className="signup-banner">
// //         <Box className="banner-overlay">
// //           <Typography variant="h4" className="banner-title">
// //             Plan Your Events Effortlessly
// //           </Typography>
// //           <Typography variant="body1" className="banner-subtext">
// //             Sign up today and make your event planning a seamless experience!
// //           </Typography>
// //         </Box>
// //       </Grid>
// //     </Grid>
// //   );
// // };

// // export default Signup;


// // import React, { useEffect, useState } from "react";
// // import "./styles.scss";
// // import authService from "../../api/ApiService";
// // import { useNavigate } from "react-router-dom";
// // import { useDispatch } from "react-redux";
// // import { login } from "../../redux/slice/authSlice";
// // import {
// //   Box,
// //   Button,
// //   Grid,
// //   Paper,
// //   TextField,
// //   Typography,
// // } from "@mui/material";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // const Signup = () => {
// //   const [formData, setFormData] = useState({
// //     username: "",
// //     email: "",
// //     mobilenumber: "",
// //     password: "",
// //   });

// //   const [errors, setErrors] = useState({});
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();

// //   // ✅ Update form data and clear specific field error when typing
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //     setErrors((prev) => ({ ...prev, [name]: "" }));
// //   };

// //   // ✅ Full field-level validation
// //   const validate = () => {
// //     let tempErrors = {};
// //     let isValid = true;

// //     // Username
// //     if (!formData.username.trim()) {
// //       tempErrors.username = "Username is required.";
// //       isValid = false;
// //     }

// //     // Mobile number
// //     if (!formData.mobilenumber.trim()) {
// //       tempErrors.mobilenumber = "Mobile number is required.";
// //       isValid = false;
// //     } else if (!/^[0-9]{10}$/.test(formData.mobilenumber)) {
// //       tempErrors.mobilenumber = "Enter a valid 10-digit mobile number.";
// //       isValid = false;
// //     }

// //     // Email
// //     if (!formData.email.trim()) {
// //       tempErrors.email = "Email is required.";
// //       isValid = false;
// //     } else if (
// //       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
// //     ) {
// //       tempErrors.email = "Enter a valid email address.";
// //       isValid = false;
// //     }

// //     // Password
// //     if (!formData.password.trim()) {
// //       tempErrors.password = "Password is required.";
// //       isValid = false;
// //     } else if (formData.password.length < 6) {
// //       tempErrors.password = "Password must be at least 6 characters.";
// //       isValid = false;
// //     }

// //     setErrors(tempErrors);
// //     return isValid;
// //   };

// //   // ✅ Register user via API
// //   const register = async () => {
// //     try {
// //       const response = await authService.registerUser(formData);
// //       dispatch(login(response.data.newUser));
// //       navigate("/company");
// //     } catch (error) {
// //       const message = error.response?.data?.message;
// //       if (message?.includes("User already exists")) {
// //         toast.error("User already exists. Please log in.", {
// //           position: "top-right",
// //           autoClose: 2000,
// //         });
// //       } else {
// //         toast.error(message || "Sign up failed. Please try again.", {
// //           position: "top-right",
// //           autoClose: 2000,
// //         });
// //       }
// //     }
// //   };

// //   // ✅ Handle submit with validation check
// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (validate()) {
// //       register();
// //     }
// //   };

// //   useEffect(() => {}, []);

// //   return (
// //     <Grid container className="signup-container" mb={20}>
// //       <ToastContainer />
// //       <Grid item xs={12} md={6} className="signup-form">
// //         <Box component={Paper} elevation={4} className="form-box">
// //           <Typography variant="h5" className="title">
// //             Create Your Account
// //           </Typography>
// //           <Typography variant="body2" className="subtitle">
// //             Sign up to start planning your events seamlessly.
// //           </Typography>

// //           {/* ✅ Signup Form */}
// //           <form onSubmit={handleSubmit} className="signup-form-content">
// //             {/* Username */}
// //             <TextField
// //               label="User Name"
// //               name="username"
// //               value={formData.username}
// //               onChange={handleChange}
// //               fullWidth
// //               margin="normal"
// //               error={!!errors.username}
// //               helperText={errors.username}
// //             />

// //             {/* Mobile Number */}
// //             <TextField
// //               label="Mobile Number"
// //               name="mobilenumber"
// //               type="tel"
// //               value={formData.mobilenumber}
// //               onChange={handleChange}
// //               fullWidth
// //               margin="normal"
// //               error={!!errors.mobilenumber}
// //               helperText={errors.mobilenumber}
// //             />

// //             {/* Email */}
// //             <TextField
// //               label="Email"
// //               name="email"
// //               type="email"
// //               value={formData.email}
// //               onChange={handleChange}
// //               fullWidth
// //               margin="normal"
// //               error={!!errors.email}
// //               helperText={errors.email}
// //             />

// //             {/* Password */}
// //             <TextField
// //               label="Password"
// //               name="password"
// //               type="password"
// //               value={formData.password}
// //               onChange={handleChange}
// //               fullWidth
// //               margin="normal"
// //               error={!!errors.password}
// //               helperText={errors.password}
// //             />

// //             {/* Submit */}
// //             <Button
// //               type="submit"
// //               fullWidth
// //               variant="contained"
// //               className="primary-btn"
// //               sx={{ mt: 2 }}
// //             >
// //               Sign Up
// //             </Button>
// //           </form>

// //           {/* OR divider */}
// //           <Typography
// //             variant="body2"
// //             className="or-text"
// //             sx={{ textAlign: "center", mt: 3 }}
// //           >
// //             OR
// //           </Typography>

// //           {/* Social Buttons */}
// //           <Button
// //             fullWidth
// //             variant="outlined"
// //             className="social-btn google-btn"
// //             sx={{ mt: 2 }}
// //           >
// //             Sign Up with Google
// //           </Button>
// //           <Button
// //             fullWidth
// //             variant="outlined"
// //             className="social-btn facebook-btn"
// //             sx={{ mt: 1 }}
// //           >
// //             Sign Up with Facebook
// //           </Button>

// //           {/* Redirect to Login */}
// //           <Typography variant="body2" className="login-text" sx={{ mt: 3 }}>
// //             Already have an account?{" "}
// //             <span
// //               className="login-link"
// //               style={{ color: "#c026d3", cursor: "pointer" }}
// //               onClick={() => navigate("/login")}
// //             >
// //               Log in
// //             </span>
// //           </Typography>
// //         </Box>
// //       </Grid>

// //       {/* Right Side Banner */}
// //       <Grid item xs={12} md={6} className="signup-banner">
// //         <Box className="banner-overlay">
// //           <Typography variant="h4" className="banner-title">
// //             Plan Your Events Effortlessly
// //           </Typography>
// //           <Typography variant="body1" className="banner-subtext">
// //             Sign up today and make your event planning a seamless experience!
// //           </Typography>
// //         </Box>
// //       </Grid>
// //     </Grid>
// //   );
// // };

// // export default Signup;

// import React, { useEffect, useState } from "react";
// import "./styles.scss";
// import authService from "../../api/ApiService";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { login } from "../../redux/slice/authSlice";
// import {
//   Box,
//   Button,
//   Grid,
//   Paper,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     mobilenumber: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // ✅ Update form data and clear specific field error when typing
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Restrict username to alphabets and spaces only
//     if (name === "username") {
//       if (/^[A-Za-z\s]*$/.test(value)) {
//         setFormData((prev) => ({ ...prev, [name]: value }));
//         setErrors((prev) => ({ ...prev, [name]: "" }));
//       }
//       return;
//     }

//     // Restrict mobile to 10 digits only
//     if (name === "mobilenumber") {
//       if (/^\d{0,10}$/.test(value)) {
//         setFormData((prev) => ({ ...prev, [name]: value }));
//         setErrors((prev) => ({ ...prev, [name]: "" }));
//       }
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   // ✅ Full field-level validation
//   const validate = () => {
//     let tempErrors = {};
//     let isValid = true;

//     // Username
//     if (!formData.username.trim()) {
//       tempErrors.username = "Username is required.";
//       isValid = false;
//     } else if (!/^[A-Za-z\s]+$/.test(formData.username)) {
//       tempErrors.username = "Username must contain only alphabets.";
//       isValid = false;
//     }

//     // Mobile number
//     if (!formData.mobilenumber.trim()) {
//       tempErrors.mobilenumber = "Mobile number is required.";
//       isValid = false;
//     } else if (!/^[0-9]{10}$/.test(formData.mobilenumber)) {
//       tempErrors.mobilenumber = "Enter a valid 10-digit mobile number.";
//       isValid = false;
//     }

//     // Email
//     if (!formData.email.trim()) {
//       tempErrors.email = "Email is required.";
//       isValid = false;
//     } else if (
//       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
//     ) {
//       tempErrors.email = "Enter a valid email address.";
//       isValid = false;
//     }

//     // Password (8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
//     if (!formData.password.trim()) {
//       tempErrors.password = "Password is required.";
//       isValid = false;
//     } else if (
//       !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
//         formData.password
//       )
//     ) {
//       tempErrors.password =
//         "Password must be at least 8 characters and include one uppercase, one lowercase, one number, and one special character.";
//       isValid = false;
//     }

//     setErrors(tempErrors);
//     return isValid;
//   };

//   // ✅ Register user via API
//   const register = async () => {
//     try {
//       const response = await authService.registerUser(formData);
//       dispatch(login(response.data.newUser));
//       navigate("/company");
//     } catch (error) {
//       const message = error.response?.data?.message;
//       if (message?.includes("User already exists")) {
//         toast.error("User already exists. Please log in.", {
//           position: "top-right",
//           autoClose: 2000,
//         });
//       } else {
//         toast.error(message || "Sign up failed. Please try again.", {
//           position: "top-right",
//           autoClose: 2000,
//         });
//       }
//     }
//   };

//   // ✅ Handle submit with validation check
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validate()) {
//       register();
//     }
//   };

//   useEffect(() => {}, []);

//   return (
//     <Grid container className="signup-container" mb={20}>
//       <ToastContainer />
//       <Grid item xs={12} md={6} className="signup-form">
//         <Box component={Paper} elevation={4} className="form-box">
//           <Typography variant="h5" className="title">
//             Create Your Account
//           </Typography>
//           <Typography variant="body2" className="subtitle">
//             Sign up to start planning your events seamlessly.
//           </Typography>

//           {/* ✅ Signup Form */}
//           <form onSubmit={handleSubmit} className="signup-form-content">
//             {/* Username */}
//             <TextField
//               label="User Name"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//               error={!!errors.username}
//               helperText={errors.username}
//             />

//             {/* Mobile Number */}
//             <TextField
//               label="Mobile Number"
//               name="mobilenumber"
//               type="tel"
//               value={formData.mobilenumber}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//               error={!!errors.mobilenumber}
//               helperText={errors.mobilenumber}
//             />

//             {/* Email */}
//             <TextField
//               label="Email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//               error={!!errors.email}
//               helperText={errors.email}
//             />

//             {/* Password */}
//             <TextField
//               label="Password"
//               name="password"
//               type="password"
//               value={formData.password}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//               error={!!errors.password}
//               helperText={errors.password}
//             />

//             {/* Submit */}
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               className="primary-btn"
//               sx={{ mt: 2 }}
//             >
//               Sign Up
//             </Button>
//           </form>

//           {/* OR divider */}
//           <Typography
//             variant="body2"
//             className="or-text"
//             sx={{ textAlign: "center", mt: 3 }}
//           >
//             OR
//           </Typography>

//           {/* Social Buttons */}
//           <Button
//             fullWidth
//             variant="outlined"
//             className="social-btn google-btn"
//             sx={{ mt: 2 }}
//           >
//             Sign Up with Google
//           </Button>
//           <Button
//             fullWidth
//             variant="outlined"
//             className="social-btn facebook-btn"
//             sx={{ mt: 1 }}
//           >
//             Sign Up with Facebook
//           </Button>

//           {/* Redirect to Login */}
//           <Typography variant="body2" className="login-text" sx={{ mt: 3 }}>
//             Already have an account?{" "}
//             <span
//               className="login-link"
//               style={{ color: "#c026d3", cursor: "pointer" }}
//               onClick={() => navigate("/login")}
//             >
//               Log in
//             </span>
//           </Typography>
//         </Box>
//       </Grid>

//       {/* Right Side Banner */}
//       <Grid item xs={12} md={6} className="signup-banner">
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

// export default Signup;

import React, { useState } from "react";
import "./styles.scss";
import authService from "../../api/ApiService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slice/authSlice";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobilenumber: "",
    password: "",
    confirmPassword: "",
    countryCode: "+91",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Capitalize each word for final cleaned value
  const capitalizeWords = (str) =>
    str
      .split(" ")
      .filter((w) => w.length)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

  // Normalize username for email check: remove spaces, hyphens, apostrophes, non-letters, lowercase
  const normalizeUsername = (str) =>
    (str || "")
      .toLowerCase()
      .replace(/[^a-z'-\s]/g, "") // keep only letters, space, hyphen, apostrophe first
      .replace(/[\s'-]/g, ""); // then remove separators

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "countryCode") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    // --- USERNAME ---
    if (name === "username") {
      // Allow alphabets, spaces, hyphen, apostrophe; collapse multiple spaces; auto-capitalize
      const cleaned = value.replace(/[^A-Za-z\s'-]/g, "").replace(/\s{2,}/g, " ");
      const limited = cleaned.slice(0, 50);
      const titleCased = capitalizeWords(limited);
      setFormData((prev) => ({ ...prev, [name]: titleCased }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    // --- MOBILE ---
    if (name === "mobilenumber") {
      const val = value.replace(/\D/g, ""); // only digits
      if (val.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: val }));
      }
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    // --- EMAIL ---
    if (name === "email") {
      const clean = value.replace(/\s/g, "").toLowerCase(); // remove spaces and force lowercase while typing
      if (clean.length <= 50) {
        setFormData((prev) => ({ ...prev, [name]: clean }));
      }
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    // --- PASSWORD ---
    if (name === "password") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    // --- CONFIRM PASSWORD ---
    if (name === "confirmPassword") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Validation Function
  const validate = () => {
    const tempErrors = {};
    let isValid = true;

    // --- USERNAME VALIDATION ---
    const username = formData.username.trim().replace(/\s{2,}/g, " "); // trim & remove extra spaces
    if (!username) {
      tempErrors.username = "User Name is required.";
      isValid = false;
    } else if (/\d/.test(username)) {
      tempErrors.username = "Numbers are not allowed in name.";
      isValid = false;
    } else if (/[^A-Za-z\s'-]/.test(username)) {
      tempErrors.username =
        "Special characters are not allowed (only alphabets, spaces, hyphen, apostrophe).";
      isValid = false;
    } else if (username.length > 50) {
      tempErrors.username = "Name cannot exceed 50 characters.";
      isValid = false;
    } else {
      // Capitalize name only on submit
      formData.username = capitalizeWords(username);
    }

    // --- MOBILE VALIDATION ---
    const mobile = formData.mobilenumber.trim();
    if (!mobile) {
      tempErrors.mobilenumber = "Mobile number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(mobile)) {
      tempErrors.mobilenumber = "Enter a valid 10-digit mobile number.";
      isValid = false;
    }

    // --- EMAIL VALIDATION ---
    const email = formData.email.trim();
    if (!email) {
      tempErrors.email = "Email ID is required.";
      isValid = false;
    } else if (email.includes(" ")) {
      tempErrors.email = "Email should not contain spaces.";
      isValid = false;
    } else if (email.length > 50) {
      tempErrors.email = "Email cannot exceed 50 characters.";
      isValid = false;
    } else if (email !== email.toLowerCase()) {
      tempErrors.email = "Email must be lowercase only.";
      isValid = false;
    } else {
      // ✅ Email validation rules:
      // - Only one '@'
      // - Local part: letters and digits (dots allowed between parts)
      // - Domain: labels with letters/digits/hyphen separated by dots, at least one dot
      const atCount = (email.match(/@/g) || []).length;
      if (atCount !== 1) {
        tempErrors.email = "Email must contain exactly one '@'.";
        isValid = false;
      } else {
        const emailRegex = /^[A-Za-z0-9]+(\.[A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
        if (!emailRegex.test(email)) {
          tempErrors.email =
            "Invalid email format. Use letters/digits before '@' and a valid domain (e.g., name12@domain.com).";
          isValid = false;
        }

        // Enforce that email local-part contains normalized username
        const [localPart] = email.split("@");
        const normalizedUser = normalizeUsername(formData.username);
        if (normalizedUser && !localPart.toLowerCase().includes(normalizedUser)) {
          tempErrors.email = "Email should include your username (e.g., davidjosheph@gmail.com).";
          isValid = false;
        }
      }
    }

    // --- PASSWORD VALIDATION ---
    const password = formData.password.trim();
    const passwordErrors = [];

    if (!password) {
      passwordErrors.push("Password is required.");
      isValid = false;
    } else {
      if (password.length < 8)
        passwordErrors.push("Must be at least 8 characters long.");
      if (!/[A-Z]/.test(password))
        passwordErrors.push("Must contain at least one uppercase letter (A–Z).");
      if (!/[a-z]/.test(password))
        passwordErrors.push("Must contain at least one lowercase letter (a–z).");
      if (!/[0-9]/.test(password))
        passwordErrors.push("Must contain at least one digit (0–9).");
      if (!/[@$!%*?&#]/.test(password))
        passwordErrors.push(
          "Must contain at least one special character (@, $, !, %, *, ?, &, #)."
        );
      if (passwordErrors.length > 0) isValid = false;
    }

    if (passwordErrors.length > 0) tempErrors.password = passwordErrors;

    // --- CONFIRM PASSWORD VALIDATION ---
    const confirmPassword = formData.confirmPassword.trim();
    if (!confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password.";
      isValid = false;
    } else if (password && confirmPassword !== password) {
      tempErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // ✅ Register API Call
  const register = async () => {
    try {
      // const combinedMobile = `${formData.countryCode}${formData.mobilenumber.trim()}`;
      const response = await authService.registerUser({
        username: capitalizeWords(formData.username.trim().replace(/\s{2,}/g, " ")),
        email: formData.email.trim(),
        mobilenumber: formData.mobilenumber.trim(),
        password: formData.password.trim(),
      });

      dispatch(login(response.data.newUser));
      navigate("/company");
    } catch (error) {
      const message = error.response?.data?.message;
      if (message?.includes("already exists")) {
        toast.error(message, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.error(message || "Sign up failed. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
  };

  // ✅ Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) register();
  };

  return (
    <Grid container className="signup-container" mb={20}>
      <ToastContainer />

      <Grid item xs={12} md={6} className="signup-form">
      <Box style={{padding: '2rem 0rem'}}>
        <Box component={Paper} elevation={0} className="form-box">
          <Box className="brand-badge">Nithya Event</Box>
          <Typography variant="h6" className="title">
            Create Your Account
          </Typography>
          <Typography variant="body2" className="subtitle">
            Join us and plan unforgettable moments with ease.
          </Typography>

          <form onSubmit={handleSubmit} className="signup-form-content">
            {/* User Name */}
            <TextField
              label="User Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.username}
              helperText={errors.username}
              InputLabelProps={{ shrink: true }}
              className="ne-input"
            />

            {/* Mobile Number with Country Code */}
            <Box className="phone-row">
              <FormControl className="country-select">
                <InputLabel id="country-code-label">Code</InputLabel>
                <Select
                  labelId="country-code-label"
                  label="Code"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  size="medium"
                >
                  <MenuItem value={"+91"}>+91 (IN)</MenuItem>
                  <MenuItem value={"+1"}>+1 (US)</MenuItem>
                  <MenuItem value={"+44"}>+44 (UK)</MenuItem>
                  <MenuItem value={"+61"}>+61 (AU)</MenuItem>
                  <MenuItem value={"+971"}>+971 (AE)</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Mobile Number"
                name="mobilenumber"
                type="tel"
                value={formData.mobilenumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.mobilenumber}
                helperText={errors.mobilenumber}
                InputLabelProps={{ shrink: true }}
                className="ne-input"
              />
            </Box>

            {/* Email */}
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              InputLabelProps={{ shrink: true }}
              className="ne-input"
            />

            {/* Password */}
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={
                Array.isArray(errors.password) ? (
                  <List dense sx={{ m: 0, p: 0 }}>
                    {errors.password.map((err, i) => (
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
                  errors.password
                )
              }
              InputLabelProps={{ shrink: true }}
              className="ne-input"
            />

            {/* Confirm Password */}
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputLabelProps={{ shrink: true }}
              className="ne-input"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="primary-btn gradient-btn"
              sx={{ mt: 2 }}
            >
              Sign Up
            </Button>
          </form>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 3 }}>
            OR
          </Typography>

          <Button fullWidth variant="outlined" className="social-btn-outline" sx={{ mt: 2 }}>
            Sign Up with Google
          </Button>
          <Button fullWidth variant="outlined" className="social-btn-outline" sx={{ mt: 1 }}>
            Sign Up with Facebook
          </Button>

          <Typography variant="body2" sx={{ mt: 3 }}>
            Already have an account?{" "}
            <span
              style={{ color: "#c026d3", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </Typography>
        </Box>
      </Box>
      </Grid>
      {/* Right Side Banner */}
      <Grid item xs={12} md={6} className="signup-banner">
        <Box className="banner-overlay">
          <Typography variant="h4" className="banner-title">
            Plan Your Events Effortlessly
          </Typography>
          <Typography variant="body1" className="banner-subtext">
            Sign up today and make your event planning a seamless experience!
          </Typography>
          <Box className="banner-bullets">
            <span>• Vendor Marketplace</span>
            <span>• Smart Budgeting</span>
            <span>• One‑click Coordination</span>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Signup;
