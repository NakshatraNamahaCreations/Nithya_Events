// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Button,
//   MenuItem,
//   Select,
//   FormControl,
//   IconButton,
//   Collapse,
//   FormControlLabel,
//   Checkbox,
//   Modal,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
// import authService from "../../api/ApiService";
// import { getErrorMessage } from "../../utils/helperFunc";
// import { useDispatch, useSelector } from "react-redux";
// import { setLoading } from "../../redux/slice/LoaderSlice";
// import Slider from "../../components/Sliders";
// import BreadCrumb from "../../components/BreadCrumb";
// import StarRating from "../../components/StarRating";
// import Pagination from "../../components/Pagination";
// import DiscountSlider from "./components/DiscountSlider";
// import axios from "axios";
// import ModalItem from "./SingleProducts/components/Modal";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./styles.scss";

// const Products = () => {
//   const { category } = useParams();
//   const [products, setProducts] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [categories] = useState([
//     "All",
//     "Sound",
//     "Lighting",
//     "Genset",
//     "Video",
//     "Fabrication",
//     "Shamiana",
//   ]);
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [sortOption, setSortOption] = useState("default");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedPriceRange, setSelectedPriceRange] = useState([0, 50000]);
//   const [currentPage, setCurrentPage] = useState(1);

//   // ✅ Show 8 products per page, as requested
//   const itemsPerPage = 9;

//   const [wishlist, setWishlist] = useState([]);
//   const [productList, setProductList] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [modalType, setModalType] = useState("success");
//   const [modalMessage, setModalMessage] = useState("");
//   const [openSections, setOpenSections] = useState({
//     categories: true,
//     priceRange: false,
//     availability: false,
//   });
//   const [lowStockChecked, setLowStockChecked] = useState(false);
//   const [highStockChecked, setHighStockChecked] = useState(false);
//   const [animate, setAnimate] = useState(null);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const { numberOfDays } = useSelector((state) => state.date);

//   const userDetail = sessionStorage.getItem("userDetails");
//   let userId = null;
//   if (userDetail) {
//     try {
//       const userDetails = JSON.parse(userDetail);
//       userId = userDetails?._id || null;
//     } catch (error) {
//       console.error("Error parsing userDetails from sessionStorage:", error);
//     }
//   }

//   const toggleSection = (section) => {
//     setOpenSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const fetchProducts = async () => {
//     dispatch(setLoading(true));
//     try {
//       const res = await authService.rentalProduct();
//       console.log("yogi", res.data);
//       setProducts(res.data.data);
//       setFilteredItems(res.data.data);
//       dispatch(setLoading(false));
//     } catch (error) {
//       dispatch(setLoading(false));
//       getErrorMessage(error);
//     }
//   };

//   const fetchWishlist = async () => {
//     if (!userId) {
//       setWishlist([]);
//       return;
//     }
//     try {
//       const res = await axios.get(
//         `https://api.nithyaevent.com/api/wishlist/get-my-wishlist/${userId}`,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       if (res.data?.wishlist && Array.isArray(res.data.wishlist)) {
//         const wishlistItems = res.data.wishlist.map((item) => item.product_id);
//         setWishlist(wishlistItems);
//         setProductList(res.data.wishlist);
//       } else {
//         setWishlist([]);
//         setProductList([]);
//       }
//     } catch (error) {
//       console.error("Wishlist fetch error:", error);
//       setWishlist([]);
//       setProductList([]);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     fetchWishlist();
//   }, [userId]);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const search = params.get("search") || "";
//     setSearchQuery(search);
//   }, [location.search]);

//   // Add this useEffect to debug categories
//   useEffect(() => {
//     if (products.length > 0) {
//       const availableCategories = [
//         ...new Set(products.map((item) => item.product_category)),
//       ];
//       console.log("Available categories in data:", availableCategories);
//       console.log("Active category:", activeCategory);
//     }
//   }, [products, activeCategory]);

//   // Filtering & side effects
//   useEffect(() => {
//     let filtered = [...products];

//     console.log("activeCategory:", activeCategory);

//     // ✅ Category
//     if (activeCategory !== "All") {
//       filtered = filtered.filter((item) => {
//         const itemCategory = item.product_category?.trim().toLowerCase();
//         const activeCat = activeCategory.trim().toLowerCase();
//         return itemCategory === activeCat;
//       });
//     }

//     // ✅ Number of days filter (only if numberOfDays > 0)
//     if (numberOfDays && numberOfDays > 0 && activeCategory !== "All") {
//       filtered = filtered.filter((item) => item.stock_in_hand >= numberOfDays);
//     }

//     // ✅ Price range (only if valid numeric values)
//     if (
//       selectedPriceRange &&
//       selectedPriceRange.length === 2 &&
//       !isNaN(selectedPriceRange[0]) &&
//       !isNaN(selectedPriceRange[1])
//     ) {
//       filtered = filtered.filter((item) => {
//         const price = parseFloat(item.product_price);
//         return (
//           !isNaN(price) &&
//           price >= selectedPriceRange[0] &&
//           price <= selectedPriceRange[1]
//         );
//       });
//     }

//     // ✅ Search
//     if (searchQuery?.trim()) {
//       filtered = filtered.filter((item) =>
//         item.product_name
//           ?.toLowerCase()
//           .includes(searchQuery.toLowerCase().trim())
//       );
//     }

//     // ✅ Stock conditions (mutually exclusive)
//     if (lowStockChecked && !highStockChecked) {
//       filtered = filtered.filter((item) => item.stock_in_hand < 50);
//     } else if (highStockChecked && !lowStockChecked) {
//       filtered = filtered.filter((item) => item.stock_in_hand >= 50);
//     }

//     // ✅ Sorting
//     let sorted = [...filtered];
//     if (sortOption === "priceLowToHigh") {
//       sorted.sort(
//         (a, b) => parseFloat(a.product_price) - parseFloat(b.product_price)
//       );
//     } else if (sortOption === "priceHighToLow") {
//       sorted.sort(
//         (a, b) => parseFloat(b.product_price) - parseFloat(a.product_price)
//       );
//     } else if (sortOption === "newest") {
//       sorted = sorted.reverse();
//     }

//     console.log("Final Filtered Count:", sorted.length);
//     setFilteredItems(sorted);
//     setCurrentPage(1);
//   }, [
//     products,
//     activeCategory,
//     numberOfDays,
//     selectedPriceRange,
//     searchQuery,
//     lowStockChecked,
//     highStockChecked,
//     sortOption,
//   ]);

//   console.log({
//     products: products.length,
//     activeCategory,
//     numberOfDays,
//     selectedPriceRange,
//     searchQuery,
//     lowStockChecked,
//     highStockChecked,
//     // filteredCount: filtered.length,
//   });

//   const handleWishlistClick = async (item) => {
//     if (!userId) {
//       toast.error("You need to login", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//       return;
//     }

//     const isInWishlist = wishlist.includes(item._id);
//     if (isInWishlist) {
//       toast.error("This item is already in your wishlist!", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//       return;
//     }

//     try {
//       await axios.post(
//         "https://api.nithyaevent.com/api/wishlist/add-wishlist",
//         {
//           product_name: item.product_name,
//           product_id: item._id,
//           product_image: item.product_image[0],
//           product_price: item.product_price,
//           mrp_price: item.mrp_price,
//           discount: item.discount,
//           user_id: userId,
//         },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       setWishlist((prev) => [...prev, item._id]);
//       setAnimate(item._id);
//       toast.success("Item added to wishlist!", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//       setTimeout(() => setAnimate(null), 500);
//     } catch (error) {
//       const msg = error?.response?.data?.message?.includes(
//         "Product already exists"
//       )
//         ? "This product is already in your wishlist!"
//         : "Failed to add item. Try again!";
//       toast.error(msg, { autoClose: 2000 });
//     }
//   };

//   const handleSortChange = (option) => {
//     setSortOption(option);
//   };

//   const getPaginatedData = () => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredItems.slice(startIndex, startIndex + itemsPerPage);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const breadcrumbPaths = [{ label: "Home", link: "/" }, { label: "Products" }];

//   const calculateAverageRating = (reviews = []) => {
//     const total = reviews.reduce((sum, curr) => sum + (curr?.ratings || 0), 0);
//     return reviews.length ? (total / reviews.length).toFixed(1) : 0;
//     // If StarRating expects a number, this is fine even for "0"
//   };

//   return (
//     <>
//       <Slider />
//       <ToastContainer />
//       <BreadCrumb paths={breadcrumbPaths} />

//       <Box className="products-page">
//         {/* Sidebar */}
//         <Box className="filters-sidebar">
//           {/* Categories */}
//           <Box className="filter-group">
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 cursor: "pointer",
//               }}
//               onClick={() => toggleSection("categories")}
//             >
//               <Typography variant="p">Categories</Typography>
//               <IconButton size="small">
//                 {openSections.categories ? (
//                   <ExpandLessIcon />
//                 ) : (
//                   <ExpandMoreIcon />
//                 )}
//               </IconButton>
//             </Box>
//             <Collapse in={openSections.categories}>
//               <Box sx={{ marginTop: "0.5rem" }}>
//                 {categories?.map((category) => (
//                   <FormControlLabel
//                     key={category}
//                     control={
//                       <Checkbox
//                         checked={category === activeCategory}
//                         onChange={() => setActiveCategory(category)}
//                       />
//                     }
//                     label={category}
//                     sx={{ display: "block", color: "#555" }}
//                   />
//                 ))}
//               </Box>
//             </Collapse>
//           </Box>

//           {/* Price Range */}
//           <Box className="filter-group">
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 cursor: "pointer",
//               }}
//               onClick={() => toggleSection("priceRange")}
//             >
//               <Typography variant="subtitle1">Price Range</Typography>
//               <IconButton size="small">
//                 {openSections.priceRange ? (
//                   <ExpandLessIcon />
//                 ) : (
//                   <ExpandMoreIcon />
//                 )}
//               </IconButton>
//             </Box>
//             <Collapse in={openSections.priceRange}>
//               <Box sx={{ marginTop: "0.5rem" }}>
//                 <Box className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
//                   <Typography variant="subtitle1" gutterBottom>
//                     ₹{selectedPriceRange[0]} - ₹{selectedPriceRange[1]}
//                   </Typography>
//                   <DiscountSlider
//                     min={0}
//                     max={50000}
//                     step={1000}
//                     value={selectedPriceRange}
//                     onChange={setSelectedPriceRange}
//                     label={"Range"}
//                   />
//                 </Box>
//               </Box>
//             </Collapse>
//           </Box>

//           {/* Availability */}
//           <Box className="filter-group">
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 cursor: "pointer",
//               }}
//               onClick={() => toggleSection("availability")}
//             >
//               <Typography variant="p">Availability</Typography>
//               <IconButton size="small">
//                 {openSections.availability ? (
//                   <ExpandLessIcon />
//                 ) : (
//                   <ExpandMoreIcon />
//                 )}
//               </IconButton>
//             </Box>
//             <Collapse in={openSections.availability}>
//               <Box sx={{ marginTop: "0.5rem", width: "15rem" }}>
//                 <Box className={`filters-sidebar`}>
//                   <FormControlLabel
//                     sx={{ width: "15rem" }}
//                     control={
//                       <Checkbox
//                         checked={lowStockChecked}
//                         onChange={() => setLowStockChecked((v) => !v)}
//                       />
//                     }
//                     label="Quantity less than 50"
//                   />
//                   <FormControlLabel
//                     sx={{ width: "15rem" }}
//                     control={
//                       <Checkbox
//                         checked={highStockChecked}
//                         onChange={() => setHighStockChecked((v) => !v)}
//                       />
//                     }
//                     label="Quantity more than 50"
//                   />
//                 </Box>
//               </Box>
//             </Collapse>
//           </Box>
//         </Box>

//         {/* Main content */}
//         <Box className="main-content">
//           <Box className="sorting-header">
//             <Typography variant="p">
//               Showing {filteredItems?.length} results
//             </Typography>
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "1rem",
//               }}
//             >
//               <FormControl sx={{ minWidth: 220, borderRadius: "10px" }}>
//                 <Select
//                   value={sortOption}
//                   onChange={(e) => handleSortChange(e.target.value)}
//                   displayEmpty
//                   sx={{
//                     borderRadius: "10px",
//                     color: "#000",
//                     fontWeight: "bold",
//                     height: "45px",
//                     border: "1px solid #ddd",
//                   }}
//                 >
//                   <MenuItem value="default">Default</MenuItem>
//                   <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
//                   <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
//                   <MenuItem value="newest">Newest</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>
//           </Box>

//           {/* ✅ Robust responsive grid: won't drop last 2 items */}
//           <Box
//             className="products-grid"
//             sx={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//               gap: "1.5rem",
//               alignItems: "stretch",
//             }}
//           >
//             {getPaginatedData().map((item) => (
//               <Card
//                 key={item._id}
//                 className="product-card"
//                 // onClick={() => navigate(`/products/${item._id}`)}
//                 onClick={() =>
//                   navigate(
//                     `/products/${encodeURIComponent(
//                       item.product_category?.toLowerCase()
//                     )}/${encodeURIComponent(
//                       item.product_name?.toLowerCase().replace(/\s+/g, "-") +
//                         "-rental"
//                     )}`
//                   )
//                 }
//                 sx={{
//                   borderRadius: "12px",
//                   overflow: "hidden",
//                   cursor: "pointer",
//                   transition: "0.3s",
//                   "&:hover": { boxShadow: "0px 4px 20px rgba(0,0,0,0.15)" },
//                   display: "flex",
//                   flexDirection: "column",
//                   height: "100%",
//                   minHeight: "320px",
//                 }}
//               >
//                 <img
//                   src={item.product_image[0]}
//                   alt={item.product_name}
//                   style={{
//                     width: "100%",
//                     height: "180px",
//                     objectFit: "contain",
//                     backgroundColor: "#fafafa",
//                   }}
//                 />

//                 <CardContent
//                   sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
//                 >
//                   <Box
//                     sx={{ display: "flex", justifyContent: "space-between" }}
//                   >
//                     <Typography
//                       variant="h6"
//                       sx={{
//                         fontWeight: "bold",
//                         fontSize: "1rem",
//                         color: "#343a40",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         whiteSpace: "nowrap",
//                         maxWidth: "80%",
//                       }}
//                     >
//                       {item.product_name}
//                     </Typography>

//                     <Button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleWishlistClick(item);
//                       }}
//                       sx={{ color: "#c026d3", position: "relative" }}
//                     >
//                       {wishlist.includes(item._id) ? (
//                         <FavoriteOutlinedIcon
//                           className={animate === item._id ? "animate-pop" : ""}
//                           style={{ transition: "transform 0.3s" }}
//                         />
//                       ) : (
//                         <FavoriteBorderIcon
//                           style={{ transition: "transform 0.3s" }}
//                         />
//                       )}
//                     </Button>
//                   </Box>

//                   <Box sx={{ display: "flex", gap: "1rem", mt: 0.5 }}>
//                     <StarRating
//                       rating={parseFloat(
//                         calculateAverageRating(item.Reviews || [])
//                       )}
//                     />
//                     <Typography variant="p" style={{ fontSize: "0.8rem" }}>
//                       {item.Reviews?.length || 0} Reviews
//                     </Typography>
//                   </Box>

//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "0.7rem",
//                       mt: 0.5,
//                     }}
//                   >
//                     <Typography
//                       variant="p"
//                       sx={{
//                         fontWeight: "bold",
//                         color: "#000",
//                         fontSize: "1rem",
//                       }}
//                     >
//                       ₹{item.product_price}
//                     </Typography>

//                     {item.discount < item.product_price && (
//                       <Typography
//                         variant="p"
//                         sx={{
//                           textDecoration: "line-through",
//                           color: "red",
//                           fontSize: "1rem",
//                         }}
//                       >
//                         ₹{item.mrp_rate || "2500"}
//                       </Typography>
//                     )}
//                     <Typography sx={{ color: "red" }}>Per day</Typography>
//                   </Box>
//                 </CardContent>
//               </Card>
//             ))}
//           </Box>

//           {/* ✅ Pagination reflects 8 per page */}
//           <Pagination
//             currentPage={currentPage}
//             totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
//             onPageChange={handlePageChange}
//           />
//         </Box>

//         <Modal
//           open={open}
//           onClose={() => setOpen(false)}
//           aria-labelledby="modal-title"
//           aria-describedby="modal-description"
//         >
//           <ModalItem
//             modalMessage={modalMessage}
//             modalType={modalType}
//             onClose={() => setOpen(false)}
//           />
//         </Modal>
//       </Box>
//     </>
//   );
// };

// export default Products;

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  MenuItem,
  Select,
  FormControl,
  IconButton,
  Collapse,
  FormControlLabel,
  Checkbox,
  Modal,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import authService from "../../api/ApiService";
import { getErrorMessage } from "../../utils/helperFunc";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slice/LoaderSlice";
import Slider from "../../components/Sliders";
import BreadCrumb from "../../components/BreadCrumb";
import StarRating from "../../components/StarRating";
import Pagination from "../../components/Pagination";
import DiscountSlider from "./components/DiscountSlider";
import axios from "axios";
import ModalItem from "./SingleProducts/components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";

const Products = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories] = useState([
    "All",
    "Sound",
    "Lighting",
    "Genset",
    "Video",
    "Fabrication",
    "Shamiana",
  ]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 50000]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  const [wishlist, setWishlist] = useState([]);
  const [productList, setProductList] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");
  const [openSections, setOpenSections] = useState({
    categories: true,
    priceRange: false,
    availability: false,
  });
  const [lowStockChecked, setLowStockChecked] = useState(false);
  const [highStockChecked, setHighStockChecked] = useState(false);
  const [animate, setAnimate] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { numberOfDays } = useSelector((state) => state.date);

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

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const fetchProducts = async () => {
    dispatch(setLoading(true));
    try {
      const res = await authService.rentalProduct();
      console.log("Fetched products:", res.data);
      setProducts(res.data.data);
      setFilteredItems(res.data.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      getErrorMessage(error);
    }
  };

  const fetchWishlist = async () => {
    if (!userId) {
      setWishlist([]);
      return;
    }
    try {
      const res = await axios.get(
        `https://api.nithyaevent.com/api/wishlist/get-my-wishlist/${userId}`,
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data?.wishlist && Array.isArray(res.data.wishlist)) {
        const wishlistItems = res.data.wishlist.map((item) => item.product_id);
        setWishlist(wishlistItems);
        setProductList(res.data.wishlist);
      } else {
        setWishlist([]);
        setProductList([]);
      }
    } catch (error) {
      console.error("Wishlist fetch error:", error);
      setWishlist([]);
      setProductList([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  // Handle URL category parameter
  useEffect(() => {
    if (category) {
      // Handle different URL formats
      const urlCategory = category.toLowerCase();
      console.log("URL Category:", urlCategory);

      if (urlCategory === "all") {
        setActiveCategory("All");
      } else {
        // Map URL category to our category names
        const categoryMap = {
          sound: "Sound",
          lighting: "Lighting",
          genset: "Genset",
          video: "Video",
          fabrication: "Fabrication",
          shamiana: "Shamiana",
        };

        const mappedCategory =
          categoryMap[urlCategory] ||
          urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1);

        console.log("Mapped category:", mappedCategory);
        setActiveCategory(mappedCategory);
      }
    }
  }, [category]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    setSearchQuery(search);
  }, [location.search]);

  // Debug available categories
  useEffect(() => {
    if (products.length > 0) {
      const availableCategories = [
        ...new Set(products.map((item) => item.product_category)),
      ];
      console.log("Available categories in data:", availableCategories);
      console.log("Active category:", activeCategory);

      // Check if active category exists in data (case-insensitive)
      if (activeCategory !== "All") {
        const categoryExists = products.some((item) => {
          const itemCategory = item.product_category?.trim().toLowerCase();
          const activeCat = activeCategory.trim().toLowerCase();
          return itemCategory === activeCat;
        });
        console.log("Category exists in data:", categoryExists);

        if (!categoryExists) {
          console.warn(`Category "${activeCategory}" not found in data`);
        }
      }
    }
  }, [products, activeCategory]);

  // Derive the real price range from the loaded products so the default
  // filter never silently hides products priced above a hard-coded cap.
  const priceBounds = useMemo(() => {
    const prices = products
      .map((item) => parseFloat(item.product_price))
      .filter((n) => !isNaN(n));
    const maxPrice = prices.length ? Math.max(...prices) : 50000;
    // round up to the nearest 1000, and keep at least the old 50000 span
    return [0, Math.max(50000, Math.ceil(maxPrice / 1000) * 1000)];
  }, [products]);

  // Initialise the slider to the full range once, without overriding a
  // selection the user has already made.
  const priceRangeInitialized = useRef(false);
  useEffect(() => {
    if (products.length && !priceRangeInitialized.current) {
      setSelectedPriceRange(priceBounds);
      priceRangeInitialized.current = true;
    }
  }, [products, priceBounds]);

  // Enhanced Filtering & side effects
  useEffect(() => {
    let filtered = [...products];

    // ✅ CATEGORY FILTERING
    if (activeCategory && activeCategory.toLowerCase() !== "all") {
      const selectedCategory = activeCategory.trim().toLowerCase();
      filtered = filtered.filter((item) => {
        const itemCategory = (item.product_category || "").trim().toLowerCase();
        return itemCategory === selectedCategory;
      });
      console.log("filtered data", filtered);
    }

    // ✅ FILTER BY NUMBER OF DAYS
    // if (numberOfDays && numberOfDays > 0) {
    //   filtered = filtered.filter((item) => item.stock_in_hand >= numberOfDays);
    // }

    // ✅ PRICE RANGE
    if (
      selectedPriceRange &&
      selectedPriceRange.length === 2 &&
      !isNaN(selectedPriceRange[0]) &&
      !isNaN(selectedPriceRange[1])
    ) {
      filtered = filtered.filter((item) => {
        const price = parseFloat(item.product_price);
        // Keep items whose price isn't a parseable number instead of
        // silently dropping them from the count.
        if (isNaN(price)) return true;
        return price >= selectedPriceRange[0] && price <= selectedPriceRange[1];
      });
    }

    // ✅ SEARCH FILTER
    if (searchQuery?.trim()) {
      filtered = filtered.filter((item) =>
        item.product_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase().trim())
      );
    }

    // ✅ STOCK LEVEL FILTER
    if (lowStockChecked && !highStockChecked) {
      filtered = filtered.filter((item) => item.stock_in_hand < 50);
    } else if (highStockChecked && !lowStockChecked) {
      filtered = filtered.filter((item) => item.stock_in_hand >= 50);
    }

    // ✅ SORTING
    let sorted = [...filtered];
    if (sortOption === "priceLowToHigh") {
      sorted.sort(
        (a, b) => parseFloat(a.product_price) - parseFloat(b.product_price)
      );
    } else if (sortOption === "priceHighToLow") {
      sorted.sort(
        (a, b) => parseFloat(b.product_price) - parseFloat(a.product_price)
      );
    } else if (sortOption === "newest") {
      sorted = sorted.reverse();
    }

    // ✅ SET FILTERED ITEMS
    setFilteredItems(sorted);
    setCurrentPage(1);
  }, [
    products,
    activeCategory,
    numberOfDays,
    selectedPriceRange,
    searchQuery,
    lowStockChecked,
    highStockChecked,
    sortOption,
  ]);

  const handleWishlistClick = async (item) => {
    if (!userId) {
      toast.error("You need to login", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const isInWishlist = wishlist.includes(item._id);
    if (isInWishlist) {
      toast.error("This item is already in your wishlist!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
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
      setAnimate(item._id);
      toast.success("Item added to wishlist!", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => setAnimate(null), 500);
    } catch (error) {
      const msg = error?.response?.data?.message?.includes(
        "Product already exists"
      )
        ? "This product is already in your wishlist!"
        : "Failed to add item. Try again!";
      toast.error(msg, { autoClose: 2000 });
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Update breadcrumb to show active category
  const breadcrumbPaths = [
    { label: "Home", link: "/" },
    { label: "Products" },
    ...(activeCategory !== "All" ? [{ label: activeCategory }] : []),
  ];

  const calculateAverageRating = (reviews = []) => {
    const total = reviews.reduce((sum, curr) => sum + (curr?.ratings || 0), 0);
    return reviews.length ? (total / reviews.length).toFixed(1) : 0;
  };

  // Show message when no products found
  const NoProductsMessage = () => (
    <Box
      sx={{
        gridColumn: "1 / -1",
        textAlign: "center",
        padding: "3rem",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Typography variant="h5" color="textSecondary" gutterBottom>
        No products found
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {activeCategory !== "All"
          ? `No products found in the "${activeCategory}" category. Try selecting a different category.`
          : "No products match your current filters. Try adjusting your search criteria."}
      </Typography>
      {activeCategory !== "All" && (
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setActiveCategory("All")}
        >
          Show All Products
        </Button>
      )}
    </Box>
  );

  return (
    <>
      <Slider />
      <ToastContainer />
      <BreadCrumb paths={breadcrumbPaths} />

      <Box className="products-page">
        {/* Sidebar */}
        <Box className="filters-sidebar">
          {/* Categories */}
          <Box className="filter-group">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => toggleSection("categories")}
            >
              <Typography variant="p">Categories</Typography>
              <IconButton size="small">
                {openSections.categories ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </Box>
            <Collapse in={openSections.categories}>
              <Box sx={{ marginTop: "0.5rem" }}>
                {categories?.map((category) => (
                  <FormControlLabel
                    key={category}
                    control={
                      <Checkbox
                        checked={category === activeCategory}
                        onChange={() => setActiveCategory(category)}
                      />
                    }
                    label={category}
                    sx={{ display: "block", color: "#555" }}
                  />
                ))}
              </Box>
            </Collapse>
          </Box>

          {/* Price Range */}
          <Box className="filter-group">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => toggleSection("priceRange")}
            >
              <Typography variant="subtitle1">Price Range</Typography>
              <IconButton size="small">
                {openSections.priceRange ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </Box>
            <Collapse in={openSections.priceRange}>
              <Box sx={{ marginTop: "0.5rem" }}>
                <Box className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
                  <Typography variant="subtitle1" gutterBottom>
                    ₹{selectedPriceRange[0]} - ₹{selectedPriceRange[1]}
                  </Typography>
                  <DiscountSlider
                    min={0}
                    max={priceBounds[1]}
                    step={1000}
                    value={selectedPriceRange}
                    onChange={setSelectedPriceRange}
                    label={"Range"}
                  />
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* Availability */}
          <Box className="filter-group">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => toggleSection("availability")}
            >
              <Typography variant="p">Availability</Typography>
              <IconButton size="small">
                {openSections.availability ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </Box>
            <Collapse in={openSections.availability}>
              <Box sx={{ marginTop: "0.5rem", width: "15rem" }}>
                <Box className={`filters-sidebar`}>
                  <FormControlLabel
                    sx={{ width: "15rem" }}
                    control={
                      <Checkbox
                        checked={lowStockChecked}
                        onChange={() => setLowStockChecked((v) => !v)}
                      />
                    }
                    label="Quantity less than 50"
                  />
                  <FormControlLabel
                    sx={{ width: "15rem" }}
                    control={
                      <Checkbox
                        checked={highStockChecked}
                        onChange={() => setHighStockChecked((v) => !v)}
                      />
                    }
                    label="Quantity more than 50"
                  />
                </Box>
              </Box>
            </Collapse>
          </Box>
        </Box>

        {/* Main content */}
        <Box className="main-content">
          <Box className="sorting-header">
            <Typography variant="p">
              Showing {filteredItems?.length} results
              {activeCategory !== "All" && ` in ${activeCategory}`}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <FormControl sx={{ minWidth: 220, borderRadius: "10px" }}>
                <Select
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  displayEmpty
                  sx={{
                    borderRadius: "10px",
                    color: "#000",
                    fontWeight: "bold",
                    height: "45px",
                    border: "1px solid #ddd",
                  }}
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
                  <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Products Grid */}
          <Box
            className="products-grid"
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
              alignItems: "stretch",
            }}
          >
            {getPaginatedData().length > 0 ? (
              getPaginatedData().map((item) => (
                <Card
                  key={item._id}
                  className="product-card"
                  onClick={() =>
                    navigate(
                      `/products/${encodeURIComponent(
                        item.product_category?.toLowerCase()
                      )}/${encodeURIComponent(
                        item.product_name?.toLowerCase().replace(/\s+/g, "-") +
                          "-rental"
                      )}`
                    )
                  }
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": { boxShadow: "0px 4px 20px rgba(0,0,0,0.15)" },
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    minHeight: "320px",
                  }}
                >
                  <img
                    src={item.product_image[0]}
                    alt={item.product_name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "contain",
                      backgroundColor: "#fafafa",
                    }}
                  />

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          color: "#343a40",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "80%",
                        }}
                      >
                        {item.product_name}
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
                            className={
                              animate === item._id ? "animate-pop" : ""
                            }
                            style={{ transition: "transform 0.3s" }}
                          />
                        ) : (
                          <FavoriteBorderIcon
                            style={{ transition: "transform 0.3s" }}
                          />
                        )}
                      </Button>
                    </Box>

                    <Box sx={{ display: "flex", gap: "1rem", mt: 0.5 }}>
                      <StarRating
                        rating={parseFloat(
                          calculateAverageRating(item.Reviews || [])
                        )}
                      />
                      <Typography variant="p" style={{ fontSize: "0.8rem" }}>
                        {item.Reviews?.length || 0} Reviews
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.7rem",
                        mt: 0.5,
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
                          }}
                        >
                          ₹{item.mrp_rate || "2500"}
                        </Typography>
                      )}
                      <Typography sx={{ color: "red" }}>Per day</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <NoProductsMessage />
            )}
          </Box>

          {/* Pagination - Only show if there are products */}
          {filteredItems.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredItems.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          )}
        </Box>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <ModalItem
            modalMessage={modalMessage}
            modalType={modalType}
            onClose={() => setOpen(false)}
          />
        </Modal>
      </Box>
    </>
  );
};

export default Products;
