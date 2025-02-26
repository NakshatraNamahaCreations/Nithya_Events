import React, { useState, useEffect } from "react";
import { Box, Typography, Slider, Paper, Button } from "@mui/material";

const DiscountSlider = ({
    onChange,
    min = 0,
    max = 100,
    step = 1,
    value = [0, 100],
    label,
}) => {
    const [range, setRange] = useState(value);

    // Only update local state if the prop `value` changes and avoid unnecessary re-renders
    useEffect(() => {
        if (value[0] !== range[0] || value[1] !== range[1]) {
            setRange(value);
        }
    }, [value]);

    const handleChange = (event, newVal) => {
        setRange(newVal);
        onChange(newVal);
    };

    const handleReset = () => {
        const defaultRange = [min, max];
        setRange(defaultRange);
        onChange(defaultRange);
    };

    return (
        <Paper
            elevation={3}
            sx={{ padding: 3, maxWidth: 400, margin: "auto", borderRadius: 2 }}
        >
            <Typography
                variant="body1"
                fontWeight="medium"
                color="text.secondary"
                gutterBottom
            >
                Filter by {label}
            </Typography>

            <Slider
                value={range}
                onChange={handleChange}
                valueLabelDisplay="auto"
                min={min}
                max={max}
                step={step}
                sx={{
                    color: "#4CAF50",
                    "& .MuiSlider-thumb": {
                        width: 20,
                        height: 20,
                        backgroundColor: "#2E7D32",
                        "&:hover": {
                            boxShadow: "0px 0px 8px #2E7D32",
                        },
                    },
                    "& .MuiSlider-track": {
                        height: 6,
                    },
                    "& .MuiSlider-rail": {
                        height: 6,
                        backgroundColor: "#E0E0E0",
                    },
                }}
            />

            <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="body2" color="text.secondary">
                    Min:{" "}
                    <span style={{ color: "#2E7D32", fontWeight: "bold" }}>
                        {label === "discount" ?  `${range[0]}%` :   `₹${range[0]}`}
                    </span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Max:{" "}
                    <span style={{ color: "#2E7D32", fontWeight: "bold" }}>
                    {label === "discount" ?  `${range[1]}%` :   `₹${range[1]}`}
                    </span>
                </Typography>
            </Box>

            {/* <Typography
                variant="body2"
                sx={{
                    backgroundColor: "#E8F5E9",
                    padding: "10px",
                    borderRadius: "8px",
                    textAlign: "center",
                    marginTop: "10px",
                }}
            >
                Showing products with{" "}
                <strong style={{ color: "#2E7D32" }}>
                    {unit === "%"
                        ? `${range[0]}% - ${range[1]}%`
                        : `₹${range[0]} - ₹${range[1]}`}
                </strong>{" "}
                {label.toLowerCase()}.
            </Typography> */}
            <Button
                variant="outlined"
                color="error"
                onClick={handleReset}
                sx={{ mt: 2, width: "100%" }}
            >
                Reset {label}
            </Button>
        </Paper>
    );
};

export default DiscountSlider;
