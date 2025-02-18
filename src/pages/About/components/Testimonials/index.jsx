import React, { useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import "./styles.scss";
import { Box } from "@mui/material";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      text: "As someone who regularly attends live performances, nithyatickets.com has been a huge help in securing tickets to events across the city. The app is easy to use, and I’ve never faced any issues with bookings or payments.",
      name: "Sandeep P., Professional Musician",
    },
    {
      text: "I’ve used nithyatickets.com to book tickets for group outings, and it’s always a smooth experience. The bulk booking options make it easy to get tickets for everyone in my group, and the process is simple and quick. Definitely a great platform for group events.",
      name: "Vikram D., Group Event Planner",
    },
    {
      text: "With nithya, managing ticket sales has never been simpler. The customization options allowed us to tailor the tickets perfectly to our audience, and the analytics have been invaluable for planning future events.",
      name: "Sarah L, Festival Director",
    },
    
    {
      text: "nithyatickets.com makes it so easy to book tickets for events! I love how quick and user-friendly the site is. I can choose the event, pick my seat, and pay in just a few minutes. It’s my go-to for all my event plans!",
      name: "Priya M. , Movie Enthusiast",
    },
    {
      text: "nithyatickets.com has been a game-changer for promoting and selling tickets for events. The interface is so intuitive, and the process is straightforward for both organizers and attendees. It’s a fantastic tool for managing large-scale events.",
      name: "Anita K. , Event Organizer",
    },
    {
      text: "I was a bit hesitant to use nithyatickets.com initially, but it’s been nothing but a smooth experience. Booking Eventx was quick, and I was kept informed with real-time updates about my bookings. I’ll definitely be using it again!",
      name: "Arun V. , First-Time User",
    },
    {
      text: "I booked tickets for a live concert through nithyatickets.com and it was a breeze. The website was easy to navigate, and I loved how I could choose my seats and see the entire seating chart before booking. Great experience!",
      name: "Anita K. , Event Organizer",
    },
    {
      text: "As someone who regularly attends live performances, nithyatickets.com has been a huge help in securing tickets to events across the city. The app is easy to use, and I’ve never faced any issues with bookings or payments.",
      name: "Sandeep P., Professional Musician",
    },
    {
      text: "The nithyatickets.com site is fantastic! The interface is sleek and intuitive. I especially love the push notifications that alert me when my favorite shows are about to go on sale. It makes booking tickets incredibly efficient!",
      name: "Neha R. , Tech Enthusiast",
    },
    {
      text: "I’ve used nithyatickets.com to book tickets for group outings, and it’s always a smooth experience. The bulk booking options make it easy to get tickets for everyone in my group, and the process is simple and quick. Definitely a great platform for group events.",
      name: "Vikram D., Group Event Planner",
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
     <section id="testimonials">
    <Box className="testimonials">
      <h2>Our Customer</h2>
      <h3>Testimonials</h3>
      <Box className="testimonial-container">
        <Box className="testimonial-card">
            <Box className="testimonial-card-header">
            {/* <img
              src={testimonials[currentIndex].image}
              alt={testimonials[currentIndex].name}
            /> */}
        <FormatQuoteIcon style={{fontSize:'2.4rem'}}/>
                    <p>{testimonials[currentIndex].text}</p>
            </Box>
    
  
          <Box className="customer-info">
        
            <h4>{testimonials[currentIndex].name}</h4>
          </Box>
        </Box>
        <ArrowForwardIosIcon className="testimonial-forward-arrow" onClick={handleNext}/>
        <ArrowBackIosNewIcon className="testimonial-backward-arrow" onClick={handlePrev}/>
      </Box>
 
    </Box>
    </section>
  );
};

export default Testimonials;
