
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is imported

const apiUrl = {
  BASEURL: "https://api.nithyaevent.com/api",
  GET_ALL_FAQ: "/faq/get-all-faq", // Assuming this is the endpoint; adjust if different
};

const FaqPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [faqList, setFaqList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFAQ = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_ALL_FAQ}`);
      if (res.status === 200) {
        setFaqList(res.data.faq || []); // Ensure faqList is an array even if response is empty
      }
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQ();
  }, []);

  const filteredFaqs = faqList.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: "10rem" }}>
      <Typography variant="h4" sx={{ marginBottom: "2rem", fontWeight: "bold" }}>
        Frequently Asked Questions
      </Typography>
      <TextField
        placeholder="Search FAQs..."
        fullWidth
        variant="outlined"
        sx={{ marginBottom: "2rem" }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {isLoading ? (
        <Typography>Loading FAQs...</Typography>
      ) : filteredFaqs.length > 0 ? (
        filteredFaqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography>No FAQs found.</Typography>
      )}
    </Box>
  );
};

export default FaqPage;
