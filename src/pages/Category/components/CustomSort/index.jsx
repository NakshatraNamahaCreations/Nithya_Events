import React, { useState } from "react";
import { Box, Typography, Button, List, ListItem } from "@mui/material";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import "./styles.scss";

const CustomSort = ({ onSortChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("newest");

  const handleSortChange = (sortOption) => {
    setSelectedSortOption(sortOption);
  };

  const handleApply = () => {
    if (!selectedSortOption) {
      onSortChange("default");
    } else {
      onSortChange(selectedSortOption);
    }
  };

  const toggleDropdown = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <Box className="custom-sort">
      <Box className="sort-header" onClick={toggleDropdown}>
        <Typography variant="h6" className="sort-title">
          Sort Options
        </Typography>
        {open ? (
          <ExpandLessOutlinedIcon className="sort-icon" />
        ) : (
          <ExpandMoreOutlinedIcon className="sort-icon" />
        )}
      </Box>
      {open && (
        <Box className="sort-list-container">
          <List>
            <ListItem
              onClick={() => handleSortChange("newest")}
              className={
                selectedSortOption === "newest"
                  ? "active-sort-option"
                  : "sort-option"
              }
            >
              Newest
            </ListItem>
            <ListItem
              onClick={() => handleSortChange("priceLowToHigh")}
              className={
                selectedSortOption === "priceLowToHigh"
                  ? "active-sort-option"
                  : "sort-option"
              }
            >
              Price: Low to High
            </ListItem>
            <ListItem
              onClick={() => handleSortChange("priceHighToLow")}
              className={
                selectedSortOption === "priceHighToLow"
                  ? "active-sort-option"
                  : "sort-option"
              }
            >
              Price: High to Low
            </ListItem>
            <ListItem
              onClick={() => handleSortChange("ratingLowToHigh")}
              className={
                selectedSortOption === "ratingLowToHigh"
                  ? "active-sort-option"
                  : "sort-option"
              }
            >
              Rating: Low to High
            </ListItem>
            <ListItem
              onClick={() => handleSortChange("ratingHighToLow")}
              className={
                selectedSortOption === "ratingHighToLow"
                  ? "active-sort-option"
                  : "sort-option"
              }
            >
              Rating: High to Low
            </ListItem>
          </List>
          <Button
            variant="contained"
            className="apply-button"
            onClick={handleApply}
          >
            Apply
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CustomSort;
