// // React and React related imports
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// // Third party library
// import { Box, Typography, Button, Grid, Paper } from "@mui/material";

// // Custom Components
// import authService from "../../api/ApiService";
// import { setLoading } from "../../redux/slice/LoaderSlice";
// import { getErrorMessage } from "../../utils/helperFunc";

// // Assets
// import EventImg from "../../assets/bookingImg.jpg";

// // styles
// import "./styles.scss";

// const Bookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const userData = useSelector((state) => state.auth.userDetails);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   console.log("userData", userData);

//   useEffect(() => {
//     const getBookings = async () => {
//       try {
//         dispatch(setLoading(true));
//         const res = await authService.getUserOrder(userData._id);
//         setBookings(res.data.userOrder);
//         dispatch(setLoading(false));
//       } catch (error) {
//         dispatch(setLoading(false));
//         getErrorMessage(error);
//       }
//     };

//     getBookings();
//   }, [dispatch, userData._id]);

//   console.log("bookings", bookings);

//   const getStatusStyle = (status) => {
//     switch (status?.toLowerCase()) {
//       case "confirmed":
//         return { bg: "#DCFCE7", color: "#15803D" }; // green
//       case "pending":
//         return { bg: "#FEF3C7", color: "#92400E" }; // yellow
//       case "cancelled":
//         return { bg: "#FEE2E2", color: "#B91C1C" }; // red
//       default:
//         return { bg: "#E0E7FF", color: "#3730A3" }; // blue
//     }
//   };

//   return (
//     <Box className="my-bookings-page" sx={{ padding: "2rem" }}>
//       {bookings.length > 0 ? (
//         bookings.map((booking) => {
//           const { bg, color } = getStatusStyle(booking.order_status);

//           return (
//             <Paper
//               key={booking._id}
//               sx={{
//                 padding: "1rem",
//                 marginBottom: "1.5rem",
//                 boxShadow: 2,
//                 maxWidth: "800px",
//                 margin: "0 auto",
//                 backgroundColor: "#fff",
//               }}
//             >
//               <Grid container spacing={2} alignItems="center">
//                 {/* Image */}
//                 <Grid item xs={12} sm={3}>
//                   <img
//                     src={EventImg}
//                     alt={booking.event_name}
//                     style={{
//                       width: "100%",
//                       height: "100px",
//                       objectFit: "cover",
//                       borderRadius: "8px",
//                     }}
//                   />
//                 </Grid>

//                 {/* Name + Status */}
//                 <Grid item xs={12} sm={6}>
//                   <Typography
//                     variant="h6"
//                     sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
//                   >
//                     {booking.event_name}
//                   </Typography>

//                   <Box
//                     sx={{
//                       display: "inline-block",
//                       backgroundColor: bg,
//                       color: color,
//                       fontWeight: 500,
//                       padding: "4px 10px",
//                       fontSize: "13px",
//                       borderRadius: "20px",
//                       textTransform: "capitalize",
//                     }}
//                   >
//                     {booking.order_status}
//                   </Box>
//                 </Grid>

//                 {/* View More Button */}
//                 <Grid
//                   item
//                   xs={12}
//                   sm={3}
//                   sx={{ textAlign: { xs: "center", sm: "right" } }}
//                 >
//                   <Button
//                     variant="contained"
//                     sx={{
//                       backgroundColor: "#c026d3",
//                       width: { xs: "100%", sm: "auto" },
//                     }}
//                     onClick={() => navigate(`/booking/${booking._id}`)}
//                   >
//                     View More
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Paper>
//           );
//         })
//       ) : (
//         <Typography
//           variant="h6"
//           sx={{ textAlign: "center", marginTop: "2rem" }}
//         >
//           No bookings found.
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default Bookings;
// React and React related imports
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Third party library
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

// Custom Components
import authService from "../../api/ApiService";
import { setLoading } from "../../redux/slice/LoaderSlice";
import { getErrorMessage } from "../../utils/helperFunc";

// Assets
import EventImg from "../../assets/bookingImg.jpg";

// styles
import "./styles.scss";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const userData = useSelector((state) => state.auth.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getBookings = async () => {
      try {
        dispatch(setLoading(true));
        const res = await authService.getUserOrder(userData._id);
        setBookings(res.data.userOrder || []);
      } catch (error) {
        getErrorMessage(error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    getBookings();
  }, [dispatch, userData._id]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return { bg: "#DCFCE7", color: "#15803D" }; // green
      case "pending":
        return { bg: "#FEF3C7", color: "#92400E" }; // yellow
      case "cancelled":
        return { bg: "#FEE2E2", color: "#B91C1C" }; // red
      default:
        return { bg: "#E0E7FF", color: "#3730A3" }; // blue
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #faf5ff 0%, #ffffff 60%)",
        minHeight: "100vh",
        py: 5,
        px: { xs: 2, sm: 4 },
      }}
    >
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          textAlign: "center",
          color: "#6b21a8",
          mb: 4,
        }}
      >
        My Bookings
      </Typography>

      {/* Booking Cards */}
      {bookings.length > 0 ? (
        <Grid container spacing={3} justifyContent="center">
          {bookings.map((booking) => {
            const { bg, color } = getStatusStyle(booking.order_status);

            return (
              <Grid item xs={12} md={8} key={booking._id}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: "16px",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    transition: "0.3s",
                    backgroundColor: "#fff",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    {/* Left Image */}
                    <Grid item xs={12} sm={3}>
                      <img
                        // src={
                        //   booking.product_data?.[0]?.imageUrl?.[0] || EventImg
                        // }
                        src={EventImg}
                        alt={booking.event_name}
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    </Grid>

                    {/* Middle Details */}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 0.5,
                          color: "#1E293B",
                        }}
                      >
                        {booking.event_name}
                      </Typography>

                      {/* Venue Name */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 0.5 }}
                      >
                        <LocationOnIcon
                          sx={{ fontSize: 18, color: "#EA580C" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "#475569", fontWeight: 500 }}
                        >
                          {booking.venue_name || "Venue not specified"}
                        </Typography>
                      </Stack>

                      {/* Event Date */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 0.5 }}
                      >
                        <CalendarMonthIcon
                          sx={{ fontSize: 18, color: "#9333EA" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "#475569" }}
                        >
                          {booking.event_date || "Date not available"}
                        </Typography>
                      </Stack>

                      {/* Order ID */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 1 }}
                      >
                        <ConfirmationNumberIcon
                          sx={{ fontSize: 18, color: "#0891B2" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "#475569", fontStyle: "italic" }}
                        >
                          Order ID: {booking.order_id}
                        </Typography>
                      </Stack>

                      {/* Status Chip */}
                      <Chip
                        label={booking.order_status}
                        sx={{
                          backgroundColor: bg,
                          color,
                          fontWeight: 600,
                          borderRadius: "8px",
                          textTransform: "capitalize",
                        }}
                      />
                    </Grid>

                    {/* Right Button */}
                    <Grid item xs={12} sm={3} textAlign="right">
                      <Button
                        variant="contained"
                        endIcon={<EventAvailableIcon />}
                        onClick={() => navigate(`/booking/${booking._id}`)}
                        sx={{
                          background:
                            "linear-gradient(90deg,#c026d3,#9333EA)",
                          color: "#fff",
                          px: 3,
                          py: 1,
                          borderRadius: "10px",
                          fontWeight: 600,
                          textTransform: "none",
                          "&:hover": {
                            background:
                              "linear-gradient(90deg,#a21caf,#7e22ce)",
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            mt: 8,
            color: "#64748B",
            fontWeight: 500,
          }}
        >
          No bookings found.
        </Typography>
      )}
    </Box>
  );
};

export default Bookings;
