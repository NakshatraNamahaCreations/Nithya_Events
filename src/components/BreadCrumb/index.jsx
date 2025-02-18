import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const BreadCrumb = ({ paths }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        margin: "2.5rem 2rem",
        color: "#555",
      }}
    >
      {paths?.map((path, index) => (
        <React.Fragment key={index}>
          {index !== 0 && (
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: "#888",
              }}
            >
              &gt;
            </Typography>
          )}
          {path.link ? (
            <Link
              to={path.link}
              style={{
                textDecoration: "none",
                color: "#555",
                fontSize: "0.8rem",
                fontWeight: "500",
              }}
            >
              {path.label}
            </Link>
          ) : (
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: "500",
                color: "#555",
              }}
            >
              {path.label}
            </Typography>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default BreadCrumb;
