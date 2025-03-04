import { Box, Button, Typography, Card, CardContent, IconButton, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../../api/ApiService";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";

import "./styles.scss";
import StarRating from "../../../../components/StarRating";
import axios from "axios";
import ModalItem from "../../../Products/SingleProducts/components/Modal";
import { setLoading } from "../../../../redux/slice/LoaderSlice";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Featured = () => {
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [productList, setProductList] = useState([]);
  const [open, setOpen] = useState(false);
  const [successType, setSuccessType] = useState("");
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetail = sessionStorage.getItem("userDetails");
  let userId = null;

  if (userDetail) {
    try {
      const userDetails = JSON.parse(userDetail);
      userId = userDetails?._id || null;
    } catch (error) {
      console.error("Error parsing userDetails from sessionStorage:", error);
    }
  }

  const fetchFeaturedProducts = async () => {
    const res = await authService.featuredProducts();
    setFeaturedProduct(res.data.data);
  };

  useEffect(() => {
    fetchFeaturedProducts();
    fetchWishlist();
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
  const fetchWishlist = async () => {
    dispatch(setLoading(true));

    try {
      const res = await axios.get(
        `https://api.nithyaevent.com/api/wishlist/get-my-wishlist/${userId}`,
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data?.wishlist && Array.isArray(res.data.wishlist)) {
        const wishlistItems = res.data.wishlist.map((item) => item.product_id);
        setWishlist(wishlistItems);
      } else {
        setWishlist([]); 
      }

      setProductList(res.data.wishlist);

      dispatch(setLoading(false));

    } catch (error) {
      dispatch(setLoading(false));
      if (error.response && error.response.status === 404) {
     
        setWishlist([]);
      } else {

        alert("Error fetching wishlist. Please try again.");
      }
      console.error("API Error:", error.response ? error.response.data : error.message);
    }
  };
  const handleWishlistClick = async (item) => {
    const isInWishlist = wishlist.includes(item._id)

    const wishlistId = productList.find((w) => w.product_id === item._id);

    try {
      // if (!isInWishlist) {

        await axios.post(
          "https://api.nithyaevent.com/api/wishlist/add-wishlist",
          {
            product_name: item.product_name,
            product_id: item._id,
            product_image: item.product_image[0],
            product_price: item.product_price,
            mrp_price: item.mrp_price,
            discount: item.discount,
            user_id: userId
          },
          { headers: { "Content-Type": "application/json" } }
        );


        setWishlist((prev) => [...prev, item._id]);
                  toast.success("Item added to cart!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
        // setModalType("success");
        // setModalMessage("The product has been successfully added to your wishlist.");
        // setOpen(true);
        // setTimeout(() => {
        //   setOpen(false);
        // }, 1800);
      // } 
      // else {

      //   await axios.delete(
      //     `https://api.nithyaevent.com/api/wishlist/remove-wishlist-list/${wishlistId._id}`
      //   );


      //   setWishlist((prev) => prev.filter((id) => id !== item._id));
      //   setModalType("success");
      //   setModalMessage("The product has been successfully deleted from your wishlist.");
      //   setOpen(true);
      //   setTimeout(() => {
      //     setOpen(false);
      //   }, 1800);
      // }
    } 
    catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
    
      if (error.response && error.response.data?.message) {
        errorMessage = error.response.data.message.includes("Product already exists")
          ? "This product is already in your wishlist!"
          : `Error: ${error.response.data.message}`;
    
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
    
        return;  
      }
    

      toast.error("Failed to add item to cart. Try again!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };


  return (
    <Box sx={{ padding: "6rem" }}>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",

        }}
      >
        <Typography sx={{ fontWeight: "bold", color: "#343a40", textTransform: 'uppercase', fontSize: '1.5rem' }}>
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
                <Button
                  onClick={(e) => {
                    // e.stopPropagation();
                    handleWishlistClick(item);
                  }}
                  sx={{ color: "#c026d3", position: 'relative' }}
                >
                  {wishlist.includes(item._id) ? (



                    <FavoriteOutlinedIcon style={{ position: 'absolute' }} />

                  ) : (
                    <FavoriteBorderIcon style={{ position: 'absolute' }} />
                  )}
                </Button>
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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <ModalItem modalMessage={modalMessage} modalType={modalType} />
      </Modal>
    </Box>
  );
};

export default Featured;
