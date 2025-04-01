import React, { useEffect, useState } from "react";
import authService from "../../../../api/ApiService";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../../redux/slice/LoaderSlice";
import Pagination from "../../../../components/Pagination";

const ServiceDetails = () => {
  const { serviceName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceDetails, setServiceDetails] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedText, setSearchedText] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]); // Stores selected rating filters

  const itemsPerPage = 6;

  const [openSections, setOpenSections] = useState({
    categories: true,
    reviews: true,
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

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const filtered = serviceDetails.filter((service) =>
        service.vendor_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
      setSearchedText(searchQuery);
      setCurrentPage(1);
    } else {
      const filtered = serviceDetails.filter((service) =>
        service.vendor_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
      setSearchedText(searchQuery);
    }
    setCurrentPage(1);
  };

  // **Filter Services by Review Rating**
  useEffect(() => {
    let filtered = [...serviceDetails];

    // Apply Review Rating Filter
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((service) => {
        const avgRating = calculateAverageRating(service.Reviews);
        return selectedRatings.some((minRating) => avgRating >= minRating);
      });
    }

    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [selectedRatings, serviceDetails]);

  const handlePageChange = (page) => setCurrentPage(page);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredServices.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleServiceClick = (id) => navigate(`/service/${serviceName}/${id}`);

  const handleWishlistClick = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce(
      (sum, review) => sum + review.ratings,
      0
    );
    return (totalRating / reviews.length).toFixed(1);
  };

  // **Handle Checkbox Click**
  const handleRatingFilter = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  return (
    <Box sx={{ mt: 5 }}>
      {/* **Breadcrumb and Heading** */}
      <Box sx={{ ml: 4 }}>
        <Typography variant="h4" fontWeight={500}>
          Services
        </Typography>
      </Box>

      <Box
        sx={{
          pt: 3,
          pb: 20,
          display: "flex",
          gap: "1rem",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          className="filters-sidebar"
          sx={{ mb: 4, width: { xs: "24rem", md: "20rem" } }}
        >
          <Box className="filter-category">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                paddingLeft: "9px",
              }}
              onClick={() =>
                setOpenSections({
                  ...openSections,
                  categories: !openSections.categories,
                })
              }
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
              <Box sx={{ mt: 1 }}>
                {searchQuery.length > 0 && searchedText && (
                  <Typography variant="h6" style={{ fontSize: "0.9rem" }}>
                    Results for: "{searchedText}"
                  </Typography>
                )}
              </Box>
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Search by Vendor Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  sx={{
                    mb: 2,
                    width: "100%",
                    fontSize: "0.8rem",
                    "& .MuiInputBase-root": {
                      height: "45px",
                      fontSize: "0.8rem",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.75rem",
                    },
                  }}
                />
              </Box>
            </Collapse>
          </Box>

          <Box className="filter-category" sx={{ padding: "10px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() =>
                setOpenSections({
                  ...openSections,
                  reviews: !openSections.reviews,
                })
              }
            >
              <Typography variant="p">Filter by Reviews</Typography>
              <IconButton size="small">
                {openSections.reviews ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={openSections.reviews}>
              <Box>
                {[4, 3, 2].map((rating) => (
                  <FormControlLabel
                    key={rating}
                    control={
                      <Checkbox
                        checked={selectedRatings.includes(rating)}
                        onChange={() => handleRatingFilter(rating)}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "0.85rem", color: "#555" }}>
                        {`${rating} Stars & Above`}
                      </Typography>
                    }
                    sx={{ color: "#555", display: "flex" }}
                  />
                ))}
              </Box>
            </Collapse>
          </Box>
          <Box
            sx={{
              textAlign: "center",
              backgroundColor: "#F5F5F5",
              padding: "16px",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              width:{xs:'20rem', md:'14rem'}
            }}
          >
            {/* Help Text */}
            <Typography
              variant="body2"
              sx={{ color: "#333", fontSize: "0.9rem" }}
            >
              Need help?
            </Typography>
            {/* <Link
        href="#"
        sx={{
          color: "#007bff",
          textDecoration: "none",
      
        }}
      > */}
            <Typography
              sx={{
                color: "blue",
                fontWeight: "bold",
                fontSize: "1rem",
                marginTop: "4px",
              }}
              onClick={() => navigate("/help-center")}
            >
              {" "}
              Help me decide &gt;
            </Typography>
            {/* </Link> */}
          </Box>
          {/* Help Link */}
          {/* <Link
        href="#"
        sx={{
          color: "#007bff",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "1rem",
          marginTop: "4px",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        Help me decide &gt;
      </Link> */}
        </Box>

        {/* **Services Grid** */}
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
                  <Rating
                    value={calculateAverageRating(item.Reviews)}
                    readOnly
                    size="small"
                  />
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
