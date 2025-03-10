// Third party library
import { Box, Button, Typography } from "@mui/material";
import Slider from "react-slick";

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
const Sliders = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };
  return (
    <>
      <Box
        sx={{
          width: "98.6%",
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
                height: "450px",
                width: "98.5%",
                "@media(max-width:600px)": {
                  width: "23.2rem",
                },
              }}
            >
              {/* Image */}
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

              {/* Overlay Content */}
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
    </>
  );
};

export default Sliders;
