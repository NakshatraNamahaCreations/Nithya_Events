// import React, { useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Shamiana from "../../assets/tent1.jpg";
// import Sound from "../../assets/speakerFinal.jpg";
// import Lights from "../../assets/lights.jpg";
// import Video from "../../assets/cameraFinal.jpg";
// import Genset from "../../assets/genset.png";

// import Fabrication from "../../assets/carpet.png";
// import "./styles.scss";
// import { Box, Typography } from "@mui/material";
// import Trusted from "../Home/components/Trusted";

// const categories = [
//   { name: "Sound", tag: "sound", image: Sound },
//   { name: "Video", tag: "video", image: Video },
//   { name: "Light", tag: "Lighting", image: Lights },
//   { name: "Genset", tag: "genset", image: Genset },
//   { name: "Shamiana", tag: "shamiana", image: Shamiana },
//   { name: "Shamiana", tag: "shamiana", image: Shamiana },
// ];

// function AllCategory() {
//   useEffect(() => {
//     const cards = document.querySelectorAll(".card");
//     cards.forEach((card, index) => {
//       setTimeout(() => {
//         card.style.opacity = 1;
//         card.style.transform = "translateY(0)";
//       }, index * 100);
//     });
//   }, []);
//   const navigate = useNavigate();
//   const handleNavigate = (category) => {
//     navigate(`/category/${category}`);
//   };
//   return (
//     <Box className="all-category">
//       <h1 className="all-category-heading">Categories</h1>
//       <p className="all-category-subHeading">Dive Into Our Exclusive Categories.</p>
//       <Box className="scroll-container-allCategory">
//         {categories.map((category, index) => (
//           <Box
//             key={index}
//             className="category-card"
//             onClick={() => handleNavigate(category.tag.toLowerCase())}
//           >
//             <Box className="image-container">
//               <img
//                 className="card-img"
//                 src={category.image}
//                 alt={category.name}
//               />
//             </Box>
//             <Typography variant="p" className="category-name">{category.name}</Typography>
//           </Box>
//         ))}
//       </Box>
//       <Trusted />
//     </Box>
//   );
// }

// export default AllCategory;
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import Shamiana from "../../assets/tent1.jpg";
import Sound from "../../assets/speakerFinal.jpg";
import Lights from "../../assets/lights.jpg";
import Video from "../../assets/cameraFinal.jpg";
import Genset from "../../assets/genset.png";
import Fabrication from "../../assets/carpet.png";

import Trusted from "../Home/components/Trusted";
import "./styles.scss";

const categories = [
  { name: "Sound", tag: "sound", image: Sound },
  { name: "Lighting", tag: "lighting", image: Lights },
  { name: "Video", tag: "video", image: Video },
  { name: "Fabrication", tag: "fabrication", image: Fabrication },
  { name: "Genset", tag: "genset", image: Genset },
  { name: "Shamiana", tag: "shamiana", image: Shamiana },
];

function AllCategory() {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll(".category-card");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <Box
      className="all-category"
      sx={{
        background: "linear-gradient(180deg, #faf5ff 0%, #f3e8ff 100%)",
        py: 8,
        px: { xs: 2, md: 6 },
        textAlign: "center",
      }}
    >
      {/* Heading Section */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          mb: 1,
          color: "#1a1a1a",
          letterSpacing: "0.5px",
        }}
      >
        Categories
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          mb: 6,
          color: "#6b7280",
          fontSize: "1.1rem",
          letterSpacing: "0.4px",
        }}
      >
        Dive Into Our Exclusive Categories
      </Typography>

      {/* Category Grid */}
      <Box
        className="scroll-container-allCategory"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gap: "2.5rem",
          justifyItems: "center",
        }}
      >
        {categories.map((category, index) => (
          <Box
            key={index}
            className="category-card hidden"
            onClick={() => handleNavigate(category.tag.toLowerCase())}
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "370px",
              height: "420px",
              borderRadius: "20px",
              overflow: "hidden",
              cursor: "pointer",
              transform: "translateY(40px)",
              opacity: 0,
              transition:
                "transform 0.8s ease, opacity 0.8s ease, box-shadow 0.4s ease",
              "&.show": {
                transform: "translateY(0)",
                opacity: 1,
              },
              "&:hover": {
                transform: "translateY(-10px) scale(1.03)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
              },
            }}
          >
            {/* Image */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#000",
              }}
            >
              <Box
                component="img"
                src={category.image}
                alt={category.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.8s ease",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              />
            </Box>

            {/* Gradient Overlay */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "45%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.05) 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                p: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  mb: 1,
                  fontSize: "1.5rem",
                  textShadow: "0 3px 10px rgba(0,0,0,0.8)",
                }}
              >
                {category.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#e5e7eb",
                  textAlign: "center",
                  maxWidth: "80%",
                  fontSize: "0.9rem",
                }}
              >
                Explore premium {category.name} solutions to elevate your next
                event experience.
              </Typography>
            </Box>

            {/* Border Glow */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "20px",
                pointerEvents: "none",
                border: "2px solid transparent",
                background:
                  "linear-gradient(135deg, rgba(192,38,211,0.8), rgba(123,44,191,0.6)) border-box",
                WebkitMask:
                  "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                opacity: 0,
                transition: "opacity 0.4s ease",
                "&:hover": { opacity: 1 },
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Trusted Section */}
      <Box sx={{ mt: 10 }}>
        <Trusted />
      </Box>
    </Box>
  );
}

export default AllCategory;
