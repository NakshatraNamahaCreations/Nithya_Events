// import { Box, Button, IconButton, Typography } from "@mui/material";
// import PlaceIcon from "@mui/icons-material/Place";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import authService from "../../../../api/ApiService";
// import { getErrorMessage } from "../../../../utils/helperFunc";
// import "./styles.scss";

// const NearVendor = () => {
//   const [vendors, setVendors] = useState([]);
//   const scrollRef = useRef(null);
//   const navigate = useNavigate();

//   const fetchVendors = async () => {
//     try {
//       const res = await authService.vendorLists();
//       // Temporarily duplicate to ensure scrolling is visible
//       setVendors([...res.data.data, ...res.data.data]);
//     } catch (error) {
//       getErrorMessage(error);
//     }
//   };

//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   const handleVendorClick = (id) => {
//     navigate(`/vendors/${id}`);
//   };

//   const scrollLeft = () => {
//     scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
//   };

//   const scrollRight = () => {
//     scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
//   };

//   return (
//     <Box sx={{ width: "100%", px: { xs: 2, md: 6 }, py: 8 }}>
//       {/* Header */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, marginLeft:"2rem" }}>
//         <Typography variant="h5" sx={{ color: "#343a40", fontWeight: 600 }}>
//           Near By Vendors
//         </Typography>
//       </Box>

//       {/* Scrollable Area with Buttons */}
//       <Box sx={{ position: "relative", padding:"2rem 7rem" }}>
//         {/* Left Arrow */}
//         <IconButton
//           onClick={scrollLeft}
//           sx={{
//             position: "absolute",
//             left: 0,
//             top: "50%",
//             transform: "translateY(-50%)",
//             zIndex: 2,
//             backgroundColor: "#fff",
//             border: "1px solid #ccc",
//             boxShadow: 1,
//             "&:hover": { backgroundColor: "#f0f0f0" },
//           }}
//         >
//           <ArrowBackIosNewIcon />
//         </IconButton>

//         {/* Scrollable Vendor List */}
//         <Box
//           ref={scrollRef}
//           sx={{
//             display: "flex",
//             overflowX: "auto",
//             scrollBehavior: "smooth",
//             gap: 3,
//             px: 0,
//             py: 1,
//             "&::-webkit-scrollbar": { display: "none" },
//           }}
//         >
//           {vendors.map((item, index) => (
//             <Box
//               key={item._id + index}
//               onClick={() => handleVendorClick(item._id)}
//               sx={{
//                 minWidth: 250,
//                 backgroundColor: "#fff",
//                 borderRadius: 2,
//                 boxShadow: 3,
//                 cursor: "pointer",
//                 transition: "transform 0.3s",
//                 "&:hover": {
//                   transform: "scale(1.03)",
//                 },
//               }}
//             >
//               <img
//                 src={item.shop_image_or_logo}
//                 alt={item.ServiceName}
//                 style={{
//                   width: "100%",
//                   height: "200px",
//                   objectFit: "cover",
//                   borderTopLeftRadius: "8px",
//                   borderTopRightRadius: "8px",
//                 }}
//               />
//               <Box sx={{ p: 2 }}>
//                 <Typography variant="subtitle1" noWrap>
//                   {item.shop_name}
//                 </Typography>
//                 <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
//                   <PlaceIcon sx={{ fontSize: 18, color: "#999", mr: 0.5 }} />
//                   <Typography variant="body2" color="textSecondary" noWrap>
//                     {item.address?.[0]?.distric || "N/A"}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>
//           ))}
//         </Box>

//         {/* Right Arrow */}
//         <IconButton
//           onClick={scrollRight}
//           sx={{
//             position: "absolute",
//             right: 0,
//             top: "50%",
//             transform: "translateY(-50%)",
//             zIndex: 2,
//             backgroundColor: "#fff",
//             border: "1px solid #ccc",
//             boxShadow: 1,
//             "&:hover": { backgroundColor: "#f0f0f0" },
//           }}
//         >
//           <ArrowForwardIosIcon />
//         </IconButton>
//       </Box>

//       {/* View All Button */}
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//         <Button
//           variant="contained"
//           sx={{
//             backgroundColor: "#c026d3",
//             px: 5,
//             py: 1.5,
//             fontWeight: 600,
//             borderRadius: 2,
//           }}
//           onClick={() => navigate("/vendors")}
//         >
//           View All
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default NearVendor;

import { Box, Button, IconButton, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../../api/ApiService";
import { getErrorMessage } from "../../../../utils/helperFunc";
import "./styles.scss";

// Local inline placeholder (no network dependency) used when a vendor image
// is missing or fails to load.
const NO_IMAGE =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='420'%20height='200'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23eeeeee'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23999999'%20font-family='sans-serif'%20font-size='18'%20text-anchor='middle'%20dominant-baseline='middle'%3ENo%20Image%3C/text%3E%3C/svg%3E";

const NearVendor = () => {
  const [vendors, setVendors] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      const res = await authService.vendorLists();
      // Render each vendor once. (Previously the list was duplicated with
      // [...data, ...data] just to force horizontal scrolling, which made
      // every vendor appear twice.)
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      setVendors(list);
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
    scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        width: "100%",
        py: 8,
        px: { xs: 2, md: 6 },
        position: "relative",
        background: "linear-gradient(180deg, #faf5ff 0%, #f3e8ff 100%)",
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#1a1a1a",
            mb: 1,
          }}
        >
          Nearby Vendors
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "#6b7280", fontSize: "1.1rem" }}
        >
          Discover top-rated vendors around your area
        </Typography>
      </Box>

      {/* Carousel Container */}
      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        {/* Left Arrow */}
        <IconButton
          onClick={scrollLeft}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 3,
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            "&:hover": {
              backgroundColor: "#c026d3",
              color: "#fff",
              transform: "translateY(-50%) scale(1.1)",
            },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        {/* Vendor Cards Carousel */}
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 4,
            py: 2,
            px: { xs: 5, md: 8 },
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" },
            position: "relative",
          }}
        >
          {vendors.length === 0 && (
            <Typography
              sx={{ color: "#6b7280", py: 4, px: 2, width: "100%", textAlign: "center" }}
            >
              No vendors available right now.
            </Typography>
          )}

          {vendors.map((item, index) => (
            <Box
              key={item._id + index}
              onClick={() => handleVendorClick(item._id)}
              sx={{
                minWidth: 270,
                height: 320,
                borderRadius: "18px",
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition:
                  "transform 0.5s ease, box-shadow 0.4s ease, border 0.3s ease",
                "&:hover": {
                  transform: "translateY(-10px) scale(1.04)",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
                  border: "2px solid #c026d3",
                },
                position: "relative",
              }}
            >
              {/* Vendor Image */}
              <Box
                sx={{
                  width: "100%",
                  height: "65%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.shop_image_or_logo || NO_IMAGE}
                  alt={item.shop_name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s ease",
                  }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = NO_IMAGE;
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />

                {/* Overlay gradient */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "40%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 10%, transparent 90%)",
                  }}
                />
              </Box>

              {/* Vendor Info */}
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "35%",
                }}
              >
                <Typography
                  variant="h6"
                  noWrap
                  sx={{ fontWeight: 700, color: "#1f2937" }}
                >
                  {item.shop_name}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <PlaceIcon sx={{ fontSize: 18, color: "#a855f7", mr: 0.5 }} />
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    noWrap
                    sx={{ fontSize: "0.9rem", color: "#6b7280" }}
                  >
                    {item.address?.[0]?.distric ||
                      item.address?.[0]?.cityDownVillage ||
                      item.address?.[0]?.state ||
                      "Not specified"}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    mt: 1.5,
                    borderRadius: "25px",
                    fontSize: "0.8rem",
                    background:
                      "linear-gradient(90deg, #c026d3 0%, #7b2cbf 100%)",
                    boxShadow: "0 5px 15px rgba(192,38,211,0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #a21caf 0%, #6d28d9 100%)",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  View Profile
                </Button>
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
            zIndex: 3,
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            "&:hover": {
              backgroundColor: "#c026d3",
              color: "#fff",
              transform: "translateY(-50%) scale(1.1)",
            },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>

        {/* Gradient fade edges */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "8rem",
            background:
              "linear-gradient(to right, #faf5ff 30%, rgba(250,245,255,0))",
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: "8rem",
            background:
              "linear-gradient(to left, #faf5ff 30%, rgba(250,245,255,0))",
            zIndex: 2,
          }}
        />
      </Box>

      {/* View All Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <Button
          variant="contained"
          onClick={() => navigate("/vendors")}
          sx={{
            background: "linear-gradient(90deg, #c026d3 0%, #7b2cbf 100%)",
            px: 5,
            py: 1.4,
            fontWeight: 700,
            borderRadius: "40px",
            fontSize: "1rem",
            boxShadow: "0 8px 25px rgba(192,38,211,0.4)",
            textTransform: "capitalize",
            "&:hover": {
              background: "linear-gradient(90deg, #a21caf 0%, #6d28d9 100%)",
              transform: "scale(1.05)",
            },
          }}
        >
          View All Vendors →
        </Button>
      </Box>
    </Box>
  );
};

export default NearVendor;
