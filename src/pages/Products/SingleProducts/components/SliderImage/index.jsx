// import React, { useRef } from "react";
// import { Box, IconButton, Typography } from "@mui/material";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// const SliderImage = ({
//   productImages,
//   setMainImage,
//   mainImage,
//   productVideo,
// }) => {
//   const scrollRef = useRef(null);

//   const scrollThumbnails = (direction) => {
//     if (scrollRef.current) {
//       const scrollAmount = 100;
//       scrollRef.current.scrollLeft +=
//         direction === "left" ? -scrollAmount : scrollAmount;
//     }
//   };

//   return (
//     <Box
//       sx={{
//         position: "relative",
//         display: "flex",
//         alignItems: "center",
//         width: "320px",
//       }}
//     >
//       {/* Left Arrow */}
//       {productImages.length > 1 && (
//       <IconButton
//         onClick={() => scrollThumbnails("left")}
//         sx={{
//           position: "absolute",
//           left: "-25px",
//           zIndex: 2,
//           backgroundColor: "rgba(255, 255, 255, 0.7)",
//           "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
//         }}
//       >
//         <ArrowBackIosIcon fontSize="small" />
//       </IconButton>
//       )}

//       {/* Thumbnails */}
//       <Box
//         ref={scrollRef}
//         sx={{
       
//           overflowX: "auto",
//           scrollBehavior: "smooth",
//           width: "280px",
//           gap: "10px",
//           padding: "8px",
//           "&::-webkit-scrollbar": { display: "none" },
//           ...(productImages.length > 0 && {
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }),

//         }}
//       >
//         {productImages?.map((img, index) => (
//           <img
//             key={index}
//             src={img}
//             alt={`Thumbnail ${index + 1}`}
//             onClick={() => setMainImage(img)}
//             style={{
//               width: "60px",
//               height: "60px",
//               borderRadius: "8px",
//               objectFit: "cover",
    
//               cursor: "pointer",
//               border:
//                 mainImage === img ? "3px solid #1976d2" : "1px solid #ddd",
//               transition: "border 0.3s ease-in-out",
//             }}
//           />
//         ))}
//         {productVideo && (
//           <Box
//             sx={{
//               width: "60px",
//               height: "60px",
//               borderRadius: "8px",
//               border:
//                 mainImage === productVideo
//                   ? "3px solid #1976d2"
//                   : "1px solid #ddd",
//               overflow: "hidden",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               transition: "border 0.3s ease-in-out",
//             }}
//             onClick={() => setMainImage(productVideo)}
//           >
//             <video
//               width="60px"
//               height="60px"
//               style={{ objectFit: "cover" }}
//               muted
//             >
//               <source src={productVideo} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           </Box>
//         )}
//       </Box>

//       {/* Right Arrow */}

//       {productImages.length > 1 && (
//   <IconButton
//   onClick={() => scrollThumbnails("right")}
//   sx={{
//     position: "absolute",
//     right: "-25px",
//     zIndex: 2,
//     backgroundColor: "rgba(255, 255, 255, 0.7)",
//     "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
//   }}
// >
//   <ArrowForwardIosIcon fontSize="small" />
// </IconButton>
//        )}
    
//     </Box>
//   );
// };

// export default SliderImage;

import React, { useRef, useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// ✅ Universal video detector
const isVideoFile = (url) => {
  if (!url) return false;
  const videoExtensions = [
    "mp4", "mov", "avi", "mkv", "webm", "m4v", "flv",
    "wmv", "3gp", "mpeg"
  ];

  const ext = url.split("?")[0].split(".").pop().toLowerCase();
  if (videoExtensions.includes(ext)) return true;

  const hints = ["video", "stream", "media", "play"];
  return hints.some((h) => url.toLowerCase().includes(h));
};

const SliderImage = ({ productImages, setMainImage, mainImage, productVideo }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;

    const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, [productImages, productVideo]);

  const scrollThumbnails = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 120;
      scrollRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
      setTimeout(checkScroll, 60);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "320px",
      }}
    >
      {canScrollLeft && (
        <IconButton
          onClick={() => scrollThumbnails("left")}
          sx={{
            position: "absolute",
            left: "-25px",
            zIndex: 2,
            backgroundColor: "rgba(255,255,255,0.8)",
            "&:hover": { backgroundColor: "white" },
          }}
        >
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
      )}

      <Box
        ref={scrollRef}
        sx={{
          overflowX: "auto",
          scrollBehavior: "smooth",
          width: "280px",
          gap: "10px",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {/* ✅ Image thumbnails */}
        {productImages?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setMainImage(img)}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "8px",
              objectFit: "cover",
              cursor: "pointer",
              border: mainImage === img ? "3px solid #1976d2" : "1px solid #ddd",
              transition: "border 0.3s ease-in-out",
            }}
          />
        ))}

        {/* ✅ Video thumbnail */}
        {productVideo && isVideoFile(productVideo) && (
          <Box
            sx={{
              width: "60px",
              height: "60px",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "pointer",
              border: mainImage === productVideo ? "3px solid #1976d2" : "1px solid #ddd",
            }}
            onClick={() => setMainImage(productVideo)}
          >
            <video
              src={productVideo}
              // autoPlay
              muted
              loop
              playsInline
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
          </Box>
        )}
      </Box>

      {canScrollRight && (
        <IconButton
          onClick={() => scrollThumbnails("right")}
          sx={{
            position: "absolute",
            right: "-25px",
            zIndex: 2,
            backgroundColor: "rgba(255,255,255,0.8)",
            "&:hover": { backgroundColor: "white" },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default SliderImage;
