import { Box, Button, Typography } from "@mui/material";
import Success from "../../../../../assets/successGif.gif";
import { Navigate, useNavigate } from "react-router-dom";


const ModalItem = ({modalMessage, modalType,onClose}) => {

    const navigate = useNavigate();
    return(
        <>
               <Box
              className="modal-container"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: modalType === "success" ? "#e1f4e5" : "#ffebee", // Green for success, Red for error
                borderRadius: "10px",
              }}
            >
              <img src={Success} className="success-image" alt="Success" style={{ display: modalType === "success" ? "block" : "none", width:'170px', height:'120px' }} />
              <Typography id="modal-title" variant="h6" component="h2" sx={{ color: modalType === "success" ? "#2e7d32" : "#d32f2f" }}>
                {modalType === "success" ? "Success!" : "Error"}
              </Typography>

              <Typography id="modal-description" sx={{ mt: 2 }}>

                {modalMessage}
              </Typography>
            {

                modalMessage === "This product is already in your wishlist!" ? <Button variant="contained" onClick={() => navigate("/wishlist")} sx={{marginTop:'2rem', backgroundColor:'#c026d3'}}>Go to wishlist</Button>
                : ""
            }
<Button onClick={onClose} sx={{ mt: 3 }}>
  Close
</Button>

            </Box>
        </>
    )
}

export default ModalItem;