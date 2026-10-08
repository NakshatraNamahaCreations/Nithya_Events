// import React, { useState, useEffect } from "react";
// import { Box, TextField, Typography, Grid, Button } from "@mui/material";
// import { useSelector } from "react-redux";
// import authService from "../../../../api/ApiService"; // API call
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./styles.scss";

// const Profile = () => {
//   const [accountDetails, setAccountDetails] = useState({
//     name: "",
//     email: "",
//     mobileNumber: "",
//     companyName: "",
//     companyType: "",
//     designation: "",
//     panNumber: "",
//     gstNumber: "",
//     cinNumber: "",
//     tradeLicense: "",
//     panFrontImage: "", // PAN image for company
//     panBackImage: "",
//     profileImage: null, // Store image as file (not URL)
//   });
//   const [updatedDetails, setUpdatedDetails] = useState({});
//   const [originalDetails, setOriginalDetails] = useState({});
//   const [isSaving, setIsSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const userDetail = sessionStorage.getItem("userDetails");
//   let userId = null;

//   if (userDetail) {
//     try {
//       const userDetails = JSON.parse(userDetail);
//       userId = userDetails?._id || null;
//     } catch (error) {
//       console.error("Error parsing userDetails from sessionStorage:", error);
//     }
//   }

//   const userDetails = useSelector((state) => state.auth.userDetails);

//   // Fetch user data for editing
//   const getUser = async () => {
//     try {
//       const res = await authService.getUserProfile(userDetails._id);
//       const companyProfile = res.data.company_profile[0] || {};

//       const userData = {
//         name: res.data.username || "",
//         email: res.data.email || "",
//         mobileNumber: res.data.mobilenumber || "",
//         companyName: companyProfile.company_name || "",
//         companyType: companyProfile.company_type || "",
//         designation: companyProfile.designation || "",
//         panNumber: companyProfile.pan_number || "",
//         gstNumber: companyProfile.gst_number || "",
//         cinNumber: companyProfile.cin_number || "",
//         tradeLicense: companyProfile.tradeLicense || "",
//         panFrontImage: companyProfile.pan_front_image || "",
//         panBackImage: companyProfile.pan_back_image || "",
//         profileImage:
//           res.data.profile_image || companyProfile.pan_front_image || null, // Default to company image
//       };

//       setAccountDetails(userData);
//       setOriginalDetails(userData);
//       setUpdatedDetails(userData);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   useEffect(() => {
//     getUser();
//   }, []);

//   // Handle Input Change for Editable Fields
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUpdatedDetails((prev) => ({ ...prev, [name]: value }));
//     setIsEditing(true);
//   };

//   // Handle Profile Image Upload
//   const handleImageChange = (e) => {
//     const file = e.target.files[0]; // Get the first file from the input
//     if (file) {
//       setUpdatedDetails({
//         ...updatedDetails,
//         profileImage: file, // Store the actual file, not the Blob URL
//       });
//     }
//   };

//   // Save Profile Updates
//   const handleSave = async () => {
//     setIsSaving(true);
//     try {
//       const formData = new FormData();
//       formData.append("username", updatedDetails.name);
//       // Only append the file object for the image
//       if (updatedDetails.profileImage) {
//         formData.append("profile_image", updatedDetails.profileImage);
//       }

//       await axios.put(
//         `https://api.nithyaevent.com/api/user/edit-profile/${userId}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       toast.success("Profile updated successfully", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//       setOriginalDetails(updatedDetails);
//       setIsEditing(false);
//     } catch (error) {
//       toast.error("Error updating profile", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//       setUpdatedDetails(originalDetails);
//     }
//     setIsSaving(false);
//   };

//   return (
//     <Box
//       sx={{
//         padding: 4,
//         maxWidth: 700,
//         margin: "20px auto",
//         backgroundColor: "#fff",
//         borderRadius: 4,
//         boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
//         position: "relative",
//         marginTop: "5rem",
//       }}
//     >
//       <ToastContainer />
//       <Typography
//         variant="h5"
//         align="center"
//         sx={{
//           marginBottom: 4,
//           marginTop: 4,
//           fontWeight: "bold",
//           color: "#333",
//           textTransform: "uppercase",
//         }}
//       >
//         Account Details
//       </Typography>

//       {/* Profile Image Upload */}
//       <Box
//         sx={{
//           textAlign: "center",
//           marginBottom: 3,
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <img
//           src={
//             updatedDetails.profileImage instanceof File
//               ? URL.createObjectURL(updatedDetails.profileImage)
//               : updatedDetails.profileImage
//               ? updatedDetails.profileImage
//               : "https://www.ohe.org/external_stakeholder/ken-buckingham/?modal=yes"
//           }
//           alt="Profile"
//           style={{
//             borderRadius: "50%",
//             width: "120px",
//             height: "120px",
//             objectFit: "cover",
//             marginBottom: "10px",
//           }}
//         />
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           style={{ display: "none" }}
//           id="profileImage"
//         />
//         <label htmlFor="profileImage">
//           <Button variant="contained" component="span" color="primary">
//             Upload Profile Image
//           </Button>
//         </label>
//       </Box>

//       {/* Personal Details */}
//       <Typography
//         variant="subtitle1"
//         gutterBottom
//         sx={{
//           fontWeight: "bold",
//           marginBottom: 1,
//           color: "#555",
//           textTransform: "uppercase",
//         }}
//       >
//         Personal Details
//       </Typography>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             variant="outlined"
//             name="name"
//             value={updatedDetails.name}
//             onChange={handleInputChange}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="Email"
//             variant="outlined"
//             value={accountDetails.email}
//             InputProps={{ readOnly: true }}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="Mobile Number"
//             variant="outlined"
//             value={accountDetails.mobileNumber}
//             InputProps={{ readOnly: true }}
//           />
//         </Grid>
//       </Grid>

//       {/* Company Details */}
//       {/* Company Details */}
//       <Typography
//         variant="subtitle1"
//         gutterBottom
//         sx={{
//           fontWeight: "bold",
//           marginTop: 4,
//           marginBottom: 1,
//           color: "#555",
//           textTransform: "uppercase",
//         }}
//       >
//         Company Details
//       </Typography>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="Company Name"
//             variant="outlined"
//             value={accountDetails.companyName}
//             InputProps={{ readOnly: true }}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="Company Type"
//             variant="outlined"
//             value={accountDetails.companyType}
//             InputProps={{ readOnly: true }}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="Designation"
//             variant="outlined"
//             value={accountDetails.designation}
//             InputProps={{ readOnly: true }}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="PAN Number"
//             variant="outlined"
//             value={accountDetails.panNumber}
//             InputProps={{ readOnly: true }}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="GST Number"
//             variant="outlined"
//             value={accountDetails.gstNumber}
//             InputProps={{ readOnly: true }}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="CIN Number"
//             variant="outlined"
//             value={accountDetails.cinNumber}
//             InputProps={{ readOnly: true }}
//           />
//         </Grid>
//       </Grid>

//       {/* PAN Images */}
//       <Typography variant="subtitle1" sx={{ marginTop: 4 }}>
//         PAN Images
//       </Typography>
//       <Grid container spacing={2}>
//         <Grid item xs={6}>
//           <img
//             src={accountDetails.panFrontImage}
//             alt="PAN Front"
//             style={{ width: "100%", height: "auto", borderRadius: "8px" }}
//           />
//         </Grid>
//         <Grid item xs={6}>
//           <img
//             src={accountDetails.panBackImage}
//             alt="PAN Back"
//             style={{ width: "100%", height: "auto", borderRadius: "8px" }}
//           />
//         </Grid>
//       </Grid>

//       {/* Save Button */}
//       <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
//         <Button
//           variant="contained"
//           color="primary"
//           size="large"
//           sx={{ paddingX: 4, textTransform: "uppercase", fontWeight: "bold" }}
//           onClick={handleSave}
//           disabled={isSaving}
//         >
//           {isSaving ? "Saving..." : "Save Changes"}
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default Profile;
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Grid,
  Button,
  MenuItem,
} from "@mui/material";
import {
  validateCompanyName,
  validateDesignation,
  validatePAN,
  validateGST,
  validateCIN,
  smartTrim,
  COMPANY_TYPES,
} from "../../../../utils/companyValidators";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../../../api/ApiService"; // API call
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";

// Inline avatar placeholder shown when the user has no profile image.
const NO_AVATAR =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='120'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23e0e0e0'/%3E%3Ccircle%20cx='60'%20cy='45'%20r='24'%20fill='%23bdbdbd'/%3E%3Cpath%20d='M20%20110%20a40%2035%200%200%201%2080%200%20z'%20fill='%23bdbdbd'/%3E%3C/svg%3E";

const Profile = () => {
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    companyName: "",
    companyType: "",
    designation: "",
    panNumber: "",
    gstNumber: "",
    cinNumber: "",
    tradeLicense: "",
    panFrontImage: "", // PAN image for company
    panBackImage: "",
    profileImage: null, // Store image as file (not URL)
  });
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [originalDetails, setOriginalDetails] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [companyErrors, setCompanyErrors] = useState({});

  // Map each editable company field to its validator (returns [] when valid).
  const COMPANY_VALIDATORS = {
    companyName: validateCompanyName,
    designation: validateDesignation,
    panNumber: validatePAN,
    gstNumber: validateGST,
    cinNumber: validateCIN,
    companyType: (v) => (v ? [] : ["Company type is required"]),
  };

  const userDetail = sessionStorage.getItem("userDetails");
  let userId = null;

  if (userDetail) {
    try {
      const userDetails = JSON.parse(userDetail);
      userId = userDetails?._id || null;
    } catch (error) {
      console.error("Error parsing userDetails from sessionStorage:", error);
    }
  }

  const userDetails = useSelector((state) => state.auth.userDetails);

  // Fetch user data for editing
  const getUser = async () => {
    try {
      const res = await authService.getUserProfile(userDetails._id);
      const companyProfile = res.data.company_profile[0] || {};

      const userData = {
        name: res.data.username || "",
        email: res.data.email || "",
        mobileNumber: res.data.mobilenumber || "",
        companyName: companyProfile.company_name || "",
        companyType: companyProfile.company_type || "",
        designation: companyProfile.designation || "",
        panNumber: companyProfile.pan_number || "",
        gstNumber: companyProfile.gst_number || "",
        cinNumber: companyProfile.cin_number || "",
        tradeLicense: companyProfile.tradeLicense || "",
        panFrontImage: companyProfile.pan_front_image || "",
        panBackImage: companyProfile.pan_back_image || "",
        profileImage:
          res.data.profile_image || companyProfile.pan_front_image || null, // Default to company image
      };

      setAccountDetails(userData);
      setOriginalDetails(userData);
      setUpdatedDetails(userData); // Initialize updatedDetails with userData
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Handle Input Change for Editable Fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prev) => ({ ...prev, [name]: value }));
    setIsEditing(true);
    if (COMPANY_VALIDATORS[name]) {
      const errs = COMPANY_VALIDATORS[name](value);
      setCompanyErrors((prev) => ({ ...prev, [name]: errs[0] || "" }));
    }
  };

  // Handle Profile Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file from the input
    if (file) {
      setUpdatedDetails({
        ...updatedDetails,
        profileImage: file, // Store the actual file, not the Blob URL
      });
      setIsEditing(true);
    }
  };

  // Save Profile Updates
  const handleSave = async () => {
    // Validate every editable company field before saving.
    const nextErrors = {};
    Object.keys(COMPANY_VALIDATORS).forEach((field) => {
      const errs = COMPANY_VALIDATORS[field](updatedDetails[field] || "");
      if (errs.length) nextErrors[field] = errs[0];
    });
    setCompanyErrors(nextErrors);
    if (Object.values(nextErrors).some((e) => e)) {
      toast.error("Please fix the highlighted fields.", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("username", updatedDetails.name);
      if (updatedDetails.profileImage) {
        formData.append("profile_image", updatedDetails.profileImage);
      }
      // Company details (now editable on this page).
      formData.append("company_name", smartTrim(updatedDetails.companyName || ""));
      formData.append("company_type", updatedDetails.companyType || "");
      formData.append("designation", smartTrim(updatedDetails.designation || ""));
      formData.append(
        "pan_number",
        (updatedDetails.panNumber || "").toUpperCase().replace(/\s+/g, "")
      );
      formData.append(
        "gst_number",
        (updatedDetails.gstNumber || "").toUpperCase().trim()
      );
      formData.append(
        "cin_number",
        (updatedDetails.cinNumber || "").toUpperCase().trim()
      );

      await axios.put(
        `https://api.nithyaevent.com/api/user/edit-profile/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Profile updated successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setAccountDetails(updatedDetails); // Sync accountDetails with updatedDetails
      setOriginalDetails(updatedDetails);
      setIsEditing(false);

      // Redirect to the home page after a successful update (let the success
      // toast show briefly first).
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      toast.error("Error updating profile", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setUpdatedDetails(originalDetails);
    }
    setIsSaving(false);
  };

  // Toggle Edit Mode
  const handleEditToggle = () => {
    if (!isEditing) {
      setUpdatedDetails(originalDetails); // Reset to original details when starting to edit
    }
    setIsEditing(!isEditing);
  };

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: 700,
        margin: "20px auto",
        backgroundColor: "#fff",
        borderRadius: 4,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        position: "relative",
        marginTop: "5rem",
      }}
    >
      <ToastContainer />
      <Typography
        variant="h5"
        align="center"
        sx={{
          marginBottom: 4,
          marginTop: 4,
          fontWeight: "bold",
          color: "#333",
          textTransform: "uppercase",
        }}
      >
        Account Details
      </Typography>

      {/* Edit Toggle Button */}
      <Box sx={{ textAlign: "right", marginBottom: 2 }}>
        <Button
          variant="contained"
          color={isEditing ? "secondary" : "primary"}
          onClick={handleEditToggle}
          disabled={isSaving}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </Box>

      {/* Profile Image Upload */}
      <Box
        sx={{
          textAlign: "center",
          marginBottom: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={
            updatedDetails.profileImage instanceof File
              ? URL.createObjectURL(updatedDetails.profileImage)
              : updatedDetails.profileImage
              ? updatedDetails.profileImage
              : NO_AVATAR
          }
          alt="Profile"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = NO_AVATAR;
          }}
          style={{
            borderRadius: "50%",
            width: "120px",
            height: "120px",
            objectFit: "cover",
            marginBottom: "10px",
          }}
        />
        {isEditing && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="profileImage"
            />
            <label htmlFor="profileImage">
              <Button variant="contained" component="span" color="primary">
                Upload Profile Image
              </Button>
            </label>
          </>
        )}
      </Box>

      {/* Personal Details */}
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          marginBottom: 1,
          color: "#555",
          textTransform: "uppercase",
        }}
      >
        Personal Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            name="name"
            value={updatedDetails.name || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={updatedDetails.email || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Mobile Number"
            variant="outlined"
            value={updatedDetails.mobileNumber || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>

      {/* Company Details */}
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          marginTop: 4,
          marginBottom: 1,
          color: "#555",
          textTransform: "uppercase",
        }}
      >
        Company Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Company Name"
            name="companyName"
            variant="outlined"
            value={updatedDetails.companyName || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            error={!!companyErrors.companyName}
            helperText={companyErrors.companyName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Company Type"
            name="companyType"
            variant="outlined"
            value={updatedDetails.companyType || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            error={!!companyErrors.companyType}
            helperText={companyErrors.companyType}
          >
            {COMPANY_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Designation"
            name="designation"
            variant="outlined"
            value={updatedDetails.designation || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            error={!!companyErrors.designation}
            helperText={companyErrors.designation}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="PAN Number"
            name="panNumber"
            variant="outlined"
            value={updatedDetails.panNumber || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            error={!!companyErrors.panNumber}
            helperText={companyErrors.panNumber}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="GST Number"
            name="gstNumber"
            variant="outlined"
            value={updatedDetails.gstNumber || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            error={!!companyErrors.gstNumber}
            helperText={companyErrors.gstNumber}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="CIN Number"
            name="cinNumber"
            variant="outlined"
            value={updatedDetails.cinNumber || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            error={!!companyErrors.cinNumber}
            helperText={companyErrors.cinNumber}
          />
        </Grid>
      </Grid>

      {/* PAN Images */}
      <Typography variant="subtitle1" sx={{ marginTop: 4 }}>
        PAN Images
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <img
            src={accountDetails.panFrontImage}
            alt="PAN Front"
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </Grid>
        <Grid item xs={6}>
          <img
            src={accountDetails.panBackImage}
            alt="PAN Back"
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ paddingX: 4, textTransform: "uppercase", fontWeight: "bold" }}
          onClick={handleSave}
          disabled={!isEditing || isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
