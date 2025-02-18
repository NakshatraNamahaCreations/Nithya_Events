import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import CustomSort from "../../Category/components/CustomSort";
import authService from "../../../api/ApiService";
import { getErrorMessage } from "../../../utils/helperFunc";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/slice/LoaderSlice";

const FeaturedProduct = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories] = useState([
    "All",
    "Sound",
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { numberOfDays } = useSelector((state) => state.date);

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

    setFilteredItems(filtered);
  };

  useEffect(() => {
    filterProducts();
  }, [products, activeCategory, minPrice, maxPrice, numberOfDays, searchQuery]);

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

  const handleOpen = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <Box className="products-page">
      <Box className="filters-sidebar">
        <Typography variant="h6" className="filters-title">
          Filters
        </Typography>
        <Box className="filter-group">
          <Typography variant="subtitle1">Categories</Typography>
          {categories.map((cat) => (
            <Button
              key={cat}
              className={
                cat === activeCategory
                  ? "filter-button-active"
                  : "filter-button"
              }
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </Button>
          ))}
        </Box>

        <Box className="filter-group">
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
        <Box className="filter-group">
          <Typography variant="subtitle1">Brand</Typography>
          <TextField
            placeholder="Search Brand"
            variant="outlined"
            size="small"
            className="search-brand"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Box sx={{ marginTop: "3rem" }}>
            <CustomSort onSortChange={handleSortChange} />
          </Box>
        </Box>
      </Box>

      <Box className="main-content">
        <Box className="sorting-header">
          <Typography variant="h5" sx={{ fontSize: "0.9rem", padding: "1rem" }}>
            Showing {filteredItems.length} results of Featured Products
          </Typography>
        </Box>

        <Box className="products-grid">
          {filteredItems.map((item) => (
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
                <Typography className="product-price">
                  ₹{item.product_price}
                </Typography>
                <Typography className="product-discount">
                  {item.discount}% OFF
                </Typography>
                <Typography className="product-stock">
                  Stock Available: {item.stock_in_hand}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturedProduct;
