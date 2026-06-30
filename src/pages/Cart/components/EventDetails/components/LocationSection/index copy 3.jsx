import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import CloseIcon from "@mui/icons-material/Close";
import authService from "../../../../../../api/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../../../../redux/slice/LoaderSlice";
import { getErrorMessage } from "../../../../../../utils/helperFunc";
import { toast } from "react-toastify";

const LocationSection = ({ onContinue, setOpenLocation }) => {
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);
  const [addressDetails, setAddressDetails] = useState([]);
  const [locationCoords, setLocationCoords] = useState({ lat: null, lng: null });
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.209 });
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.auth.userDetails);
  const mapRef = useRef();
  const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";
  const LOCAL_STORAGE_KEY = "saved_locations";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // ✅ Fetch backend addresses
  const getAddress = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.getUserProfile(userDetails._id);
      const saved = res?.data?.saved_address || [];
      setAddressDetails(Array.isArray(saved) ? saved : [saved]);
    } catch (err) {
      getErrorMessage(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ✅ Load all local saved addresses (array)
  const [localAddresses, setLocalAddresses] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setLocalAddresses(parsed);
          // auto-select last used one
          const last = parsed[parsed.length - 1];
          setSearchedLocation(last.address);
          setLocationCoords({ lat: last.lat, lng: last.lng });
          setCenter({ lat: last.lat, lng: last.lng });
          setMarkers([last]);
          setSelectedMarker(last);
          setSelectedSavedAddress({ ...last, id: "local" });
        }
      } catch (err) {
        console.error("Error parsing saved_locations:", err);
      }
    }
  }, []);

  // ✅ Add or update localStorage list
  const saveToLocalStorage = (newLocation) => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    let locations = [];
    if (saved) {
      try {
        locations = JSON.parse(saved);
      } catch {}
    }

    // prevent duplicates by address
    const already = locations.find((l) => l.address === newLocation.address);
    if (!already) locations.push(newLocation);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(locations));
    setLocalAddresses(locations);
    console.log("💾 Saved locations:", locations);
  };

  // ✅ Handle search selection
  const handlePlaceSelect = async (place) => {
    if (!place?.value?.place_id) return;
    try {
      const results = await geocodeByPlaceId(place.value.place_id);
      const result = results[0];
      const lat = result.geometry.location.lat();
      const lng = result.geometry.location.lng();
      const newLocation = { address: result.formatted_address, lat, lng };

      setSearchedLocation(newLocation.address);
      setLocationCoords({ lat, lng });
      setCenter({ lat, lng });
      setMarkers([newLocation]);
      setSelectedMarker(newLocation);

      saveToLocalStorage(newLocation); // save new location

      if (map) {
        map.panTo(newLocation);
        map.setZoom(15);
      }
    } catch (err) {
      console.error("Error selecting place:", err);
    }
  };

  // ✅ Save to backend
  const handleSaveLocation = async () => {
    if (!searchedLocation || !locationCoords.lat) {
      alert("Please select a valid location first.");
      return;
    }
    try {
      dispatch(setLoading(true));
      const newAddress = {
        id: Date.now(),
        selected_region: searchedLocation,
        latitude: locationCoords.lat,
        longitude: locationCoords.lng,
      };

      const res = await authService.addAddress(userDetails._id, newAddress);
      if (res.status === 200 || res.status === 201) {
        toast.success("Address saved successfully!");
        await getAddress();
        setSelectedSavedAddress(newAddress);
        setIsAddingNewAddress(false);
        setSearchedLocation(null);
        setLocationCoords({ lat: null, lng: null });
        setMarkers([]);
      }
    } catch (err) {
      getErrorMessage(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ✅ Select from saved
  const handleSavedAddressSelect = (location) => {
    const savedLocation = {
      address: location.selected_region || location.address,
      lat: location.latitude || location.lat,
      lng: location.longitude || location.lng,
    };
    setSelectedSavedAddress(location);
    setSearchedLocation(savedLocation.address);
    setLocationCoords({ lat: savedLocation.lat, lng: savedLocation.lng });
    setCenter({ lat: savedLocation.lat, lng: savedLocation.lng });
    setMarkers([savedLocation]);
    setSelectedMarker(savedLocation);
    saveToLocalStorage(savedLocation);
    if (map) {
      map.panTo(savedLocation);
      map.setZoom(15);
    }
  };

  const onMapClick = (e) => {
    if (!isAddingNewAddress) return;
    const newLocation = {
      address: "Custom Location",
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setSearchedLocation(newLocation.address);
    setLocationCoords(newLocation);
    setMarkers([newLocation]);
    setSelectedMarker(newLocation);
    saveToLocalStorage(newLocation);
  };

  const handleContinue = () => {
    let selectedLocation = null;
    if (searchedLocation && locationCoords.lat) {
      selectedLocation = {
        address: searchedLocation,
        lat: locationCoords.lat,
        lng: locationCoords.lng,
      };
    } else if (selectedSavedAddress) {
      selectedLocation = {
        address: selectedSavedAddress.selected_region,
        lat: selectedSavedAddress.latitude,
        lng: selectedSavedAddress.longitude,
      };
    }

    if (selectedLocation) onContinue(selectedLocation);
    else alert("Please select a location before continuing.");
  };

  const onMapLoad = (map) => setMap(map);

  useEffect(() => {
    if (userDetails?._id) getAddress();
  }, [userDetails]);

  if (!isLoaded) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>Loading map...</Typography>
      </Box>
    );
  }

  // ✅ Combine local + backend addresses
  const allAddresses = [
    ...localAddresses.map((l) => ({
      id: l.address,
      selected_region: l.address,
      latitude: l.lat,
      longitude: l.lng,
      fromLocal: true,
    })),
    ...addressDetails,
  ];

  return (
    <Box sx={{ height: "600px", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6">Select Location</Typography>
        <CloseIcon sx={{ cursor: "pointer" }} onClick={() => setOpenLocation(false)} />
      </Box>

      {/* Saved Addresses */}
      <Box sx={{ p: 2, maxHeight: "200px", overflowY: "auto" }}>
        <Typography variant="subtitle1" gutterBottom>
          Saved Addresses
        </Typography>
        {allAddresses.length > 0 ? (
          allAddresses.map((location) => (
            <FormControlLabel
              key={location.id}
              control={
                <Checkbox
                  checked={selectedSavedAddress?.id === location.id}
                  onChange={() => handleSavedAddressSelect(location)}
                />
              }
              label={
                <Typography variant="body2">
                  {location.selected_region}
                  {location.fromLocal && " (Local)"}
                </Typography>
              }
              sx={{ display: "block", width: "100%", mb: 1 }}
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No saved addresses found.
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Add New Address */}
      {!isAddingNewAddress ? (
        <Button
          variant="outlined"
          fullWidth
          sx={{ m: 2, borderColor: "#c026d3", color: "#c026d3" }}
          onClick={() => setIsAddingNewAddress(true)}
        >
          + Add New Address
        </Button>
      ) : (
        <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle1" gutterBottom>
            Search Location
          </Typography>

          <GooglePlacesAutocomplete
            autocompletionRequest={{ componentRestrictions: { country: "in" } }}
            selectProps={{
              placeholder: "Search address...",
              value: null,
              onChange: handlePlaceSelect,
              styles: {
                input: (provided) => ({ ...provided, padding: "12px", fontSize: "14px" }),
                option: (provided) => ({ ...provided, padding: "12px", fontSize: "14px" }),
              },
            }}
          />

          <Box sx={{ flex: 1, mt: 2, position: "relative" }}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={12}
              onLoad={onMapLoad}
              onClick={onMapClick}
            >
              {markers.map((marker, i) => (
                <Marker
                  key={i}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => setSelectedMarker(marker)}
                />
              ))}

              {selectedMarker && (
                <InfoWindow
                  position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <Typography variant="body2">{selectedMarker.address}</Typography>
                </InfoWindow>
              )}
            </GoogleMap>
          </Box>

          {searchedLocation && (
            <Box sx={{ p: 2, bgcolor: "#f0f8ff", borderRadius: 1, mt: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Selected:
              </Typography>
              <Typography variant="body2">{searchedLocation}</Typography>
              <Typography variant="caption" color="text.secondary">
                Lat: {locationCoords.lat?.toFixed(6)}, Lng: {locationCoords.lng?.toFixed(6)}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              sx={{ flex: 1, backgroundColor: "#c026d3" }}
              onClick={handleSaveLocation}
              disabled={!searchedLocation}
            >
              Save Address
            </Button>
            <Button variant="outlined" sx={{ flex: 1 }} onClick={() => setIsAddingNewAddress(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      <Divider />

      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{ backgroundColor: "#c026d3" }}
          onClick={handleContinue}
          disabled={!searchedLocation && !selectedSavedAddress}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default LocationSection;
