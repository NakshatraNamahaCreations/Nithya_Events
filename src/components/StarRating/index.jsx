import React from "react";
import { Star } from "@mui/icons-material";
import { Box } from "@mui/material";

const StarRating = ({ rating }) => {
  return (
    <>
    {
    
      rating ? (
        <Box sx={{ display: "flex", alignItems: "center", marginLeft:'-0.115rem' }}>
        {Array(Math.round(rating))
          .fill()
          .map((_, index) => (
            <Star key={index} sx={{ color: "#FFC107", fontSize:'1.1rem' }} />
          ))}
      </Box>
      )
      :
      ""
    }
    </>
  );
};

export default StarRating;
