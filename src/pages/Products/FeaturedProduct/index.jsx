import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  FormControl,
  Checkbox,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import CustomSort from "../../Category/components/CustomSort";
import authService from "../../../api/ApiService";
import { getErrorMessage } from "../../../utils/helperFunc";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/slice/LoaderSlice";
import Slider from "react-slick";
import DiscountSlider from "../components/DiscountSlider";
import BreadCrumb from "../../../components/BreadCrumb";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import StarRating from "../../../components/StarRating";
const FeaturedProduct = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories] = useState([
    "All",
    "Sound",
    "Lighting",
    "Genset",
    "Video",
    "Fabrication",
    "Shamiana",
  ]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { numberOfDays } = useSelector((state) => state.date);
  const [openSections, setOpenSections] = useState({
    categories: true,
    priceRange: false,
    discount: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [lowStockChecked, setLowStockChecked] = useState(false);
  const [highStockChecked, setHighStockChecked] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState([0, 100]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 50000]);
  const breadcrumbPaths = [{ label: "Home", link: "/" }, { label: "Products" }];

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const fetchProducts = async () => {
    dispatch(setLoading(true));
    try {
      const res = await authService.allFeaturedProducts();
      setProducts(res.data.data);
      setFilteredItems(res.data.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      getErrorMessage(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    setSearchQuery(search);
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const filterProducts = () => {
    let filtered = products;

    if (activeCategory !== "All") {
      filtered = filtered.filter(
        (item) => item.product_category === activeCategory
      );
    }

    if (numberOfDays) {
      filtered = filtered.filter((item) => item.stock_in_hand >= numberOfDays);
    }

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.product_name?.toLowerCase().includes(searchQuery?.toLowerCase())
      );
    }
    if (lowStockChecked) {
      filtered = filtered.filter((item) => item.stock_in_hand < 50);
    }
    if (selectedPriceRange && selectedPriceRange.length === 2) {
      filtered = filtered.filter(
        (item) =>
          parseFloat(item.product_price) >= selectedPriceRange[0] &&
          parseFloat(item.product_price) <= selectedPriceRange[1]
      );
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
    setCurrentPage(1);
  };

  useEffect(() => {
    filterProducts();
  }, [
    products,
    activeCategory,
    minPrice,
    selectedPriceRange,
    maxPrice,
    numberOfDays,
    searchQuery,
    lowStockChecked,
    highStockChecked,
    selectedDiscount,
  ]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handlePriceFilter = () => {
    let filtered = products;
    if (numberOfDays) {
      filtered = filtered.filter((item) => item.stock_in_hand >= numberOfDays);
    }
    if (minPrice || maxPrice) {
      filtered = filtered.filter(
        (item) =>
          (!minPrice || item.product_price >= parseFloat(minPrice)) &&
          (!maxPrice || item.product_price <= parseFloat(maxPrice))
      );
    }
    setFilteredItems(filtered);
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  const calculateAverageRating = (review) => {
    const total = review.reduce((sum, curr) => sum + curr.ratings, 0);

    return review.length ? (total / review.length).toFixed(1) : 0;
  };

  const handleOpen = (id) => {
    navigate(`/products/${id}`);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
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

  return (
    <>
      <Slider />
      <BreadCrumb paths={breadcrumbPaths} />

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
              <Box sx={{ marginTop: "0.5rem" }}>
                {categories?.map((category) => (
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
                {openSections.priceRange ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={openSections.priceRange}>
              <Box sx={{ marginTop: "0.5rem" }}>
                <Box className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
                  <Typography variant="subtitle1" gutterBottom>
                    ₹{selectedPriceRange[0]} - ₹{selectedPriceRange[1]}
                  </Typography>
                  <DiscountSlider
                    min={0}
                    max={50000}
                    step={1000}
                    value={selectedPriceRange}
                    onChange={setSelectedPriceRange}
                    label={"Range"}
                  />
                </Box>
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
              onClick={() => toggleSection("discount")}
            >
              <Typography variant="p">Discount</Typography>
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
                  <DiscountSlider  value={selectedDiscount} onChange={setSelectedDiscount} min={0}
                    max={100}
                    step={100} />
                </Box>
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
              onClick={() => toggleSection("availability")}
            >
              <Typography variant="p">Availability</Typography>
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
                <Box className={`filters-sidebar ${showFilters ? "open" : ""}`}>
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

        <Box className="main-content">
          <Box className="sorting-header">
            <Typography variant="p">
              Showing {filteredItems?.length} results
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
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
                  <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
                  <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
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
                    sx={{ display: "flex", gap: "0.5rem", marginLeft: "-6px" }}
                  >
                    <StarRating
                      rating={parseFloat(calculateAverageRating(item.Reviews))}
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
      </Box>
    </>
  );
};

export default FeaturedProduct;
