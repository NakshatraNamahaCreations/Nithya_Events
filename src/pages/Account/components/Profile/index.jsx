import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Grid, Button } from "@mui/material";
import { useSelector } from "react-redux";
import authService from "../../../../api/ApiService"; // API call
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";

const Profile = () => {
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
      setUpdatedDetails(userData);
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
  };

  // Handle Profile Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file from the input
    if (file) {
      setUpdatedDetails({
        ...updatedDetails,
        profileImage: file, // Store the actual file, not the Blob URL
      });
    }
  };

  // Save Profile Updates
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("username", updatedDetails.name);
      // Only append the file object for the image
      if (updatedDetails.profileImage) {
        formData.append("profile_image", updatedDetails.profileImage);
      }

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
      setOriginalDetails(updatedDetails);
      setIsEditing(false);
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

      {/* Profile Image Upload */}
      <Box sx={{ textAlign: "center", marginBottom: 3, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
    
      <img
          src={
            updatedDetails.profileImage instanceof File
              ? URL.createObjectURL(updatedDetails.profileImage)
              : updatedDetails.profileImage
              ? updatedDetails.profileImage
              : "https://www.ohe.org/external_stakeholder/ken-buckingham/?modal=yes"
          }
          alt="Profile"
          style={{
            borderRadius: "50%",
            width: "120px",
            height: "120px",
            objectFit: "cover",
            marginBottom: "10px",
          }}
        />
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
            variant="outlined"
            name="name"
            value={updatedDetails.name}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={accountDetails.email}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Mobile Number"
            variant="outlined"
            value={accountDetails.mobileNumber}
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>

      {/* Company Details */}
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
            variant="outlined"
            value={accountDetails.companyName}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Company Type"
            variant="outlined"
            value={accountDetails.companyType}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Designation"
            variant="outlined"
            value={accountDetails.designation}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="PAN Number"
            variant="outlined"
            value={accountDetails.panNumber}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="GST Number"
            variant="outlined"
            value={accountDetails.gstNumber}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="CIN Number"
            variant="outlined"
            value={accountDetails.cinNumber}
            InputProps={{ readOnly: true }}
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
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
