import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { setDates } from "../../redux/slice/dateSlice";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CustomModal from "../../components/CustomModal";
import "./styles.scss"; // Add custom styles here

const Calendar = ({ calendarClose }) => {
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDateChange = (dates) => {
    setSelectedDates(dates);

    if (dates[0] && dates[1]) {
      const difference =
        Math.ceil(
          (dates[1].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24)
        ) + 1; 
      setNumberOfDays(difference);
    } else {
      setNumberOfDays(1);
    }

    if (dates[0]) {
      dispatch(
        setDates({
          startDate: dates[0],
          endDate: dates[1] ? dates[1] : dates[0],
          numberOfDays: dates[1] ? numberOfDays : 1,
        })
      );
    }
  };

  const handleConfirm = () => {
    if (selectedDates[0] || selectedDates[1]) {
      // setOpenModal(true);
      // setModalMessage(
      //   `Thank you! Your event is booked for ${numberOfDays} day(s).`
      // );
      // setModalType("success");
      
      navigate("/");
      calendarClose();
    } else {
      alert("Please select a date range first.");
    }
  };

  return (
    <Box className="calendar-container">
      {/* HEADER SECTION */}
      <Box className="calendar-header">
        <EventIcon className="calendar-icon" />
        <Typography variant="h6">Choose your Event Date</Typography>
        <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }} mt={1}>
          {selectedDates[0] && (
            <Typography
              className="calendar-date"
              sx={{ fontSize: "0.85rem", height: "33px", padding:'0.4rem 1rem' }}
            >
              {selectedDates[0]?.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}{" "}
        
        {selectedDates[1] ? (
  <>
    -{" "}
    {selectedDates[1]?.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })}
  </>
) : ""}
           
            </Typography>
          )}
          {numberOfDays > 0 && (
            <Typography
              className="noofdays"
              variant="p"
              sx={{ color: "#d946ef", fontSize: "0.85rem", height: "30px" }}
            >
              {numberOfDays} {numberOfDays > 1 ? "days" : "day"}
            </Typography>
          )}
        </Box>
      </Box>

      {/* DATE PICKER WITH YEAR DROPDOWN */}
      <Box mt={5}>
        <DatePicker
          selected={selectedDates[0]}
          onChange={handleDateChange}
          startDate={selectedDates[0]}
          endDate={selectedDates[1]}
          selectsRange
          inline
          min 
          showYearDropdown
          scrollableYearDropdown
          dateFormat="yyyy" 
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
          sx={{backgroundColor:'#c026d3'}}
          className="calendar-confirm-btn"
          disabled={!selectedDates[0]}
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
