import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import StarRating from "../../../../components/StarRating";
import axios from "axios";
import { setLoading } from "../../../../redux/slice/LoaderSlice";
import { useDispatch } from "react-redux";
import "./styles.scss";

function SlideDown(props) {
  return <Slide {...props} direction="down" />;
}

const Featured = () => {
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [productList, setProductList] = useState([]);
  const [loading, setLoadingState] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Safely read user ID
  const userDetail = sessionStorage.getItem("userDetails");
  let userId = null;
  if (userDetail) {
    try {
      const userDetails = JSON.parse(userDetail);
      userId = userDetails?._id || null;
    } catch (error) {
      console.error("Error parsing userDetails:", error);
    }
  }

  // ✅ Fetch Featured Products
  const fetchFeaturedProducts = async () => {
    try {
      const res = await axios.get(
        "https://api.nithyaevent.com/api/product/getrentalproduct?limit=5",
        { headers: { "Content-Type": "application/json" } }
      );

      let products = res?.data?.data || [];
      if (Array.isArray(res?.data)) products = res.data;
      if (!Array.isArray(products)) products = [];

      setFeaturedProduct(products?.slice(0, 8));
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoadingState(false);
    }
  };

  // ✅ Fetch Wishlist
  const fetchWishlist = async () => {
    if (!userId) return;
    dispatch(setLoading(true));
    try {
      const res = await axios.get(
        `https://api.nithyaevent.com/api/wishlist/get-my-wishlist/${userId}`,
        { headers: { "Content-Type": "application/json" } }
      );
      const wishlistItems = Array.isArray(res.data?.wishlist)
        ? res.data.wishlist.map((item) => item.product_id)
        : [];
      setWishlist(wishlistItems);
      setProductList(res.data.wishlist || []);
    } catch (error) {
      if (error.response?.status === 404) setWishlist([]);
      else console.error("Error fetching wishlist:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
    fetchWishlist();
  }, []);

  // ✅ Updated Navigate handlers to use slug pattern
  const handleProductClick = (item) => {
    const categorySlug = item.product_category.toLowerCase();
    const productSlug = item.product_name.toLowerCase().replace(/\s+/g, "-") + "-rental";
    navigate(`/products/${categorySlug}/${productSlug}`);
  };
  const handleViewAll = () => {
    window.scrollTo(0, 0);
    navigate("/products");
  };

  // ✅ Calculate average rating
  const calculateAverageRating = (reviews = []) => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + (r?.ratings || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  // ✅ Wishlist click with Snackbar popup
  const handleWishlistClick = async (item) => {
    if (!userId) {
      setSnackbar({
        open: true,
        message: "Please log in to add to wishlist.",
        severity: "warning",
      });
      return;
    }

    if (wishlist.includes(item._id)) {
      setSnackbar({
        open: true,
        message: "Already in wishlist.",
        severity: "info",
      });
      return;
    }

    try {
      await axios.post(
        "https://api.nithyaevent.com/api/wishlist/add-wishlist",
        {
          product_name: item.product_name,
          product_id: item._id,
          product_image: item.product_image?.[0],
          product_price: item.product_price,
          mrp_price: item.mrp_price,
          discount: item.discount,
          user_id: userId,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setWishlist((prev) => [...prev, item._id]);
      setSnackbar({
        open: true,
        message: "Added to wishlist!",
        severity: "success",
      });
    } catch (error) {
      console.error("Wishlist error:", error);
      setSnackbar({
        open: true,
        message: "Failed to add to wishlist.",
        severity: "error",
      });
    }
  };

  // ✅ Close Snackbar
  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ padding: { xs: "2rem 1rem", md: "6rem" } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#343a40",
            textTransform: "uppercase",
            fontSize: "1.2rem",
          }}
        >
          Featured Products
        </Typography>
      </Box>

      {/* ✅ Loader or Product Grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : featuredProduct.length === 0 ? (
        <Typography align="center" sx={{ color: "gray", mt: 5 }}>
          No featured products available.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            },
            gap: "1.5rem",
          }}
        >
          {featuredProduct.map((item) => (
            <Card
              key={item._id}
              sx={{
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.03)" },
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "#fff",
                minHeight: "480px",
              }}
            >
              <Box
                component="img"
                src={
                  item.product_image?.[0] ||
                  item.image ||
                  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='400'%20height='300'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f9f9f9'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23999999'%20font-family='sans-serif'%20font-size='18'%20text-anchor='middle'%20dominant-baseline='middle'%3ENo%20Image%3C/text%3E%3C/svg%3E"
                }
                alt={item.product_name || "Product"}
                sx={{
                  width: "100%",
                  height: "260px",
                  objectFit: "contain",
                  backgroundColor: "#f9f9f9",
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='400'%20height='300'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f9f9f9'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23999999'%20font-family='sans-serif'%20font-size='18'%20text-anchor='middle'%20dominant-baseline='middle'%3ENo%20Image%3C/text%3E%3C/svg%3E";
                }}
                onClick={() => handleProductClick(item)}  // Updated to pass full item
              />

              <CardContent sx={{ padding: "1.8rem" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      color: "#111827",
                      flexGrow: 1,
                    }}
                  >
                    {item.product_name?.length > 18
                      ? item.product_name.slice(0, 18) + "..."
                      : item.product_name}
                  </Typography>

                  <IconButton
                    onClick={() => handleWishlistClick(item)}
                    sx={{ padding: 0 }}
                  >
                    {wishlist.includes(item._id) ? (
                      <FavoriteOutlinedIcon sx={{ color: "#c026d3" }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ color: "#c026d3" }} />
                    )}
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    mt: 1,
                  }}
                >
                  <StarRating
                    rating={parseFloat(calculateAverageRating(item.Reviews))}
                  />
                  <Typography sx={{ fontSize: "0.9rem", color: "#6b7280" }}>
                    {item.Reviews?.length || 0} Reviews
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    mt: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: "#111827",
                    }}
                  >
                    ₹{item.product_price || item.price}
                  </Typography>
                  {item.mrp_price && item.mrp_price > item.product_price && (
                    <Typography
                      sx={{
                        textDecoration: "line-through",
                        color: "#ef4444",
                        fontSize: "1rem",
                      }}
                    >
                      ₹{item.mrp_price}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      color: "#ef4444",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                    }}
                  >
                    Per day
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Button
          variant="contained"
          onClick={handleViewAll}
          sx={{
            textTransform: "capitalize",
            fontWeight: "bold",
            backgroundColor: "#c026d3",
            width: "8rem",
            height: "40px",
            "&:hover": { transform: "scale(1.1)", backgroundColor: "#a21caf" },
          }}
        >
          View All
        </Button>
      </Box>

      {/* ✅ Snackbar popup (TOP POSITION) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideDown}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Featured;