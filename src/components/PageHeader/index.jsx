import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo2.png";

// Third party library
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Paper,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import { useDispatch, useSelector } from "react-redux";
import {
  formatCurrencyIntl,
  getCurrentCity,
  getCityFromQuery,
} from "../../utils/helperFunc";
import { logout } from "../../redux/slice/authSlice";

// Assests
import Calenders from "../../assets/Calenders.png";
import HomePage from "../../assets/homepage.png";
import AnalyticsImg from "../../assets/pieChart.png";
import Delivery from "../../assets/deliveryHome.png";
import Calendar from "../../pages/Calender";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Homes from "../../assets/hom.png";
import Serv from "../../assets/serv.png";
import Calend from "../../assets/calend.png";
import Products from "../../assets/prod.png";
import Locations from "../../assets/loc.png";
import DigiService from "../../assets/digitalService.png";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import EventIcon from "@mui/icons-material/Event";
import InfoIcon from "@mui/icons-material/Info";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import GavelIcon from "@mui/icons-material/Gavel";
import SearchIcon from "@mui/icons-material/Search";

// styles
import "./styles.scss";
import { config } from "../../api/config";
import { setLoading } from "../../redux/slice/LoaderSlice";
import axios from "axios";
import authService from "../../api/ApiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addToCart,
  clearCart,
  quantityDecrement,
  quantityIncrement,
  removeFromCart,
} from "../../redux/slice/CartSlice";
import { clearServices } from "../../redux/slice/serviceSlice";
import { clearTechnicians } from "../../redux/slice/technicianSlice";

const PageHeader = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [currLocation, setCurrLocation] = useState({ city: "", town: "" });
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const count = useSelector((state) => state.cart.cart.length);
  const cartItems = useSelector((state) => state.cart.cart);
  const techniciansItems = useSelector(
    (state) => state.technicians.technicians
  );
  const serviceItems = useSelector((state) => state.services.services);
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const isActive = (path) => location.pathname === path;
  const dispatch = useDispatch();
  const totalItems = [...cartItems, ...techniciansItems, ...serviceItems];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [originalDetails, setOriginalDetails] = useState({
    profileImage: "",
  });
  const [updatedDetails, setUpdatedDetails] = useState({
    profileImage: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const menuItems = [
    {
      label: "My Profile",
      icon: <AccountCircleOutlinedIcon />,
      path: "/profile",
    },
    {
      label: "My Bookings",
      icon: <EditCalendarOutlinedIcon />,
      path: "/Booking",
    },
    { label: "My Tickets", icon: <EventIcon />, path: "/my-tickets" },
    { label: "Faq", icon: <InfoIcon />, path: "/faq" },
    { label: "Help Center", icon: <InfoIcon />, path: "/help-center" },
    {
      label: "Privacy Policy",
      icon: <HelpOutlineIcon />,
      path: "/privacyPolicy",
    },
    {
      label: "Terms & Conditions",
      icon: <GavelIcon />,
      path: "/TermsAndCondition",
    },
  ];

  const [activePath, setActivePath] = useState(location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestedProducts([]);
      return;
    }
    const fetchProducts = async () => {
      try {
        const res = await axios.post(
          `${config.BASEURL}/product/search-product?limit=5&name=${searchTerm}`
        );
        setSuggestedProducts(res.data.products || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    const debounceSearch = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceSearch);
  }, [searchTerm]);

  const handleSuggestionClick = (productName) => {
    setSearchTerm("");
    setSuggestedProducts([]);
    setTimeout(() => {
      navigate(`/products?search=${encodeURIComponent(productName)}`);
    }, 50);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
    setSuggestedProducts([]);
  };

  const closeMenuAndNavigate = (path) => {
    setActivePath(path);
    setMenuOpen(false);
    setMenuAnchor(null); // Ensure menu closes
    navigate(path);
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  useEffect(() => {
    const homeVisited = sessionStorage.getItem("homeVisited");
    if (!homeVisited) {
      setIsCalendarOpen(true);
      sessionStorage.setItem("homeVisited", "true");
    }
  }, []);

  const handleCalendarClose = () => setIsCalendarOpen(false);

  useEffect(() => {
    // Prefer a location the user has explicitly chosen before; otherwise
    // auto-detect via geolocation.
    const saved = localStorage.getItem("selectedLocation");
    if (saved) {
      try {
        setCurrLocation(JSON.parse(saved));
        return;
      } catch (e) {
        // fall through to auto-detect on parse error
      }
    }
    const fetchCity = async () => {
      try {
        const locationData = await getCurrentCity();
        setCurrLocation(locationData);
      } catch (error) {
        setCurrLocation(error);
      }
    };
    fetchCity();
  }, []);

  const persistLocation = (loc) => {
    setCurrLocation(loc);
    try {
      localStorage.setItem("selectedLocation", JSON.stringify(loc));
    } catch (e) {
      // ignore storage errors
    }
  };

  const openLocationDialog = () => {
    setLocationError("");
    setLocationQuery("");
    setLocationDialogOpen(true);
  };

  const handleUseCurrentLocation = async () => {
    setLocating(true);
    setLocationError("");
    try {
      const locationData = await getCurrentCity();
      persistLocation(locationData);
      setLocationDialogOpen(false);
    } catch (error) {
      setLocationError(
        typeof error === "string"
          ? error
          : "Could not detect your location. Please allow location access or search manually."
      );
    } finally {
      setLocating(false);
    }
  };

  const handleApplyTypedLocation = async () => {
    setLocating(true);
    setLocationError("");
    try {
      const locationData = await getCityFromQuery(locationQuery);
      persistLocation(locationData);
      setLocationDialogOpen(false);
    } catch (error) {
      setLocationError(
        error?.message || "Location not found. Try a different search."
      );
    } finally {
      setLocating(false);
    }
  };

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    navigate("/login");

    dispatch(clearCart());
    dispatch(clearTechnicians());
    dispatch(logout());
    dispatch(clearServices());
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedDetails({
          ...updatedDetails,
          profileImage: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("username", updatedDetails.name);
      if (updatedDetails.profileImage) {
        formData.append("profile_image", updatedDetails.profileImage);
      }
      await axios.put(
        `https://api.nithyaevent.com/api/user/edit-profile/${userDetails._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile");
    }
    setIsSaving(false);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await authService.getUserProfile(userDetails._id);
        setUpdatedDetails(res.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    getUser();
  }, [userDetails._id]);

  return (
    <>
      <Box className="header-main">
        <AppBar position="static" sx={{ background: "white", width: "100%" }}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              minHeight: "60px",
              position: "relative",
            }}
          >
            {/* Logo Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <img
                src={Logo}
                alt="Logo"
                style={{ cursor: "pointer" }}
                className="logo-image"
                onClick={() => navigate("/")}
              />
            </Box>

            {/* Location */}
            <Box
              onClick={openLocationDialog}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.2rem",
                cursor: "pointer",
                borderRadius: "8px",
                p: "4px 6px",
                "&:hover": { backgroundColor: "#f4f4f4" },
              }}
              title="Select your location"
            >
              <img
                src={Locations}
                alt="Not found"
                style={{ width: "1.5rem", height: "25px" }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "0.8rem",
                }}
              >
                <Typography sx={{ color: "black", fontSize: "0.85rem" }}>
                  Your Location ▾
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "400",
                    color: "black",
                    fontSize: { xs: "0.575rem", md: "0.75rem" },
                  }}
                >
                  {currLocation.city
                    ? `${currLocation.city}${
                        currLocation.town ? `, ${currLocation.town}` : ""
                      }`
                    : "Select location"}
                </Typography>
              </Box>
            </Box>

            {/* Search */}
            {!isMobile && (
              <Paper
                component="form"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: { xs: "100%", md: "32%" },
                  borderRadius: "50px",
                  boxShadow: "none",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#f4f4f4",
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
              >
                <SearchIcon sx={{ color: "#9e9e9e", marginLeft: "8px" }} />
                <InputBase
                  sx={{
                    flex: 1,
                    color: "#757575",
                    height: "50px",
                    p: "2px 10px",
                    fontWeight: "500",
                    fontSize: "18px",
                    backgroundColor: "transparent",
                  }}
                  placeholder='Search "Products"'
                  inputProps={{ "aria-label": "search products" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Paper>
            )}

            {/* Suggested Products */}
            {suggestedProducts.length > 0 && searchTerm && (
              <Paper
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100%",
                  maxWidth: "400px",
                  backgroundColor: "white",
                  zIndex: 10,
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                  maxHeight: "400px",
                  overflowY: "auto",
                  borderRadius: "8px",
                  marginTop: "5px",
                  padding: "10px",
                }}
              >
                <List>
                  {suggestedProducts.map((product) => (
                    <ListItem
                      key={product.id}
                      button
                      onClick={() =>
                        handleSuggestionClick(product.product_name)
                      }
                      sx={{ padding: "10px" }}
                    >
                      <ListItemText
                        primary={product.product_name}
                        sx={{ color: "#333", fontWeight: "bold" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}

            {/* Icons and Profile */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                {/* Wishlist */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  onClick={() => navigate("/wishlist")}
                >
                  <FavoriteBorderIcon
                    sx={{ color: "#e389eb", cursor: "pointer" }}
                  />
                  <Typography sx={{ color: "#6f6a6a", fontSize: "0.8rem" }}>
                    Wishlist
                  </Typography>
                </Box>

                {/* Cart */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Link
                    to="/cart"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <Badge
                      badgeContent={totalItems.length}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "10px",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      <ShoppingCartOutlinedIcon sx={{ color: "#e389eb" }} />
                    </Badge>
                  </Link>
                  <Typography sx={{ color: "#6f6a6a", fontSize: "0.8rem" }}>
                    Cart
                  </Typography>
                </Box>

                {/* Mood Board */}
                <Box>
                  <Link
                    to={"/mood-board"}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <DesignServicesOutlinedIcon
                      sx={{ color: "#e389eb", cursor: "pointer" }}
                    />
                    <Typography sx={{ color: "#6f6a6a", fontSize: "0.8rem" }}>
                      Mood Board
                    </Typography>
                  </Link>
                </Box>

                {/* Calendar */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <CalendarMonthIcon
                    sx={{ color: "#e389eb", cursor: "pointer" }}
                  />
                  <Typography sx={{ color: "#6f6a6a", fontSize: "0.8rem" }}>
                    Calender
                  </Typography>
                </Box>

                {/* Profile */}
                {isAuthenticated ? (
                  <>
                    <Box onClick={handleMenuOpen}>
                      {updatedDetails.profile_image ? (
                        <Avatar
                          src={updatedDetails.profile_image}
                          sx={{
                            width: 64,
                            height: 64,
                            margin: "0 auto",
                            cursor: "pointer",
                            mb: 1,
                            border: "2px solid #ccc",
                          }}
                        />
                      ) : (
                        <Box sx={{ textAlign: "center" }}>
                          <AccountCircleOutlinedIcon
                            sx={{ color: "#e389eb" }}
                          />
                          <Typography
                            sx={{
                              color: "#6f6a6a",
                              fontSize: "0.8rem",
                              cursor: "pointer",
                            }}
                          >
                            Profile
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Menu
                      anchorEl={menuAnchor}
                      open={Boolean(menuAnchor)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        sx: {
                          width: "280px",
                          padding: "15px",
                          borderRadius: "12px",
                        },
                      }}
                    >
                      <Box sx={{ textAlign: "center", paddingBottom: "12px" }}>
                        <Avatar
                          src={updatedDetails.profile_image}
                          sx={{
                            width: "3rem",
                            height: "3rem",
                            margin: "0 auto",
                            mb: 1,
                            border: "2px solid #ccc",
                          }}
                        />
                        <Typography variant="h6" fontWeight="bold">
                          {userDetails.username}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {userDetails.email}
                        </Typography>
                      </Box>

                      <Divider sx={{ mb: 1 }} />

                      <List>
                        {menuItems.map((item) => {
                          const isActive = activePath === item.path;
                          return (
                            <ListItem
                              key={item.path}
                              button
                              onClick={() => closeMenuAndNavigate(item.path)}
                              sx={{
                                backgroundColor: isActive
                                  ? "#f3e5f5"
                                  : "transparent",
                                "&:hover": { backgroundColor: "#f1f1f7" },
                                borderRadius: "8px",
                              }}
                            >
                              {React.cloneElement(item.icon, {
                                sx: {
                                  marginRight: "12px",
                                  color: isActive ? "#9c27b0" : "black",
                                },
                              })}
                              <ListItemText
                                primary={
                                  <Typography
                                    sx={{
                                      color: isActive ? "#9c27b0" : "black",
                                      fontWeight: isActive ? "bold" : "normal",
                                    }}
                                  >
                                    {item.label}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          );
                        })}
                      </List>

                      <Divider sx={{ my: 1 }} />

                      <ListItem
                        button
                        onClick={() => {
                          handleLogoutClick();
                          handleMenuClose();
                        }}
                        sx={{
                          "&:hover": { backgroundColor: "#f1f1f7" },
                          padding: "12px 15px",
                          borderRadius: "8px",
                        }}
                      >
                        <LogoutIcon
                          sx={{ marginRight: "12px", color: "#e389eb" }}
                        />
                        <ListItemText
                          primary="Logout"
                          sx={{ color: "#e389eb", cursor: "pointer" }}
                        />
                      </ListItem>
                    </Menu>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/login")}
                  >
                    <AccountCircleOutlinedIcon sx={{ color: "#e389eb" }} />
                    <Typography sx={{ color: "#6f6a6a", fontSize: "0.8rem" }}>
                      Login
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <IconButton
              edge="end"
              sx={{ display: { xs: "block", md: "none" } }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon fill="black" />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>

      <Dialog
        open={locationDialogOpen}
        onClose={() => setLocationDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Select your location</DialogTitle>
        <DialogContent>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            sx={{
              mb: 2,
              textTransform: "none",
              borderColor: "#e389eb",
              color: "#9c27b0",
            }}
          >
            {locating ? "Detecting…" : "📍 Use my current location"}
          </Button>

          <Typography
            sx={{ textAlign: "center", color: "#999", fontSize: "0.8rem", mb: 1 }}
          >
            or search for a location
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Enter city or area (e.g. Bangalore)"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApplyTypedLocation();
            }}
          />

          {locationError && (
            <Typography sx={{ color: "red", fontSize: "0.8rem", mt: 1 }}>
              {locationError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocationDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleApplyTypedLocation}
            variant="contained"
            disabled={locating || !locationQuery.trim()}
            sx={{
              backgroundColor: "#e389eb",
              "&:hover": { backgroundColor: "#d26cd4" },
              color: "white",
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={logoutDialogOpen} onClose={handleLogoutCancel}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            sx={{
              backgroundColor: "#e389eb",
              "&:hover": { backgroundColor: "#d26cd4" },
              color: "white",
            }}
          >
            Yes, Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={isCalendarOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: "16px",
            p: 4,
            width: "450px",
            maxWidth: "95%",
            textAlign: "center",
          }}
        >
          <Calendar
            handleCalendarClose={handleCalendarClose}
            calendarClose={handleCalendarClose}
          />
        </Box>
      </Modal>
    </>
  );
};

export default PageHeader;
