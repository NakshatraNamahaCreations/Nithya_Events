// React and react related imports
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Third party library
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Collapse,
  FormControlLabel,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// Custom Components
import CustomSort from "./components/CustomSort";
import "./styles.scss";
import authService from "../../api/ApiService";
import { setLoading } from "../../redux/slice/LoaderSlice";
import { getErrorMessage } from "../../utils/helperFunc";
import Sliders from "../../components/Sliders";
import BreadCrumb from "../../components/BreadCrumb";
import StarRating from "../../components/StarRating";
import Pagination from "../../components/Pagination";
import DiscountSlider from "../Products/components/DiscountSlider";

const Category = () => {
  const { category } = useParams();
  const [data, setData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories] = useState([
    "All",
    "Sound",
    "Genset",
    "Video",
    "Lighting",
    "Fabrication",
    "Shamiana",
  ]);
  const [activeCategory, setActiveCategory] = useState(category || "All");
  const [sortOption, setSortOption] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openSections, setOpenSections] = useState({
    categories: true,
    priceRange: false,
    discount: false,
  });
  const [selectedDiscount, setSelectedDiscount] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [lowStockChecked, setLowStockChecked] = useState(false);
  const [highStockChecked, setHighStockChecked] = useState(false);
  const { numberOfDays } = useSelector((state) => state.date);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const breadcrumbPaths = [{ label: "Home", link: "/" }, { label: category }];

  const fetchCategories = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.rentalProduct();
      if (res.data.data && res.data.data.length > 0) {
        setData(res.data.data);
        // console.log(res.data.data);

        setActiveCategory(category);
        dispatch(setLoading(false));
      } else {
        setData([]);
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      getErrorMessage(error);
    }
  };
  const filterProducts = () => {
    let filtered = data;

    if (activeCategory !== "All") {
      filtered = filtered.filter(
        (item) =>
          item.product_category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // if (numberOfDays) {
    //   filtered = filtered.filter((item) => item.stock_in_hand >= numberOfDays);
    // }

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.product_name?.toLowerCase().includes(searchQuery?.toLowerCase())
      );
    }
    if (lowStockChecked) {
      filtered = filtered.filter((item) => item.stock_in_hand < 50);
    }

    if (highStockChecked) {
      filtered = filtered.filter((item) => item.stock_in_hand >= 50);
    }

    filtered = filtered.filter(
      (item) =>
        item.discount >= selectedDiscount[0] &&
        item.discount <= selectedDiscount[1]
    );

    setFilteredItems(filtered);
  };
  useEffect(() => {
    filterProducts();
  }, [
    data,
    activeCategory,
    minPrice,
    maxPrice,
    numberOfDays,
    searchQuery,
    lowStockChecked,
    highStockChecked,
    selectedDiscount,
  ]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePriceFilter = () => {
    let filtered = data;

    if (activeCategory !== "All") {
      filtered = filtered.filter(
        (item) =>
          item.product_category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (minPrice || maxPrice) {
      filtered = filtered.filter(
        (item) =>
          (!minPrice || item.product_price >= parseFloat(minPrice)) &&
          (!maxPrice || item.product_price <= parseFloat(maxPrice))
      );
    }

    setFilteredItems(filtered);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    let sortedItems = [...filteredItems];

    if (option === "newest") {
      sortedItems.sort((a, b) => b.id - a.id);
    } else if (option === "priceLowToHigh") {
      sortedItems.sort(
        (a, b) => parseFloat(a.product_price) - parseFloat(b.product_price)
      );
    } else if (option === "priceHighToLow") {
      sortedItems.sort(
        (a, b) => parseFloat(b.product_price) - parseFloat(a.product_price)
      );
    }

    setFilteredItems(sortedItems);
  };

  // const handleSearch = () => {
  //   let filtered = data.filter((item) =>
  //     item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  //   if (activeCategory !== "All") {
  //     filtered = filtered.filter(
  //       (item) =>
  //         item.product_category.toLowerCase() === activeCategory.toLowerCase()
  //     );
  //   }

  //   if (minPrice || maxPrice) {
  //     filtered = filtered.filter(
  //       (item) =>
  //         (!minPrice || item.product_price >= parseFloat(minPrice)) &&
  //         (!maxPrice || item.product_price <= parseFloat(maxPrice))
  //     );
  //   }

  //   setFilteredItems(filtered);
  // };
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  };
  const calculateAverageRating = (review) => {
    console.log("The review", review);
    const total = review.reduce((sum, curr) => sum + curr.ratings, 0);

    return review.length ? (total / review.length).toFixed(1) : 0;
  };
  const handleOpen = (id) => {
    navigate(`/products/${id}`);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLowStockChange = (event) => {
    setLowStockChecked(event.target.checked);
  };

  const handleHighStockChange = (event) => {
    setHighStockChecked(event.target.checked);
  };

  console.log(getPaginatedData());

  return (
    <>
      <Sliders />
      <BreadCrumb paths={breadcrumbPaths} />

      <Box className="category-page">
        <Box className="products-page">
          <Box className="filters-sidebar">
            {/* Categories Section */}
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
                <Typography variant="subtitle1">Categories</Typography>
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
                  {categories.map((category) => (
                    <FormControlLabel
                      key={category}
                      control={
                        <Checkbox
                          checked={category === activeCategory}
                          onChange={() => setActiveCategory(category)}
                        />
                      }
                      label={category}
                      sx={{ display: "block", color: "#555" }}
                    />
                  ))}
                </Box>
              </Collapse>
            </Box>

            <Box className="filter-group">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => toggleSection("priceRange")}
              >
                <Typography variant="subtitle1">Price Range</Typography>
                <IconButton size="small">
                  {openSections.priceRange ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
              <Collapse in={openSections.priceRange}>
                <Box>
                  <Typography variant="subtitle1">Price</Typography>
                  <TextField
                    type="number"
                    placeholder="Min"
                    size="small"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="price-input"
                  />
                  <TextField
                    type="number"
                    placeholder="Max"
                    size="small"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="price-input"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePriceFilter}
                    sx={{
                      marginTop: "1rem",
                      background:
                        "linear-gradient(90deg, rgb(196, 70, 255) -14.33%, rgb(120, 1, 251) 38.59%, rgb(62, 0, 130) 98.88%)",
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </Collapse>
            </Box>

            {/* Discount Section */}
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
                <Typography variant="subtitle1">Discount</Typography>
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
                  <Box className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
                    <DiscountSlider onChange={setSelectedDiscount} />
                  </Box>
                </Box>
              </Collapse>
            </Box>

            {/* Availability Section */}
            <Box className="filter-group">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => toggleSection("availability")}
              >
                <Typography variant="subtitle1">Availability</Typography>
                <IconButton size="small">
                  {openSections.availability ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
              <Collapse in={openSections.availability}>
                <Box sx={{ marginTop: "0.5rem", width: "15rem" }}>
                  <Box
                    className={`filters-sidebar ${showFilters ? "open" : ""}`}
                  >
                    <FormControlLabel
                      sx={{ width: "15rem" }}
                      control={
                        <Checkbox
                          checked={lowStockChecked}
                          onChange={handleLowStockChange}
                        />
                      }
                      label="Quantity less than 50"
                    />
                    <FormControlLabel
                      sx={{ width: "15rem" }}
                      control={
                        <Checkbox
                          checked={highStockChecked}
                          onChange={handleHighStockChange}
                        />
                      }
                      label="Quantity more than 50"
                    />
                  </Box>
                </Box>
              </Collapse>
            </Box>
          </Box>
          {filteredItems.length > 0 ? (
            <Box className="main-content">
              <Box className="sorting-header">
                <Typography variant="p" className="number-results">
                  Showing {filteredItems.length} results
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  {/* Left Title */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      color: "#1E2A38",
                      fontSize: "1rem",
                    }}
                  >
                    Sort By:
                  </Typography>

                  <FormControl
                    sx={{
                      minWidth: 220,
                      backgroundColor: "#F5F5F5",
                      borderRadius: "10px",
                      padding: "0.5rem",
                    }}
                  >
                    <Select
                      value={sortOption}
                      onChange={(e) => handleSortChange(e.target.value)}
                      displayEmpty
                      sx={{
                        borderRadius: "10px",
                        backgroundColor: "#F5F5F5",
                        color: "#000",
                        fontWeight: "bold",
                        height: "45px",
                        boxShadow: "none",
                        outline: "none",
                        border: "1px solid #ddd",
                        "&:hover": {
                          backgroundColor: "#e0e0e0",
                        },
                      }}
                    >
                      <MenuItem value="default">Default</MenuItem>
                      <MenuItem value="priceLowToHigh">
                        Price: Low to High
                      </MenuItem>
                      <MenuItem value="priceHighToLow">
                        Price: High to Low
                      </MenuItem>
                      <MenuItem value="newest">Newest</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box className="products-grid">
                {getPaginatedData().map((item) => (
                  <Card
                    key={item.id}
                    className="product-card"
                    onClick={() => handleOpen(item._id)}
                  >
                    <img
                      src={item.product_image[0]}
                      alt={item.product_name}
                      className="product-image"
                    />
                    <CardContent>
                      <Typography variant="h6" className="product-title">
                        {item.product_name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: "0.5rem",
                          marginLeft: "-6px",
                        }}
                      >
                        <StarRating
                          rating={parseFloat(
                            calculateAverageRating(item.Reviews)
                          )}
                        />
                        <Typography>
                          {item.Reviews.length > 0 ? item.Reviews.length : 0}{" "}
                          Reviews
                          {/* {item.Reviews && item.Reviews.length > 0
                      ? calculateAverageRating(item.Reviews)
                      : "No Ratings"} */}
                        </Typography>
                      </Box>
                      <Typography className="product-price">
                        ₹{item.product_price} / day
                      </Typography>
                      <Typography className="product-discount">
                        {item.discount}% OFF
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
                onPageChange={handlePageChange}
                
              />
            </Box>
          ) : (
            <Box
              sx={{ display: "flex", margin: "auto auto", fontSize: "1.5rem" }}
            >
              <Typography variant="p">No Product found</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Category;
