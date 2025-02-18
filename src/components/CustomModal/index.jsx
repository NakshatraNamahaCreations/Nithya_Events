import React, { useEffect } from "react";
import Success from "../../assets/success02.gif";
import { Modal, Box, Typography, Button } from "@mui/material";

const CustomModal = ({ open, onClose, message, type }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: type === "success" ? "green" : "red", mb: 2 }}
        >
          {type === "success" ? "Success!" : "Failure!"}
        </Typography>
        {type === "success" ? (
          <img src={Success} style={{ width: "15rem" }} alt="Not found" />
        ) : (
          ""
        )}
        <Typography variant="body1" sx={{ mb: 3 }}>
          {message}
        </Typography>
      </Box>
    </Modal>
  );
};

export default CustomModal;
