import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Box } from "@mui/material";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  border: "none",
  backgroundColor: "transparent",
  marginBottom: "1rem",
  borderRadius: "10px",
  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const AccordionSummary = styled(MuiAccordionSummary)(() => ({
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  padding: "1rem 1.5rem",
  "& .MuiAccordionSummary-expandIconWrapper": {
    transition: "transform 0.3s",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
  backgroundColor: "#f9f9f9",
  borderRadius: "10px",
  padding: "1.5rem",
  fontSize: "1rem",
  color: "#555",
}));

const Faq = () => {
  const [expanded, setExpanded] = useState("");

  const faqList = [
    {
      id: 1,
      Title: "What is Nithya?",
      description:
        "Nithya Event is a powerful online Event Booking platform designed to make event management easy and efficient. Organizers can create and manage event with ease.",
    },
    {
      id: 2,
      Title: "What features does Nithya provide?",
      description:
        "Our platform offers tailored Event options, secure payment processing, real-time analytics, and tools to track your event and revenue for all event sizes.",
    },
    {
      id: 3,
      Title: "Why choose Nithya Events?",
      description:
        "We ensure a smooth and professional event experience with reliable tools that simplify event planning, helping you deliver unforgettable experiences.",
    },
    {
      id: 4,
      Title: "Is Nithya Events secure?",
      description:
        "Yes, Nithya Event uses encrypted payment systems to ensure secure and reliable transactions for both organizers and attendees.",
    },
  ];

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : "");
  };

  return (
    <section id="faq">
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: {xs:"1rem", sm:"2rem", md:"20rem"},
          // maxWidth: "1200px",
          margin: "2rem",
          padding: "2rem 5rem",
        }}
      >
        {/* FAQ Section */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              color: "#ed6bfd",
              fontWeight: "bold",
              fontSize: "1.2rem",
              textTransform: "uppercase",
            }}
          >
            FAQ
          </Typography>
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#343a40",
            }}
          >
            Frequently Asked Question
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              color: "#6c757d",
              marginBottom: "2rem",
            }}
          >
            Make your event planning stress-free. Streamline every detail with
            ease. Focus on what truly matters—celebrating!
          </Typography>
          {faqList.map((item) => (
            <Accordion
              expanded={expanded === `panel${item.id}`}
              onChange={handleChange(`panel${item.id}`)}
              key={item.id}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#17a2b8" }} />}
                aria-controls={`panel${item.id}-content`}
                id={`panel${item.id}-header`}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {item.Title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{item.description}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Image Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="https://www.eventsindustryforum.co.uk/images/articles/about_the_eif.jpg"
            alt="FAQ"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>
    </section>
  );
};

export default Faq;
