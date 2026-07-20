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
  extractCityTown,
  parseCoords,
} from "../../utils/helperFunc";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";

const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

// Product categories the header search can jump to.
const PRODUCT_CATEGORIES = [
  "Sound",
  "Lighting",
  "Genset",
  "Video",
  "Fabrication",
  "Shamiana",
];
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
  // Cached lists so the header search can also match vendors & services
  // (fetched once; filtered client-side as the user types).
  const [allVendors, setAllVendors] = useState([]);
  const [allServices, setAllServices] = useState([]);
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

  // Load vendors & services once so the header search can match them too.
  useEffect(() => {
    (async () => {
      try {
        const [vRes, sRes] = await Promise.all([
          axios.get(`${config.BASEURL}/vendor/getallvendor`),
          axios.get(`${config.BASEURL}/service/get-all-service`),
        ]);
        setAllVendors(Array.isArray(vRes?.data) ? vRes.data : []);
        const svc = Array.isArray(sRes?.data)
          ? sRes.data
          : sRes?.data?.data || sRes?.data?.services || [];
        setAllServices(Array.isArray(svc) ? svc : []);
      } catch (err) {
        console.error("Header search bootstrap failed:", err);
      }
    })();
  }, []);

  // Open a vendor's profile page.
  const handleVendorClick = (vendor) => {
    setSearchTerm("");
    setSuggestedProducts([]);
    navigate(`/vendors/${vendor._id}`);
  };

  // Open a service. SingleService (/service/:name/:id) is keyed by VENDOR id;
  // if we have one go straight there, otherwise open the services listing for
  // that service name (which never 404s).
  const handleServiceClick = (service) => {
    setSearchTerm("");
    setSuggestedProducts([]);
    const name = encodeURIComponent(service.service_name || "");
    if (service.vendor_id) {
      navigate(`/service/${name}/${service.vendor_id}`);
    } else {
      navigate(`/service/${name}`);
    }
  };

  // Open a specific product's detail page from a suggestion.
  const handleSuggestionClick = (product) => {
    setSearchTerm("");
    setSuggestedProducts([]);
    const cat = encodeURIComponent(
      (product.product_category || "products").toLowerCase()
    );
    const slug = encodeURIComponent(
      (product.product_name || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") + "-rental"
    );
    navigate(`/products/${cat}/${slug}`);
  };

  // Open a category page.
  const handleCategoryClick = (cat) => {
    setSearchTerm("");
    setSuggestedProducts([]);
    navigate(`/category/${encodeURIComponent(cat.toLowerCase())}`);
  };

  const handleSearch = () => {
    const term = searchTerm.trim();
    if (!term) return;
    setSuggestedProducts([]);
    // If the term is a known category, open that category; otherwise run a
    // product search.
    const matchedCat = PRODUCT_CATEGORIES.find(
      (c) => c.toLowerCase() === term.toLowerCase()
    );
    if (matchedCat) {
      navigate(`/category/${encodeURIComponent(matchedCat.toLowerCase())}`);
    } else {
      navigate(`/products?search=${encodeURIComponent(term)}`);
    }
    setSearchTerm("");
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
        const parsed = JSON.parse(saved);
        // Only trust a saved location with REAL coordinates. Anything else
        // (including values written by the older buggy code, e.g. lat: null)
        // falls through to auto-detect, so bad stored data self-heals.
        if (parseCoords(parsed)) {
          setCurrLocation(parsed);
          return;
        }
      } catch (e) {
        // fall through to auto-detect on parse error
      }
    }
    const fetchCity = async () => {
      try {
        const locationData = await getCurrentCity();
        // Persist (not just display) so the coordinates are saved to
        // "selectedLocation" — otherwise the Nearby-Vendors distance filter has
        // no coords and shows every vendor unsorted.
        persistLocation(locationData);
      } catch (error) {
        console.warn("Auto location detect failed:", error);
      }
    };
    fetchCity();
  }, []);

  const persistLocation = (loc) => {
    setCurrLocation(loc);
    const coords = parseCoords(loc);
    if (!coords) {
      // Saving a location without usable coordinates is what made the nearby
      // filter show every vendor regardless of distance. Show the name, but
      // don't persist a location the distance filter can't use.
      console.warn("Location has no usable coordinates — not persisting:", loc);
      return;
    }
    try {
      localStorage.setItem(
        "selectedLocation",
        JSON.stringify({ ...loc, ...coords })
      );
      // Notify listeners (e.g. Home "Nearby Vendors") to re-sort by the new
      // location without a page reload.
      window.dispatchEvent(new Event("location:changed"));
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

  // User picked a suggestion from the autocomplete dropdown.
  const handlePlaceSelect = async (place) => {
    if (!place?.value?.place_id) return;
    setLocating(true);
    setLocationError("");
    try {
      const results = await geocodeByPlaceId(place.value.place_id);
      // Scan every result (the first is often a precise street address with no
      // locality component) using the same rules as auto-detect.
      const { city, town } = extractCityTown(results, place.label);

      const loc = results?.[0]?.geometry?.location;
      // The Maps JS API returns lat/lng as functions; the REST API as numbers.
      const lat = typeof loc?.lat === "function" ? loc.lat() : loc?.lat;
      const lng = typeof loc?.lng === "function" ? loc.lng() : loc?.lng;

      // Without coordinates the nearby-vendor distance filter silently falls
      // back to showing every vendor (which is how far-away vendors turned up
      // in a local search). Refuse to save a coordinate-less location.
      if (typeof lat !== "number" || typeof lng !== "number") {
        setLocationError(
          "Could not get coordinates for that place. Please pick a more specific address."
        );
        return;
      }

      persistLocation({ lat, lng, city, town });
      setLocationDialogOpen(false);
    } catch (error) {
      console.error("Place select error:", error);
      setLocationError("Could not resolve that address. Try another.");
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
                  placeholder="Search products, vendors, services…"
                  inputProps={{ "aria-label": "search" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Paper>
            )}

            {/* Suggested Categories + Products */}
            {searchTerm.trim() &&
              (() => {
                const term = searchTerm.trim().toLowerCase();
                const matchedCategories = PRODUCT_CATEGORIES.filter((c) =>
                  c.toLowerCase().includes(term)
                );
                const matchedVendors = allVendors
                  .filter(
                    (v) =>
                      v?.vendor_name?.toLowerCase().includes(term) ||
                      v?.shop_name?.toLowerCase().includes(term) ||
                      v?.profession?.toLowerCase().includes(term)
                  )
                  .slice(0, 5);
                const matchedServices = allServices
                  .filter(
                    (s) =>
                      s?.service_name?.toLowerCase().includes(term) ||
                      s?.service_category?.toLowerCase().includes(term)
                  )
                  .slice(0, 5);
                if (
                  matchedCategories.length === 0 &&
                  suggestedProducts.length === 0 &&
                  matchedVendors.length === 0 &&
                  matchedServices.length === 0
                )
                  return null;
                return (
                  <Paper
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "100%",
                      maxWidth: "400px",
                      backgroundColor: "white",
                      zIndex: 1300,
                      boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                      maxHeight: "400px",
                      overflowY: "auto",
                      borderRadius: "8px",
                      marginTop: "5px",
                      padding: "10px",
                    }}
                  >
                    <List dense>
                      {matchedCategories.length > 0 && (
                        <Typography
                          sx={{
                            px: 1,
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            color: "#9e9e9e",
                            textTransform: "uppercase",
                          }}
                        >
                          Categories
                        </Typography>
                      )}
                      {matchedCategories.map((cat) => (
                        <ListItem
                          key={`cat-${cat}`}
                          button
                          onClick={() => handleCategoryClick(cat)}
                          sx={{ padding: "8px 10px" }}
                        >
                          <SearchIcon
                            sx={{ color: "#c026d3", fontSize: 18, mr: 1 }}
                          />
                          <ListItemText
                            primary={cat}
                            sx={{ color: "#333", fontWeight: "bold" }}
                          />
                        </ListItem>
                      ))}

                      {suggestedProducts.length > 0 && (
                        <Typography
                          sx={{
                            px: 1,
                            mt: matchedCategories.length ? 1 : 0,
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            color: "#9e9e9e",
                            textTransform: "uppercase",
                          }}
                        >
                          Products
                        </Typography>
                      )}
                      {suggestedProducts.map((product) => (
                        <ListItem
                          key={product._id}
                          button
                          onClick={() => handleSuggestionClick(product)}
                          sx={{ padding: "8px 10px" }}
                        >
                          <img
                            src={
                              Array.isArray(product.product_image)
                                ? product.product_image[0]
                                : product.product_image
                            }
                            alt={product.product_name}
                            style={{
                              width: 34,
                              height: 34,
                              objectFit: "cover",
                              borderRadius: 4,
                              marginRight: 10,
                            }}
                          />
                          <ListItemText
                            primary={product.product_name}
                            secondary={product.product_category}
                            primaryTypographyProps={{
                              sx: { color: "#333", fontWeight: 600, fontSize: "0.9rem" },
                            }}
                          />
                        </ListItem>
                      ))}

                      {/* Vendors */}
                      {matchedVendors.length > 0 && (
                        <Typography
                          sx={{
                            px: 1,
                            mt: 1,
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            color: "#9e9e9e",
                            textTransform: "uppercase",
                          }}
                        >
                          Vendors
                        </Typography>
                      )}
                      {matchedVendors.map((vendor) => (
                        <ListItem
                          key={`vendor-${vendor._id}`}
                          button
                          onClick={() => handleVendorClick(vendor)}
                          sx={{ padding: "8px 10px" }}
                        >
                          {vendor.shop_image_or_logo ? (
                            <img
                              src={vendor.shop_image_or_logo}
                              alt={vendor.shop_name || vendor.vendor_name}
                              style={{
                                width: 34,
                                height: 34,
                                objectFit: "cover",
                                borderRadius: 4,
                                marginRight: 10,
                              }}
                            />
                          ) : (
                            <SearchIcon
                              sx={{ color: "#c026d3", fontSize: 18, mr: 1 }}
                            />
                          )}
                          <ListItemText
                            primary={vendor.shop_name || vendor.vendor_name}
                            secondary={vendor.profession}
                            primaryTypographyProps={{
                              sx: { color: "#333", fontWeight: 600, fontSize: "0.9rem" },
                            }}
                          />
                        </ListItem>
                      ))}

                      {/* Services */}
                      {matchedServices.length > 0 && (
                        <Typography
                          sx={{
                            px: 1,
                            mt: 1,
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            color: "#9e9e9e",
                            textTransform: "uppercase",
                          }}
                        >
                          Services
                        </Typography>
                      )}
                      {matchedServices.map((service) => (
                        <ListItem
                          key={`service-${service._id}`}
                          button
                          onClick={() => handleServiceClick(service)}
                          sx={{ padding: "8px 10px" }}
                        >
                          <SearchIcon
                            sx={{ color: "#c026d3", fontSize: 18, mr: 1 }}
                          />
                          <ListItemText
                            primary={service.service_name}
                            secondary={service.service_category}
                            primaryTypographyProps={{
                              sx: { color: "#333", fontWeight: 600, fontSize: "0.9rem" },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                );
              })()}

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
        {/* min height so the autocomplete dropdown has room to open */}
        <DialogContent sx={{ minHeight: 320, overflow: "visible" }}>
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

          {/* Google Places autocomplete — shows suggestion dropdown as you type */}
          <GooglePlacesAutocomplete
            apiKey={GOOGLE_MAPS_API_KEY}
            autocompletionRequest={{ componentRestrictions: { country: "in" } }}
            selectProps={{
              value: null,
              onChange: handlePlaceSelect,
              placeholder: "Search city or area...",
              // Render the dropdown in a body portal so the Dialog doesn't clip it
              menuPortalTarget:
                typeof document !== "undefined" ? document.body : null,
              styles: {
                menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                menu: (base) => ({ ...base, zIndex: 99999 }),
              },
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
            Close
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
