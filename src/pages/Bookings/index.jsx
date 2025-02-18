import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "./styles.scss";
import authService from "../../api/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setLoading } from "../../redux/slice/LoaderSlice";
import { formatDate, getErrorMessage } from "../../utils/helperFunc";
import EventImg from "../../assets/bookingImg.jpg";
import SliderImage from "../Products/SingleProducts/components/SliderImage";
import Sliders from "../../components/Sliders";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const userData = useSelector((state) => state.auth.userDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    const getBookings = async () => {
      try {
        dispatch(setLoading(true));
        const res = await authService.getUserOrder(userData._id);
        console.log("the response", res);
        setBookings(res.data.userOrder);
        dispatch(setLoading(false));
      } catch (error) {
        setLoading(false);
        getErrorMessage(error);
      }
    };

    getBookings();
  }, []);

  return (
    <Box className="my-bookings-page" sx={{ padding: "2rem" }}>
      <Sliders />
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: "2rem", marginTop: "2rem" }}
      >
        My Bookings
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          justifyContent: "center",
        }}
      >
        {bookings.length > 0 ? (
          bookings?.map((booking) => (
            <Card
              key={booking._id}
              sx={{
                width: "350px",
                boxShadow: 3,
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <img
                src={EventImg}
                alt={booking.eventName}
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                >
                  {booking.event_name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <LocationOnIcon fontSize="small" color="primary" />
                  <Typography variant="body2" sx={{ marginLeft: "0.5rem" }}>
                    {booking.event_location}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <EventIcon fontSize="small" color="secondary" />
                  <Typography variant="body2" sx={{ marginLeft: "0.5rem" }}>
                    {formatDate(booking.event_start_date)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.4rem",
                  }}
                >
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ marginLeft: "0.5rem" }}>
                    {booking.event_start_time}
                  </Typography>
                </Box>
                <Chip
                  label={booking.status}
                  color={
                    booking.payment_status === "success"
                      ? "success"
                      : booking.status === "pending"
                      ? "warning"
                      : "error"
                  }
                  sx={{
                    fontWeight: "bold",
                    width: "0.9rem",
                    height: "15px",
                    marginLeft: "0.2rem",
                  }}
                />
                <Typography variant="p" sx={{ marginLeft: "0.6rem" }}>
                  {booking.payment_status}
                </Typography>
                <Link to={`/booking/${booking._id}`}>
                  <Button
                    variant="outlined"
                    sx={{ marginTop: "1rem" }}
                    color="primary"
                    fullWidth
                  >
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography
            variant="h6"
            sx={{ textAlign: "center", marginTop: "2rem" }}
          >
            No bookings found.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Bookings;
