import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

const faqs = [
    { question: "What is your return policy?", answer: "You can return items within 30 days of purchase." },
    { question: "How do I track my order?", answer: "Once your order is shipped, you will receive an email with the tracking information." },
    { question: "Do you offer international shipping?", answer: "Yes, we ship to many countries worldwide. Shipping fees apply." },
    { question: "Can I change or cancel my order?", answer: "If your order hasn’t shipped yet, you can change or cancel it by contacting our support team." },
    { question: "What payment methods do you accept?", answer: "We accept credit cards, debit cards, and online payment methods." }
];

const FaqPage = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ padding: '10rem' }}>
            <Typography variant="h4" sx={{ marginBottom: '2rem', fontWeight: 'bold' }}>
                Frequently Asked Questions
            </Typography>
            <TextField
                placeholder="Search FAQs..."
                fullWidth
                variant="outlined"
                sx={{ marginBottom: '2rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {filteredFaqs.map((faq, index) => (
                <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
                        <Typography>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{faq.answer}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default FaqPage;
