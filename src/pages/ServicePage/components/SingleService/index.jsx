import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  IconButton,
  useMediaQuery,
  useTheme,
  Grid,
  CardContent,
  Card,
  CardMedia,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Star } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import authService from "../../../../api/ApiService";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../../redux/slice/LoaderSlice";
import { addService } from "../../../../redux/slice/serviceSlice";
import ReviewSection from "./components/ReviewSection";

// Local inline placeholder (no network dependency) for missing/broken images.
const NO_IMAGE =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='400'%20height='300'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23eeeeee'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23999999'%20font-family='sans-serif'%20font-size='18'%20text-anchor='middle'%20dominant-baseline='middle'%3ENo%20Image%3C/text%3E%3C/svg%3E";

const SingleService = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [service, setService] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [openBook, setOpenBook] = useState(false);
  const [serviceObj, setServiceObj] = useState(null);
  const [addOnsList, setAddOnsList] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [services, setServices] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { startDate, endDate } = useSelector((state) => state.date);

  // ✅ Fetch Service
  const fetchService = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.getParticularService(id);
      setService(res.data || {});
      if (res.data.shop_image_or_logo)
        setMainImage(res.data.shop_image_or_logo);

      const individualService = await authService.getIndividualService(id);
      const data = Array.isArray(individualService.data.service)
        ? individualService.data.service
        : [];
      setServices(data);
    } catch (error) {
      console.error("Error fetching service:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchAddOnsList = async (vendorId, category) => {
    try {
      if (!vendorId || !category) return;
      const encodedCategory = encodeURIComponent(category);
      const res = await axios.get(
        `https://api.nithyaevent.com/api/addons/get-addons-by-vendorid/?vendor_id=${vendorId}&category=${encodedCategory}`
      );
      setAddOnsList(res.data?.addOns || []);
    } catch (error) {
      console.error("Error fetching add-ons:", error);
      setAddOnsList([]);
    }
  };

  const handleOpenBookDialog = async (serviceItem) => {
    setServiceObj(serviceItem);
    await fetchAddOnsList(service._id, serviceItem.service_subcategory);
    setOpenBook(true);
  };

  const handleCloseBook = () => {
    setOpenBook(false);
    setSelectedAddOns([]);
  };

  const handleCheckboxChange = useCallback((addon) => {
    setSelectedAddOns((prev) =>
      prev.some((i) => i._id === addon._id)
        ? prev.filter((i) => i._id !== addon._id)
        : [...prev, addon]
    );
  }, []);

  const handleAddToCart = async (serviceItem) => {
    try {
      const payload = {
        orderId: Date.now().toString(),
        id: serviceItem._id,
        context: "service",
        productName: serviceItem.service_name,
        productPrice: serviceItem.price,
        imageUrl: serviceItem.additional_images?.[0] || "",
        sellerName: serviceItem.vendor_name || "Unknown Seller",
        sellerId: serviceItem.vendor_id,
        totalPrice:
          (serviceItem.price || 0) +
          selectedAddOns.reduce((sum, a) => sum + (a.price || 0), 0),
        quantity: 1,
        eventStartDate: startDate || new Date().toISOString().split("T")[0],
        eventEndDate: endDate || new Date().toISOString().split("T")[0],
        addOns: selectedAddOns.map((a) => ({
          id: a._id,
          name: a.service_name,
          price: a.price,
          category: a.category,
        })),
      };

      dispatch(addService(payload));

      setSnackbarMessage("Service added to cart successfully!");
      setOpenSnackbar(true);

      setTimeout(() => setOpenBook(false), 300);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.ratings || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <Box sx={{ padding: "6rem 2rem", maxWidth: "1200px", margin: "auto" }}>
      {/* Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "4rem",
          alignItems: "flex-start",
        }}
      >
        {/* Image */}
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: "center" }}>
            <img
              src={mainImage || NO_IMAGE}
              alt={service.shop_name || "Service"}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = NO_IMAGE;
              }}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          </Box>
        </Grid>

        {/* Description */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#c026d3", mb: 1 }}
          >
            {service.shop_name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              {calculateAverageRating(service.Reviews)}
            </Typography>
            <Star sx={{ color: "gold", ml: 0.5 }} />
          </Box>

          <Typography
            variant="h6"
            sx={{
              color: "#333",
              fontWeight: "bold",
              mb: 1,
              borderBottom: "2px solid #c026d3",
              display: "inline-block",
            }}
          >
            Description
          </Typography>

          <Typography variant="body1" sx={{ color: "#444", lineHeight: 1.7 }}>
            {service.experience_in_business && service.year_of_establishment
              ? `${service.shop_name} has been in business for ${service.experience_in_business} years and was established in ${service.year_of_establishment}.`
              : service.experience_in_business
              ? `${service.shop_name} has been in business for ${service.experience_in_business} years.`
              : service.year_of_establishment
              ? `${service.shop_name} was established in ${service.year_of_establishment}.`
              : `${service.shop_name || "This vendor"} offers the services listed below.`}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 5 }} />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, val) => setActiveTab(val)}
        centered
        sx={{
          "& .MuiTabs-indicator": { backgroundColor: "#c026d3" },
          "& .Mui-selected": { color: "#c026d3 !important" },
        }}
      >
        <Tab label="Service Details" />
        <Tab label="Reviews" />
      </Tabs>

      {activeTab === 0 && (
        <Box sx={{ mt: 3 }}>
          {services.map((s) => (
            <Card
              key={s._id}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                p: 2,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <CardMedia
                component="img"
                image={s.additional_images?.[0] || NO_IMAGE}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = NO_IMAGE;
                }}
                sx={{
                  width: 180,
                  height: 120,
                  borderRadius: 2,
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{s.service_name}</Typography>
                {s.service_category && (
                  <Typography
                    sx={{ color: "#c026d3", fontSize: "0.85rem", fontWeight: 600 }}
                  >
                    {s.service_category}
                  </Typography>
                )}
                <Typography sx={{ color: "#777" }}>
                  {s.service_description}
                </Typography>
              </CardContent>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="h6">₹{s.price}</Typography>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 1,
                    borderColor: "#c026d3",
                    color: "#c026d3",
                    textTransform: "none",
                  }}
                  onClick={() => handleOpenBookDialog(s)}
                >
                  View
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {activeTab === 1 && <ReviewSection id={id} />}

      {/* Dialog (Modal) */}
      <Dialog open={openBook} onClose={handleCloseBook} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.3rem",
            pb: 0,
          }}
        >
          Service Details
          <IconButton
            onClick={handleCloseBook}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 2 }}>
          {serviceObj && (
            <>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Amount: ₹{serviceObj?.price?.toLocaleString()}
              </Typography>

              {addOnsList.length > 0 && (
                <>
                  <Typography
                    sx={{
                      mt: 1,
                      mb: 1.5,
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "#222",
                    }}
                  >
                    Add-ons
                  </Typography>

                  {addOnsList.map((a, index) => (
                    <Box
                      key={a._id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto auto",
                        alignItems: "center",
                        py: 1,
                        borderBottom:
                          index !== addOnsList.length - 1
                            ? "1px solid #eee"
                            : "none",
                      }}
                    >
                      <Typography sx={{ color: "#333" }}>
                        {a.service_name}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#444",
                          fontWeight: 500,
                          textAlign: "right",
                          pr: 1,
                        }}
                      >
                        ₹{a.price}/day
                      </Typography>
                      <Checkbox
                        checked={selectedAddOns.some((x) => x._id === a._id)}
                        onChange={() => handleCheckboxChange(a)}
                        sx={{
                          color: "#c026d3",
                          "&.Mui-checked": { color: "#c026d3" },
                        }}
                      />
                    </Box>
                  ))}
                </>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseBook}>Cancel</Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#c026d3",
              textTransform: "none",
              "&:hover": { backgroundColor: "#a81bb5" },
            }}
            onClick={() => handleAddToCart(serviceObj)}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SingleService;
