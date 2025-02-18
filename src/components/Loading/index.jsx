import { Box } from "@mui/material";
import Loader from "../../assets/loading2.gif";

const Loading = ({ loading }) => {
  return (
    <>
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            position: "fixed", // Ensure it covers the whole screen
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999, // Ensure it's above other elements
          }}
        >
          <img
            style={{
              position: "absolute",
              width: "4rem",
            }}
            src={Loader}
            alt="Loading..."
          />
        </Box>
      )}
    </>
  );
};

export default Loading;
