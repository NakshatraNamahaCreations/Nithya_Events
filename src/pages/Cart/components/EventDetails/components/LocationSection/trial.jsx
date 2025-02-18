import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const LocationSection = ({ onContinue }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationCoords, setLocationCoords] = useState({
    lat: null,
    lng: null,
  });

  const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g"; // Replace with actual API key

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handleSelect = async (place) => {
    console.log("Place selected:", place);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: place.value.place_id }, (results, status) => {
      if (status === "OK" && results[0]) {
        setSelectedLocation(results[0].formatted_address);
        setLocationCoords({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        });
      }
    });
  };

  if (!isLoaded) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6">Search Location</Typography>

      {/* Google Places Autocomplete Input */}
      <GooglePlacesAutocomplete
        apiKey={GOOGLE_MAPS_API_KEY}
        selectProps={{
          value: selectedLocation,
          onChange: handleSelect,
          placeholder: "Enter a location",
        }}
      />

      {/* Display Google Map */}
      <GoogleMap
        mapContainerStyle={{
          height: "200px",
          width: "100%",
          marginTop: "10px",
        }}
        center={
          locationCoords.lat ? locationCoords : { lat: 12.9716, lng: 77.5946 }
        }
        zoom={12}
      />

      <Box mt={2}>
        <Typography variant="body1">
          Selected Location: {selectedLocation || "No location selected"}
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        color="primary"
        sx={{ mt: 2 }}
        onClick={() =>
          onContinue({
            address: selectedLocation,
            lat: locationCoords.lat,
            lng: locationCoords.lng,
          })
        }
        disabled={!selectedLocation}
      >
        Continue
      </Button>
    </Box>
  );
};

export default LocationSection;
