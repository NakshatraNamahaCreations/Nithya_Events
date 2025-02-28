import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import BannerImg from "../../../../../../assets/close-up.jpg";

const Banner = () => {
  return (
    <Paper
      sx={{
        position: "relative",
        margin: "20px 0",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <img
        src={BannerImg}
        alt="Donation Banner"
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          background: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "white", fontWeight: "600", textAlign: "center" }}
        >
          LET'S FIGHT
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: "#fdb33a",
            fontWeight: "800",
            textAlign: "center",
          }}
        >
          HUNGER!
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "white", textAlign: "center" }}
        >
          DONATE NOW AND SAVE THEIR LIFE
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "white", textAlign: "center" }}
        >
          MORE INFORMATION AT OUR WEBSITE
        </Typography>
        <Button
          variant="contained"
          color="error"
          href="https://kadagamfoundation.org/activities/food-donation"
          target="_blank"
          sx={{
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
          startIcon={<FastfoodIcon />}
        >
          DONATE FOOD
        </Button>
      </Box>
    </Paper>
  );
};

export default Banner;

