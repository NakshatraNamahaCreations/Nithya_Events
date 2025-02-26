import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const PromoCard = () => {
    return (
        <Paper
            elevation={1}
            sx={{
                display:'flex',
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #B0BEC5",
                width: "333px",
                boxSizing: "border-box",
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                    variant="p"
                    sx={{ fontWeight: "500", marginBottom: "0.5rem", fontSize: "0.7rem" }}
                >
                    Get upto 30% Off on order value above $100
                </Typography>
                <Typography
                    variant="p"
                    sx={{
                        color: "#1976D2",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontSize: "0.6rem",
                    }}
                >
                    Terms & Conditions
                </Typography>

            </Box>
            <Box>

            <Paper
                elevation={2}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: "0.5rem 1rem",
                    backgroundColor: "#F5F5F5",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                    alignItems: 'center'
                }}
            >
                <Typography
                    variant="p"
                    sx={{ fontSize: "0.55rem", color: "#333", fontWeight: "500" }}
                >
                    Use Code
                </Typography>
                <Typography
                    variant="p"
                    sx={{ fontWeight: "bold", marginTop: "0.2rem", fontSize: '0.8rem' }}
                >
                    ORDER100
                </Typography>
            </Paper>
            </Box>

        </Paper>
    );
};

const Coupon = () => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                padding: "1rem 0",
                flexWrap: "wrap",
                // maxWidth: "100%",
                // marginLeft: '-1rem'
            }}
        >
            <PromoCard />
            <PromoCard />
        </Box>
    );
};

export default Coupon;
