// import React, { useState } from "react";
// import {
//   Box,
//   TextField,
//   Typography,
//   Grid,
//   MenuItem,
//   Button,
//   Paper,
//   IconButton,
//   Modal,
// } from "@mui/material";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Calendar from "../Calender";
// import { config } from "../../api/config";
// import axios from "axios";

// const CompanyDetails = () => {
//   const [companyType, setCompanyType] = useState("");
//   const [formData, setFormData] = useState({
//     company_type: "",
//     company_name: "",
//     designation: "",
//     gst_number: "",
//     pan_number: "",
//     cin_number: "",
//     tradeLicense: "",
//     pan_front_image: null,
//     pan_back_image: null,
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const userDetails = useSelector((state) => state.auth.userDetails);
//   const navigate = useNavigate();

//   // -----------------------------
//   // Handle Changes
//   // -----------------------------
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setFormErrors({ ...formErrors, [name]: "" });
//   };

//   const handleCompanyTypeChange = (e) => {
//     const value = e.target.value;
//     setCompanyType(value);
//     setFormData({ ...formData, company_type: value });
//     setFormErrors({});
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (files.length > 0) {
//       setFormData({ ...formData, [name]: files[0] });
//       setFormErrors({ ...formErrors, [name]: "" });
//     }
//   };

//   // -----------------------------
//   // Validation Logic
//   // -----------------------------
//   const validateForm = () => {
//     const errors = {};

//     if (!companyType) errors.company_type = "Please select a company type.";
//     if (!formData.company_name.trim())
//       errors.company_name =
//         companyType === "Self/Others"
//           ? "Please enter your name."
//           : "Please enter the company name.";

//     if (companyType !== "Self/Others" && !formData.designation.trim())
//       errors.designation = "Please enter your designation.";

//     if (
//       [
//         "Private Limited & Limited",
//         "Partnership & LLP",
//         "Proprietorship",
//         "Limited",
//       ].includes(companyType)
//     ) {
//       if (!formData.gst_number.trim())
//         errors.gst_number = "GST number is required.";
//       if (!formData.pan_number.trim())
//         errors.pan_number = "PAN number is required.";
//       if (!formData.pan_front_image)
//         errors.pan_front_image = "Upload PAN front image.";
//       if (!formData.pan_back_image)
//         errors.pan_back_image = "Upload PAN back image.";
//     }

//     if (
//       ["Private Limited & Limited", "Partnership & LLP", "Limited"].includes(
//         companyType
//       ) &&
//       !formData.cin_number.trim()
//     )
//       errors.cin_number = "CIN number is required.";

//     if (companyType === "Proprietorship" && !formData.tradeLicense.trim())
//       errors.tradeLicense = "Trade license is required.";

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // -----------------------------
//   // Submit
//   // -----------------------------
//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       const payload = new FormData();
//       Object.keys(formData).forEach((key) => {
//         payload.append(key, formData[key]);
//       });

//       await axios.put(
//         `${config.BASEURL}${config.UPDATE_USER_PROFILE}${userDetails?._id}`,
//         payload,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setIsCalendarOpen(true);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   };

//   const handleCalendarClose = () => setIsCalendarOpen(false);

//   // -----------------------------
//   // JSX Render
//   // -----------------------------
//   return (
//     <Box
//       sx={{
//         padding: 4,
//         maxWidth: 700,
//         margin: "60px auto",
//         backgroundColor: "#fff",
//         borderRadius: 4,
//         boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
//       }}
//     >
//       <Typography
//         variant="h5"
//         align="center"
//         sx={{
//           marginBottom: 4,
//           fontWeight: "bold",
//           color: "#333",
//           textTransform: "uppercase",
//         }}
//       >
//         Company Details
//       </Typography>

//       <Grid container spacing={2}>
//         {/* Company Type */}
//         <Grid item xs={12}>
//           <TextField
//             select
//             fullWidth
//             label="Company Type"
//             name="company_type"
//             value={companyType}
//             onChange={handleCompanyTypeChange}
//             variant="outlined"
//             error={!!formErrors.company_type}
//             helperText={formErrors.company_type}
//           >
//             <MenuItem value="Private Limited & Limited">
//               Private Limited & Limited
//             </MenuItem>
//             <MenuItem value="Partnership & LLP">Partnership & LLP</MenuItem>
//             <MenuItem value="Proprietorship">Proprietorship</MenuItem>
//             <MenuItem value="Limited">Limited</MenuItem>
//             <MenuItem value="Self/Others">Self/Others</MenuItem>
//           </TextField>
//         </Grid>

//         {/* Company Name / Name */}
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label={companyType === "Self/Others" ? "Name" : "Company Name"}
//             name="company_name"
//             value={formData.company_name}
//             onChange={handleChange}
//             variant="outlined"
//             error={!!formErrors.company_name}
//             helperText={formErrors.company_name}
//           />
//         </Grid>

//         {/* Designation & TDS */}
//         {companyType !== "Self/Others" && (
//           <>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Designation"
//                 name="designation"
//                 value={formData.designation}
//                 onChange={handleChange}
//                 variant="outlined"
//                 error={!!formErrors.designation}
//                 helperText={formErrors.designation}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="TDS"
//                 name="tds"
//                 value="2%"
//                 variant="outlined"
//                 disabled
//               />
//             </Grid>
//           </>
//         )}

//         {/* GST, PAN, and Images */}
//         {[
//           "Private Limited & Limited",
//           "Partnership & LLP",
//           "Proprietorship",
//           "Limited",
//         ].includes(companyType) && (
//           <>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="GST Number"
//                 name="gst_number"
//                 value={formData.gst_number}
//                 onChange={handleChange}
//                 variant="outlined"
//                 error={!!formErrors.gst_number}
//                 helperText={formErrors.gst_number}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="PAN Number"
//                 name="pan_number"
//                 value={formData.pan_number}
//                 onChange={handleChange}
//                 variant="outlined"
//                 error={!!formErrors.pan_number}
//                 helperText={formErrors.pan_number}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <Paper
//                 sx={{
//                   height: 120,
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   backgroundColor: "#f5f5f5",
//                   borderRadius: 2,
//                   border: "2px dashed #ddd",
//                   flexDirection: "column",
//                 }}
//               >
//                 <IconButton color="primary" component="label">
//                   <PhotoCamera />
//                   <input
//                     hidden
//                     accept="image/*"
//                     type="file"
//                     name="pan_front_image"
//                     onChange={handleFileChange}
//                   />
//                 </IconButton>
//                 {formData.pan_front_image && (
//                   <Typography align="center" variant="subtitle2" sx={{ mt: 1 }}>
//                     {formData.pan_front_image.name.slice(0, 20)}
//                   </Typography>
//                 )}
//               </Paper>
//               {formErrors.pan_front_image && (
//                 <Typography color="error" variant="caption">
//                   {formErrors.pan_front_image}
//                 </Typography>
//               )}
//               <Typography align="center" variant="subtitle2">
//                 PAN Front Image
//               </Typography>
//             </Grid>

//             <Grid item xs={6}>
//               <Paper
//                 sx={{
//                   height: 120,
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   backgroundColor: "#f5f5f5",
//                   borderRadius: 2,
//                   border: "2px dashed #ddd",
//                   flexDirection: "column",
//                 }}
//               >
//                 <IconButton color="primary" component="label">
//                   <PhotoCamera />
//                   <input
//                     hidden
//                     accept="image/*"
//                     type="file"
//                     name="pan_back_image"
//                     onChange={handleFileChange}
//                   />
//                 </IconButton>
//                 {formData.pan_back_image && (
//                   <Typography align="center" variant="subtitle2" sx={{ mt: 1 }}>
//                     {formData.pan_back_image.name.slice(0, 20)}
//                   </Typography>
//                 )}
//               </Paper>
//               {formErrors.pan_back_image && (
//                 <Typography color="error" variant="caption">
//                   {formErrors.pan_back_image}
//                 </Typography>
//               )}
//               <Typography align="center" variant="subtitle2">
//                 PAN Back Image
//               </Typography>
//             </Grid>
//           </>
//         )}

//         {/* CIN or Trade License */}
//         {(companyType === "Private Limited & Limited" ||
//           companyType === "Partnership & LLP" ||
//           companyType === "Limited") && (
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="CIN Number"
//               name="cin_number"
//               value={formData.cin_number}
//               onChange={handleChange}
//               variant="outlined"
//               error={!!formErrors.cin_number}
//               helperText={formErrors.cin_number}
//             />
//           </Grid>
//         )}

//         {companyType === "Proprietorship" && (
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Trade License"
//               name="tradeLicense"
//               value={formData.tradeLicense}
//               onChange={handleChange}
//               variant="outlined"
//               error={!!formErrors.tradeLicense}
//               helperText={formErrors.tradeLicense}
//             />
//           </Grid>
//         )}
//       </Grid>

//       {/* Submit */}
//       <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
//         <Button
//           variant="contained"
//           color="primary"
//           size="large"
//           sx={{ paddingX: 4, textTransform: "uppercase", fontWeight: "bold" }}
//           onClick={handleSubmit}
//         >
//           Submit
//         </Button>
//       </Box>

//       {/* Calendar Modal */}
//       <Modal open={isCalendarOpen} onClose={handleCalendarClose}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             bgcolor: "background.paper",
//             borderRadius: "16px",
//             boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
//             p: 4,
//             width: "450px",
//             maxWidth: "95%",
//             textAlign: "center",
//           }}
//         >
//           <Calendar />
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default CompanyDetails;

import React, { useMemo, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Button,
  Paper,
  IconButton,
  Modal,
  Stack,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Calendar from "../Calender";
import { config } from "../../api/config";
import axios from "axios";

/* ---------------------------------------------
 * Helpers / Constants
 * --------------------------------------------- */
const MIN_COMPANY_CHARS = 2;
const MAX_COMPANY_CHARS = 100;
const MIN_DESIG_CHARS = 2;
const MAX_DESIG_CHARS = 50;

const RE_ALPHA_SPACE = /^[A-Za-z ]+$/;
const RE_PAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
// Don't pre-strip spaces for GST/CIN; detect spaces explicitly
const RE_GST_ALNUM = /^[A-Z0-9]+$/;
const RE_GST_SHAPE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/;
const RE_CIN_ALNUM = /^[A-Z0-9]+$/;
const RE_CIN_SHAPE = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

// Indian state codes used in CIN (positions 7-8, 0-index slice(6,8))
const STATE_CODES = new Set([
  "AP",
  "AR",
  "AS",
  "BR",
  "CG",
  "GA",
  "GJ",
  "HR",
  "HP",
  "JH",
  "JK",
  "KA",
  "KL",
  "LD",
  "MH",
  "ML",
  "MN",
  "MP",
  "MZ",
  "NL",
  "OD",
  "PB",
  "PY",
  "RJ",
  "SK",
  "TN",
  "TS",
  "TR",
  "UK",
  "UP",
  "WB",
  "AN",
  "CH",
  "DN",
  "DD",
  "DL",
  "LA",
]);

// Common company type codes inside CIN (positions 13-15, 0-index slice(12,15))
const CIN_COMPANY_TYPES = new Set([
  "PLC",
  "PTC",
  "NPL",
  "GAP",
  "GOV",
  "SGC",
  "FTC",
  "OPC",
  "ULL",
]);

// Smart trim ends and collapse internal multi-spaces to single
const smartTrim = (s = "") => s.replace(/\s+/g, " ").trim();

// GSTIN checksum per spec
const gstChecksumValid = (gstin) => {
  const baseChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const codePoint = (c) => baseChars.indexOf(c);

  // weights must be 1,2,1,2,1,2 starting from LEFT
  const weights = [1, 2];
  let sum = 0;

  for (let i = 0; i < 14; i++) {
    const cp = codePoint(gstin[i]);
    const w = weights[i % 2];
    const p = cp * w;

    sum += Math.floor(p / 36) + (p % 36);
  }

  const checkCode = (36 - (sum % 36)) % 36;
  return codePoint(gstin[14]) === checkCode;
};

// CIN validation with state and type code checks (do NOT remove inner spaces silently)
const validateCIN = (raw) => {
  const rawStr = raw || "";
  const v = rawStr.toUpperCase().trim(); // trim ends, keep internal spaces to detect
  const errors = [];
  if (!v) {
    errors.push("CIN Number is required");
    return errors;
  } // Field left blank
  if (/\s/.test(v)) {
    errors.push("Spaces not allowed");
    return errors;
  } // Spaces included
  if (!RE_CIN_ALNUM.test(v)) {
    errors.push("Invalid CIN Format");
    return errors;
  } // Special chars
  if (v.length !== 21) {
    errors.push("CIN must be 21 characters");
    return errors;
  } // < or > 21
  if (!RE_CIN_SHAPE.test(v)) {
    errors.push("Invalid CIN Format");
    return errors;
  } // wrong letters/digits positions
  const state = v.slice(6, 8);
  if (!STATE_CODES.has(state)) errors.push("Invalid State Code");
  const typeCode = v.slice(12, 15);
  if (!CIN_COMPANY_TYPES.has(typeCode)) errors.push("Invalid Company Type");
  return errors;
};

// Optional PAN duplicate check — expects { exists: boolean }
const checkPanDuplicate = async (pan) => {
  try {
    const url = `${config.BASEURL}/users/check-pan?pan=${encodeURIComponent(
      pan
    )}`;
    const res = await axios.get(url);
    return !!res?.data?.exists;
  } catch {
    return false; // Non-blocking if API not available
  }
};

const CompanyDetails = () => {
  const [companyType, setCompanyType] = useState("");
  const [formData, setFormData] = useState({
    company_type: "",
    company_name: "",
    designation: "",
    gst_number: "",
    pan_number: "",
    cin_number: "",
    tradeLicense: "",
    pan_front_image: null,
    pan_back_image: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [panFrontPreview, setPanFrontPreview] = useState(null);
  const [panBackPreview, setPanBackPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userDetails = useSelector((state) => state.auth.userDetails);
  const navigate = useNavigate();

  /* ---------------------------------------------
   * Company types (Option B from your tests)
   * --------------------------------------------- */
  const COMPANY_TYPES = [
    "Proprietorship",
    "Partnership",
    "Private Limited",
    "Public Limited",
    "LLP",
    "NGO",
  ];

  /* ---------------------------------------------
   * Visibility / Required rules (aligned to tests)
   * --------------------------------------------- */
  // GST & PAN required for all types in tests
  const requiresBusinessIds = useMemo(() => !!companyType, [companyType]);

  // CIN required for Partnership, Private Limited, Public Limited, LLP, NGO
  const requiresCIN = useMemo(
    () =>
      [
        "Partnership",
        "Private Limited",
        "Public Limited",
        "LLP",
        "NGO",
      ].includes(companyType),
    [companyType]
  );

  // Trade License required for Proprietorship only
  const requiresTradeLicense = useMemo(
    () => companyType === "Proprietorship",
    [companyType]
  );

  // Designation required for all types in tests
  const showDesignation = useMemo(() => !!companyType, [companyType]);

  /* ---------------------------------------------
   * Change Handlers
   * --------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;

    if (
      name === "company_name" ||
      name === "designation" ||
      name === "tradeLicense"
    ) {
      v = v.replace(/\s{2,}/g, " ");
    }

    // Do NOT remove inner spaces here for GST/CIN; we must detect them during validation
    if (name === "gst_number") {
      v = (v || "").toUpperCase(); // keep inner spaces if any; validator will flag
    }
    if (name === "pan_number") {
      v = (v || "").toUpperCase().replace(/\s+/g, ""); // PAN must not contain spaces
    }
    if (name === "cin_number") {
      v = (v || "").toUpperCase(); // keep inner spaces; validator will flag
    }

    setFormData((prev) => ({ ...prev, [name]: v }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCompanyTypeChange = (e) => {
    const value = e.target.value;
    setCompanyType(value);
    setFormData((prev) => ({ ...prev, company_type: value }));
    setFormErrors({});
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];

      // ✅ Store original image file
      setFormData((prev) => ({ ...prev, [name]: file }));
      setFormErrors((prev) => ({ ...prev, [name]: "" }));

      // ✅ Create preview
      const previewUrl = URL.createObjectURL(file);

      if (name === "pan_front_image") {
        setPanFrontPreview(previewUrl);
      }
      if (name === "pan_back_image") {
        setPanBackPreview(previewUrl);
      }
    }
  };

  /* ---------------------------------------------
   * Field Validations (mapped to your test cases)
   * --------------------------------------------- */
  const validateCompanyName = (raw) => {
    const errors = [];
    if (raw && raw.trim() === "") {
      errors.push("Invalid name");
      return errors;
    } // only spaces
    const v = smartTrim(raw);
    if (!v) {
      errors.push("Company Name is required");
      return errors;
    }
    if (v.length < MIN_COMPANY_CHARS) errors.push("Minimum length not met");
    if (v.length > MAX_COMPANY_CHARS) errors.push("Maximum length exceeded");
    if (!RE_ALPHA_SPACE.test(v)) {
      if (/\d/.test(v)) errors.push("Numbers not allowed");
      else errors.push("Special characters not allowed");
    }
    return errors;
  };

  const validateDesignation = (raw) => {
    const errors = [];
    if (!showDesignation) return errors;
    if (raw && raw.trim() === "") {
      errors.push("Invalid designation");
      return errors;
    } // only spaces
    const v = smartTrim(raw);
    if (!v) {
      errors.push("Designation is required");
      return errors;
    }
    if (v.length < MIN_DESIG_CHARS) errors.push("Minimum length not met");
    if (v.length > MAX_DESIG_CHARS) errors.push("Maximum length exceeded");
    if (!RE_ALPHA_SPACE.test(v)) {
      if (/\d/.test(v)) errors.push("Numbers not allowed");
      else errors.push("Special characters not allowed");
    }
    return errors;
  };

  const validatePAN = async (raw) => {
    const errors = [];
    const v = (raw || "").toUpperCase().replace(/\s+/g, "");
    if (!v) {
      errors.push("PAN number is required");
      return errors;
    }
    if (v.length !== 10) {
      errors.push(
        v.length < 10
          ? "PAN must be 10 characters"
          : "PAN must be exactly 10 characters"
      );
      return errors;
    }
    if (!RE_PAN.test(v)) {
      if (/[^A-Z0-9]/.test(v)) errors.push("Invalid characters not allowed");
      else errors.push("Invalid PAN format");
      return errors;
    }
    const exists = await checkPanDuplicate(v);
    if (exists) errors.push("Pan number already exists");
    return errors;
  };

  const validateGST = (raw) => {
    const errors = [];
    const v = (raw || "").toUpperCase().trim();

    if (!v) {
      errors.push("GST Number is required");
      return errors;
    }

    if (/\s/.test(v)) {
      errors.push("Spaces not allowed");
      return errors;
    }

    if (v.length !== 15) {
      errors.push("GST Number must be 15 characters");
      return errors;
    }

    if (!RE_GST_SHAPE.test(v)) {
      errors.push("Invalid GST Format");
      return errors;
    }

    // ✅ Checksum validation
    if (!gstChecksumValid(v)) {
      errors.push("Invalid GST Number");
    }

    return errors;
  };

  const validateCINWrap = (raw) => {
    if (!requiresCIN) return [];
    return validateCIN(raw);
  };

  const validatePANImages = () => {
    const errors = {};
    if (!requiresBusinessIds) return errors;
    if (!formData.pan_front_image)
      errors.pan_front_image = "Upload PAN front image.";
    if (!formData.pan_back_image)
      errors.pan_back_image = "Upload PAN back image.";
    return errors;
  };

  /* ---------------------------------------------
   * Form Orchestrator
   * --------------------------------------------- */
  const validateForm = async () => {
    const errors = {};

    if (!companyType) errors.company_type = "Please select a company type.";

    const cnErrors = validateCompanyName(formData.company_name);
    if (cnErrors.length) errors.company_name = cnErrors[0];

    const dgErrors = validateDesignation(formData.designation);
    if (dgErrors.length) errors.designation = dgErrors[0];

    if (requiresBusinessIds) {
      const panErrors = await validatePAN(formData.pan_number);
      if (panErrors.length) errors.pan_number = panErrors[0];
    }

    const gstErrors = validateGST(formData.gst_number);
    if (gstErrors.length) errors.gst_number = gstErrors[0];

    const cinErrors = validateCINWrap(formData.cin_number);
    if (cinErrors.length) errors.cin_number = cinErrors[0];

    if (requiresTradeLicense) {
      if (!smartTrim(formData.tradeLicense))
        errors.tradeLicense = "Trade license is required.";
    }

    Object.assign(errors, validatePANImages());

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ---------------------------------------------
   * Submit
   * --------------------------------------------- */
  const handleSubmit = async () => {
    setIsSubmitting(true); // ✅ start loading

    setFormData((prev) => ({
      ...prev,
      company_name: smartTrim(prev.company_name),
      designation: smartTrim(prev.designation),
      gst_number: (prev.gst_number || "").toUpperCase().trim(),
      pan_number: (prev.pan_number || "").toUpperCase().replace(/\s+/g, ""),
      cin_number: (prev.cin_number || "").toUpperCase().trim(),
      tradeLicense: smartTrim(prev.tradeLicense),
    }));

    if (!(await validateForm())) {
      setIsSubmitting(false); // ✅ stop loading if validation fails
      return;
    }

    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });

      await axios.put(
        `${config.BASEURL}${config.UPDATE_USER_PROFILE}${userDetails?._id}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setIsCalendarOpen(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setFormErrors((prev) => ({
        ...prev,
        submit: "Something went wrong while saving. Please try again.",
      }));
    }

    setIsSubmitting(false); // ✅ stop loading after complete
  };

  const handleCalendarClose = () => setIsCalendarOpen(false);

  /* ---------------------------------------------
   * JSX
   * --------------------------------------------- */
  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: 700,
        margin: "60px auto",
        backgroundColor: "#fff",
        borderRadius: 4,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: "#333",
          textTransform: "uppercase",
        }}
      >
        Company Details
      </Typography>

      <Grid container spacing={2}>
        {/* Company Type (Option B) */}
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Company Type"
            name="company_type"
            value={companyType}
            onChange={handleCompanyTypeChange}
            variant="outlined"
            error={!!formErrors.company_type}
            helperText={
              formErrors.company_type || "Select your organization type"
            }
          >
            {COMPANY_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Company Name — CN_* */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Company Name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            onBlur={(e) =>
              setFormData((prev) => ({
                ...prev,
                company_name: smartTrim(e.target.value),
              }))
            }
            inputProps={{ maxLength: MAX_COMPANY_CHARS + 5 }}
            variant="outlined"
            error={!!formErrors.company_name}
            helperText={
              formErrors.company_name ||
              `Only letters & spaces • ${MIN_COMPANY_CHARS}-${MAX_COMPANY_CHARS} chars`
            }
          />
        </Grid>

        {/* Designation — DG_* */}
        {showDesignation && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                onBlur={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    designation: smartTrim(e.target.value),
                  }))
                }
                variant="outlined"
                error={!!formErrors.designation}
                helperText={
                  formErrors.designation ||
                  `Only letters & spaces • ${MIN_DESIG_CHARS}-${MAX_DESIG_CHARS} chars`
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="TDS"
                name="tds"
                value="2%"
                variant="outlined"
                disabled
              />
            </Grid>
          </>
        )}

        {/* GST, PAN, and Images */}
        {requiresBusinessIds && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="GST Number"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
                onBlur={(e) =>
                  setFormData((p) => ({
                    ...p,
                    gst_number: (e.target.value || "").toUpperCase().trim(),
                  }))
                }
                variant="outlined"
                error={!!formErrors.gst_number}
                helperText={
                  formErrors.gst_number
                    ? formErrors.gst_number
                    : "Example: 29ABCDE1234F1Z5 (15 characters)"
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="PAN Number"
                name="pan_number"
                value={formData.pan_number}
                onChange={handleChange}
                onBlur={async (e) => {
                  const v = (e.target.value || "")
                    .toUpperCase()
                    .replace(/\s+/g, "");
                  setFormData((p) => ({ ...p, pan_number: v }));
                  try {
                    const exists = await checkPanDuplicate(v);
                    setFormErrors((prev) => ({
                      ...prev,
                      pan_number: exists
                        ? "Pan number already exists"
                        : prev.pan_number,
                    }));
                  } catch {
                    /* ignore */
                  }
                }}
                variant="outlined"
                error={!!formErrors.pan_number}
                helperText={
                  formErrors.pan_number
                    ? formErrors.pan_number
                    : "Example: ABCDE1234F (5 letters + 4 digits + 1 letter)"
                }
              />
            </Grid>

            {/* PAN Front Image — GUI_IMG_* */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  minHeight: 180,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  backgroundColor: "#fafafa",
                  borderRadius: 2,
                  border: "2px dashed #d0d0d0",
                  gap: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  PAN Front Image
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <IconButton color="primary" component="label">
                    <PhotoCamera />
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      name="pan_front_image"
                      onChange={handleFileChange}
                    />
                  </IconButton>

                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ fontSize: 12 }}
                  >
                    Upload
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      name="pan_front_image"
                      onChange={handleFileChange}
                    />
                  </Button>
                </Stack>

                {panFrontPreview ? (
                  <img
                    src={panFrontPreview}
                    alt="PAN Front Preview"
                    style={{
                      width: "100%",
                      maxWidth: "240px",
                      height: "auto",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                ) : (
                  <Typography variant="caption" sx={{ mt: 1, color: "#777" }}>
                    No image uploaded
                  </Typography>
                )}
              </Paper>

              {formErrors.pan_front_image && (
                <Typography color="error" variant="caption">
                  {formErrors.pan_front_image}
                </Typography>
              )}
            </Grid>

            {/* PAN Back Image */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  minHeight: 180,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  backgroundColor: "#fafafa",
                  borderRadius: 2,
                  border: "2px dashed #d0d0d0",
                  gap: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  PAN Back Image
                </Typography>

                {/* Upload Buttons */}
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <IconButton color="primary" component="label">
                    <PhotoCamera />
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      name="pan_back_image"
                      onChange={handleFileChange}
                    />
                  </IconButton>

                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ fontSize: 12 }}
                  >
                    Upload
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      name="pan_back_image"
                      onChange={handleFileChange}
                    />
                  </Button>
                </Stack>

                {/* Preview */}
                {panBackPreview ? (
                  <img
                    src={panBackPreview}
                    alt="PAN Back Preview"
                    style={{
                      width: "100%",
                      maxWidth: "240px",
                      height: "auto",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                ) : (
                  <Typography variant="caption" sx={{ mt: 1, color: "#777" }}>
                    No image uploaded
                  </Typography>
                )}
              </Paper>

              {formErrors.pan_back_image && (
                <Typography color="error" variant="caption">
                  {formErrors.pan_back_image}
                </Typography>
              )}
            </Grid>
          </>
        )}

        {/* CIN or Trade License */}
        {requiresCIN && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="CIN Number"
              name="cin_number"
              value={formData.cin_number}
              onChange={handleChange}
              onBlur={(e) =>
                setFormData((p) => ({
                  ...p,
                  cin_number: (e.target.value || "").toUpperCase().trim(), // trim ends only
                }))
              }
              variant="outlined"
              error={!!formErrors.cin_number}
              helperText={
                formErrors.cin_number
                  ? formErrors.cin_number
                  : "Example: U15400KA2020PLC123456 (21 characters)"
              }
            />
          </Grid>
        )}

        {requiresTradeLicense && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Trade License"
              name="tradeLicense"
              value={formData.tradeLicense}
              onChange={handleChange}
              onBlur={(e) =>
                setFormData((p) => ({
                  ...p,
                  tradeLicense: smartTrim(e.target.value),
                }))
              }
              variant="outlined"
              error={!!formErrors.tradeLicense}
              helperText={formErrors.tradeLicense}
            />
          </Grid>
        )}
      </Grid>

      {/* Submit */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 4, textTransform: "uppercase", fontWeight: "bold" }}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
        {formErrors.submit && (
          <Typography
            color="error"
            variant="body2"
            sx={{ alignSelf: "center" }}
          >
            {formErrors.submit}
          </Typography>
        )}
      </Box>

      {/* Calendar Modal */}
      <Modal open={isCalendarOpen} onClose={handleCalendarClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: "16px",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
            p: 4,
            width: "450px",
            maxWidth: "95%",
            textAlign: "center",
          }}
        >
          <Calendar />
        </Box>
      </Modal>
    </Box>
  );
};

export default CompanyDetails;
