import React, { useRef } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const SliderImage = ({
  productImages,
  setMainImage,
  mainImage,
  productVideo,
}) => {
  const scrollRef = useRef(null);

  const scrollThumbnails = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 100;
      scrollRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
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
      {/* Left Arrow */}
      <IconButton
        onClick={() => scrollThumbnails("left")}
        sx={{
          position: "absolute",
          left: "-25px",
          zIndex: 2,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
        }}
      >
        <ArrowBackIosIcon fontSize="small" />
      </IconButton>

      {/* Thumbnails */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
          width: "280px",
          gap: "10px",
          padding: "8px",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
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
              border:
                mainImage === img ? "3px solid #1976d2" : "1px solid #ddd",
              transition: "border 0.3s ease-in-out",
            }}
          />
        ))}
        {productVideo && (
          <Box
            sx={{
              width: "60px",
              height: "60px",
              borderRadius: "8px",
              border:
                mainImage === productVideo
                  ? "3px solid #1976d2"
                  : "1px solid #ddd",
              overflow: "hidden",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "border 0.3s ease-in-out",
            }}
            onClick={() => setMainImage(productVideo)}
          >
            <video
              width="60px"
              height="60px"
              style={{ objectFit: "cover" }}
              muted
            >
              <source src={productVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        )}
      </Box>

      {/* Right Arrow */}
      <IconButton
        onClick={() => scrollThumbnails("right")}
        sx={{
          position: "absolute",
          right: "-25px",
          zIndex: 2,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
        }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default SliderImage;
