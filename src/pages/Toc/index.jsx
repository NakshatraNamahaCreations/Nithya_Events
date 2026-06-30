import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import axios from "axios";
import { config } from "../../api/config";

const Toc = () => {
  const [tncList, setTncList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get(
          `${config.BASEURL}/tnc/get-user-tnc`
        );

        if (response.data && Array.isArray(response.data)) {
          setTncList(response.data);
        } else {
          setError("No Terms & Conditions found.");
        }
      } catch (err) {
        setError("Failed to load Terms & Conditions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  return (
    <Box pl={8} pr={8} pt={5}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold", mb: "2rem", mt: "2rem" }}
      >
        Terms and Conditions
      </Typography>

      {/* ✅ Loading */}
      {loading && (
        <Box textAlign="center" mt={5}>
          <CircularProgress />
        </Box>
      )}

      {/* ✅ Error */}
      {error && (
        <Typography
          color="error"
          textAlign="center"
          sx={{ fontWeight: "bold", mt: 3 }}
        >
          {error}
        </Typography>
      )}

      {/* ✅ T&C Data */}
      {!loading && !error && (
        <Paper
          sx={{
            mb: 3,
            p: 3,
            border: "1px solid #ddd",
            borderRadius: "4px",
            bgcolor: "#f9f9f9",
          }}
        >
          {tncList.map((item, index) => (
            <Box key={item._id} sx={{ mb: 4 }}>
              {/* ✅ Title */}
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mt: 3, mb: 1 }}
              >
                {item.title}
              </Typography>

              {/* ✅ Description with line breaks */}
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-line", lineHeight: 1.7 }}
              >
                {item.description || ""}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default Toc;
