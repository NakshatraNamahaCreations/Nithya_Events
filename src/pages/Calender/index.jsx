import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { setDates } from "../../redux/slice/dateSlice";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.scss";
import { Box, Button } from "@mui/material";
import CustomModal from "../../components/CustomModal";

const Calendar = ({ calendarClose }) => {
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDateChange = (dates) => {
    setSelectedDates(dates);

    if (dates[0]) {
      dispatch(setDates({ startDate: dates[0], endDate: dates[1] ? dates[1] : dates[0] }));
    }
  };

  const handleConfirm = () => {
    if (selectedDates[0]) {
      setOpenModal(true);
      setModalMessage("Thank you! Your event dates are confirmed.");
      setModalType("success");
      calendarClose();
      navigate("/products");
     
    } else {
      alert("Please select a date range first.");
    }
  };

  return (
    <Box style={{ padding: "15px", fontFamily: "'Poppins', sans-serif" }}>
      <h2
        style={{
          marginBottom: "20px",
          color: "#333",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Select Event Dates
      </h2>
      <DatePicker
        selected={selectedDates[0]}
        onChange={handleDateChange}
        startDate={selectedDates[0]}
        endDate={selectedDates[1]}
        selectsRange
        inline
        monthsShown={1}
        calendarClassName="custom-calendar"
      />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{
            flex: 1,
            background:
              !selectedDates[0] || !selectedDates[1]
                ? "linear-gradient(90deg, #d3d3d3, #b0b0b0)"
                : "linear-gradient(90deg, #6c63ff, #845ec2)",
            textTransform: "uppercase",
            fontWeight: "bold",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              background: "linear-gradient(90deg, #845ec2, #6c63ff)",
            },
          }}
          disabled={!selectedDates[0]}
        >
          Confirm
        </Button>
      </div>
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
