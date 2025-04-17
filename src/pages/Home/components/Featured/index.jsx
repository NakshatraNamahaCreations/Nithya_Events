import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  Modal,
} from "@mui/material";
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
import { getErrorMessage } from "../../../../utils/helperFunc";

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
    try {
      const res = await authService.featuredProducts();
      setFeaturedProduct(res.data.data);
    } catch (error) {
      getErrorMessage(error);
    }
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
    // if (!userId) {
    // toast.error("You need to login", {
    //   position: "top-right",
    //   autoClose: 2000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    // });
    //   dispatch(setLoading(false));
    //   return;
    // }
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
      console.error(
        "API Error:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleWishlistClick = async (item) => {
    const isInWishlist = wishlist.includes(item._id);
    if (!userId) {
      toast.error("You need to login", {
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
    const wishlistId = productList.find((w) => w.product_id === item._id);
    if (isInWishlist) {
      toast.error("This item is already in your wishlist!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
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
          user_id: userId,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setWishlist((prev) => [...prev, item._id]);
      toast.success("Item added to Wishlist!", {
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
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response && error.response.data?.message) {
        errorMessage = error.response.data.message.includes(
          "Product already exists"
        )
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
      src={item.product_image[0]}
      alt={item.product_name}
      sx={{
        width: "100%",
        height: "260px",
        objectFit: "contain",
      }}
      onClick={() => handleProductClick(item._id)}
    />
    <CardContent sx={{ padding: "1.8rem" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1.2rem",
            color: "#111827",
            flexGrow: 1,
          }}
        >
          {item.product_name.length > 18
            ? item.product_name.slice(0, 18) + "..."
            : item.product_name}
        </Typography>
        <IconButton onClick={() => handleWishlistClick(item)} sx={{ padding: 0 }}>
          {wishlist.includes(item._id) ? (
            <FavoriteOutlinedIcon sx={{ color: "#c026d3" }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "#c026d3" }} />
          )}
        </IconButton>
      </Box>
  
      <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem", mt: 1 }}>
        <StarRating rating={parseFloat(calculateAverageRating(item.Reviews))} />
        <Typography sx={{ fontSize: "0.9rem", color: "#6b7280" }}>
          {item.Reviews.length || 0} Reviews
        </Typography>
      </Box>
  
      <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", mt: 1.5 }}>
        <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#111827" }}>
          ₹{item.product_price}
        </Typography>
        {item.discount < item.product_price && (
          <Typography
            sx={{
              textDecoration: "line-through",
              color: "#ef4444",
              fontSize: "1rem",
            }}
          >
            ₹{item.mrp_rate || "2500"}
          </Typography>
        )}
        <Typography sx={{ color: "#ef4444", fontWeight: 500, fontSize: "0.9rem" }}>
          Per day
        </Typography>
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
