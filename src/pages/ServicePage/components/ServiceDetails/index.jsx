// // import React, { useEffect, useState } from "react";
// // import authService from "../../../../api/ApiService";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { Typography, Box, Paper, Avatar, Rating, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";
// // import { useDispatch } from "react-redux";
// // import { setLoading } from "../../../../redux/slice/LoaderSlice";
// // import "./styles.scss";

// // const ServiceDetails = () => {
// //   const { serviceName } = useParams();
// //   const [serviceDetails, setServiceDetails] = useState([]);
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const getService = async () => {
// //     try {
// //       dispatch(setLoading(true));
// //       const res = await authService.getService(serviceName);
// //       setServiceDetails(res.data.data);
// //       dispatch(setLoading(false));
// //     } catch (error) {
// //       dispatch(setLoading(false));
// //       console.error("Error fetching service details:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     getService();
// //   }, [serviceName]);

// //   if (!serviceDetails || serviceDetails.length === 0) {
// //     return (
// //       <Box className="no-services" sx={{ textAlign: "center", p: 10 }}>
// //         <Typography variant="h5">No Services Found...</Typography>
// //       </Box>
// //     );
// //   }

// //   const calculateAverageRating = (reviews) => {
// //     if (!reviews || reviews.length === 0) return 0;
// //     const totalRating = reviews.reduce((sum, review) => sum + review.ratings, 0);
// //     return (totalRating / reviews.length).toFixed(1);
// //   };

// //   return (
// //     <Box className="service-details" sx={{ p: 6, pb: 20 }}>
// //       <Typography variant="h5" className="service-details-heading" sx={{ mb: 3, fontWeight: "600", textAlign: "center" }}>
// //         Service Details
// //       </Typography>

// //       {serviceDetails.map((item) => (
// //         <Card key={item._id} sx={{ display: "flex", mb: 2, p: 2, borderRadius: 2, boxShadow: 3 }}>
// //           {/* Shop Image */}
// //           <CardMedia
// //             component="img"
// //             sx={{ width: 200, height: 150, borderRadius: 2, objectFit: "cover" }}
// //             image={item.shop_image_or_logo || "https://via.placeholder.com/200"}
// //             alt={item.shop_name}
// //           />

// //           {/* Service Details */}
// //           <CardContent sx={{ flex: 1, pl: 2 }}>
// //             <Typography variant="h6" fontWeight="bold">
// //               {item.shop_name}
// //             </Typography>
// //             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
// //               Vendor: {item.vendor_name}
// //             </Typography>
// //             <Box sx={{ display: "flex", alignItems: "center" }}>
// //               <Rating value={calculateAverageRating(item.Reviews)} precision={0.1} readOnly size="small" />
// //               <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
// //                 ({item.Reviews.length} Reviews)
// //               </Typography>
// //             </Box>
// //           </CardContent>
// //         </Card>
// //       ))}
// //     </Box>
// //   );
// // };

// // export default ServiceDetails;

// // import React, { useEffect, useState } from "react";
// // import authService from "../../../../api/ApiService";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { Typography, Box, Paper, Avatar, Rating, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";
// // import { useDispatch } from "react-redux";
// // import { setLoading } from "../../../../redux/slice/LoaderSlice";
// // import "./styles.scss";

// // const ServiceDetails = () => {
// //   const { serviceName } = useParams();
// //   const [serviceDetails, setServiceDetails] = useState([]);
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const getService = async () => {
// //     try {
// //       dispatch(setLoading(true));
// //       const res = await authService.getService(serviceName);
// //       setServiceDetails(res.data.data);
// //       dispatch(setLoading(false));
// //     } catch (error) {
// //       dispatch(setLoading(false));
// //       console.error("Error fetching service details:", error);
// //     }
// //   };
// //   const handleServiceClick = (id) => {
// //     navigate(`/service/${serviceName}/${id}`);
// //   };
// //   useEffect(() => {
// //     getService();
// //   }, [serviceName]);

// //   if (!serviceDetails || serviceDetails.length === 0) {
// //     return (
// //       <Box className="no-services" sx={{ textAlign: "center", p: 10 }}>
// //         <Typography variant="h5">No Services Found...</Typography>
// //       </Box>
// //     );
// //   }

// //   const calculateAverageRating = (reviews) => {
// //     if (!reviews || reviews.length === 0) return 0;
// //     const totalRating = reviews.reduce((sum, review) => sum + review.ratings, 0);
// //     return (totalRating / reviews.length).toFixed(1);
// //   };

// //   return (
// //     <Box className="service-details" sx={{ p: 6, pb: 20, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
// //       <Typography variant="h5" className="service-details-heading" sx={{ mb: 3, fontWeight: "600", textAlign: "center" }}>
// //         Service Details
// //       </Typography>

// //       {serviceDetails.map((item) => (
// //         <Card key={item._id} sx={{ width: { xs: '90%', sm: '70%', md: '50%' }, mb: 2, p: 2, borderRadius: 2, boxShadow: 3, display:'flex' }}  onClick={() => handleServiceClick(item._id)}>
// //           {/* Shop Image */}
// //           <CardMedia
// //             component="img"
// //             sx={{ width: 200, height: 150, borderRadius: 2, objectFit: "cover" }}
// //             image={item.shop_image_or_logo || "https://via.placeholder.com/200"}
// //             alt={item.shop_name}
// //           />

// //           {/* Service Details */}
// //           <CardContent sx={{ flex: 1, pl: 2 }}>
// //             <Typography variant="h6" fontWeight="bold">
// //               {item.shop_name}
// //             </Typography>
// //             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
// //               Vendor: {item.vendor_name}
// //             </Typography>
// //             <Box sx={{ display: "flex", alignItems: "center" }}>
// //               <Rating value={calculateAverageRating(item.Reviews)} precision={0.1} readOnly size="small" />
// //               <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
// //                 ({item.Reviews.length} Reviews)
// //               </Typography>
// //             </Box>
// //           </CardContent>
// //         </Card>
// //       ))}
// //     </Box>
// //   );
// // };

// // export default ServiceDetails;

// // import React, { useEffect, useState } from "react";
// // import authService from "../../../../api/ApiService";
// // import { useNavigate, useParams } from "react-router-dom";
// // import {
// //   Typography,
// //   Box,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   Avatar,
// //   Rating,
// // } from "@mui/material";
// // import { useDispatch } from "react-redux";
// // import { setLoading } from "../../../../redux/slice/LoaderSlice";
// // import "./styles.scss";

// // const ServiceDetails = () => {
// //   const { serviceName } = useParams();
// //   const [serviceDetails, setServiceDetails] = useState([]);
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const getService = async () => {
// //     try {
// //       dispatch(setLoading(true));
// //       const res = await authService.getService(serviceName);
// //       setServiceDetails(res.data.data);
// //       dispatch(setLoading(false));
// //     } catch (error) {
// //       dispatch(setLoading(false));
// //       console.error("Error fetching service details:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     getService();
// //   }, [serviceName]);

// //   if (!serviceDetails || serviceDetails.length === 0) {
// //     return (
// //       <Box className="no-services" sx={{ textAlign: "center", p: 10 }}>
// //         <Typography variant="h5">No Services Found...</Typography>
// //       </Box>
// //     );
// //   }

// //   const calculateAverageRating = (reviews) => {
// //     if (!reviews || reviews.length === 0) return 0;
// //     const totalRating = reviews.reduce((sum, review) => sum + review.ratings, 0);
// //     return (totalRating / reviews.length).toFixed(1);
// //   };

// //   return (
// //     <Box className="service-details" sx={{ p: 6, pb: 20, display: "flex", justifyContent: "center" }}>
// //       <Box sx={{ width: "90%", maxWidth: "800px" }}>
// //         <Typography variant="h5" className="service-details-heading" sx={{ mb: 3, fontWeight: "600", textAlign: "center" }}>
// //           Service Details
// //         </Typography>

// //         <TableContainer component={Paper} elevation={3} className="service-card">
// //           <Table>
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell align="center" sx={{ fontWeight: "bold" }}>Logo</TableCell>
// //                 <TableCell align="left" sx={{ fontWeight: "bold" }}>Shop Name</TableCell>
// //                 <TableCell align="left" sx={{ fontWeight: "bold" }}>Vendor Name</TableCell>
// //                 <TableCell align="center" sx={{ fontWeight: "bold" }}>Rating</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {serviceDetails.map((item) => (
// //                 <TableRow key={item._id} hover sx={{ cursor: "pointer" }} onClick={() => navigate(`/service/${serviceName}/${item._id}`)}>
// //                   {/* Logo */}
// //                   <TableCell align="center">
// //                     <Avatar alt={item.shop_name} src={item.shop_image_or_logo || ""} sx={{ width: 50, height: 50 }}>
// //                       {!item.shop_image_or_logo && item.shop_name?.charAt(0)}
// //                     </Avatar>
// //                   </TableCell>
// //                   {/* Shop Name */}
// //                   <TableCell>
// //                     <Typography variant="body1" fontWeight="bold">
// //                       {item.shop_name}
// //                     </Typography>
// //                   </TableCell>
// //                   {/* Vendor Name */}
// //                   <TableCell>
// //                     <Typography variant="body2" color="text.secondary">
// //                       {item.vendor_name}
// //                     </Typography>
// //                   </TableCell>
// //                   {/* Rating */}
// //                   <TableCell align="center" sx={{display:'flex', alignItems:'center',ml:'1rem'}}>
// //                     {/* <Rating value={calculateAverageRating(item.Reviews)} precision={0.1} readOnly /> */}
// //                     <Typography variant="caption" color="text.secondary">
// //                       ({item.Reviews.length} Reviews)
// //                     </Typography>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default ServiceDetails;

// import React, { useEffect, useState } from "react";
// import authService from "../../../../api/ApiService";
// import { useNavigate, useParams } from "react-router-dom";
// import { Typography, Box, Paper, Avatar, Rating, Grid, Card, CardMedia, CardContent, Button, IconButton } from "@mui/material";import { useDispatch } from "react-redux";
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

//   const handleServiceClick = (id) => {
//     navigate(`/service/${serviceName}/${id}`);
//   };

// const calculateAverageRating = (reviews) => {
//   if (!reviews || reviews.length === 0) return 0;
//   const totalRating = reviews.reduce((sum, review) => sum + review.ratings, 0);
//   return (totalRating / reviews.length).toFixed(1);
// };

//   return (
//     <Box sx={{ p: 6, pb: 20 }}>
//       <Typography variant="h5" sx={{ mb: 3, fontWeight: "600", textAlign: "center" }}>
//         Service Details
//       </Typography>
//       <Box className="filters-sidebar">
//           {/* Categories Section */}
//           <Box className="filter-group">
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 cursor: "pointer",
//               }}
//               onClick={() => toggleSection("categories")}
//             >
//               <Typography variant="p">Categories</Typography>
//               <IconButton size="small">
//                 {openSections.categories ? (
//                   <ExpandLessIcon />
//                 ) : (
//                   <ExpandMoreIcon />
//                 )}
//               </IconButton>
//             </Box>
//             <Collapse in={openSections.categories}>
//               <Box sx={{ marginTop: "0.5rem" }}>
//                 {categories?.map((category) => (
//                   <FormControlLabel
//                     key={category}
//                     control={
//                       <Checkbox
//                         checked={category === activeCategory}
//                         onChange={() => setActiveCategory(category)}
//                       />
//                     }
//                     label={category}
//                     sx={{ display: "block", color: "#555" }}
//                   />
//                 ))}
//               </Box>
//             </Collapse>
//           </Box>

//           <Box className="filter-group">
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 cursor: "pointer",
//               }}
//               onClick={() => toggleSection("priceRange")}
//             >
//               <Typography variant="subtitle1">Price Range</Typography>
//               <IconButton size="small">
//                 {openSections.priceRange ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//               </IconButton>
//             </Box>
//             <Collapse in={openSections.priceRange}>
//               <Box sx={{ marginTop: "0.5rem" }}>
//                 <Box className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
//                   <Typography variant="subtitle1" gutterBottom>
//                     ₹{selectedPriceRange[0]} - ₹{selectedPriceRange[1]}
//                   </Typography>
//                   <DiscountSlider
//                     min={0}
//                     max={50000}
//                     step={1000}
//                     value={selectedPriceRange}
//                     onChange={setSelectedPriceRange}
//                     label={"Range"}
//                   />
//                 </Box>
//               </Box>
//             </Collapse>
//           </Box>

//           <Box className="filter-group">
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 cursor: "pointer",
//               }}
//               onClick={() => toggleSection("discount")}
//             >
//               <Typography variant="p">Discount</Typography>
//               <IconButton size="small">
//                 {openSections.discount ? (
//                   <ExpandLessIcon />
//                 ) : (
//                   <ExpandMoreIcon />
//                 )}
//               </IconButton>
//             </Box>
//             <Collapse in={openSections.discount}>
//               <Box sx={{ marginTop: "0.5rem" }}>
//                 <Box className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
//                   <DiscountSlider value={selectedDiscount} onChange={setSelectedDiscount} min={0}
//                     max={100}
//                     step={100} />
//                 </Box>
//               </Box>
//             </Collapse>
//           </Box>

//           <Box className="filter-group">
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 cursor: "pointer",
//               }}
//               onClick={() => toggleSection("availability")}
//             >
//               <Typography variant="p">Availability</Typography>
//               <IconButton size="small">
//                 {openSections.availability ? (
//                   <ExpandLessIcon />
//                 ) : (
//                   <ExpandMoreIcon />
//                 )}
//               </IconButton>
//             </Box>
//             <Collapse in={openSections.availability}>
//               <Box sx={{ marginTop: "0.5rem", width: "15rem" }}>
//                 <Box className={`filters-sidebar ${showFilters ? "open" : ""}`}>
//                   <FormControlLabel
//                     sx={{ width: "15rem" }}
//                     control={
//                       <Checkbox
//                         checked={lowStockChecked}
//                         onChange={handleLowStockChange}
//                       />
//                     }
//                     label="Quantity less than 50"
//                   />
//                   <FormControlLabel
//                     sx={{ width: "15rem" }}
//                     control={
//                       <Checkbox
//                         checked={highStockChecked}
//                         onChange={handleHighStockChange}
//                       />
//                     }
//                     label="Quantity more than 50"
//                   />
//                 </Box>
//               </Box>
//             </Collapse>
//           </Box>
//         </Box>
//       <Grid container spacing={3}>
//         {serviceDetails.map((item) => (
//           <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
//             <Card key={item._id} sx={{ mb: 2, p: 2, borderRadius: 2 }} onClick={() => handleServiceClick(item._id)}>
//            {/* Shop Image */}
//           <CardMedia
//           component="img"
//            sx={{ width: 260, height: 150, borderRadius: 2, objectFit: "cover", cursor:'pointer' }}
//             image={item.shop_image_or_logo || "https://via.placeholder.com/200"}
//             alt={item.shop_name}
//           />

//           {/* Service Details */}
//           <CardContent sx={{ flex: 1, pl: 2 }}>
//             <Typography variant="h6" fontWeight="bold">
//               {item.shop_name}
//             </Typography>
// <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//   Vendor: {item.vendor_name}
// </Typography>
// <Box sx={{ display: "flex", alignItems: "center" }}>
// <Rating value={calculateAverageRating(item.Reviews)} precision={0.1} readOnly size="small" />
// <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
//   ({item.Reviews.length} Reviews)
// </Typography>
//             </Box>
//           </CardContent>
//         </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default ServiceDetails;
import React, { useEffect, useState } from "react";
import authService from "../../../../api/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Rating,
  IconButton,
  Collapse,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../../redux/slice/LoaderSlice";
import DiscountSlider from "../../../Products/components/DiscountSlider";
import "./styles.scss";
import BreadCrumb from "../../../../components/BreadCrumb";
import Pagination from "../../../../components/Pagination";

const ServiceDetails = () => {
  const { serviceName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const breadcrumbPaths = [{ label: "Home", link: "/" }, { label: "Services" }];
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceDetails, setServiceDetails] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState([0, 100]);
  const itemsPerPage = 6;

  const [openSections, setOpenSections] = useState({
    categories: true,
    discount: false,
  });


  useEffect(() => {
    const getService = async () => {
      try {
        dispatch(setLoading(true));
        const res = await authService.getService(serviceName);
        setServiceDetails(res.data.data);
        setFilteredServices(res.data.data);
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setLoading(false));
        console.error("Error fetching service details:", error);
      }
    };

    getService();
  }, [serviceName, dispatch]);

 
  useEffect(() => {
    let filtered = [...serviceDetails];

    // Apply Category Filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((service) =>
        selectedCategories.includes(service.category)
      );
    }

    // Apply Discount Filter
    filtered = filtered.filter(
      (service) =>
        service.discount >= selectedDiscount[0] &&
        service.discount <= selectedDiscount[1]
    );

    setFilteredServices(filtered);
    setCurrentPage(1);

  }, [selectedCategories, selectedDiscount]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  if (!serviceDetails || serviceDetails.length === 0) {
    return (
      <Box className="no-services" sx={{ textAlign: "center", p: 10 }}>
        <Typography variant="h5">No Services Found...</Typography>
      </Box>
    );
  }

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredServices.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleServiceClick = (id) => {
    navigate(`/service/${serviceName}/${id}`);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleWishlistClick = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce(
      (sum, review) => sum + review.ratings,
      0
    );
    return (totalRating / reviews.length).toFixed(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ marginLeft: "2rem" }}>
        <BreadCrumb paths={breadcrumbPaths} />
        <Box sx={{ marginLeft: "2rem" }}>
          <Typography variant="h4" fontWeight={500}>
            Services
          </Typography>
        </Box>
      </Box>

      {/* <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "600", textAlign: "center" }}
      >
        Service Details
      </Typography> */}

      <Box sx={{ p: 6, pb: 20, display: "flex", gap: "1rem" }}>
        {/* Filters Sidebar */}
        <Box className="filters-sidebar" sx={{ mb: 4 }}>
          {/* Categories Filter */}
          <Box className="filter-group">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => toggleSection("categories")}
            >
              <Typography variant="p">Categories</Typography>
              <IconButton size="small">
                {openSections.categories ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </Box>
            <Collapse in={openSections.categories}>
              <Box sx={{ marginTop: "0.5rem" }}>
                {["Hotels", "Resorts", "Hostels"].map((category) => (
                  <FormControlLabel
                    key={category}
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                    }
                    label={category}
                    sx={{ display: "block", color: "#555" }}
                  />
                ))}
              </Box>
            </Collapse>
          </Box>

          {/* Discount Filter */}
          <Box className="filter-group">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => toggleSection("discount")}
            >
              <Typography variant="p">Discount</Typography>
              <IconButton size="small">
                {openSections.discount ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </Box>
            <Collapse in={openSections.discount}>
              <Box sx={{ marginTop: "0.5rem" }}>
                <DiscountSlider
                  value={selectedDiscount}
                  onChange={setSelectedDiscount}
                  min={0}
                  max={100}
                  step={5}
                />
              </Box>
            </Collapse>
          </Box>
        </Box>
        {console.log(filteredServices)}
        {/* Services Grid */}
        <Grid container spacing={3} justifyContent="center">
          {getPaginatedData().map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "0.3s",
                  cursor: "pointer",
                  "&:hover": { boxShadow: 5 },
                }}
                onClick={() => handleServiceClick(item._id)}
              >
                {/* Service Image */}
                <CardMedia
                  component="img"
                  sx={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: "8px 8px 0 0",
                  }}
                  image={
                    item.shop_image_or_logo || "https://via.placeholder.com/200"
                  }
                  alt={item.shop_name}
                />

                {/* Wishlist Button */}
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "white",
                    borderRadius: "50%",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistClick(item._id);
                  }}
                >
                  {wishlist.includes(item._id) ? (
                    <FavoriteOutlinedIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>

                {/* Service Details */}
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold">
                    {item.shop_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Vendor: {item.vendor_name}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Rating
                      value={calculateAverageRating(item.Reviews)}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({item.Reviews.length} Reviews)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredServices.length / itemsPerPage)}
        onPageChange={handlePageChange}
      />
    </Box>
  );
};

export default ServiceDetails;
