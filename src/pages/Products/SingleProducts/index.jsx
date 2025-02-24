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

// Assests
import Success from "../../../assets/successGif.gif";
import Replace from "../../../assets/replace.png";
import Cod from "../../../assets/cod.png";
import Shipping from "../../../assets/shipping.png";
import Badge from "../../../assets/badge.png";
import Lock from "../../../assets/lock.png";
import Rupees from "../../../assets/rupee.png";

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

const SingleProducts = () => {
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [technicianModalOpen, setTechnicianModalOpen] = useState(false);
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [showProduct, setShowProduct] = useState(false);
  const [productId, setProductId] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { startDate, endDate, numberOfDays } = useSelector(
    (state) => state.date
  );

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
    }
  };
  console.log(product);

  const handleContinue = () => {
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
            service_id: technician._id,
            product_image:
              technician.image ||
              "https://centrechurch.org/wp-content/uploads/2022/03/img-person-placeholder.jpeg",
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

    setOpen(true);
    setBottomDrawerOpen(false);
    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTechnicianSelect = (selectedTechnician) => {
    if (technicians.find((tech) => tech._id === selectedTechnician._id)) {
      setTechnicians(
        technicians.filter((tech) => tech._id !== selectedTechnician._id)
      );
    } else {
      setTechnicians([...technicians, selectedTechnician]);
    }
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

  return (
    <>
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
                <Typography variant="p" sx={{ fontSize: "2rem" }}>
                  {product.product_name}
                </Typography>
                <Typography
                  className="rating"
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                >
                  <Typography variant="p" sx={{ fontSize: "1.2rem" }}>
                    Brand: {product.brand}
                  </Typography>
                </Typography>
                <Box className="Price-point">
                  <Typography sx={{ fontSize: "1.6rem" }}>
                    <strong>RS {product.product_price} / day</strong>
                  </Typography>
                  <Typography className="Offer">
                    {product.discount}% OFF
                  </Typography>
                </Box>
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
                {/* <Divider sx={{ width: "50rem", marginBottom: "0.8rem" }} /> */}
                <Box className="Product-descriptions">
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
                </Box>
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <Typography variant="p">Quantity:</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "5px 10px",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={handleDecrease}
                      disabled={quantity === 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="h6" sx={{ margin: "0 10px" }}>
                      {quantity}
                    </Typography>
                    <IconButton size="small" onClick={handleIncrease}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
              <Box className="product-features">
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
                <Box className="feature">
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
                </Box>
              </Box>
              <Box
                sx={{
                  textAlign: "center",
                  padding: "1.2rem",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  maxWidth: "800px",
                  margin: "auto",
                  border: "2px solid #ff6f61",
                  "@media(min-width:1800px)": {
                    maxWidth: "700px",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <ReplayIcon sx={{ fontSize: "1.2rem", color: "#ff6f61" }} />
                  10 Days Return Policy
                </Typography>
                <Typography
                  variant="p"
                  sx={{
                    color: "#555",
                    maxWidth: "600px",
                    margin: "0 auto",
                    fontSize: "0.8rem",
                    lineHeight: "1.6",
                  }}
                >
                  Enjoy worry-free shopping with our{" "}
                  <strong>10-day return policy</strong>! If you're not
                  completely satisfied, we ensure a{" "}
                  <strong>smooth, quick, and hassle-free return process</strong>{" "}
                  for your convenience.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  color="red"
                  className="addToCart"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </Box>
            </Box>
          </Box>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            className="tabs-container"
            variant={isMobile ? "scrollable" : "standard"} // Scrollable on mobile
            scrollButtons="auto" // Show scroll buttons when needed
            allowScrollButtonsMobile
            centered={!isMobile} // Centers tabs on desktop, but not mobile
            sx={{
              backgroundColor: "#f1f6fc",
              padding: "0.8rem",
              "& .MuiTabs-scroller": { overflowX: "auto !important" }, // Ensures smooth scrolling
            }}
          >
            <Tab label="About" />
            <Tab label="Product Details" />
            <Tab label="Other Details" />
            <Tab label="Reviews" />
          </Tabs>

          <Box className="tab-content" sx={{ padding: "0rem 4rem" }}>
            {activeTab === 0 && (
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
            )}

            {activeTab === 1 && (
              <Box className="Product-detail-container">
                <Typography variant="h6" className="Product-detail-heading">
                  Product Details
                </Typography>
                <Box className="Product-detail">
                  <Box className="tab1-content">
                    <Typography variant="p">Brand:</Typography>
                    <Typography variant="p">Product Category:</Typography>
                    <Typography variant="p">Model Name:</Typography>
                    <Typography variant="p">Product Dimensions:</Typography>
                    <Typography variant="p">Item Weight:</Typography>
                    <Typography variant="p">Material Type:</Typography>
                    <Typography variant="p">Color:</Typography>
                    <Typography variant="p">Warranty Type:</Typography>
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
                    <Typography variant="p">{product.material_type}</Typography>
                    <Typography variant="p">{product.product_color}</Typography>
                    <Typography variant="p">{product.warranty_type}</Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {activeTab === 2 && (
              <Box className="Spec-container">
                <Typography variant="h6" className="Spec-detail-heading">
                  Other Details
                </Typography>
                <Box className="Spec-detail">
                  <Box className="tab1-content">
                    <Typography variant="p">Manufacturer:</Typography>
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
                    <Typography variant="p">{product.product_type}</Typography>
                    <Typography variant="p">{product.modelName}</Typography>
                    <Typography variant="p">{product.shop_name}</Typography>
                    <Typography variant="p">{product.vendor_name}</Typography>
                    <Typography variant="p">{product.stock_in_hand}</Typography>
                    <Typography variant="p">
                      {product.country_of_orgin}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {activeTab === 3 && (
              <Box>
                <Review onSubmit={handleReviewSubmit} productId={productId} />
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
                  <Box className="related-product-content">
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
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* <Modal
            open={technicianModalOpen}
            onClose={handleCloseTechnicianModal}
            aria-labelledby="technician-modal-title"
            aria-describedby="technician-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                right: "2%",
                transform: "translateY(-50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: "8px",
                width: "32rem",
                maxHeight: "100vh",
                overflowY: "auto",
              }}
            >
              <Technician
                onSelectTechnician={handleTechnicianSelect}
                selectedTechnicians={technicians}
                productCategory={product.product_category}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCloseTechnicianModal}
                sx={{ mt: 3 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleContinue}
                sx={{ mt: 3, ml: 2 }}
              >
                Continue
              </Button>
            </Box>
          </Modal> */}
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
            onClose={handleClose}
            aria-labelledby="success-modal-title"
            aria-describedby="success-modal-description"
          >
            <Box
              className="modal-container"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 80,
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e1f4e5",
              }}
            >
              <img src={Success} className="success-image" alt="Success" />
              <Typography id="success-modal-title" variant="h6" component="h2">
                Success!
              </Typography>

              <Typography id="success-modal-description" sx={{ mt: 2 }}>
                The product has been successfully added to your cart.
              </Typography>
              <Button onClick={handleClose} sx={{ mt: 3 }}>
                Close
              </Button>
            </Box>
          </Modal>
        </Box>
      )}
    </>
  );
};

export default SingleProducts;
