// React Related imports
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CloseIcon from "@mui/icons-material/Close";
import { Add } from "@mui/icons-material";
import RemoveIcon from "@mui/icons-material/Remove";

// Custom Components
import { useDispatch, useSelector } from "react-redux";
import { formatCurrencyIntl, getCurrentCity } from "../../utils/helperFunc";
import { logout } from "../../redux/slice/authSlice";
import {
  quantityDecrement,
  quantityIncrement,
  removeFromCart,
} from "../../redux/slice/CartSlice";

// Assests
import Calenders from "../../assets/Calenders.png";
import HomePage from "../../assets/homepage.png";
import AnalyticsImg from "../../assets/pieChart.png";
import Delivery from "../../assets/deliveryHome.png";
import Calendar from "../../pages/Calender";
import Settings from "../../assets/Settings.png";
// import ShoppingCart from "../../assets/shoppingCart.png";
// import ShoppingCart from "../../assets/carts.png";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
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
import SearchIcon from '@mui/icons-material/Search';

// styles
import "./styles.scss";

const PageHeader = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currLocation, setCurrLocation] = useState({ city: "", town: "" });
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

  const menuItems = [
    { label: "My Profile", icon: <AccountCircleOutlinedIcon />, path: "/profile" },
    // { label: "My Bookings", icon: <AccountCircleOutlinedIcon />, path: "/account" },
    { label: "My Bookings", icon: <EditCalendarOutlinedIcon />, path: "/Booking" },
    { label: "My Tickets", icon: <EventIcon />, path: "/my-tickets" },
    { label: "Faq", icon: <InfoIcon />, path: "/faq" },
    { label: "Privacy Policy", icon: <HelpOutlineIcon />, path: "/privacyPolicy" },
    { label: "Terms & Conditions", icon: <GavelIcon />, path: "/TermsAndCondition" },
  ];
  const [activePath, setActivePath] = useState(location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const closeMenuAndNavigate = (path) => {
    setActivePath(path);
    setMenuOpen(false);
    navigate(path);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  useEffect(() => {
    const homeVisited = sessionStorage.getItem("homeVisited");

    if (!homeVisited) {
      setIsCalendarOpen(true);
      sessionStorage.setItem("homeVisited", "true");
    }
  }, []);

  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
  };

  useEffect(() => {
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

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Logout User
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <>
      <Box className="header-main">
        <AppBar
          position="static"
          sx={{
            background: "white",
            width: "100% !important",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              gap: "2rem",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", gap: "3rem" }}>
              {/* <Typography
                variant="h5"
                component={Link}
                to="/"
                sx={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              > */}
              <img
                src={Logo}
                alt="Logo"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
              {/* </Typography> */}

              {/* <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  gap: "1.5rem",
                  alignItems: "center",
                }}
              >
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <img
                    src={Homes}
                    alt="Not found"
                    style={{ width: "18px", marginTop: "1px" }}
                  />
                  <Typography variant="p">Home</Typography>
                </Link>

                <Link
                  to="/products"
                  style={{
                    textDecoration: "none",
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <img
                    src={Products}
                    alt="Not found"
                    style={{ width: "17px", marginTop: "1.5px" }}
                  />
                  Products
                </Link> */}
              {/* <Link
                  to={"/booking"}
                  style={{
                    textDecoration: "none",
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <img
                    src={Settings}
                    alt="Not found"
                    style={{ width: "17px", marginTop: "1.5px" }}
                  />
                  Setting
                </Link> */}
              {/* <Link
                  to={"/services"}
                  style={{
                    textDecoration: "none",
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <img
                    src={Serv}
                    alt="Not found"
                    style={{ width: "17px", marginTop: "1.5px" }}
                  />
                  Services
                </Link> */}
              {/* <Link
                  to={"/booking"}
                  style={{
                    textDecoration: "none",
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <img
                    src={Calend}
                    alt="Not found"
                    style={{ width: "17px", marginTop: "1.5px" }}
                  />
                  Booking
                </Link>
              </Box> */}
            </Box>

            <Box
              sx={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
            >
              {/* <FmdGoodOutlinedIcon sx={{ color: "black", fontSize: 24 }} /> */}
              <img
                src={Locations}
                alt="Not found"
                style={{
                  width: "1.5rem",
                  height: "25px",
                  display: "flex",
                  alignItems: "center",
                }}
              />
              <Typography
                variant="p"
                sx={{ fontWeight: "400", color: "black", fontSize: { xs: '0.575rem', md: "0.9075rem" } }}
              // sx={{ display: { xs: "none", md: "block" } }}
              >
                {currLocation.city
                  ? `${currLocation.city}, ${currLocation.town}`
                  : "Fetching location..."}
              </Typography>
            </Box>



            {/* Search Bar.................. */}

            <Paper
              component="form"
              sx={{
                display: "flex",
                alignItems: "center",
                width: { xs: "100%", md: "40%" },
                borderRadius: "50px",
                boxShadow: "none",
                border: "1px solid #e0e0e0",
                backgroundColor: "#f4f4f4",
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

            {/* Last menu icons ................... */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>

              <Box sx={{ display: "flex", gap: "1rem", alignItems: 'center' }}>

                {/* Wishlist............. */}

                <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'center' }} onClick={() => navigate("/wishlist")}>

                  <FavoriteBorderIcon fontSize="medium" sx={{ color: '#e389eb', cursor: 'pointer' }} />
                  <Typography sx={{ color: '#6f6a6a', fontFamily: 'poppins' }} >Wishlist</Typography>
                </Box>

                {/* Cart .......... */}
                <Box sx={{ display: "flex", flexDirection: 'column', gap: '0.2rem', alignItems: 'center' }}>
                  <Link
                    to="/cart"
                    style={{
                      textDecoration: "none",
                      color: "black",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      position: "relative",
                    }}
                  >
                    <Badge
                      badgeContent={totalItems.length}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "10px",
                          fontWeight: "bold",
                          minWidth: "16px",
                          height: "16px",
                          padding: "4px",
                        },
                      }}
                    >
                      <ShoppingCartOutlinedIcon
                        fontSize="medium"
                        sx={{

                          color: '#e389eb'
                        }}
                      />
                    </Badge>
                  </Link>

                  <Typography sx={{ color: '#6f6a6a', fontFamily: 'poppins' }}>Cart</Typography>

                </Box>

                {/* Mood Board.............  */}

                <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>

                  <DesignServicesOutlinedIcon fontSize="medium" sx={{ color: '#e389eb', cursor: 'pointer' }} />
                  <Typography sx={{ color: '#6f6a6a', fontFamily: 'poppins' }}>Mood Board</Typography>
                </Box>
                {/* <Link
                  to={"/cart"}
                  style={{
                    textDecoration: "none",
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <img
                    src={Bell}
                    alt="Not found"
                    style={{ width: "17px", marginTop: "1.5px" }}
                  />
                </Link> */}

                {/* Account page................................. */}
                {isAuthenticated ? (
                  <>
                    <IconButton onClick={handleMenuOpen}>
                      {userDetails.profileImage ? (
                        <Avatar src={userDetails.profileImage} />
                      ) : (
                        <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>

                          <AccountCircleOutlinedIcon fontSize="medium" sx={{ color: '#e389eb' }} />
                          <Typography sx={{ color: '#6f6a6a', fontFamily: 'poppins' }}>Profile</Typography>
                        </Box>
                      )}
                    </IconButton>

                    <Menu
                      anchorEl={menuAnchor}
                      open={Boolean(menuAnchor)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        sx: {
                          width: "280px",
                          padding: "15px",
                          borderRadius: "12px",
                          boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
                        },
                      }}
                    >
                      {isAuthenticated ? (
                        <Box
                          sx={{ textAlign: "center", paddingBottom: "12px" }}
                        >
                          <Avatar
                            src={userDetails.profileImage}
                            sx={{
                              width: 64,
                              height: 64,
                              margin: "0 auto",
                              mb: 1,
                            }}
                          />
                          <Typography variant="h6" fontWeight="bold" sx={{textTransform:'capitalize'}}>
                            {userDetails.username}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {userDetails.email}
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{ textAlign: "center", paddingBottom: "12px" }}
                        >
                          <Avatar
                            sx={{
                              width: 64,
                              height: 64,
                              margin: "0 auto",
                              mb: 1,
                            }}
                          />
                          <Typography variant="h6" fontWeight="bold">
                            Guest User
                          </Typography>
                        </Box>
                      )}

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
                                backgroundColor: isActive ? "#f3e5f5" : "transparent",
                                "&:hover": { backgroundColor: "#f1f1f7" },
                                padding: "10px 15px",
                                borderRadius: "8px",
                                color: isActive ? "#9c27b0" : "black",
                               cursor:'pointer'
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
                                  <Typography variant="p"
                                    sx={{
                                      fontWeight: isActive ? "bold" : "normal",
                                      color: isActive ? "#9c27b0" : "black", 
                                      fontSize:'0.9rem'
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

                      {isAuthenticated ? (
                        <ListItem
                          button
                          onClick={() => {
                            handleLogout();
                            handleMenuClose();
                          }}
                          sx={{
                            "&:hover": { backgroundColor: "#f1f1f7" },
                            padding: "12px 15px",
                            borderRadius: "8px",
                          }}
                        >
                          <LogoutIcon
                            sx={{ marginRight: "12px", color: "#d32f2f" }}
                          />
                          <ListItemText
                            primary="Logout"
                            sx={{ color: "#d32f2f" }}
                          />
                        </ListItem>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          sx={{ borderRadius: "8px", marginTop: "10px" }}
                          onClick={() => navigate("/login")}
                        >
                          Sign In
                        </Button>
                      )}
                    </Menu>
                  </>
                ) : (
                  // <Button
                  //   color="primary"
                  //   variant="contained"
                  //   onClick={() => navigate("/login")}
                  // >
                  //   Signin
                  // </Button>

                  <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate("/login")}>

                    <AccountCircleOutlinedIcon fontSize="medium" sx={{ color: '#e389eb' }} />
                    <Typography sx={{ color: '#6f6a6a', fontFamily: 'poppins' }} >Login</Typography>
                  </Box>
                )}


              </Box>

            </Box>

            <IconButton
              edge="end"
              aria-label="menu"
              sx={{ display: { xs: "block", md: "none" } }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon fill="black" />
            </IconButton>
          </Toolbar>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{
                width: 250,
                padding: "1rem",
              }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                Menu
              </Typography>
              <Divider />
              <List>
                <ListItem button component={Link} to="/">
                  <ListItemText primary="Home" />
                </ListItem>
                {/* <ListItem button component={Link} to="/about">
                  <ListItemText primary="About" />
                </ListItem> */}
                <ListItem button component={Link} to="/categories">
                  <ListItemText primary="Categories" />
                </ListItem>
                <ListItem button component={Link} to="/booking">
                  <ListItemText primary="Bookings" />
                </ListItem>
                <ListItem button component={Link} to="/services">
                  <ListItemText primary="Services" />
                </ListItem>
                <ListItem button component={Link} to="/faq">
                  <ListItemText primary="Faq" />
                </ListItem>
                <ListItem button component={Link} to="/account">
                  <ListItemText primary="Account" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </AppBar>
      </Box>
      <Modal open={isCalendarOpen}>
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
            border: "none",
          }}
        >
          <Box
            sx={{
              marginBottom: "20px",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <Calendar
              handleCalendarClose={handleCalendarClose}
              calendarClose={handleCalendarClose}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              marginTop: "20px",
            }}
          >
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default PageHeader;
