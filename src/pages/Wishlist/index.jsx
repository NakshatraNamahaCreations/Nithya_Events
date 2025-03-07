// React Related imports
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Third party library
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Modal,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

// Custom component
import { setLoading } from "../../redux/slice/LoaderSlice";
import authService from "../../api/ApiService";
import { getErrorMessage } from "../../utils/helperFunc";
import ModalItem from "../Products/SingleProducts/components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [successType, setSuccessType] = useState("");
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");
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

  const getWishlist = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(
        `https://api.nithyaevent.com/api/wishlist/get-my-wishlist/${userId}`,
        { headers: { "Content-Type": "application/json" } }
      );
      setWishlistItems(res.data.wishlist);

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
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

        return; // ✅ This stops the second toast from executing
      }

      // This will only run if the first condition is not met
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

  useEffect(() => {
    getWishlist();
  }, []);

  const handleRemoveFromWishlist = async (id) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.delete(
        `https://api.nithyaevent.com/api/wishlist/remove-wishlist-list/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setWishlistItems((prev) => prev.filter((item) => item._id !== id));
      // setModalType("success");
      // setModalMessage("The product has been successfully deleted from your wishlist.");
      // setOpen(true);
      toast.success("The Item has been successfully deleted!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(setLoading(false));
      // setTimeout(() => {
      //   setOpen(false);
      // }, 1800);
    } catch (error) {
      dispatch(setLoading(false));
      getErrorMessage(error);
    }
  };

  const handleAddToCart = (id) => {
    alert("Added to cart");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        padding: "4rem",
      }}
    >
      <ToastContainer />
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", marginBottom: "2rem" }}
      >
        My Wishlist
      </Typography>
      <Box sx={{ maxWidth: "1000px", width: "100%" }}>
        <Grid container spacing={3} justifyContent="center">
          {wishlistItems && wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <Grid item xs={12} md={4} key={item.id}>
                <Card
                  sx={{
                    padding: "1rem",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.02)" },
                    backgroundColor: "#fff",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/products/${item?.product_id}`)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={item.product_image}
                      alt={item.product_name}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "120px",
                        height: "120px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        marginRight: "1rem",
                        backgroundColor: "#fff",
                        padding: "5px",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Product Name */}
                    <Typography
                      variant="p"
                      sx={{ color: "#333" }}
                    >
                      {item.product_name.slice(0, 23)}
                    </Typography>

                    {/* Product Category */}
                    {/* <Typography
                      variant="body2"
                      sx={{ color: "#6c757d", marginBottom: "0.5rem" }}
                    >
                      Category: {item.product_category}
                    </Typography> */}

                    {/* Discount & Pricing */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Typography
                        variant="p"
                        sx={{  color: "#000", fontWeight:'bold' }}
                      >
                        ₹{item.product_price}
                      </Typography>
                      {/* <Typography
                        variant="body2"
                        sx={{
                          textDecoration: "line-through",
                          color: "#b12704",
                          fontSize: "1rem",
                        }}
                      >
                        ₹
                        {(
                          item.product_price /
                          (1 - item.discount / 100)
                        ).toFixed(0)}
                      </Typography> */}
                      {/* <Typography
                        variant="body2"
                        sx={{
                          backgroundColor: "#c026d3",
                          color: "#fff",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {item.discount}% Off
                      </Typography> */}
                    </Box>

                    {/* Buttons - Add to Cart & Remove */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "1rem",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#c026d3",
                          color: "#fff",
                          "&:hover": { backgroundColor: "#e68a00" },
                        }}
                        startIcon={<ShoppingCartIcon />}
                        // onClick={() => handleAddToCart(item.id)}
                        onClick={() => handleRemoveFromWishlist(item._id)}
                      >
                        Remove
                      </Button>
                      {/* <IconButton
                        sx={{ color: "#ff4081", marginLeft: "1rem" }}
                       
                      >
                        <DeleteIcon />
                      </IconButton> */}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography sx={{display:'flex', justifyContent:'center',textAlign:'center', marginTop:'3rem'}}>No items in your wishlist.</Typography>
          )}
        </Grid>
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

export default Wishlist;
