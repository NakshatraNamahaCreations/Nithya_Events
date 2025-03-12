import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { setDates } from "../../redux/slice/dateSlice";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import CustomModal from "../../components/CustomModal";
import "./styles.scss";

const Calendar = ({ calendarClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get current date
  const today = new Date();
  
  // Get stored dates from Redux
  const { startDate, endDate } = useSelector((state) => state.date);

  // State initialization with current date as default
  const [selectedDates, setSelectedDates] = useState([
    startDate ? new Date(startDate) : today,
    endDate ? new Date(endDate) : today,
  ]);
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  // Effect to set default dates if not selected
  useEffect(() => {
    if (!startDate || !endDate) {
      dispatch(
        setDates({
          startDate: today,
          endDate: today,
          numberOfDays: 1,
        })
      );
    }
  }, [dispatch, startDate, endDate, today]);

  const handleDateChange = (dates) => {
    setSelectedDates(dates);

    let start = dates[0] || today; // Default to today if no start date
    let end = dates[1] || start; // Default to start date if no end date
    let difference =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    setNumberOfDays(difference);

    dispatch(
      setDates({
        startDate: start,
        endDate: end,
        numberOfDays: difference,
      })
    );
  };

  const handleConfirm = () => {
    if (selectedDates[0]) {
      navigate("/");
      calendarClose();
    } else {
      alert("Please select a date range first.");
    }
  };

  return (
    <Box className="calendar-container">
      {/* HEADER */}
      <Box className="calendar-header">
        <EventIcon className="calendar-icon" />
        <Typography variant="h6">Choose your Event Date</Typography>
        <Box sx={{ display: "flex", gap: "0.3rem", alignItems: "center" }} mt={1}>
          <Typography className="calendar-date">
            {selectedDates[0]?.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}{" "}
            -{" "}
            {selectedDates[1]?.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </Typography>
          <Typography
            className="noofdays"
            sx={{ color: "#d946ef", fontSize: "0.85rem", height: "30px" }}
          >
            {numberOfDays} {numberOfDays > 1 ? "days" : "day"}
          </Typography>
        </Box>
      </Box>

      {/* DATE PICKER */}
      <Box mt={5}>
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
        />
      </Box>

      {/* CONFIRM BUTTON */}
      <div className="calendar-footer">
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{ backgroundColor: "#c026d3" }}
          className="calendar-confirm-btn"
        >
          Confirm
        </Button>
      </div>

      {/* MODAL */}
      <CustomModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        message={modalMessage}
        type={modalType}
      />
    </Box>
  );
};

export default Calendar;
