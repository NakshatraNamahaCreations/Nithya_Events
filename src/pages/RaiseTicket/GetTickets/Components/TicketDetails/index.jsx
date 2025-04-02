import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Divider, Chip, Button, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { formatDate, formatTicketDate } from "../../../../../utils/helperFunc";

const TicketDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const ticket = state?.ticket;

  if (!ticket) {
    return (
      <Box
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <Typography variant="h6" color="error">
          No Ticket Data Found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 8,
        mb: 8,
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 600,
          width: "100%",
          borderRadius: 4,
          padding: 4,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Ticket Details
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Ticket ID:</strong> {ticket._id.slice(-6)}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Product Name:</strong> {ticket.product_name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Reason:</strong> {ticket.ticket_reason}
          </Typography>
        </Box>

        {ticket.ticket_image && (
          <Box
            component="img"
            src={ticket.ticket_image}
            alt="ticket"
            sx={{
              width: "100%",
              maxHeight: 250,
              objectFit: "cover",
              borderRadius: 2,
              mb: 2,
            }}
          />
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Status:</strong>{" "}
            <Chip
              label={ticket.ticket_status}
              sx={{
                backgroundColor:
                  ticket.ticket_status === "Resolved"
                    ? "#4CAF50"
                    : ticket.ticket_status === "Pending"
                    ? "#FFC107"
                    : "#607D8B",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
                px: 2,
              }}
            />
          </Typography>

          <Typography variant="body1" mt={2}>
            <strong>Created On:</strong> {formatTicketDate(ticket.createdAt)}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default TicketDetails;
