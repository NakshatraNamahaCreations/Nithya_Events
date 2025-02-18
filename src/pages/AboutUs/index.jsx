// React related products
import React from "react";

// Third party library
import { Box, Typography, Grid } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import Sliders from "../../components/Sliders";
import Trusted from "../Home/components/Trusted";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import PlaceIcon from "@mui/icons-material/Place";
import ExploreService from "../Home/components/ExploreService";
import NearVendor from "../Home/components/NearVendor";
import Faq from "../Home/components/Faq";

// Assests
import AboutSideImage from "../../assets/aboutImg.jpeg";

const highlights = [
  {
    title: "Heading one",
    description:
      "Make your event planning stress-free. Streamline every detail with ease. Focus on what truly matters—celebrating!",
  },
  {
    title: "Heading one",
    description:
      "Make your event planning stress-free. Streamline every detail with ease. Focus on what truly matters—celebrating!",
  },
  {
    title: "Heading one",
    description:
      "Make your event planning stress-free. Streamline every detail with ease. Focus on what truly matters—celebrating!",
  },
  {
    title: "Heading one",
    description:
      "Make your event planning stress-free. Streamline every detail with ease. Focus on what truly matters—celebrating!",
  },
];

const stats = [
  {
    icon: <ShoppingCartIcon sx={{ fontSize: 40, color: "#1976D2" }} />,
    value: "450+",
    label: "Products",
  },
  {
    icon: <HomeIcon sx={{ fontSize: 40, color: "#1976D2" }} />,
    value: "80+",
    label: "Vendors",
  },
  {
    icon: <BarChartIcon sx={{ fontSize: 40, color: "#1976D2" }} />,
    value: "15+",
    label: "Services",
  },
  {
    icon: <PlaceIcon sx={{ fontSize: 40, color: "#1976D2" }} />,
    value: "70+",
    label: "Locations",
  },
];

const AboutUs = () => {
  return (
    <>
      <Sliders />
      <Box sx={{ py: 8, px: 4 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left side - List of Highlights */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={4}>
              {highlights.map((highlight, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box display="flex" alignItems="flex-start">
                    <StarIcon sx={{ color: "#1976D2", fontSize: 30, mr: 2 }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {highlight.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {highlight.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={AboutSideImage}
              alt="Event Celebration"
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          backgroundColor: "#EAF6FF",
          borderRadius: "12px",
          py: 4,
          px: 4,
          mt: 4,
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} textAlign="center">
              {stat.icon}
              <Typography
                variant="h5"
                fontWeight="600"
                color="text.primary"
                mt={1}
                fontSize={38}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="p"
                sx={{ fontSize: "1.1rem" }}
                color="text.secondary"
              >
                {stat.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Trusted />
      <ExploreService />
      <NearVendor />
      <Faq />
    </>
  );
};

export default AboutUs;
