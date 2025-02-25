import React from "react";
import Slider from "react-slick";

// Third party library
import { Box, Card, CardContent, Typography, Button } from "@mui/material";


// Custom Components
import Featured from "../../pages/Home/components/Featured/index";
import ExploreService from "../../pages/Home/components/ExploreService/index";
import NearVendor from "../../pages/Home/components/NearVendor/index";
import Details from "../../pages/Home/components/Details/index";
import ExploreCategory from "../../pages/Home/components/ExploreCategory/index";
import Gallery from "./components/Gallery";
import Faq from "./components/Faq";
import Trusted from "./components/Trusted";

// Assests
import MainImage from "../../assets/AboutMain.jpg";
import HomePage1 from "../../assets/HomePage1.jpg";
import HomePage2 from "../../assets/HomePage2.jpeg";
import HomePage3 from "../../assets/HomePage3.jpeg";

// styles
import "./styles.scss";

const cardsData = [
  {
    title: "Make Your Event is Simple Now",
    subtitle:
      "Make your event planing stress-free. Streamline every detail with ease. Focus on what truly matters - Celebrating !",
    buttonText: "Book Now",
    image: HomePage1,
  },
  {
    title: "Plan with Ease, Celebrate in Style",
    subtitle:
      "Effortlessly manage every detail of your event. Let us take care of the stress while you focus on creating unforgettable memories.",
    buttonText: "Book Now",
    image: MainImage,
  },
  {
    title: "Bring Your Event Vision to Life",
    subtitle:
      "Whether it's a wedding, party, or corporate gathering, we ensure your event shines and your guests are amazed.",
    buttonText: "Sign Up",
    image: HomePage2,
  },
  {
    title: "Your Event, Perfectly Crafted",
    subtitle:
      "From concept to execution, experience flawless event management for an unforgettable celebration.",
    buttonText: "Book Now",
    image: HomePage3,
  },
];
{
  /* <img
src={MainImage}
style={{ width: "100%", height: "450px", borderRadius: "2rem" }}
alt="Not found"
/> */
}

const Home = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
  };

  return (
    <>
      <Box sx={{ minHeight: "55vh", padding: "0px" }}>
        <Box
          sx={{
            width: "98%",
            // marginTop:'3rem',
            "@media(max-width:600px)": {
              width: "23.2rem",
            },
          }}
        >
          <Slider {...sliderSettings}>
            {cardsData.map((card, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  
                  overflow: "hidden",
                  height: "600px",
                  width: "100%",
                }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(90%)",
                  }}
                />

          
                <Box className="Home-overlay-text">
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "600",
                      marginBottom: "1rem",
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      marginBottom: "1.5rem",
                      maxWidth: "600px",
                      lineHeight: "1.5",
                    }}
                  >
                    {card.subtitle}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>
      <ExploreCategory />
      <Trusted />
      <Featured />
      <ExploreService />
      {/* <Gallery /> */}
      <NearVendor />
      <Details />
      <Faq />
    </>
  );
};

export default Home;
