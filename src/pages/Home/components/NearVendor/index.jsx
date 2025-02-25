import { Box, Button, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import "./styles.scss";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "../../../../api/ApiService";
import { getErrorMessage } from "../../../../utils/helperFunc";

const NearVendor = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      const res = await authService.vendorLists();

      setVendors(res.data.data);
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const handleVendorClick = (id) => {
    navigate(`/vendors/${id}`);
  };
  useEffect(() => {
    fetchVendors();
  }, []);
  return (
    <Box sx={{ padding: { xs: "1rem 1rem", md: "0rem 6rem" } }}>

      <Box className="Vendor-container">
        <Box
          className="Vendor-content"
          style={{
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "96%",
            marginTop: "2rem",
            marginLeft: "2rem",
          }}
        >
          <Typography variant="h5" sx={{color:'#343a40'}}>
            Near By Vendors
          </Typography>

        </Box>

        <Box className="Vendor-card-container">
          {vendors.map((item) => (
            <Box
              className="Vendor-card"
              key={item._id}
              onClick={() => handleVendorClick(item._id)}
              style={{
                borderRadius: "8px",
                width: "248px",
                flexShrink: 0,
              }}
            >
              <img
                src={item.shop_image_or_logo}
                alt={item.ServiceName}
                style={{
                  width: "100%",
                  height: "206px",
                  objectFit: "cover",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              />
              <Box padding={2}>
                <Typography variant="h6" gutterBottom>
                  {item.shop_name.slice(0, 12).concat("...")}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <PlaceIcon color="action" />
                  <Typography variant="body2">
                    {item.address[0].distric}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        {/* <Link to="/vendors">
          <Button className="Vendor-viewAll">View All</Button>
        </Link> */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Button
            variant="contained"
            sx={{ marginTop: "4rem", backgroundColor: "#c026d3" }}
            className="view-all-button"
            onClick={() => navigate("/vendors")}
          >
            View All
          </Button>
        </Box>

      </Box>

    </Box>
  );
};

export default NearVendor;
