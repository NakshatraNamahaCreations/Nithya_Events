import React, { useState, useEffect } from "react";
import authService from "../../api/ApiService";
import "./styles.scss";
import { Box, Typography } from "@mui/material";
import {
  BuildOutlined,
  DesignServicesOutlined,
  CodeOutlined,
  VideoLibraryOutlined,
  BrushOutlined,
  AppsOutlined,
} from "@mui/icons-material";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import HotelIcon from "@mui/icons-material/Hotel";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonIcon from "@mui/icons-material/Person";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import GppGoodIcon from "@mui/icons-material/GppGood";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import HouseboatIcon from "@mui/icons-material/Houseboat";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slice/LoaderSlice";
import { useNavigate } from "react-router-dom";

const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getServices = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.getAllServices();
      setServices(res.data.data);
      setFilteredServices(res.data.data);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter((service) =>
      service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleService = (service) => {
    navigate(`/service/${service}`);
  };

  const getServiceIcon = (serviceName) => {
    switch (serviceName.toLowerCase()) {
      case "rooms":
        return <HomeWorkIcon fontSize="large" />;
      case "hotels":
        return <HotelIcon fontSize="large" />;
      case "resort":
        return <HouseboatIcon fontSize="large" />;
      case "vendor & seller":
        return <StorefrontIcon fontSize="large" />;
      case "photographers":
        return <VideoLibraryOutlined fontSize="large" />;
      case "artists":
        return <BrushOutlined fontSize="large" />;
      case "freelancer":
        return <PersonIcon fontSize="large" />;
      case "stage designers":
        return <DesignServicesOutlined fontSize="large" />;
      case "catering servcie":
        return <RestaurantMenuIcon fontSize="large" />;
      case "technical support":
        return <PointOfSaleIcon fontSize="large" />;
      case "security personnel":
        return <GppGoodIcon fontSize="large" />;
      case "volunteers":
        return <PeopleAltIcon fontSize="large" />;
      case "manpower":
        return <PersonIcon fontSize="large" />;
      default:
        return <BuildOutlined fontSize="large" />; //
    }
  };

  return (
    <Box className="service-page">
      <Box className="search-bar">
        <Typography variant="p" style={{ color: "#c026d3" }}>
          Our Services
        </Typography>
        <Typography variant="h6">
          Turning Every Moment into an Enjoyable Journey.
        </Typography>
        <input
          type="text"
          placeholder="Search for services..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </Box>

      <Box className="services-grid">
        {filteredServices.map((service) => (
          <Box
            key={service._id}
            className="service-card"
            onClick={() => handleService(service.service_name)}
            sx={{ cursor: "pointer" }}
          >
            <Box className="icon-container">
              {getServiceIcon(service.service_name)}
            </Box>
            <h3>{service.service_name}</h3>
            <p>
              <strong>Requirements:</strong>{" "}
              {service.requirement_fields.length > 0
                ? service.requirement_fields.slice(0, 3).map((req, index) => (
                    <span key={req.unique_id}>
                      {req.parameter}
                      {index < service.requirement_fields.slice(0, 3).length - 1
                        ? ", "
                        : ""}
                    </span>
                  ))
                : "None"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {service.isActive ? "Active" : "Inactive"}
            </p>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ServicePage;
