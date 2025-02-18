import React, { useEffect, useState } from "react";
import authService from "../../../../api/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Rating,
} from "@mui/material";
import { LocationOn, Email, Phone } from "@mui/icons-material";
import "./styles.scss";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../../redux/slice/LoaderSlice";

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

  const handleServiceClick = (id) => {
    navigate(`/service/${serviceName}/${id}`);
  };

  useEffect(() => {
    getService();
  }, [serviceName]);

  if (!serviceDetails || serviceDetails.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10rem",
        }}
      >
        <Typography variant="h5">No Services Found...</Typography>
      </Box>
    );
  }

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce(
      (sum, review) => sum + review.ratings,
      0
    );
    return (totalRating / reviews.length).toFixed(1);
  };

  return (
    <Box className="service-details" sx={{ p: 6, pb: 20 }}>
      <Typography
        variant="p"
        className="service-details-heading"
        sx={{
          mb: 3,
          fontWeight: "600",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        Service Details
        <span> Building Trust Through Exceptional Services.</span>
      </Typography>

      <TableContainer component={Paper} elevation={3} className="service-card">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Logo
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Shop Name
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Vendor Name
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Mobile
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Address
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Rating
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serviceDetails.map((item) => (
              <TableRow
                key={item._id}
                hover
                onClick={() => handleServiceClick(item._id)}
                sx={{ cursor: "pointer" }}
              >
                {/* Logo */}
                <TableCell align="center">
                  <Avatar
                    alt={item.shop_name}
                    src={item.shop_image_or_logo || ""}
                    sx={{ bgcolor: "#1976d2", width: 40, height: 40 }}
                  >
                    {!item.shop_image_or_logo && item.shop_name?.charAt(0)}
                  </Avatar>
                </TableCell>

                {/* Shop Name */}
                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {item.shop_name}
                  </Typography>
                </TableCell>

                {/* Vendor Name */}
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {item.vendor_name}
                  </Typography>
                </TableCell>

                {/* Email */}
                <TableCell>
                  <Typography variant="body2">
                    <Email
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                    />
                    {item.email || "N/A"}
                  </Typography>
                </TableCell>

                {/* Mobile */}
                <TableCell>
                  <Typography variant="body2">
                    <Phone
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                    />
                    {item.mobile_number || "N/A"}
                  </Typography>
                </TableCell>

                {/* Address */}
                <TableCell>
                  <Typography variant="body2">
                    <LocationOn
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                    />
                    {item.address[0]?.cityDownVillage || "No Address Provided"}
                  </Typography>
                </TableCell>

                {/* Rating */}
                <TableCell align="center">
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="caption" color="text.secondary">
                      ({item.Reviews.length} Reviews)
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ServiceDetails;
