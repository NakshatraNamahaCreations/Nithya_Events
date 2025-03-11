import React, { useEffect, useState } from "react";
import { Box, TextField, Typography, Grid, Paper, Button } from "@mui/material";
import { useSelector } from "react-redux";
import authService from "../../../../api/ApiService";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    panFrontImage: "",
    panBackImage: "",
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
  const companyType = accountDetails.companyType;

  const getUser = async () => {
    try {
      const res = await authService.getCompanyDetail(userDetails._id);
      const companyDetails = res.data.company_profile[0];

      const userData = {
        name: res.data.username || "",
        email: res.data.email || "",
        mobileNumber: res.data.mobilenumber || "",
        companyName: companyDetails?.company_name || "",
        companyType: companyDetails?.company_type || "",
        designation: companyDetails?.designation || "",
        panNumber: companyDetails?.pan_number || "",
        gstNumber: companyDetails?.gst_number || "",
        cinNumber: companyDetails?.cin_number || "",
        tradeLicense: companyDetails?.tradeLicense || "",
        panFrontImage: companyDetails?.pan_front_image || "",
        panBackImage: companyDetails?.pan_back_image || "",
      };

      setAccountDetails(userData);
      setOriginalDetails(userData); // Store original backend values
      setUpdatedDetails(userData); // Set fields for editing
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

    // If name is edited, enable editing mode
 
      setIsEditing(true);
    
  };

  // Update User API Call
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(`http://192.168.1.103:9000/api/user/edit-profile/${userId}`, {
        username: updatedDetails.name,
        email: updatedDetails.email,
        mobilenumber: updatedDetails.mobileNumber, 
      });

      toast.success("Name has been updated successfully", {
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
            toast.error("Error in editing the name", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
      setUpdatedDetails(originalDetails); // Reset to original backend values
    }
    setIsSaving(false);
  };
  useEffect(() => {
    getUser();
  }, []);

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
      <ToastContainer/>
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
            // InputProps={{ readOnly: !isEditing }}  
          />
        </Grid>
        <Grid item xs={12}>
     
            <TextField
            fullWidth
            label="email"
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
            label={companyType === "Self/Others" ? "Name" : "Company Name"}
            variant="outlined"
            value={accountDetails.companyName}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        {companyType !== "Self/Others" && (
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Company Type"
              variant="outlined"
              value={accountDetails.companyType}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        )}

        {companyType !== "Self/Others" && (
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Designation"
              variant="outlined"
              value={accountDetails.designation}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        )}

        {companyType !== "Self/Others" && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="TDS"
              variant="outlined"
              value="2%"
              InputProps={{ readOnly: true }}
            />
          </Grid>
        )}
      </Grid>

      {/* GST & PAN Details - Shown for Certain Company Types */}
      {[
        "Private Limited & Limited",
        "Partnership & LLP",
        "Proprietorship",
        "Limited",
      ].includes(companyType) && (
        <>
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
            Tax & Compliance Details
          </Typography>
          <Grid container spacing={2}>
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
                label="PAN Number"
                variant="outlined"
                value={accountDetails.panNumber}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>

          {/* PAN Card Images */}
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
            PAN Card Images
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper
                sx={{
                  height: 120,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  border: "2px dashed #ddd",
                }}
              >
                {accountDetails.panFrontImage ? (
                  <img
                    src={accountDetails.panFrontImage}
                    alt="PAN Front"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                ) : (
                  <Typography>No Image</Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper
                sx={{
                  height: 120,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  border: "2px dashed #ddd",
                }}
              >
                {accountDetails.panBackImage ? (
                  <img
                    src={accountDetails.panBackImage}
                    alt="PAN Back"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                ) : (
                  <Typography>No Image</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* CIN Number (For Specific Companies) */}
      {["Private Limited & Limited", "Partnership & LLP", "Limited"].includes(
        companyType
      ) && (
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="CIN Number"
            variant="outlined"
            value={accountDetails.cinNumber}
            sx={{ marginTop: "2rem" }}
            InputProps={{ readOnly: true }}
          />
        </Grid>
      )}

      {/* Trade License (Only for Proprietorship) */}
      {companyType === "Proprietorship" && (
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Trade License"
            variant="outlined"
            value={accountDetails.tradeLicense}
            InputProps={{ readOnly: true }}
          />
        </Grid>
      )}
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
