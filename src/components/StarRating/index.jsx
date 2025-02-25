import React from "react";
import { Star } from "@mui/icons-material";
import { Box } from "@mui/material";

const StarRating = ({ rating }) => {
  return (
    <>
    {
    
      rating ? (
        <Box sx={{ display: "flex", alignItems: "center", marginRight:"0.8rem" }}>
        {Array(Math.round(rating))
          .fill()
          .map((_, index) => (
            <Star key={index} sx={{ color: "#FFC107" }} />
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
