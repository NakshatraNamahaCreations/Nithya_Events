// import { Box, Button, Typography } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./styles.scss";
// import authService from "../../../../api/ApiService";

// const ExploreService = () => {
//   const navigate = useNavigate();
//   const [services, setServices] = useState([]);

//   const fetchServices = async () => {
//     try {
//       const res = await authService.getAllServices();
//       setServices(res.data.data);
//     } catch (error) {
//       console.error("Error fetching services:", error);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   return (
//     <Box sx={{ padding: "2rem" }}>
//       <Typography
//         sx={{
//           fontSize: "1.4rem",
//           fontWeight: "bold",
//           color: "#343a40",
//           marginBottom: "2rem",
//           textTransform: "uppercase",
//           textAlign: "center",
//         }}
//       >
//         Services
//       </Typography>

//       {/* Center container */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           marginLeft: { xs: "2.5rem", lg: "8rem" },
//         }}
//       >
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: {
//               xs: "1fr",
//               sm: "1fr 1fr",
//               md: "repeat(3, 1fr)",
//             },
//             gap: "1.5rem",
//             maxWidth: "1280px",
//             width: "100%",
//             justifyContent: "center",
//           }}
//         >
//           {services.slice(0, 6).map((service) => (
//             <Box
//               key={service._id}
//               onClick={() => navigate(`/service/${service.service_name}`)}
//               sx={{
//                 borderRadius: "12px",
//                 overflow: "hidden",
//                 boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
//                 backgroundColor: "#fff",
//                 cursor: "pointer",
//                 transition: "transform 0.3s ease",
//                 maxWidth: "280px",
//                 width: "100%",
//                 "&:hover": {
//                   transform: "translateY(-5px)",
//                 },
//               }}
//             >
//               <Box sx={{ position: "relative", height: "370px" }}>
//                 <img
//                   src={service.service_image}
//                   alt={service.service_name}
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                 />
//               </Box>
//             </Box>
//           ))}
//         </Box>
//       </Box>

//       <Box
//         sx={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}
//       >
//         <Button
//           variant="outlined"
//           onClick={() => navigate("/services")}
//           sx={{
//             textTransform: "capitalize",
//             fontWeight: "bold",
//             color: "white",
//             backgroundColor: "#c026d3",
//             width: "8rem",
//             height: "40px",
//             border: "none",
//             "&:hover": {
//               transform: "scale(1.1)",
//               color: "#fff",
//             },
//           }}
//         >
//           View All
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default ExploreService;
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../../api/ApiService";
import "./styles.scss";

const ExploreService = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const res = await authService.getAllServices();
      setServices(res.data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <Box
      sx={{
        py: 8,
        px: { xs: 2, md: 6 },
        background:
          "linear-gradient(180deg, #faf5ff 0%, #f3e8ff 50%, #ede9fe 100%)",
        textAlign: "center",
      }}
    >
      {/* Section Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "#1a1a1a",
          mb: 6,
          position: "relative",
          display: "inline-block",
          letterSpacing: "0.5px",
          "&::after": {
            content: '""',
            position: "absolute",
            left: "50%",
            bottom: -10,
            transform: "translateX(-50%)",
            width: "90px",
            height: "4px",
            borderRadius: "2px",
            background: "linear-gradient(90deg, #c026d3, #7b2cbf)",
          },
        }}
      >
        Explore Our Premium Services
      </Typography>

      {/* Services Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gap: "2.5rem",
          justifyItems: "center",
          mt: 4,
        }}
      >
        {services.slice(0, 6).map((service) => (
          <Box
            key={service._id}
            onClick={() => navigate(`/service/${service.service_name}`)}
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "370px",
              height: "420px",
              borderRadius: "20px",
              overflow: "hidden",
              cursor: "pointer",
              background: "linear-gradient(135deg, #fff, #faf5ff)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
              transition:
                "transform 0.4s ease, box-shadow 0.4s ease, border 0.3s ease",
              "&:hover": {
                transform: "translateY(-10px) scale(1.02)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                border: "1px solid #c026d3",
              },
            }}
          >
            {/* Image (No Cropping) */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                background:
                  "linear-gradient(180deg, #fff 0%, #f3e8ff 40%, #f0f0f0 100%)",
              }}
            >
              <Box
                component="img"
                src={service.service_image}
                alt={service.service_name}
                sx={{
                  width: "90%",
                  height: "90%",
                  objectFit: "contain", // shows full image without cutting
                  transition: "transform 0.6s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
            </Box>

            {/* Gradient Overlay at Bottom */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40%",

                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                p: 3,
              }}
            >
              {/* <Typography
                variant="h5"
                sx={{
                  color: "#f91a1aff",
                  fontWeight: 700,
                  mb: 1,
                  fontSize: "1.4rem",
                  textShadow: "0 3px 8px rgba(0,0,0,0.7)",
                }}
              >
                {service.service_name}
              </Typography> */}

              <Typography
                variant="body2"
                sx={{
                  color: "#e0e0e0",
                  fontSize: "0.9rem",
                  mb: 2,
                  textAlign: "center",
                  lineHeight: 1.4,
                  maxWidth: "90%",
                }}
              ></Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* View All Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <Button
          variant="contained"
          onClick={() => navigate("/services")}
          sx={{
            textTransform: "capitalize",
            fontWeight: 700,
            fontSize: "1rem",
            px: 5,
            py: 1.5,
            borderRadius: "40px",
            color: "#fff",
            background: "linear-gradient(90deg, #c026d3 0%, #7b2cbf 100%)",
            boxShadow: "0 8px 25px rgba(192,38,211,0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px) scale(1.05)",
              background: "linear-gradient(90deg, #a21caf 0%, #6d28d9 100%)",
              boxShadow: "0 12px 35px rgba(0,0,0,0.35)",
            },
          }}
        >
          View All Services →
        </Button>
      </Box>
    </Box>
  );
};

export default ExploreService;
