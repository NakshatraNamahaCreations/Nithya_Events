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
} from "@mui/material";

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
        setBookings(res.data.userOrder);
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setLoading(false));
        getErrorMessage(error);
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
    <Box className="my-bookings-page" sx={{ padding: "2rem" }}>
      {bookings.length > 0 ? (
        bookings.map((booking) => {
          const { bg, color } = getStatusStyle(booking.order_status);

          return (
            <Paper
              key={booking._id}
              sx={{
                padding: "1rem",
                marginBottom: "1.5rem",
                boxShadow: 2,
                maxWidth: "800px",
                margin: "0 auto",
                backgroundColor: "#fff",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                {/* Image */}
                <Grid item xs={12} sm={3}>
                  <img
                    src={EventImg}
                    alt={booking.event_name}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Grid>

                {/* Name + Status */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                    {booking.event_name}
                  </Typography>

                  <Box
                    sx={{
                      display: "inline-block",
                      backgroundColor: bg,
                      color: color,
                      fontWeight: 500,
                      padding: "4px 10px",
                      fontSize: "13px",
                      borderRadius: "20px",
                      textTransform: "capitalize",
                    }}
                  >
                    {booking.order_status}
                  </Box>
                </Grid>

                {/* View More Button */}
                <Grid item xs={12} sm={3} sx={{ textAlign: { xs: "center", sm: "right" } }}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#c026d3", width: { xs: "100%", sm: "auto" } }}
                    onClick={() => navigate(`/booking/${booking._id}`)}
                  >
                    View More
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          );
        })
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", marginTop: "2rem" }}>
          No bookings found.
        </Typography>
      )}
    </Box>
  );
};

export default Bookings;
