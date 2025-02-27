// React and React related imports 
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// Third party library 
import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Custom Components 
import authService from "../../api/ApiService";
import { setLoading } from "../../redux/slice/LoaderSlice";
import { formatDate, getErrorMessage } from "../../utils/helperFunc";

// Assests 
import EventImg from "../../assets/bookingImg.jpg";
import Sliders from "../../components/Sliders";

// styles 
import "./styles.scss";



const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const userData = useSelector((state) => state.auth.userDetails);
  const [selectedTab, setSelectedTab] = useState(0);
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
        setLoading(false);
        getErrorMessage(error);
      }
    };

    getBookings();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const filteredBookings = bookings.filter((booking) => {
    console.log(bookings);
    if (selectedTab === 0) return true; // All
    if (selectedTab === 1) return booking.payment_status === "pending";
    if (selectedTab === 2) return booking.payment_status === "on progress"; 
    if (selectedTab === 3) return booking.payment_status === "success"; 
    if (selectedTab === 4) return booking.payment_status === "cancelled"; 
    return false;
  });
  
  return (
    <Box className="my-bookings-page" sx={{ padding: "2rem" }}>
      {/* <Sliders /> */}
      {/* <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: "2rem", marginTop: "2rem" }}
      >
        My Bookings
      </Typography> */}

<Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: "1.5rem" }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTabs-indicator": {
                backgroundColor: "#c026d3",
            },
            "& .Mui-selected": {
                color: "#c026d3 !important",
            },
        }}
        >
          <Tab label="All" />
          <Tab label="Pending" />
          <Tab label="On Progress" />
          <Tab label="Completed" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>

      {filteredBookings.length > 0 ? (
        filteredBookings?.map((booking) => (
          <Paper
            key={booking._id}
            sx={{
              padding: "1.5rem",
              marginBottom: "1.5rem",
              borderRadius: "8px",
              boxShadow: 2,
              maxWidth: "800px",
              margin: "0 auto",
              backgroundColor: "#fff",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    ORDER PLACED: {formatDate(booking.event_start_date)}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    TOTAL: ₹{booking.paid_amount || "N/A"}
                  </Typography>
                 
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ marginY: "0.5rem" }} />
              </Grid>

              <Grid item xs={12} md={8}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={EventImg}
                    alt={booking.event_name}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginRight: "1rem",
                    }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                    >
                      {booking.event_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {booking.event_location}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {booking.event_start_time} - {booking.event_end_time}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Status: {booking.payment_status}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems:'center',
                  justifyContent:'center',
                  gap: "0.5rem",
                }}
              >
                    <Button variant="contained" sx={{backgroundColor:'#c026d3'}} onClick={() => navigate(`/booking/${booking._id}`)} color="primary" fullWidth>
                  View More
                </Button>
                {/* <Button variant="outlined" color="secondary" fullWidth>
                  Track package
                </Button>
                <Button variant="outlined" color="secondary" fullWidth>
                  Leave feedback
                </Button>
                <Button variant="outlined" color="secondary" fullWidth>
                  Write a review
                </Button> */}
              </Grid>
            </Grid>
          </Paper>
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
  );
};

export default Bookings;