// import React, { useEffect, useState, useRef } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   FormControlLabel,
//   Checkbox,
//   Divider,
// } from "@mui/material";
// import GooglePlacesAutocomplete, {
//   geocodeByPlaceId,
// } from "react-google-places-autocomplete";
// import {
//   GoogleMap,
//   useJsApiLoader,
//   Marker,
//   InfoWindow,
// } from "@react-google-maps/api";
// import CloseIcon from "@mui/icons-material/Close";
// import authService from "../../../../../../api/ApiService";
// import { useDispatch, useSelector } from "react-redux";
// import { setLoading } from "../../../../../../redux/slice/LoaderSlice";
// import { getErrorMessage } from "../../../../../../utils/helperFunc";
// import { toast } from "react-toastify";

// const LocationSection = ({ onContinue, setOpenLocation }) => {
//   const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
//   const [searchedLocation, setSearchedLocation] = useState(null);
//   const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);
//   const [addressDetails, setAddressDetails] = useState([]);
//   const [locationCoords, setLocationCoords] = useState({
//     lat: null,
//     lng: null,
//   });
//   const [map, setMap] = useState(null);
//   const [center, setCenter] = useState({ lat: 28.6139, lng: 77.209 }); 
//   const [markers, setMarkers] = useState([]);
//   const [selectedMarker, setSelectedMarker] = useState(null);

//   const userDetails = useSelector((state) => state.auth.userDetails);
//   const dispatch = useDispatch();
//   const mapRef = useRef();
//   console.log("userDetails", userDetails);
//   const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
//     libraries: ["places"],
//   });

//   // ✅ Fetch all saved addresses
//   const getAddress = async () => {
//     try {
//       dispatch(setLoading(true));
//       const res = await authService.getUserProfile(userDetails._id);
//       const saved = res?.data?.saved_address || [];
//       setAddressDetails(Array.isArray(saved) ? saved : [saved]);
//     } catch (error) {
//       getErrorMessage(error);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   // ✅ Handle Google place selection
//   const handlePlaceSelect = async (place) => {
//     if (!place?.value?.place_id) return;

//     try {
//       const results = await geocodeByPlaceId(place.value.place_id);
//       const result = results[0];
//       const lat = result.geometry.location.lat();
//       const lng = result.geometry.location.lng();

//       const newLocation = {
//         address: result.formatted_address,
//         lat,
//         lng,
//       };

//       setSearchedLocation(newLocation.address);
//       setLocationCoords({ lat, lng });
//       setSelectedSavedAddress(null);
//       setCenter({ lat, lng });
//       setMarkers([newLocation]);
//       setSelectedMarker(newLocation);

//       if (map) {
//         map.panTo(newLocation);
//         map.setZoom(15);
//       }
//     } catch (error) {
//       console.error("Error selecting place:", error);
//     }
//   };

//   // ✅ Save the new address (append instead of overwrite)
//   const handleSaveLocation = async () => {
//     if (!searchedLocation || !locationCoords.lat) {
//       alert("Please select a valid location first.");
//       return;
//     }

//     try {
//       dispatch(setLoading(true));

//       const newAddress = {
//         id: Date.now(),
//         selected_region: searchedLocation,
//         latitude: locationCoords.lat,
//         longitude: locationCoords.lng,
//         latitudeDelta: 0.015,
//         longitudeDelta: 0.0121,
//       };
//       // send single object instead of full array
//       const res = await authService.addAddress(userDetails._id, newAddress);

//       if (res.status === 200 || res.status === 201) {
//         toast.success("Address saved successfully!");
//         await getAddress();
//         console.log("res");
//         // Auto-select newly added address
//         setSelectedSavedAddress(newAddress);
//         setIsAddingNewAddress(false);
//         setSearchedLocation(null);
//         setLocationCoords({ lat: null, lng: null });
//         setMarkers([]);
//       } else {
//         toast.error("Failed to save address. Please try again.");
//       }
//     } catch (error) {
//       getErrorMessage(error);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   // ✅ Handle selecting an existing saved address
//   const handleSavedAddressSelect = (location) => {
//     const savedLocation = {
//       address: location.selected_region,
//       lat: location.latitude,
//       lng: location.longitude,
//     };

//     setSelectedSavedAddress(location);
//     setSearchedLocation(savedLocation.address);
//     setLocationCoords({ lat: savedLocation.lat, lng: savedLocation.lng });
//     setCenter({ lat: savedLocation.lat, lng: savedLocation.lng });
//     setMarkers([savedLocation]);
//     setSelectedMarker(savedLocation);

//     if (map) {
//       map.panTo(savedLocation);
//       map.setZoom(15);
//     }
//   };

//   // ✅ Handle map click to manually pick a location
//   const onMapClick = (e) => {
//     if (!isAddingNewAddress) return;
//     const newLocation = {
//       address: "Custom Location",
//       lat: e.latLng.lat(),
//       lng: e.latLng.lng(),
//     };
//     setSearchedLocation(newLocation.address);
//     setLocationCoords(newLocation);
//     setMarkers([newLocation]);
//     setSelectedMarker(newLocation);
//   };

//   // ✅ Continue button handler
//   const handleContinue = () => {
//     let selectedLocation = null;

//     if (searchedLocation && locationCoords.lat) {
//       selectedLocation = {
//         address: searchedLocation,
//         lat: locationCoords.lat,
//         lng: locationCoords.lng,
//       };
//     } else if (selectedSavedAddress) {
//       selectedLocation = {
//         address: selectedSavedAddress.selected_region,
//         lat: selectedSavedAddress.latitude,
//         lng: selectedSavedAddress.longitude,
//       };
//     }

//     if (selectedLocation) {
//       onContinue(selectedLocation);
//     } else {
//       alert("Please select or search for a location before continuing.");
//     }
//   };

//   const onMapLoad = (map) => setMap(map);

//   useEffect(() => {
//     if (userDetails?._id) {
//       getAddress();
//     }
//   }, [userDetails]);

//   if (!isLoaded) {
//     return (
//       <Box sx={{ p: 4, textAlign: "center" }}>
//         <Typography>Loading map...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ height: "600px", display: "flex", flexDirection: "column" }}>
//       {/* Header */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           p: 2,
//           borderBottom: "1px solid #e0e0e0",
//         }}
//       >
//         <Typography variant="h6">Select Location</Typography>
//         <CloseIcon
//           sx={{ cursor: "pointer" }}
//           onClick={() => setOpenLocation(false)}
//         />
//       </Box>

//       {/* Saved Addresses */}
//       <Box sx={{ p: 2, maxHeight: "200px", overflowY: "auto" }}>
//         <Typography variant="subtitle1" gutterBottom>
//           Saved Addresses
//         </Typography>
//         {addressDetails.length > 0 ? (
//           addressDetails.map((location) => (
//             <FormControlLabel
//               key={location.id}
//               control={
//                 <Checkbox
//                   checked={selectedSavedAddress?.id === location.id}
//                   onChange={() => handleSavedAddressSelect(location)}
//                 />
//               }
//               label={
//                 <Typography variant="body2">
//                   {location.selected_region}
//                 </Typography>
//               }
//               sx={{ display: "block", width: "100%", mb: 1 }}
//             />
//           ))
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             No saved addresses found.
//           </Typography>
//         )}
//       </Box>

//       <Divider />

//       {/* Add New Address Section */}
//       {!isAddingNewAddress ? (
//         <Button
//           variant="outlined"
//           fullWidth
//           sx={{ m: 2, borderColor: "#c026d3", color: "#c026d3" }}
//           onClick={() => setIsAddingNewAddress(true)}
//         >
//           + Add New Address
//         </Button>
//       ) : (
//         <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column" }}>
//           <Typography variant="subtitle1" gutterBottom>
//             Search Location
//           </Typography>

//           {/* Google Places Autocomplete */}
//           <GooglePlacesAutocomplete
//             autocompletionRequest={{
//               componentRestrictions: { country: "in" },
//             }}
//             selectProps={{
//               placeholder: "Search address...",
//               value: null,
//               onChange: handlePlaceSelect,
//               styles: {
//                 input: (provided) => ({
//                   ...provided,
//                   padding: "12px",
//                   fontSize: "14px",
//                 }),
//                 option: (provided) => ({
//                   ...provided,
//                   padding: "12px",
//                   fontSize: "14px",
//                 }),
//               },
//             }}
//           />

//           {/* Interactive Map */}
//           <Box sx={{ flex: 1, mt: 2, position: "relative" }}>
//             <GoogleMap
//               mapContainerStyle={{ width: "100%", height: "100%" }}
//               center={center}
//               zoom={12}
//               onLoad={onMapLoad}
//               onClick={onMapClick}
//             >
//               {markers.map((marker, index) => (
//                 <Marker
//                   key={index}
//                   position={{ lat: marker.lat, lng: marker.lng }}
//                   onClick={() => setSelectedMarker(marker)}
//                 />
//               ))}

//               {/* ✅ InfoWindow outside Marker */}
//               {selectedMarker && (
//                 <InfoWindow
//                   position={{
//                     lat: selectedMarker.lat,
//                     lng: selectedMarker.lng,
//                   }}
//                   onCloseClick={() => setSelectedMarker(null)}
//                 >
//                   <Typography variant="body2">
//                     {selectedMarker.address}
//                   </Typography>
//                 </InfoWindow>
//               )}
//             </GoogleMap>
//           </Box>

//           {/* Selected Location Info */}
//           {searchedLocation && (
//             <Box sx={{ p: 2, bgcolor: "#f0f8ff", borderRadius: 1, mt: 1 }}>
//               <Typography variant="subtitle2" fontWeight="bold">
//                 Selected:
//               </Typography>
//               <Typography variant="body2">{searchedLocation}</Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Lat: {locationCoords.lat?.toFixed(6)}, Lng:{" "}
//                 {locationCoords.lng?.toFixed(6)}
//               </Typography>
//             </Box>
//           )}

//           {/* Action Buttons */}
//           <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
//             <Button
//               variant="contained"
//               sx={{ flex: 1, backgroundColor: "#c026d3" }}
//               onClick={handleSaveLocation}
//               disabled={!searchedLocation}
//             >
//               Save Address
//             </Button>
//             <Button
//               variant="outlined"
//               sx={{ flex: 1 }}
//               onClick={() => setIsAddingNewAddress(false)}
//             >
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       )}

//       <Divider />

//       {/* Continue Button */}
//       <Box sx={{ p: 2 }}>
//         <Button
//           variant="contained"
//           fullWidth
//           sx={{ backgroundColor: "#c026d3" }}
//           onClick={handleContinue}
//           disabled={!searchedLocation && !selectedSavedAddress}
//         >
//           Continue
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default LocationSection;,


import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Checkbox,
  Divider,
  IconButton,
  Paper,
  Fade,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
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
  const [center, setCenter] = useState({ lat: 12.9716, lng: 77.5946 });
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [map, setMap] = useState(null);

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.auth.userDetails);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g",
    libraries: ["places"],
  });

  const getAddress = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.getUserProfile(userDetails._id);
      const saved = res?.data?.saved_address || [];
      setAddressDetails(Array.isArray(saved) ? saved : [saved]);
    } catch (error) {
      getErrorMessage(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

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
      setSelectedSavedAddress(null);

      if (map) {
        map.panTo(newLocation);
        map.setZoom(15);
      }
    } catch (err) {
      console.error("Error selecting place:", err);
    }
  };

  const handleSaveLocation = async () => {
    if (!searchedLocation || !locationCoords.lat)
      return toast.warning("Please select a valid location first.");

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
      } else toast.error("Failed to save address.");
    } catch (err) {
      getErrorMessage(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSavedAddressSelect = (loc) => {
    const saved = {
      address: loc.selected_region,
      lat: loc.latitude,
      lng: loc.longitude,
    };
    setSelectedSavedAddress(loc);
    setSearchedLocation(saved.address);
    setLocationCoords({ lat: saved.lat, lng: saved.lng });
    setCenter({ lat: saved.lat, lng: saved.lng });
    setMarkers([saved]);
    setSelectedMarker(saved);
    if (map) {
      map.panTo(saved);
      map.setZoom(15);
    }
  };

  const handleContinue = () => {
    const selected =
      searchedLocation && locationCoords.lat
        ? { address: searchedLocation, lat: locationCoords.lat, lng: locationCoords.lng }
        : selectedSavedAddress
        ? {
            address: selectedSavedAddress.selected_region,
            lat: selectedSavedAddress.latitude,
            lng: selectedSavedAddress.longitude,
          }
        : null;

    if (selected) onContinue(selected);
    else toast.info("Please select or search for a location first.");
  };

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

  return (
    <Backdrop
      open
      sx={{
        zIndex: 9999,
        backdropFilter: "blur(6px)",
        bgcolor: "rgba(0,0,0,0.35)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      <Fade in>
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: 520,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: "88vh",
            animation: "slideUp 0.35s ease-out",
            background: "#fff",
            "@keyframes slideUp": {
              from: { transform: "translateY(100%)" },
              to: { transform: "translateY(0)" },
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid #eee",
              bgcolor: "#fafafa",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Select Location
            </Typography>
            <IconButton size="small" onClick={() => setOpenLocation(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Scrollable Body */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 2.5,
              py: 2,
              scrollbarWidth: "thin",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 1, color: "#333" }}
            >
              Saved Addresses
            </Typography>

            {addressDetails.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {addressDetails.map((loc) => {
                  const selected = selectedSavedAddress?.id === loc.id;
                  return (
                    <Box
                      key={loc.id}
                      onClick={() => handleSavedAddressSelect(loc)}
                      sx={{
                        border: selected ? "2px solid #c026d3" : "1px solid #ddd",
                        borderRadius: 2,
                        p: 1.5,
                        bgcolor: selected ? "#fdf5ff" : "#fff",
                        boxShadow: selected
                          ? "0 2px 10px rgba(192,38,211,0.15)"
                          : "0 1px 4px rgba(0,0,0,0.05)",
                        cursor: "pointer",
                        transition: "0.2s",
                        "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#444", mb: 0.5 }}>
                        {loc.selected_region}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Checkbox checked={selected} color="secondary" />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No saved addresses found.
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {!isAddingNewAddress ? (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AddLocationAltIcon />}
                sx={{
                  borderColor: "#c026d3",
                  color: "#c026d3",
                  fontWeight: 600,
                  textTransform: "none",
                }}
                onClick={() => setIsAddingNewAddress(true)}
              >
                Add New Address
              </Button>
            ) : (
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: 600, color: "#333" }}
                >
                  Search & Add Address
                </Typography>

                <GooglePlacesAutocomplete
                  autocompletionRequest={{
                    componentRestrictions: { country: "in" },
                  }}
                  selectProps={{
                    placeholder: "Search address...",
                    onChange: handlePlaceSelect,
                  }}
                />

                <Box
                  sx={{
                    mt: 2,
                    height: 220,
                    borderRadius: 2,
                    border: "1px solid #ddd",
                    overflow: "hidden",
                  }}
                >
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={center}
                    zoom={12}
                    onLoad={(m) => setMap(m)}
                    onClick={(e) => {
                      const newLoc = {
                        address: "Custom Location",
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                      };
                      setSearchedLocation(newLoc.address);
                      setLocationCoords(newLoc);
                      setMarkers([newLoc]);
                      setSelectedMarker(newLoc);
                    }}
                  >
                    {markers.map((m, i) => (
                      <Marker
                        key={i}
                        position={{ lat: m.lat, lng: m.lng }}
                        onClick={() => setSelectedMarker(m)}
                      />
                    ))}
                    {selectedMarker && (
                      <InfoWindow
                        position={{
                          lat: selectedMarker.lat,
                          lng: selectedMarker.lng,
                        }}
                        onCloseClick={() => setSelectedMarker(null)}
                      >
                        <Typography variant="body2">
                          {selectedMarker.address}
                        </Typography>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </Box>

                {searchedLocation && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#faf5ff",
                      border: "1px solid #e0ccff",
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      Selected Location:
                    </Typography>
                    <Typography variant="body2">{searchedLocation}</Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: "#c026d3",
                      "&:hover": { backgroundColor: "#a11bb3" },
                    }}
                    onClick={handleSaveLocation}
                    disabled={!searchedLocation}
                  >
                    Save
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setIsAddingNewAddress(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #eee",
              bgcolor: "#fff",
              position: "sticky",
              bottom: 0,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#c026d3",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#a11bb3" },
              }}
              onClick={handleContinue}
              disabled={!searchedLocation && !selectedSavedAddress}
            >
              Continue
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Backdrop>
  );
};

export default LocationSection;
