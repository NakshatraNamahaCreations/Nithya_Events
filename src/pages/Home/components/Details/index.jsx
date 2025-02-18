import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ProfessionalGif from "../../../../assets/ProfessionalGif.gif";
import TailoredGif from "../../../../assets/Tailored.gif";
import ReliableGif from "../../../../assets/Reliable.gif";
import ServiceImg from "../../../../assets/eventHd.jpg";
import EventImg from "../../../../assets/event2.jpg";
import "./styles.scss";
import authService from "../../../../api/ApiService";

const videoData = [
  {
    id: 1,
    title: "Video 1",
    video_link: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: "Video 2",
    video_link: "https://www.youtube.com/embed/3JZ_D3ELwOQ",
  },
  {
    id: 3,
    title: "Video 3",
    video_link: "https://www.youtube.com/embed/tgbNymZ7vqY",
  },
  {
    id: 4,
    title: "Video 4",
    video_link: "https://www.youtube.com/embed/kJQP7kiw5Fk",
  },
];

const gifData = [
  {
    id: 1,
    title: "Trusted By Professionals",
    img: ProfessionalGif,
    description: "Trusted By Professionals",
  },
  {
    id: 2,
    title: "Tailored Professionals",
    img: TailoredGif,
    description: "Tailored Professionals",
  },
  {
    id: 3,
    title: "Reliable",
    img: ReliableGif,
    description: "Reliable",
  },
  {
    id: 4,
    title: "24/7 Support",
    img: ProfessionalGif,
    description: "24/7 Support",
  },
];

const stepsData = [
  {
    id: 1,
    title: "Book",
    description:
      "Choose your service and book your appointment in just a few clicks.",
    position: "top",
  },
  {
    id: 2,
    title: "Receive",
    description:
      "Receive the best service delivered directly to your doorstep.",
    position: "middle",
  },
  {
    id: 3,
    title: "Enjoy",
    description:
      "Enjoy hassle-free and professional services tailored to your needs.",
    position: "bottom",
  },
];

const Details = () => {
  // const [videoData, setVideoData] = useState([]);
  const scrollRef = useRef();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
  //     setShowLeftArrow(scrollLeft > 0);
  //     setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
  //   };

  //   handleScroll();

  //   scrollRef.current.addEventListener("scroll", handleScroll);
  // }, []);

  // const handleScrollLeft = () => {
  //   scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  // };

  // const handleScrollRight = () => {
  //   scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  // };

  // const fetchYoutubeLink = async() => {
  //   const res = await  authService.getYoutube();
  //   setVideoData(res.data.data)
  //   console.log(res.data.data);

  // }

  // useEffect(() => {
  //   fetchYoutubeLink();
  // },[])

  return (
    <>
      {/* <Box className="event-service-detail">
        <img className="service-detail-image" src={ServiceImg} alt="Event" />
        <Box className="service-detail-contents">
          <p className="quality">Quality and Efficience</p>
          <h1>Looking for Event Rental Service</h1>
          <p className="paragraph">
            Are you planning an important party or event? When it comes to
            making an occasion as special as possible, you want every detail to
            be perfect from the theme of your decor to the silverware on your
            table.
          </p>
          <p className="paragraph">
            Whether you’re preparing for a wedding, throwing a graduation party
            or holding a corporate event, you have so many factors to consider
            and boxes to check.
          </p>
          <p className="paragraph">
            Taking care of the basic necessities can be challenging enough not
            to mention the extra work that goes into decor, displays and special
            features.
          </p>
        </Box>
      </Box> */}
      {/* 
      <Box className="event-service-detail">
        <Box className="service-detail-contents">
          <p className="quality">Quality and Efficience</p>
          <h1>Looking for Event Rental Service</h1>
          <p className="paragraph">
            Are you planning an important party or event? When it comes to
            making an occasion as special as possible, you want every detail to
            be perfect from the theme of your decor to the silverware on your
            table.
          </p>
          <p className="paragraph">
            Whether you’re preparing for a wedding, throwing a graduation party
            or holding a corporate event, you have so many factors to consider
            and boxes to check.
          </p>
          <p className="paragraph">
            Taking care of the basic necessities can be challenging enough not
            to mention the extra work that goes into decor, displays and special
            features.
          </p>
        </Box>
        <img
          className="service-detail-image-second"
          src={EventImg}
          alt="Event"
        />
      </Box> */}

      <Box className="Different-section">
        <Typography variant="h6">What Makes Us Different</Typography>
        <Box className="Different-content">
          {gifData.map((gif) => (
            <Box key={gif.id} className="Gif-card">
              <img
                src={gif.img}
                alt={gif.description}
                className="gif-image-container"
              />
              <Typography>{gif.description}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      {/* <Box className="trusted-section">
        <Box className="trusted-left-content">
          <h1>Trusted by</h1>
          <h1 className="left-content-heading"> over 1200+ clients</h1>
          <p className="left-content-subHeading">Expert to level up your business</p>
        </Box>
        <Box className="trusted-right-content">
          <Box className="feature">
            <Box className="image-section">
              <img src="https://cdn-icons-png.freepik.com/512/6096/6096552.png" alt="Not found" />
            </Box>
            <Box className="content-section">
              <h2>20+</h2>
              <p className="project"> Projects</p>
            </Box>
          </Box>
          <Box className="feature">
            <Box className="image-section">
              <img src="https://cdn-icons-png.flaticon.com/512/8793/8793978.png" alt="Not found" />
            </Box>
            <Box className="content-section">
              <h2>800+</h2>
              <p className="clients"> Happy Clients</p>
            </Box>
          </Box>
          <Box className="feature">
            <Box className="image-section">
              <img src="https://cdn-icons-png.freepik.com/512/6096/6096552.png" alt="Not found" />
            </Box>
            <Box className="content-section">
              <h2>99+</h2>
              <p className="rental">Rental Tents</p>
            </Box>
          </Box>
        </Box>
      </Box> */}
    </>
  );
};

export default Details;
