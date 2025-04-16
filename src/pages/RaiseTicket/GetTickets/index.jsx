import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, CircularProgress, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GetTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userDetails = sessionStorage.getItem("userDetails");

  let userId = null;

  if (userDetails) {
    try {
      let userDetail = JSON.parse(userDetails);
      userId = userDetail._id;
    } catch (error) {
      console.error("Error in userDetails from sessionStorage");
    }
  }
const handleNavigate = (ticket) => {
  navigate("/ticket-details",{state:{ticket}});
}
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `https://api.nithyaevent.com/api/ticket/get-ticket-by-id/${userId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }
        const data = await response.json();
        const sortedTickets = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setTickets(sortedTickets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 6, color: 'red', fontWeight: 'bold' }}>
        {error}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', mt: 8, mb: 12 }}>
      {tickets.length > 0 && tickets ? (
        tickets.map((ticket) => (
        <Card
          key={ticket._id}
          sx={{
            width: 350,
            borderRadius: 3,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            transition: '0.3s',
            cursor:'pointer',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
            },
          }}
          onClick={() => handleNavigate(ticket)}
        >
          {/* Gradient Header */}
          <Box
            sx={{
              background: '#c026d3',
              color: 'white',
              padding: '10px 16px',
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Ticket ID: {ticket._id.slice(-6)}
            </Typography>
            <Typography variant="caption">{ticket.ticket_created_date}</Typography>
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              {ticket.product_name.length > 30
                ? `${ticket.product_name.slice(0, 30)}...`
                : ticket.product_name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <strong>Issue:</strong> {ticket.ticket_reason}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Description:</strong>{' '}
              {ticket.ticket_command ? ticket.ticket_command : 'No description provided.'}
            </Typography>

            <Chip
              label={ticket.ticket_status}
              sx={{
                backgroundColor:
                  ticket.ticket_status === 'Resolved'
                    ? '#4CAF50'
                    : ticket.ticket_status === 'Pending'
                    ? '#FFC107'
                    : '#607D8B',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                padding: '5px 12px',
                borderRadius: '4px',
              }}
            />
          </CardContent>
        </Card>
      ))
    ) : (

<Typography variant='p' mt={10} mb={20}>        No Ticket found!!
</Typography>
)}
    </Box>
  );
};

export default GetTickets;
