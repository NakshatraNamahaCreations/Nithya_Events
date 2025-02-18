import React, { useState } from "react";
import { Box, Typography, Slider, Paper, Button } from "@mui/material";

const DiscountSlider = ({ onChange }) => {
  const [discount, setDiscount] = useState([0, 100]); // Min and Max discount values

  const handleChange = (event, newValue) => {
    setDiscount(newValue);
    onChange(newValue);
  };
  const handleReset = () => {
    setDiscount([0, 100]);
    onChange([0, 100]); // Reset in parent state
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 3, maxWidth: 400, margin: "auto", borderRadius: 2 }}
    >
      <Typography
        variant="body1"
        fontWeight="medium"
        color="text.secondary"
        gutterBottom
      >
        Filter by Discount (%)
      </Typography>

      <Slider
        value={discount}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={0}
        max={100}
        step={1}
        sx={{
          color: "#4CAF50",
          "& .MuiSlider-thumb": {
            width: 20,
            height: 20,
            backgroundColor: "#2E7D32",
            "&:hover": {
              boxShadow: "0px 0px 8px #2E7D32",
            },
          },
          "& .MuiSlider-track": {
            height: 6,
          },
          "& .MuiSlider-rail": {
            height: 6,
            backgroundColor: "#E0E0E0",
          },
        }}
      />

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Typography variant="body2" color="text.secondary">
          Min:{" "}
          <span style={{ color: "#2E7D32", fontWeight: "bold" }}>
            {discount[0]}%
          </span>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Max:{" "}
          <span style={{ color: "#2E7D32", fontWeight: "bold" }}>
            {discount[1]}%
          </span>
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{
          backgroundColor: "#E8F5E9",
          padding: "10px",
          borderRadius: "8px",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        Showing products with{" "}
        <strong style={{ color: "#2E7D32" }}>
          {discount[0]}% - {discount[1]}%
        </strong>{" "}
        discount.
      </Typography>
      <Button
        variant="outlined"
        color="error"
        onClick={handleReset}
        sx={{ mt: 2, width: "100%" }}
      >
        Reset Discount
      </Button>
    </Paper>
  );
};

export default DiscountSlider;
