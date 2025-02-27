import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import CloseIcon from "@mui/icons-material/Close";
import authService from "../../../../../../api/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../../../../redux/slice/LoaderSlice";
import { getErrorMessage } from "../../../../../../utils/helperFunc";

const LocationSection = ({ onContinue, setOpenLocation }) => {
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [locationCoords, setLocationCoords] = useState({
    lat: null,
    lng: null,
  });
  const [addressDetails, setAddressDetails] = useState([]);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const dispatch = useDispatch();

  const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handlePlaceSelect = async (place) => {
    
    if (!place) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: place.value.place_id }, (results, status) => {
      if (status === "OK" && results[0]) {
        setSearchedLocation(results[0].formatted_address);
        setSelectedSavedAddress(null);
        setLocationCoords({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        });
      }
    });
  };

  const getAddress = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.getUserProfile(userDetails._id);
      setAddressDetails(res.data.saved_address);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      getErrorMessage(error);
    }
  };

  const handleSaveLocation = async () => {
    if (searchedLocation) {
      await authService.addAddress(userDetails._id, {
        saved_address: {
          id: Date.now(),
          selected_region: searchedLocation,
          latitude: locationCoords.lat,
          longitude: locationCoords.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        },
      });
      getAddress();
      setIsAddingNewAddress(false);
      setSearchedLocation("");
    }
  };

  const handleSavedAddressSelect = (location) => {
    setSelectedSavedAddress(location);
    setSearchedLocation(null);
    setLocationCoords({ lat: location.latitude, lng: location.longitude });
  };

  const handleContinue = () => {
    if (searchedLocation) {
      // If user searched a new location
      onContinue({
        address: searchedLocation,
        lat: locationCoords.lat,
        lng: locationCoords.lng,
      });
    } else if (selectedSavedAddress) {
      // If user selected a saved address
      onContinue({
        address: selectedSavedAddress.selected_region,
        lat: selectedSavedAddress.latitude,
        lng: selectedSavedAddress.longitude,
      });
    } else {
      alert("Please select or search for a location before continuing.");
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  if (!isLoaded) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "1rem",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Saved Address
        </Typography>
        <CloseIcon
          sx={{ cursor: "pointer" }}
          onClick={() => setOpenLocation(false)}
        />
      </Box>

      {addressDetails.map((location) => (
        <FormControlLabel
          key={location._id}
          control={
            <Checkbox
              checked={selectedSavedAddress?.id === location.id}
              onChange={() => handleSavedAddressSelect(location)}
            />
          }
          label={location.selected_region}
        />
      ))}

      {!isAddingNewAddress ? (
        <Button
          variant="outlined"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={() => setIsAddingNewAddress(true)}
        >
          + Add New Address
        </Button>
      ) : (
        <Box
          sx={{
            marginTop: 2,
            padding: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Add New Address
          </Typography>

          {/* Google Places Autocomplete Input */}
          <GooglePlacesAutocomplete
            apiKey={GOOGLE_MAPS_API_KEY}
            selectProps={{
              value: searchedLocation
                ? { label: searchedLocation, value: searchedLocation }
                : null,
              onChange: handlePlaceSelect,
              placeholder: "Enter a location",
            }}
          />

          <GoogleMap
            mapContainerStyle={{
              height: "200px",
              width: "100%",
              marginTop: "10px",
            }}
            center={
              locationCoords.lat
                ? locationCoords
                : { lat: 12.9716, lng: 77.5946 }
            }
            zoom={12}
          />

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveLocation}
              disabled={!searchedLocation}
            >
              Save Location
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setIsAddingNewAddress(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      <Button
        variant="contained"
        fullWidth
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleContinue} // Now properly handles saved address selection
      >
        Continue
      </Button>
    </Box>
  );
};

export default LocationSection;
