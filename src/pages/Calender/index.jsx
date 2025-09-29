import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { setDates } from "../../redux/slice/dateSlice";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import "./styles.scss";
import { toast } from "react-toastify"; // Add this import
import "react-toastify/dist/ReactToastify.css"; 

const Calendar = ({ calendarClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get current date
  const today = new Date();

  // Get stored dates from Redux
  const { startDate, endDate } = useSelector((state) => state.date);

  // State initialization
  const [selectedDates, setSelectedDates] = useState([
    startDate ? new Date(startDate) : null,
    endDate ? new Date(endDate) : null,
  ]);
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [dateType, setDateType] = useState("start"); // Toggle between start and end date

  // Effect to set default dates if not selected
  useEffect(() => {
    if (!startDate || !endDate) {
      dispatch(
        setDates({
          startDate: null,
          endDate: null,
          numberOfDays: 1,
        })
      );
    }
  }, [dispatch, startDate, endDate]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setSelectedDates([start, end]);

    if (start && !end) {
      setDateType("end"); // Switch to end date after selecting start
      dispatch(
        setDates({
          startDate: start,
          endDate: null,
          numberOfDays: 1,
        })
      );
    } else if (start && end) {
      const difference =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setNumberOfDays(difference > 0 ? difference : 1);
      dispatch(
        setDates({
          startDate: start,
          endDate: end,
          numberOfDays: difference > 0 ? difference : 1,
        })
      );
    }
  };

  const handleDateTypeChange = (event, newDateType) => {
    if (newDateType !== null) {
      setDateType(newDateType);
    }
  };

  const handleConfirm = () => {
    if (selectedDates[0] && selectedDates[1]) {
      navigate("/");
      calendarClose();
    } else {
      alert("Please select both start and end dates.");
    }
  };

  return (
    <Box className="calendar-container" sx={{ p: 2, maxWidth: 400, mx: "auto" }}>
      <IconButton
        onClick={calendarClose}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      {/* HEADER */}
      <Box className="calendar-header" sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          Choose your Event Date
        </Typography>
      </Box>

      {/* TOGGLE BUTTONS */}
<Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
  <ToggleButtonGroup
    value={dateType}
    exclusive
    onChange={handleDateTypeChange}
    aria-label="date type"
    sx={{ bgcolor: "#f0f0f0", overflow: "hidden", fontSize: '14px' }}
  >
    <ToggleButton
      value="start"
      sx={{
        px: 2,
        py: 0.5,
        border: "none",
        fontSize: '12px',
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        "&.Mui-selected": {
          backgroundColor: "#d946ef",
          color: "white",
        },
        "&.Mui-selected:hover": {
          backgroundColor: "#c13ec8",
        },
        "&:hover": {
          backgroundColor: "#e0e0e0",
        },
      }}
    >
      Event Start Date
    </ToggleButton>
    <ToggleButton
      value="end"
      sx={{
        px: 2,
        py: 0.5,
        border: "none",
        fontSize: '12px',
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        "&.Mui-selected": {
          backgroundColor: "#d946ef",
          color: "white",
        },
        "&.Mui-selected:hover": {
          backgroundColor: "#c13ec8",
        },
        "&:hover": {
          backgroundColor: "#e0e0e0",
        },
      }}
    >
      Event End Date
    </ToggleButton>
  </ToggleButtonGroup>
</Box>



      {/* DATE PICKER */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <DatePicker
          selected={selectedDates[0]}
          onChange={handleDateChange}
          startDate={selectedDates[0]}
          endDate={selectedDates[1]}
          selectsRange
          inline
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={10}
          minDate={new Date()}
          maxDate={new Date(2035, 11, 31)}
          calendarClassName="custom-calendar"
          dayClassName={(date) =>
            (selectedDates[0] &&
              selectedDates[1] &&
              date >= selectedDates[0] &&
              date <= selectedDates[1]) ||
            date.toDateString() === selectedDates[0]?.toDateString() ||
            date.toDateString() === selectedDates[1]?.toDateString()
              ? "selected-date"
              : undefined
          }
        />
      </Box>

      {/* SELECTED DATES DISPLAY */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        {selectedDates[0] && (
          <Typography sx={{ fontSize: "0.9rem", mb: 0.5 }}>
            Start Date: {selectedDates[0].toLocaleDateString("en-GB")}
          </Typography>
        )}
        {selectedDates[1] && (
          <Typography sx={{ fontSize: "0.9rem", mb: 0.5 }}>
            End Date: {selectedDates[1].toLocaleDateString("en-GB")}
          </Typography>
        )}
        {selectedDates[0] && selectedDates[1] && (
          <Typography sx={{ fontSize: "0.9rem", color: "#c026d3", mb: 0.5 }}>
            Number of Days: {numberOfDays}
          </Typography>
        )}
      </Box>

      {/* CONFIRM BUTTON */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{
            backgroundColor: "#c026d3",
            color: "white",
            px: 4,
            py: 1,
            borderRadius: 8,
          }}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default Calendar;