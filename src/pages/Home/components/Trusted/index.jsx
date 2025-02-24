import { Box, Typography } from "@mui/material";

import EventImg from "../../../../assets/TrustedImg.png";

// Styles
import "./styles.scss";

const Trusted = () => {
  const features = [
    {
      number: "01",
      title: "Your Trust Our Commitment",
      description:
        "Make your event planning stress-free. Streamline every detail with ease.",
    },
    {
      number: "02",
      title: "Creating Joy for Our Clients",
      description:
        "Crafting events that leave lasting impressions for our valued clients.",
    },
    {
      number: "03",
      title: "When Trust Meets Excellence",
      description:
        "Delivering outstanding experiences every time for our clients.",
    },
    {
      number: "04",
      title: "Your Event, Our Expertise Delivered",
      description:
        "Our experienced team ensures every event is planned and executed with creativity.",
    },
  ];

  return (
    <Box
      sx={{ padding: { xs: "1rem", md: "2rem 5rem" }, backgroundColor: "#f8f9fa" }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
        <Typography
          sx={{
            color: "#db62ea",
            fontSize: { xs: "1rem", md: "1.2rem" },
            fontWeight: "bold",
          }}
        >
          Trusted
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "1.5rem", md: "2rem" },
            fontWeight: "bold",
            color: "#343a40",
            marginBottom: "1rem",
          }}
        >
          Trusted by over 140+ clients
        </Typography>
        <Typography
          sx={{
            color: "#6c757d",
            fontSize: { xs: "0.9rem", md: "1rem" },
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Make your event planning stress-free. Streamline every detail with
          ease. Focus on what truly matters—celebrating!
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#c026d3",
          borderRadius: "10px",
          padding: { xs: "1rem", md: "3rem" },
          color: "#fff",
          gap: { xs: "1.5rem", md: "0" },
        }}
      >
        {/* Feature List */}
        <Box sx={{ flex: "1" }}>
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                marginBottom: "1.5rem",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                {feature.number} {feature.title}
              </Typography>
              <Typography
                sx={{
                  color: "#dbe9ff",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  marginTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid #dbe9ff",
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            flex: "1",
            textAlign: "center",
          }}
        >
          <img
            src={EventImg}
            alt="Trusted Clients"
            style={{
              width: "82%",
              height: "auto",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Trusted;
