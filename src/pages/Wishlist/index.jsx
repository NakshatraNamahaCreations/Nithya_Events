import { Box, Card, CardContent, Typography, Button, Grid, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const wishlistItems = [
  {
    id: 1,
    product_name: "Camera Teleprompter",
    product_category: "Video",
    product_price: 20000,
    product_image: "https://example.com/teleprompter.jpg",
    discount: 12,
  },
  {
    id: 2,
    product_name: "Umbrella Lights",
    product_category: "Lighting",
    product_price: 5000,
    product_image: "https://example.com/umbrella-lights.jpg",
    discount: 10,
  },
];

const Wishlist = () => {
  const navigate = useNavigate();

  const handleRemoveFromWishlist = (id) => {
    alert("Removed from wishlist");
  };

  const handleAddToCart = (id) => {
    alert("Added to cart");
  };

  return (
    <Box sx={{ padding: "8rem", backgroundColor: "#f5f5f5" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "2rem" }}>
        My Wishlist
      </Typography>
      <Grid container spacing={3}>
        {wishlistItems.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <Card sx={{ position: "relative", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "10px", transition: "transform 0.2s", '&:hover': { transform: 'scale(1.05)' } }}>
              <Box
                component="img"
                src={item.product_image}
                alt={item.product_name}
                sx={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "10px 10px 0 0" }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: '#333' }}>
                  {item.product_name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6c757d", marginBottom: "1rem" }}>
                  {item.product_category}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#000" }}>
                    ₹{item.product_price}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: "line-through", color: "#b12704", fontSize: "1rem" }}
                  >
                    ₹{(item.product_price / (1 - item.discount / 100)).toFixed(0)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#c026d3', color: '#fff', '&:hover': { backgroundColor: '#e91e63' } }}
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(item.id)}
                  >
                    Add to Cart
                  </Button>
                  <IconButton
                    sx={{ color: '#ff4081' }}
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    <FavoriteBorderIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Wishlist;
