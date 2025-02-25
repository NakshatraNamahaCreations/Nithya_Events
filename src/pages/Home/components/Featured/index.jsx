import { Box, Button, Typography, Card, CardContent, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../../api/ApiService";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";

import "./styles.scss";

const Featured = () => {
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const fetchFeaturedProducts = async () => {
    const res = await authService.featuredProducts();
    setFeaturedProduct(res.data.data);
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  // Navigate to Product Page
  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  // View All Products
  const handleViewAll = () => {
    window.scrollTo(0, 0);
    navigate(`/Featuredproducts`);
  };

  // Toggle Wishlist Status
  // const handleWishlistClick = (id) => {
  //   setWishlist((prevWishlist) =>
  //     prevWishlist.includes(id)
  //       ? prevWishlist.filter((itemId) => itemId !== id) // Remove from wishlist
  //       : [...prevWishlist, id] // Add to wishlist
  //   );
  // };

  const handleWishlistClick = (id) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]);
  }
  return (
    <Box sx={{ padding: "6rem" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          
        }}
      >
        <Typography sx={{ fontWeight: "bold", color: "#343a40",  textTransform:'uppercase', fontSize:'1.5rem' }}>
          Featured Products
        </Typography>
      </Box>

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
              "&:hover": { transform: "scale(1.05)" },
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <Box
              component="img"
              src={item.product_image}
              alt={item.product_name}
              sx={{
                width: "100%",
                height: "270px",
                objectFit: "cover",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
              onClick={() => handleProductClick(item._id)}
            />
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#343a40",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.product_name}
                </Typography>

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    handleWishlistClick(item._id);
                  }}
                  sx={{ color: "#c026d3" }}
                >
                  {wishlist.includes(item._id) ? (
                    <FavoriteOutlinedIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: "#6c757d",
                  marginBottom: "0.5rem",
                }}
              >
                {item.product_category}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    color: "#000",
                    fontSize: "1rem",
                  }}
                >
                  ₹{item.product_price} / day
                </Typography>

                {item.discount < item.product_price && (
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: "line-through",
                      color: "red",
                      fontSize: "1.1rem",
                      marginTop: "4px",
                    }}
                  >
                    ₹{(item.mrp_rate)}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    width: "15rem",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    marginTop: "1rem",
                    backgroundColor: "#c026d3",
                    color: "white",
                    border: "none",
                    "&:hover": {
                      borderColor: "black",
                      boxShadow: "none",
                    },
                  }}
                >
                  Add to Bag
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "3rem",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleViewAll}
          sx={{
            textTransform: "capitalize",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "#c026d3",
            width: "8rem",
            height: "40px",
            border: "none",
            "&:hover": {
              transform: "scale(1.1)",
              color: "#fff",
            },
          }}
        >
          View All
        </Button>
      </Box>
    </Box>
  );
};

export default Featured;
