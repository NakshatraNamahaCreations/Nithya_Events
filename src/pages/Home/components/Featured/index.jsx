import { Box, Button, Typography, Card, CardContent, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../../api/ApiService";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";

import "./styles.scss";
import StarRating from "../../../../components/StarRating";
import axios from "axios";

const Featured = () => {
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const userDetail =  sessionStorage.getItem('userDetails');
  const userDetails = JSON.parse(userDetail);
  const userId = userDetails._id;
  console.log(userId);

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
  
  const calculateAverageRating = (review) => {
    const total = review.reduce((sum, curr) => sum + curr.ratings, 0);

    return review.length ? (total / review.length).toFixed(1) : 0;
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
  const handleClick  = async (product) => {
    
    const payload = {
      product_name: product.product_name,
    product_id: product.product_id,
    product_image: product.product_image[0],
    product_price: product.product_price,
    mrp_price: product.mrp_price,
    discount: product.discount,
    user_id: userId


    }

  
    try {
      const res = await axios.post(
        "https://api.nithyaevent.com/api/wishlist/add-wishlist",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Wishlist API Response:", res.data);
      alert("Product successfully added!");
    } catch (error) {
      console.error("Wishlist API Error:", error);
      alert("Error in wishlist");
    }
  };
  
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
                          }}
                        >
                          {item.product_name.length > 15 ? item.product_name.slice(0, 15) + "..." : item.product_name}
                        </Typography>

                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWishlistClick(item._id);
                          }}
                          sx={{ color: "#c026d3", position: 'relative' }}
                        >
                          {wishlist.includes(item._id) ? (
                            <Button onClick={() => handleClick(item)}>

                              <FavoriteOutlinedIcon  style={{ position: 'absolute' }} />
                            </Button>
                          ) : (
                            <FavoriteBorderIcon style={{ position: 'absolute' }} />
                          )}
                        </IconButton>
                      </Box>

                      <Typography
                        variant="p"
                        sx={{
                          color: "#6c757d",
                        }}
                      >
                        {item.brand}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                        <StarRating
                          rating={parseFloat(
                            calculateAverageRating(item.Reviews)
                          )}
                        // style={{ marginRight: '2rem' }}
                        />
                        <Typography variant="p" style={{ fontSize: "0.8rem" }}>
                          {item.Reviews.length > 0 ? item.Reviews.length : 0}{" "}
                          Reviews
                          {/* {item.Reviews && item.Reviews.length > 0
                      ? calculateAverageRating(item.Reviews)
                      : "No Ratings"} */}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.7rem",
                          marginTop: '0.3rem'
                        }}
                      >
                        <Typography
                          variant="p"
                          sx={{
                            fontWeight: "bold",
                            color: "#000",
                            fontSize: "1rem",
                          }}
                        >
                          ₹{item.product_price}
                        </Typography>

                        {item.discount < item.product_price && (
                          <Typography
                            variant="p"
                            sx={{
                              textDecoration: "line-through",
                              color: "red",
                              fontSize: "1rem",
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            ₹{(item.mrp_rate) || "2500"}
                          </Typography>
                        )}
                        <Typography sx={{ color: 'red', marginLeft: '-0.2rem' }} >Per day</Typography>
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
                          View More
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
