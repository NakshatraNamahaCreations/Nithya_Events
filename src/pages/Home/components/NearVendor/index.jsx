import { Box, Button, IconButton, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../../api/ApiService";
import { getErrorMessage } from "../../../../utils/helperFunc";
import "./styles.scss";

const NearVendor = () => {
  const [vendors, setVendors] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      const res = await authService.vendorLists();
      // Temporarily duplicate to ensure scrolling is visible
      setVendors([...res.data.data, ...res.data.data]);
    } catch (error) {
      getErrorMessage(error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleVendorClick = (id) => {
    navigate(`/vendors/${id}`);
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <Box sx={{ width: "100%", px: { xs: 2, md: 6 }, py: 8 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, marginLeft:"2rem" }}>
        <Typography variant="h5" sx={{ color: "#343a40", fontWeight: 600 }}>
          Near By Vendors
        </Typography>
      </Box>

      {/* Scrollable Area with Buttons */}
      <Box sx={{ position: "relative", padding:"2rem 7rem" }}>
        {/* Left Arrow */}
        <IconButton
          onClick={scrollLeft}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            boxShadow: 1,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        {/* Scrollable Vendor List */}
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            gap: 3,
            px: 0,
            py: 1,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {vendors.map((item, index) => (
            <Box
              key={item._id + index}
              onClick={() => handleVendorClick(item._id)}
              sx={{
                minWidth: 250,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 3,
                cursor: "pointer",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            >
              <img
                src={item.shop_image_or_logo}
                alt={item.ServiceName}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" noWrap>
                  {item.shop_name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <PlaceIcon sx={{ fontSize: 18, color: "#999", mr: 0.5 }} />
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {item.address?.[0]?.distric || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Right Arrow */}
        <IconButton
          onClick={scrollRight}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            boxShadow: 1,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {/* View All Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#c026d3",
            px: 5,
            py: 1.5,
            fontWeight: 600,
            borderRadius: 2,
          }}
          onClick={() => navigate("/vendors")}
        >
          View All
        </Button>
      </Box>
    </Box>
  );
};

export default NearVendor;
