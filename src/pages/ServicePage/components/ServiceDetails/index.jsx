// import React, { useEffect, useState } from "react";
// import authService from "../../../../api/ApiService";
// import { useNavigate, useParams } from "react-router-dom";
// import { Typography, Box, Paper, Avatar, Rating, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";
// import { useDispatch } from "react-redux";
// import { setLoading } from "../../../../redux/slice/LoaderSlice";
// import "./styles.scss";

// const ServiceDetails = () => {
//   const { serviceName } = useParams();
//   const [serviceDetails, setServiceDetails] = useState([]);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const getService = async () => {
//     try {
//       dispatch(setLoading(true));
//       const res = await authService.getService(serviceName);
//       setServiceDetails(res.data.data);
//       dispatch(setLoading(false));
//     } catch (error) {
//       dispatch(setLoading(false));
//       console.error("Error fetching service details:", error);
//     }
//   };

//   useEffect(() => {
//     getService();
//   }, [serviceName]);

//   if (!serviceDetails || serviceDetails.length === 0) {
//     return (
//       <Box className="no-services" sx={{ textAlign: "center", p: 10 }}>
//         <Typography variant="h5">No Services Found...</Typography>
//       </Box>
//     );
//   }

//   const calculateAverageRating = (reviews) => {
//     if (!reviews || reviews.length === 0) return 0;
//     const totalRating = reviews.reduce((sum, review) => sum + review.ratings, 0);
//     return (totalRating / reviews.length).toFixed(1);
//   };

//   return (
//     <Box className="service-details" sx={{ p: 6, pb: 20 }}>
//       <Typography variant="h5" className="service-details-heading" sx={{ mb: 3, fontWeight: "600", textAlign: "center" }}>
//         Service Details
//       </Typography>
      
//       {serviceDetails.map((item) => (
//         <Card key={item._id} sx={{ display: "flex", mb: 2, p: 2, borderRadius: 2, boxShadow: 3 }}>
//           {/* Shop Image */}
//           <CardMedia
//             component="img"
//             sx={{ width: 200, height: 150, borderRadius: 2, objectFit: "cover" }}
//             image={item.shop_image_or_logo || "https://via.placeholder.com/200"}
//             alt={item.shop_name}
//           />
          
//           {/* Service Details */}
//           <CardContent sx={{ flex: 1, pl: 2 }}>
//             <Typography variant="h6" fontWeight="bold">
//               {item.shop_name}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//               Vendor: {item.vendor_name}
//             </Typography>
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               <Rating value={calculateAverageRating(item.Reviews)} precision={0.1} readOnly size="small" />
//               <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
//                 ({item.Reviews.length} Reviews)
//               </Typography>
//             </Box>
//           </CardContent>
//         </Card>
//       ))}
//     </Box>
//   );
// };

// export default ServiceDetails;

// import React, { useEffect, useState } from "react";
// import authService from "../../../../api/ApiService";
// import { useNavigate, useParams } from "react-router-dom";
// import { Typography, Box, Paper, Avatar, Rating, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";
// import { useDispatch } from "react-redux";
// import { setLoading } from "../../../../redux/slice/LoaderSlice";
// import "./styles.scss";

// const ServiceDetails = () => {
//   const { serviceName } = useParams();
//   const [serviceDetails, setServiceDetails] = useState([]);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const getService = async () => {
//     try {
//       dispatch(setLoading(true));
//       const res = await authService.getService(serviceName);
//       setServiceDetails(res.data.data);
//       dispatch(setLoading(false));
//     } catch (error) {
//       dispatch(setLoading(false));
//       console.error("Error fetching service details:", error);
//     }
//   };
//   const handleServiceClick = (id) => {
//     navigate(`/service/${serviceName}/${id}`);
//   };
//   useEffect(() => {
//     getService();
//   }, [serviceName]);

//   if (!serviceDetails || serviceDetails.length === 0) {
//     return (
//       <Box className="no-services" sx={{ textAlign: "center", p: 10 }}>
//         <Typography variant="h5">No Services Found...</Typography>
//       </Box>
//     );
//   }

//   const calculateAverageRating = (reviews) => {
//     if (!reviews || reviews.length === 0) return 0;
//     const totalRating = reviews.reduce((sum, review) => sum + review.ratings, 0);
//     return (totalRating / reviews.length).toFixed(1);
//   };

//   return (
//     <Box className="service-details" sx={{ p: 6, pb: 20, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
//       <Typography variant="h5" className="service-details-heading" sx={{ mb: 3, fontWeight: "600", textAlign: "center" }}>
//         Service Details
//       </Typography>
      
//       {serviceDetails.map((item) => (
//         <Card key={item._id} sx={{ width: { xs: '90%', sm: '70%', md: '50%' }, mb: 2, p: 2, borderRadius: 2, boxShadow: 3, display:'flex' }}  onClick={() => handleServiceClick(item._id)}>
//           {/* Shop Image */}
//           <CardMedia
//             component="img"
//             sx={{ width: 200, height: 150, borderRadius: 2, objectFit: "cover" }}
//             image={item.shop_image_or_logo || "https://via.placeholder.com/200"}
//             alt={item.shop_name}
//           />
          
//           {/* Service Details */}
//           <CardContent sx={{ flex: 1, pl: 2 }}>
//             <Typography variant="h6" fontWeight="bold">
//               {item.shop_name}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//               Vendor: {item.vendor_name}
//             </Typography>
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               <Rating value={calculateAverageRating(item.Reviews)} precision={0.1} readOnly size="small" />
//               <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
//                 ({item.Reviews.length} Reviews)
//               </Typography>
//             </Box>
//           </CardContent>
//         </Card>
//       ))}
//     </Box>
//   );
// };

// export default ServiceDetails;


// import React, { useEffect, useState } from "react";
// import authService from "../../../../api/ApiService";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Typography,
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Avatar,
//   Rating,
// } from "@mui/material";
// import { useDispatch } from "react-redux";
// import { setLoading } from "../../../../redux/slice/LoaderSlice";
// import "./styles.scss";

// const ServiceDetails = () => {
//   const { serviceName } = useParams();
//   const [serviceDetails, setServiceDetails] = useState([]);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const getService = async () => {
//     try {
//       dispatch(setLoading(true));
//       const res = await authService.getService(serviceName);
//       setServiceDetails(res.data.data);
//       dispatch(setLoading(false));
//     } catch (error) {
//       dispatch(setLoading(false));
//       console.error("Error fetching service details:", error);
//     }
//   };

//   useEffect(() => {
//     getService();
//   }, [serviceName]);

//   if (!serviceDetails || serviceDetails.length === 0) {
//     return (
//       <Box className="no-services" sx={{ textAlign: "center", p: 10 }}>
//         <Typography variant="h5">No Services Found...</Typography>
//       </Box>
//     );
//   }

//   const calculateAverageRating = (reviews) => {
//     if (!reviews || reviews.length === 0) return 0;
//     const totalRating = reviews.reduce((sum, review) => sum + review.ratings, 0);
//     return (totalRating / reviews.length).toFixed(1);
//   };

//   return (
//     <Box className="service-details" sx={{ p: 6, pb: 20, display: "flex", justifyContent: "center" }}>
//       <Box sx={{ width: "90%", maxWidth: "800px" }}>
//         <Typography variant="h5" className="service-details-heading" sx={{ mb: 3, fontWeight: "600", textAlign: "center" }}>
//           Service Details
//         </Typography>

//         <TableContainer component={Paper} elevation={3} className="service-card">
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell align="center" sx={{ fontWeight: "bold" }}>Logo</TableCell>
//                 <TableCell align="left" sx={{ fontWeight: "bold" }}>Shop Name</TableCell>
//                 <TableCell align="left" sx={{ fontWeight: "bold" }}>Vendor Name</TableCell>
//                 <TableCell align="center" sx={{ fontWeight: "bold" }}>Rating</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {serviceDetails.map((item) => (
//                 <TableRow key={item._id} hover sx={{ cursor: "pointer" }} onClick={() => navigate(`/service/${serviceName}/${item._id}`)}>
//                   {/* Logo */}
//                   <TableCell align="center">
//                     <Avatar alt={item.shop_name} src={item.shop_image_or_logo || ""} sx={{ width: 50, height: 50 }}>
//                       {!item.shop_image_or_logo && item.shop_name?.charAt(0)}
//                     </Avatar>
//                   </TableCell>
//                   {/* Shop Name */}
//                   <TableCell>
//                     <Typography variant="body1" fontWeight="bold">
//                       {item.shop_name}
//                     </Typography>
//                   </TableCell>
//                   {/* Vendor Name */}
//                   <TableCell>
//                     <Typography variant="body2" color="text.secondary">
//                       {item.vendor_name}
//                     </Typography>
//                   </TableCell>
//                   {/* Rating */}
//                   <TableCell align="center" sx={{display:'flex', alignItems:'center',ml:'1rem'}}>
//                     {/* <Rating value={calculateAverageRating(item.Reviews)} precision={0.1} readOnly /> */}
//                     <Typography variant="caption" color="text.secondary">
//                       ({item.Reviews.length} Reviews)
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </Box>
//   );
// };

// export default ServiceDetails;


import React, { useEffect, useState } from "react";
import authService from "../../../../api/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Box, Paper, Avatar, Rating, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";import { useDispatch } from "react-redux";
import { setLoading } from "../../../../redux/slice/LoaderSlice";
import "./styles.scss";

const ServiceDetails = () => {
  const { serviceName } = useParams();
  const [serviceDetails, setServiceDetails] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getService = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.getService(serviceName);
      setServiceDetails(res.data.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Error fetching service details:", error);
    }
  };

  useEffect(() => {
    getService();
  }, [serviceName]);

  if (!serviceDetails || serviceDetails.length === 0) {
    return (
      <Box className="no-services" sx={{ textAlign: "center", p: 10 }}>
        <Typography variant="h5">No Services Found...</Typography>
      </Box>
    );
  }

  const handleServiceClick = (id) => {
    navigate(`/service/${serviceName}/${id}`);
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.ratings, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  return (
    <Box sx={{ p: 6, pb: 20 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "600", textAlign: "center" }}>
        Service Details
      </Typography>
      
      <Grid container spacing={3}>
        {serviceDetails.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
            <Card key={item._id} sx={{ mb: 2, p: 2, borderRadius: 2, boxShadow: 3 }} onClick={() => handleServiceClick(item._id)}>
           {/* Shop Image */}
          <CardMedia
          component="img"
           sx={{ width: 260, height: 150, borderRadius: 2, objectFit: "cover", cursor:'pointer' }}
            image={item.shop_image_or_logo || "https://via.placeholder.com/200"}
            alt={item.shop_name}
          />
          
          {/* Service Details */}
          <CardContent sx={{ flex: 1, pl: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {item.shop_name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Vendor: {item.vendor_name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Rating value={calculateAverageRating(item.Reviews)} precision={0.1} readOnly size="small" />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                ({item.Reviews.length} Reviews)
              </Typography>
            </Box>
          </CardContent>
        </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServiceDetails;
