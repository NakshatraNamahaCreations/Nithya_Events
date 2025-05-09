// React and react related imports
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { replace, useNavigate, useParams } from "react-router-dom";

// Third party library
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Modal,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";

// Assests
import ProfileImg1 from "../../../assets/profileImg1.jpg";
// import Replace from "../../../assets/replace.png";
// import Cod from "../../../assets/cod.png";
// import Shipping from "../../../assets/shipping.png";
// import Badge from "../../../assets/badge.png";
// import Lock from "../../../assets/lock.png";
// import Rupees from "../../../assets/rupee.png";

// Custom Components
import { addToCart } from "../../../redux/slice/CartSlice";
import authService from "../../../api/ApiService";
import { setLoading } from "../../../redux/slice/LoaderSlice";
import { getErrorMessage } from "../../../utils/helperFunc";
import Review from "./components/Review";
import Technician from "./components/Technician";
import ImageSlider from "./components/SliderImage";
import { addTechnician } from "../../../redux/slice/technicianSlice";

// styles
import "./styles.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Coupon from "./components/Coupon";
import StarRating from "../../../components/StarRating";
import axios from "axios";
import ModalItem from "./components/Modal";

const SingleProducts = () => {
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [technicianModalOpen, setTechnicianModalOpenOpen] = useState(false);
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [showProduct, setShowProduct] = useState(false);
  const [productId, setProductId] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [open, setOpen] = useState(false);
  const [successType, setSuccessType] = useState("");
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { startDate, endDate, numberOfDays } = useSelector(
    (state) => state.date
  );
  const [wishlist, setWishlist] = useState([]);

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

  const fetchSingleProduct = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.singleProduct(params.id);
      setProduct(res.data.product);
      setProductId(res.data.product._id);
      setShowProduct(true);
      if (res.data.product.product_category) {
        relatedProducts(res.data.product.product_category);
      }
      dispatch(setLoading(false));
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const relatedProducts = async (category) => {
    try {
      dispatch(setLoading(true));
      const res = await authService.relatedRentalProduct(category);
      const filteredProducts = res.data.data
        .filter(
          (item) => item.product_category === category && item._id !== params.id
        )
        .slice(0, 4);

      setRelatedProduct(filteredProducts);

      dispatch(setLoading(false));
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      dispatch(setLoading(true));
      const res = await authService.reviewProduct(reviewData, productId);

      dispatch(setLoading(false));
    } catch (error) {
      getErrorMessage(error);
    }
  };

  useEffect(() => {
    if (product.product_category && productId) {
      relatedProducts(product.product_category);
    }
  }, [product.product_category, productId]);

  useEffect(() => {
    fetchSingleProduct();
  }, [params.id]);

  useEffect(() => {
    if (product.product_image && product.product_image.length > 0) {
      setMainImage(product.product_image[0]);
    }
  }, [product.product_image]);

  const handleAddTechnician = (technician) => {
    const updatedTechnicians = [...technicians, technician];
    setTechnicians(updatedTechnicians);
    setTechnicianModalOpen(false);
    setSuccessModalOpen(true);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
  };
  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  let TimeoutId;

  const handleAddToCart = async () => {
    try {
      setBottomDrawerOpen(true);

      const res = await authService.getAllTechnicians();

      const filteredTechnicians = res.data.tech.filter(
        (tech) => tech.category === product.product_category
      );

      setTechnicians(filteredTechnicians);
    } catch (error) {
      getErrorMessage(error);
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

  const handleContinue = () => {
    // if (!userId) {
    //   toast.error("You need to log in to add items to the cart!", {
    //     position: "top-right",
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });

    //   Redirect user to login page
    //   navigate("/login", { state: { from: location.pathname } });
    //   return;
    // }

    if (product) {
      dispatch(
        addToCart({
          orderId: Date.now().toString(),
          id: product._id,
          productName: product.product_name,
          productPrice: product.product_price,
          mrpPrice: product.mrp_rate,
          store: product.shop_name,
          imageUrl: product.product_image,
          productDimension: product.product_dimension || "Not Specified",
          totalPrice: product.product_price * quantity,
          quantity: quantity,
          context: "product",
          sellerName: product.vendor_name,
          sellerId: product.vendor_id,
          eventStartDate: startDate,
          eventEndDate: endDate,
          commissionTax: product.commission_tax || 0,
          commissionPercentage: product.commission_percentage || 0,
        })
      );
    }

    if (technicians && technicians.length > 0) {
      technicians.forEach((technician) => {
        dispatch(
          addTechnician({
            orderId: Date.now().toString(),
            id: technician._id,
            product_image: technician.image || ProfileImg1,
            category: technician.category,
            price: technician.price,
            service_name: technician.service_name,
            shop_name: technician.shop_name,
            vendor_id: technician.vendor_id,
            vendor_name: technician.vendor_name,
            eventStartDate: startDate,
            eventEndDate: endDate,
            quantity: 1,
            totalPrice: technician.price * 1,
            commission_tax: technician.commission_tax || 0,
            commission_percentage: technician.commission_percentage || 0,
          })
        );
      });
    }
    toast.success("Item added to cart!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // setOpen(true);
    setBottomDrawerOpen(false);
    // setTimeout(() => {
    //   setOpen(false);
    // }, 1500);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // const handleTechnicianSelect = (selectedTechnician) => {
  //   if (technicians.find((tech) => tech._id === selectedTechnician._id)) {
  //     setTechnicians(
  //       technicians.filter((tech) => tech._id !== selectedTechnician._id)
  //     );
  //   } else {
  //     setTechnicians([...technicians, selectedTechnician]);
  //   }
  // };
  const calculateAverageRating = (review) => {
    const total = review.reduce((sum, curr) => sum + curr.ratings, 0);

    return review.length ? (total / review.length).toFixed(1) : 0;
  };
  // const handleCloseTechnicianModal = () => {
  //   setTechnicianModalOpen(false);
  // };

  const handleClose = () => {
    clearTimeout(TimeoutId);
    setOpen(false);
  };

  const handleOpenProduct = (id) => {
    navigate(`/products/${id}`);
    console.log(id);
  };

  const handleClick = async (item) => {
    const isInWishlist = wishlist.some((id) => String(id) === String(item._id));
  
    if (!userId) {
      toast.error("You need to login", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
  
    if (isInWishlist) {
      toast.error("This item is already in your wishlist!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
  
    const payload = {
      product_name: item?.product_name,
      product_id: item?._id,
      product_image: item?.product_image[0],
      product_price: item?.product_price,
      mrp_price: item?.mrp_price,
      discount: item?.discount,
      user_id: userId,
    };
  
    try {
      await axios.post(
        "https://api.nithyaevent.com/api/wishlist/add-wishlist",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      toast.success("Item has been added to the wishlist!", {
        position: "top-right",
        autoClose: 2000,
      });
  
      // ✅ Update wishlist state immediately
      setWishlist((prevWishlist) => [...prevWishlist, item._id]);
  
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
  
      if (error.response && error.response.data?.message) {
        errorMessage = error.response.data.message.includes("Product already exists")
          ? "This product is already in your wishlist!"
          : `Error: ${error.response.data.message}`;
      }
  
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
  
  const fetchWishlist = async () => {
    if (!userId) {
      console.log("No user ID, can't fetch wishlist.");
      return;
    }

    try {
      const res = await axios.get(
        `https://api.nithyaevent.com/api/wishlist/get-my-wishlist/${userId}`,
        { headers: { "Content-Type": "application/json" } }
      );

      // Debug the response
      console.log("Fetched wishlist response:", res);

      if (res.data?.wishlist && Array.isArray(res.data.wishlist)) {
        const wishlistItems = res.data.wishlist.map((item) => item.product_id);
        setWishlist(wishlistItems);
      } else {
        setWishlist([]); 
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      // toast.error("Failed to fetch wishlist. Please try again.");
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
    // const wishlistId = productList.find((w) => w.product_id === item._id);
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

      //      toast.error("Failed to add item to cart. Try again!", {
      //           position: "top-right",
      //           autoClose: 2000,
      //           hideProgressBar: false,
      //           closeOnClick: true,
      //           pauseOnHover: true,
      //           draggable: true,
      //           progress: undefined,
      //         });
      //   // setModalType("success");
      //   // setModalMessage("The product has been successfully deleted from your wishlist.");
      //   // setOpen(true);
      //   // setTimeout(() => {
      //   //   setOpen(false);
      //   // }, 1800);
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
  useEffect(() => {
    if (userId) {

      fetchWishlist(); // Ensure this is being called properly
    }
  }, [userId]); // Make sure this runs when `userId` changes

  return (
    <Box sx={{marginTop:'2rem'}}>
      <ToastContainer />
      {showProduct && (
        <Box className="product-container">
          <Box
            sx={{
              display: "flex",
              marginTop: "2rem",
              gap: "10rem",
              marginLeft: "4rem",
              "@media(max-width:620px)": {
                flexDirection: "column",
                marginLeft: "0rem",
              },
              " @media(max-width:1100px)": {
                gap: "0rem",
                flexDirection: "column",
              },
              "@media(min-width:1800px)": {
                gap: "23rem",
                marginLeft: "26rem",
              },
            }}
          >
            <Box className="product-content">
              <img
                className="image-container-01"
                src={mainImage}
                alt="Main Product Image"
              />
              {/* <Box className="thumbnails-container">
                {product.product_image?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className={`thumbnail ${mainImage === img ? "active" : ""}`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </Box> */}
              <ImageSlider
                productImages={product.product_image || []}
                setMainImage={setMainImage}
                mainImage={mainImage}
                productVideo={product.product_video}
              />
            </Box>
            <Box>
              <Box
                sx={{
                  width: "30rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                  "@media(max-width:620px)": {
                    width: "25rem",
                  },
                }}
              >
                <Box>
                  <Typography variant="p" sx={{ fontSize: "1.4rem" }}>
                    {product.product_name}
                  </Typography>
                  <Typography
                    className="rating"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    {/* <Typography variant="p" sx={{ fontSize: "1rem" }}>
                      Brand: {product.brand}
                    </Typography> */}
                  </Typography>
                </Box>
                {/* <Box className="Price-point">
                  <Typography sx={{ fontSize: "1.1rem" }}>
                    <strong>RS {product.product_price} / day</strong>
                  </Typography>
                  <Typography className="Offer">
                    {product.discount}% OFF
                  </Typography>
                </Box> */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.7rem",
                    marginTop: "0.3rem",
                  }}
                >
                  <Typography
                    variant="p"
                    sx={{
                      fontWeight: "bold",
                      color: "#000",
                      fontSize: "1.4rem",
                    }}
                  >
                    ₹{product.product_price}
                  </Typography>

                  {product.discount < product.product_price && (
                    <Typography
                      variant="p"
                      sx={{
                        textDecoration: "line-through",
                        color: "red",
                        fontSize: "1.2rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      ₹{product.mrp_rate || "2500"}
                    </Typography>
                  )}
                  <Typography sx={{ color: "red", marginLeft: "-0.2rem" }}>
                    Per day
                  </Typography>
                </Box>
                <Box className="Rating-point">
                  {/* <Typography variant="p" className="Rating-container">
                    {product.Reviews?.length > 0
                      ? (
                        product.Reviews.reduce(
                          (acc, review) => acc + review.ratings,
                          0
                        ) / product.Reviews.length
                      ).toFixed(1)
                      : 0}{" "}
                    
                  </Typography> */}

                  {/* <Typography className="Rating-num">
                    {product.Reviews?.length || 0} Rating
                    {product.Reviews?.length === 1 ? "" : "s"}
                  </Typography> */}
                  <Box
                    sx={{ display: "flex", gap: "1rem", marginTop: "0.2rem" }}
                  >
                    <StarRating
                      rating={parseFloat(
                        calculateAverageRating(product.Reviews)
                      )}
                      // style={{ marginRight: '2rem' }}
                    />
                    <Typography variant="p" style={{ fontSize: "0.8rem" }}>
                      {product.Reviews.length > 0 ? product.Reviews.length : 0}{" "}
                      Reviews
                      {/* {item.Reviews && item.Reviews.length > 0
                      ? calculateAverageRating(item.Reviews)
                      : "No Ratings"} */}
                    </Typography>
                  </Box>
                </Box>
                {/* <Divider sx={{ width: "50rem", marginBottom: "0.8rem" }} /> */}
                {/* <Box className="Product-descriptions">
                  <Box className="Product-desc-header">
                    <CheckCircleIcon
                      sx={{ color: "#4caf50", fontSize: "24px" }}
                    />
                    <Typography
                      variant="p"
                      sx={{ fontWeight: "600", fontSize: "1.1rem" }}
                    >
                      Availability Details
                    </Typography>
                  </Box>
                  <Box className="product-desc-content">
                    <Typography variant="p">
                      {" "}
                      The Current Available Products are {
                        product.stock_in_hand
                      }{" "}
                      Units
                    </Typography>
                  </Box>
                </Box> */}
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Typography variant="p">Quantity:</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "0px 8px",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={handleDecrease}
                      disabled={quantity === 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography
                      variant="h6"
                      sx={{ margin: "0 10px", fontSize: "0.8rem" }}
                    >
                      {quantity}
                    </Typography>
                    <IconButton size="small" onClick={handleIncrease}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
              {/* <Box className="product-features">
                {/* <Box className="feature">
                  <img src={Shipping} alt="Free Delivery" />
                  <Typography variant="p" className="feature-contents">
                    Free Delivery
                  </Typography>
                </Box> */}
              {/* <Box className="feature">
                  <img src={Replace} alt="3 Days Replacement" />
                  <Typography variant="p" className="feature-contents">
                    3 Days Replacement
                  </Typography>
                </Box> */}
              {/* <Box className="feature">
                  <img src={Shipping} alt="Fast Delivery" />
                  <Typography variant="p" className="feature-contents">
                    Fast Delivery
                  </Typography>
                </Box>
                <Box className="feature">
                  <img src={Cod} alt="Cash on Delivery" />
                  <Typography variant="p" className="feature-contents">
                    Cash/Pay on Delivery
                  </Typography>
                </Box>
                <Box className="feature">
                  <img src={Badge} alt="Top Brand" />
                  <Typography variant="p" className="feature-contents">
                    Top Brand
                  </Typography>
                </Box>
                <Box className="feature">
                  <img src={Lock} alt="Secure Transaction" />
                  <Typography variant="p" className="feature-contents">
                    Secure Transaction
                  </Typography>
                </Box> */}
              {/* </Box> */}

              {/* Coupons */}

              <Coupon />

              <Box
                sx={{ display: "flex", justifyContent: "center", gap: "1rem", alignItems:"baseline" }}
              >
                <Button
                  color="white"
                  sx={{ backgroundColor: "#c026d3", color: "white" }}
                  className="addToCart"
                  onClick={handleAddToCart}
                >
                  <ShoppingBagOutlinedIcon sx={{ marginRight: "8px" }} />
                  Add to Cart
                </Button>
                {wishlist.some((id) => String(id) === String(product._id)) ? (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/wishlist")}
                    // height: 37px;
                    // margin-top: 2rem;
                    // width: 18rem;
                    sx={{ fontWeight: "bold", height:'37px', marginTop:'2rem', width:"18rem" }}
                  >
                    <FavoriteOutlinedIcon sx={{ marginRight: "8px" }} />
                    View Wishlist
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="red"
                    className="addToWishlist"
                    onClick={() => handleClick(product)}
                  >
                    <FavoriteBorderOutlinedIcon sx={{ marginRight: "8px" }} />
                    Add to Wishlist
                  </Button>
                )}
              </Box>
            </Box>
          </Box>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            className="tabs-container"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              color: "red",
              background:
                "linear-gradient(rgb(255, 255, 255), rgb(245 232 247))",
              padding: "0.8rem 5rem",

              "& .MuiTabs-indicator": {
                backgroundColor: "#c026d3",
              },
              "& .MuiTab-root": {
                color: "#9c27b0",
                textTransform: "none",
                fontWeight: "bold",
              },
              "& .Mui-selected": {
                color: "#c026d3",
              },
            }}
          >
            <Tab label="Product Details" />
            {/* <Tab label="About" /> */}
            <Tab label="Reviews" />
          </Tabs>

          <Box
            className="tab-content"
            sx={{ padding: "0rem 7rem", gap: "30rem" }}
          >
            {/* {activeTab === 0 && (
              <Box className="about-section">
                <Box className="specification-detail-container">
                  <Typography
                    variant="h6"
                    className="specification-detail-heading"
                  >
                    About this item
                  </Typography>
                  <Box className="specification-detail">
                    <ul>
                      <li>
                        This product comes from {product.brand}, a trusted name
                        known for high-quality standards and durability.
                      </li>
                      <li>
                        Designed for {product.product_category}, this item is
                        perfect for those looking for reliable and efficient
                        performance in its category.
                      </li>
                      <li>
                        With dimensions of {product.product_dimension}, it’s
                        designed to be space-efficient and portable, weighing
                        only {product.product_weight} kg
                      </li>
                      <li>
                        Crafted from {product.material_type}, this product
                        ensures long-lasting durability and resilience.
                      </li>
                      <li>
                        Proudly made in {product.country_of_orgin}, this product
                        meets global standards of quality and performance.
                      </li>
                      <li>
                        We currently have {product.stock_in_hand} units in
                        stock, so grab yours before it's gone!
                      </li>
                    </ul>
                  </Box>
                </Box>
              </Box>
            )} */}

            {activeTab === 0 && (
              <Box sx={{ display: "flex", gap: "3rem" }}>
                <Box className="Product-detail-container">
                  <Typography
                    variant="p"
                    sx={{ fontWeight: "600" }}
                    className="Product-detail-heading"
                  >
                    Product Details
                  </Typography>
                  <Box className="Product-detail">
                    <Box className="tab1-content">
                      <Typography variant="p">Brand:</Typography>
                      <Typography variant="p">Category:</Typography>
                      <Typography variant="p">Model Name:</Typography>
                      <Typography variant="p">Product Dimensions:</Typography>
                      <Typography variant="p">Item Weight:</Typography>
                      <Typography variant="p">Material Type:</Typography>
                    </Box>
                    <Box className="tab2-content">
                      <Typography variant="p">{product.brand}</Typography>
                      <Typography variant="p">
                        {product.product_category}
                      </Typography>
                      <Typography variant="p">{product.model_name}</Typography>
                      <Typography variant="p">
                        {product.product_dimension}
                      </Typography>
                      <Typography variant="p">
                        {product.product_weight}
                      </Typography>
                      <Typography variant="p">
                        {product.material_type}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className="Spec-container">
                  <Typography
                    variant="p"
                    sx={{ fontWeight: "600" }}
                    className="Spec-detail-heading"
                  >
                    Other Details
                  </Typography>
                  <Box className="Spec-detail">
                    <Box className="tab1-content">
                      <Typography variant="p">Manufacturer:</Typography>
                      <Typography variant="p">Color:</Typography>
                      <Typography variant="p">Product Type:</Typography>
                      <Typography variant="p">Shop Name:</Typography>
                      <Typography variant="p">vendor Name:</Typography>
                      <Typography variant="p">Stock In Hand:</Typography>
                      <Typography variant="p">Country of origin:</Typography>
                    </Box>
                    <Box className="tab2-content">
                      <Typography variant="p">
                        {product.manufacturer_name}
                      </Typography>
                      <Typography variant="p">
                        {product.product_color}
                      </Typography>
                      <Typography variant="p">
                        {product.product_type}
                      </Typography>
                      <Typography variant="p">{product.modelName}</Typography>
                      <Typography variant="p">{product.shop_name}</Typography>
                      <Typography variant="p">{product.vendor_name}</Typography>
                      <Typography variant="p">
                        {product.stock_in_hand}
                      </Typography>
                      <Typography variant="p">
                        {product.country_of_orgin}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Review
                  onSubmit={handleReviewSubmit}
                  productId={productId}
                  userId={userId}
                />
              </Box>
            )}
          </Box>
          <Box className="related-products">
            <Typography variant="h4">Related Products</Typography>
            <Box className="related-product-container">
              {relatedProduct?.map((item) => (
                <Box key={item._id} onClick={() => handleOpenProduct(item._id)}>
                  <img
                    className="related-product-image"
                    src={item.product_image}
                    alt="Not Found"
                  />
                  {/* <Box className="related-product-content">
                    <Box className="">{item.product_name}</Box>
                    <Box className="">
                      <img
                        src={Rupees}
                        style={{ width: "13px" }}
                        alt="Not Found"
                      />{" "}
                      {item.product_price} /  day
                    </Box>

                    <Typography
                      className="rating"
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      <Box className="Rating-point">
                        <Typography variant="p" className="Rating-container">
                          {product.Reviews?.length > 0
                            ? (
                              product.Reviews.reduce(
                                (acc, review) => acc + review.ratings,
                                0
                              ) / product.Reviews.length
                            ).toFixed(1)
                            : 0}{" "}
                          ⭐
                        </Typography>

                        <Typography className="Rating-num">
                          {product.Reviews?.length || 0} Rating
                          {product.Reviews?.length === 1 ? "" : "s"}
                        </Typography>
                      </Box>
                    </Typography>
                  </Box> */}{" "}
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        color: "#343a40",
                      }}
                    >
                      {item.product_name.length > 15
                        ? item.product_name.slice(0, 15) + "..."
                        : item.product_name}
                    </Typography>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistClick(item);
                      }}
                      sx={{ color: "#c026d3", position: "relative" }}
                    >
                      {wishlist.includes(item._id) ? (
                        <FavoriteOutlinedIcon
                          style={{ position: "absolute" }}
                        />
                      ) : (
                        <FavoriteBorderIcon style={{ position: "absolute" }} />
                      )}
                    </Button>
                  </Box>
                  {/* <Typography
                    variant="p"
                    sx={{
                      color: "#6c757d",
                    }}
                  >
                    {item.brand}
                  </Typography> */}
                  <Box
                    sx={{ display: "flex", gap: "1rem", marginTop: "0.2rem" }}
                  >
                    <StarRating
                      rating={parseFloat(calculateAverageRating(item.Reviews))}
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
                      marginTop: "0.3rem",
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
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        ₹{item.mrp_rate || "2500"}
                      </Typography>
                    )}
                    <Typography sx={{ color: "red", marginLeft: "-0.2rem" }}>
                      Per day
                    </Typography>
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
                </Box>
              ))}
            </Box>
          </Box>

          <Drawer
            anchor="bottom"
            open={bottomDrawerOpen}
            onClose={() => setBottomDrawerOpen(false)}
          >
            <Box
              sx={{
                width: "100%",
                maxHeight: "80vh",
                overflowY: "auto",
                padding: "1.5rem",
                bgcolor: "background.paper",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                boxShadow: 24,
              }}
            >
              {/* Close Button */}
              <IconButton
                sx={{ position: "absolute", right: 10, top: 10 }}
                onClick={() => setBottomDrawerOpen(false)}
              >
                {/* <CloseIcon /> */}
              </IconButton>

              {/* Modal Title */}
              <Typography variant="h6" textAlign="center" gutterBottom>
                Select a Technician
              </Typography>

              {/* Technician List */}
              <Technician
                selectedTechnicians={technicians}
                setSelectedTechnicians={setTechnicians}
                onSelectTechnician={setTechnicians}
                productCategory={product.product_category}
              />

              {/* Continue Button */}
              <Box textAlign="center" mt={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          </Drawer>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <ModalItem modalMessage={modalMessage} modalType={modalType} />
          </Modal>
        </Box>
      )}
    </Box>
  );
};

export default SingleProducts;
