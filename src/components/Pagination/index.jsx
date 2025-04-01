import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleViewAll = () => {
    window.scrollTo({
      top: 200,
      left: 200,
      behavior: "smooth",
    });
  };

  const generatePageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        margin:"0 auto",
        padding: "0.5rem",
      }}
      onClick={handleViewAll}
    >
      <IconButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          "&:hover": { backgroundColor: "#e0e0e0" },
        }}
      >
        <ChevronLeft />
      </IconButton>

      {generatePageNumbers().map((page, index) =>
        page === "..." ? (
          <Button key={index} disabled sx={{ minWidth: "40px", color: "#000" }}>
            ...
          </Button>
        ) : (
          <Button
            key={index}
            onClick={() => onPageChange(page)}
            variant={page === currentPage ? "contained" : "outlined"}
            sx={{
              minWidth: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: page === currentPage ? "#3788FF" : "#fff",
              color: page === currentPage ? "#fff" : "#000",
              border: "1px solid #ddd",
              "&:hover": {
                backgroundColor: page === currentPage ? "#3788FF" : "#f0f0f0",
              },
            }}
          >
            {page}
          </Button>
        )
      )}

      {/* Next Button */}
      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          "&:hover": { backgroundColor: "#e0e0e0" },
        }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default Pagination;
