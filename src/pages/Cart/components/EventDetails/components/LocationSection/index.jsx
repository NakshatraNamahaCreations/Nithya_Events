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

//   const dispatch = useDispatch();
//   const userDetails = useSelector((state) => state.auth.userDetails);
//   const mapRef = useRef();
//   const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";
//   const LOCAL_STORAGE_KEY = "saved_locations";

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
//     libraries: ["places"],
//   });

//   // ✅ Fetch backend addresses
//   const getAddress = async () => {
//     try {
//       dispatch(setLoading(true));
//       const res = await authService.getUserProfile(userDetails._id);
//       const saved = res?.data?.saved_address || [];
//       setAddressDetails(Array.isArray(saved) ? saved : [saved]);
//     } catch (err) {
//       getErrorMessage(err);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   // ✅ Load all local saved addresses (array)
//   const [localAddresses, setLocalAddresses] = useState([]);
//   useEffect(() => {
//     const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         if (Array.isArray(parsed)) {
//           setLocalAddresses(parsed);
//           // auto-select last used one
//           const last = parsed[parsed.length - 1];
//           setSearchedLocation(last.address);
//           setLocationCoords({ lat: last.lat, lng: last.lng });
//           setCenter({ lat: last.lat, lng: last.lng });
//           setMarkers([last]);
//           setSelectedMarker(last);
//           setSelectedSavedAddress({ ...last, id: "local" });
//         }
//       } catch (err) {
//         console.error("Error parsing saved_locations:", err);
//       }
//     }
//   }, []);

//   // ✅ Add or update localStorage list
//   const saveToLocalStorage = (newLocation) => {
//     const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
//     let locations = [];
//     if (saved) {
//       try {
//         locations = JSON.parse(saved);
//       } catch {}
//     }

//     // prevent duplicates by address
//     const already = locations.find((l) => l.address === newLocation.address);
//     if (!already) locations.push(newLocation);

//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(locations));
//     setLocalAddresses(locations);
//     console.log("💾 Saved locations:", locations);
//   };

//   // ✅ Handle search selection
//   const handlePlaceSelect = async (place) => {
//     if (!place?.value?.place_id) return;
//     try {
//       const results = await geocodeByPlaceId(place.value.place_id);
//       const result = results[0];
//       const lat = result.geometry.location.lat();
//       const lng = result.geometry.location.lng();
//       const newLocation = { address: result.formatted_address, lat, lng };

//       setSearchedLocation(newLocation.address);
//       setLocationCoords({ lat, lng });
//       setCenter({ lat, lng });
//       setMarkers([newLocation]);
//       setSelectedMarker(newLocation);

//       saveToLocalStorage(newLocation); // save new location

//       if (map) {
//         map.panTo(newLocation);
//         map.setZoom(15);
//       }
//     } catch (err) {
//       console.error("Error selecting place:", err);
//     }
//   };

//   // ✅ Save to backend
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
//       };

//       const res = await authService.addAddress(userDetails._id, newAddress);
//       if (res.status === 200 || res.status === 201) {
//         toast.success("Address saved successfully!");
//         await getAddress();
//         setSelectedSavedAddress(newAddress);
//         setIsAddingNewAddress(false);
//         setSearchedLocation(null);
//         setLocationCoords({ lat: null, lng: null });
//         setMarkers([]);
//       }
//     } catch (err) {
//       getErrorMessage(err);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   // ✅ Select from saved
//   const handleSavedAddressSelect = (location) => {
//     const savedLocation = {
//       address: location.selected_region || location.address,
//       lat: location.latitude || location.lat,
//       lng: location.longitude || location.lng,
//     };
//     setSelectedSavedAddress(location);
//     setSearchedLocation(savedLocation.address);
//     setLocationCoords({ lat: savedLocation.lat, lng: savedLocation.lng });
//     setCenter({ lat: savedLocation.lat, lng: savedLocation.lng });
//     setMarkers([savedLocation]);
//     setSelectedMarker(savedLocation);
//     saveToLocalStorage(savedLocation);
//     if (map) {
//       map.panTo(savedLocation);
//       map.setZoom(15);
//     }
//   };

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
//     saveToLocalStorage(newLocation);
//   };

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

//     if (selectedLocation) onContinue(selectedLocation);
//     else alert("Please select a location before continuing.");
//   };

//   const onMapLoad = (map) => setMap(map);

//   useEffect(() => {
//     if (userDetails?._id) getAddress();
//   }, [userDetails]);

//   if (!isLoaded) {
//     return (
//       <Box sx={{ p: 4, textAlign: "center" }}>
//         <Typography>Loading map...</Typography>
//       </Box>
//     );
//   }

//   // ✅ Combine local + backend addresses
//   const allAddresses = [
//     ...localAddresses.map((l) => ({
//       id: l.address,
//       selected_region: l.address,
//       latitude: l.lat,
//       longitude: l.lng,
//       fromLocal: true,
//     })),
//     ...addressDetails,
//   ];

//   return (
//     <Box sx={{ height: "600px", display: "flex", flexDirection: "column" }}>
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
//         {allAddresses.length > 0 ? (
//           allAddresses.map((location) => (
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
//                   {location.fromLocal && " (Local)"}
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

//       {/* Add New Address */}
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

//           <GooglePlacesAutocomplete
//             autocompletionRequest={{ componentRestrictions: { country: "in" } }}
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

//           <Box sx={{ flex: 1, mt: 2, position: "relative" }}>
//             <GoogleMap
//               mapContainerStyle={{ width: "100%", height: "100%" }}
//               center={center}
//               zoom={12}
//               onLoad={onMapLoad}
//               onClick={onMapClick}
//             >
//               {markers.map((marker, i) => (
//                 <Marker
//                   key={i}
//                   position={{ lat: marker.lat, lng: marker.lng }}
//                   onClick={() => setSelectedMarker(marker)}
//                 />
//               ))}

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

// export default LocationSection;

// LocationSection.jsx
import React, { useEffect, useState, useRef } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import authService from "../../../../../../api/ApiService";
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

  const LOCAL_STORAGE_KEY = "saved_locations";
  const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Fetch saved from backend
  const getAddress = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.getUserProfile(userDetails._id);
      const saved = res?.data?.saved_address || [];
      const list = Array.isArray(saved) ? saved : [saved];
      // Drop any null/blank entries left over from earlier malformed saves so
      // the list only shows real addresses.
      setAddressDetails(
        list.filter((a) => a && (a.selected_region || a.address))
      );
    } catch (error) {
      getErrorMessage(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Fetch localStorage saved
  const [localAddresses, setLocalAddresses] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setLocalAddresses(parsed);
          const last = parsed[parsed.length - 1];
          setSearchedLocation(last.address);
          setLocationCoords({ lat: last.lat, lng: last.lng });
          setCenter({ lat: last.lat, lng: last.lng });
          setMarkers([last]);
          setSelectedMarker(last);
          setSelectedSavedAddress({ ...last, id: "local" });
        }
      } catch (err) {
        console.error("Error parsing local locations:", err);
      }
    }
  }, []);

  const saveToLocalStorage = (newLocation) => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    let locations = [];
    if (saved) {
      try {
        locations = JSON.parse(saved);
      } catch {}
    }
    const already = locations.find((l) => l.address === newLocation.address);
    if (!already) {
      locations.push(newLocation);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(locations));
      setLocalAddresses(locations);
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
      saveToLocalStorage(newLocation);
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
      // Backend expects the address wrapped under `saved_address`
      // (it does `const { saved_address } = req.body`). Sending the fields at
      // the top level pushed `undefined` into the user's saved_address array.
      const res = await authService.addAddress(userDetails._id, {
        saved_address: newAddress,
      });
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
      address: loc.selected_region || loc.address,
      lat: loc.latitude || loc.lat,
      lng: loc.longitude || loc.lng,
    };
    setSelectedSavedAddress(loc);
    setSearchedLocation(saved.address);
    setLocationCoords({ lat: saved.lat, lng: saved.lng });
    setCenter({ lat: saved.lat, lng: saved.lng });
    setMarkers([saved]);
    setSelectedMarker(saved);
    saveToLocalStorage(saved);
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

  if (!isLoaded) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>Loading map...</Typography>
      </Box>
    );
  }

  return (
    <Backdrop open sx={{ zIndex: 9999, backdropFilter: "blur(5px)", bgcolor: "rgba(0,0,0,0.3)" }}>
      <Fade in>
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 520,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <Typography variant="h6">Select Location</Typography>
            <IconButton size="small" onClick={() => setOpenLocation(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>
              Saved Addresses
            </Typography>
            {allAddresses.length > 0 ? (
              allAddresses.map((loc) => {
                const selected = selectedSavedAddress?.id === loc.id;
                return (
                  <Box
                    key={loc.id}
                    onClick={() => handleSavedAddressSelect(loc)}
                    sx={{
                      border: selected ? "2px solid #c026d3" : "1px solid #e0e0e0",
                      borderRadius: 2,
                      p: 2,
                      mb: 1.5,
                      cursor: "pointer",
                      background: selected ? "#fdf4ff" : "#fff",
                      boxShadow: selected ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
                      transition: "0.3s",
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: "#444" }}>
                        {loc.selected_region}
                      </Typography>
                      <Checkbox checked={selected} color="secondary" />
                    </Box>
                  </Box>
                );
              })
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
              <>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Search & Add Address
                </Typography>
                <GooglePlacesAutocomplete
                  autocompletionRequest={{ componentRestrictions: { country: "in" } }}
                  selectProps={{ placeholder: "Search address...", onChange: handlePlaceSelect }}
                />

                <Box sx={{ mt: 2, height: 220, borderRadius: 2, overflow: "hidden", border: "1px solid #ccc" }}>
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
                      saveToLocalStorage(newLoc);
                    }}
                  >
                    {markers.map((m, i) => (
                      <Marker key={i} position={{ lat: m.lat, lng: m.lng }} onClick={() => setSelectedMarker(m)} />
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
                  <Box sx={{ mt: 2, p: 2, bgcolor: "#faf5ff", borderRadius: 2, border: "1px solid #e0ccff" }}>
                    <Typography variant="subtitle2" fontWeight={600}>Selected Location:</Typography>
                    <Typography variant="body2">{searchedLocation}</Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ backgroundColor: "#c026d3", "&:hover": { backgroundColor: "#a11bb3" } }}
                    onClick={handleSaveLocation}
                    disabled={!searchedLocation}
                  >
                    Save
                  </Button>
                  <Button fullWidth variant="outlined" onClick={() => setIsAddingNewAddress(false)}>
                    Cancel
                  </Button>
                </Box>
              </>
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
            <Button
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "#c026d3", fontWeight: 600, "&:hover": { backgroundColor: "#a11bb3" } }}
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


// import React, { useEffect, useState, useRef } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   FormControlLabel,
//   Checkbox,
//   Divider,
//   Paper,
//   Stack,
//   IconButton,
//   Card,
//   CardContent,
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
//   const [locationCoords, setLocationCoords] = useState({ lat: null, lng: null });
//   const [map, setMap] = useState(null);
//   const [center, setCenter] = useState({ lat: 28.6139, lng: 77.209 });
//   const [markers, setMarkers] = useState([]);
//   const [selectedMarker, setSelectedMarker] = useState(null);

//   const dispatch = useDispatch();
//   const userDetails = useSelector((state) => state.auth.userDetails);
//   const mapRef = useRef();

//   const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";
//   const LOCAL_STORAGE_KEY = "saved_locations";

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
//     libraries: ["places"],
//   });

//   useEffect(() => {
//     if (userDetails?._id) getAddress();
//   }, [userDetails]);

//   const getAddress = async () => {
//     try {
//       dispatch(setLoading(true));
//       const res = await authService.getUserProfile(userDetails._id);
//       const saved = res?.data?.saved_address || [];
//       setAddressDetails(Array.isArray(saved) ? saved : [saved]);
//     } catch (err) {
//       getErrorMessage(err);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const [localAddresses, setLocalAddresses] = useState([]);
//   useEffect(() => {
//     const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         if (Array.isArray(parsed)) {
//           setLocalAddresses(parsed);
//           const last = parsed[parsed.length - 1];
//           setSearchedLocation(last.address);
//           setLocationCoords({ lat: last.lat, lng: last.lng });
//           setCenter({ lat: last.lat, lng: last.lng });
//           setMarkers([last]);
//           setSelectedMarker(last);
//           setSelectedSavedAddress({ ...last, id: "local" });
//         }
//       } catch (err) {
//         console.error("Error parsing saved_locations:", err);
//       }
//     }
//   }, []);

//   const saveToLocalStorage = (newLocation) => {
//     const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
//     let locations = [];
//     if (saved) {
//       try {
//         locations = JSON.parse(saved);
//       } catch {}
//     }
//     const already = locations.find((l) => l.address === newLocation.address);
//     if (!already) locations.push(newLocation);
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(locations));
//     setLocalAddresses(locations);
//   };

//   const handlePlaceSelect = async (place) => {
//     if (!place?.value?.place_id) return;
//     try {
//       const results = await geocodeByPlaceId(place.value.place_id);
//       const result = results[0];
//       const lat = result.geometry.location.lat();
//       const lng = result.geometry.location.lng();
//       const newLocation = { address: result.formatted_address, lat, lng };

//       setSearchedLocation(newLocation.address);
//       setLocationCoords({ lat, lng });
//       setCenter({ lat, lng });
//       setMarkers([newLocation]);
//       setSelectedMarker(newLocation);
//       saveToLocalStorage(newLocation);
//       if (map) {
//         map.panTo(newLocation);
//         map.setZoom(15);
//       }
//     } catch (err) {
//       console.error("Error selecting place:", err);
//     }
//   };

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
//       };
//       const res = await authService.addAddress(userDetails._id, newAddress);
//       if (res.status === 200 || res.status === 201) {
//         toast.success("Address saved successfully!");
//         await getAddress();
//         setSelectedSavedAddress(newAddress);
//         setIsAddingNewAddress(false);
//         setSearchedLocation(null);
//         setLocationCoords({ lat: null, lng: null });
//         setMarkers([]);
//       }
//     } catch (err) {
//       getErrorMessage(err);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const handleSavedAddressSelect = (location) => {
//     const savedLocation = {
//       address: location.selected_region || location.address,
//       lat: location.latitude || location.lat,
//       lng: location.longitude || location.lng,
//     };
//     setSelectedSavedAddress(location);
//     setSearchedLocation(savedLocation.address);
//     setLocationCoords({ lat: savedLocation.lat, lng: savedLocation.lng });
//     setCenter({ lat: savedLocation.lat, lng: savedLocation.lng });
//     setMarkers([savedLocation]);
//     setSelectedMarker(savedLocation);
//     saveToLocalStorage(savedLocation);
//     if (map) {
//       map.panTo(savedLocation);
//       map.setZoom(15);
//     }
//   };

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
//     saveToLocalStorage(newLocation);
//   };

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

//     if (selectedLocation) onContinue(selectedLocation);
//     else alert("Please select a location before continuing.");
//   };

//   const onMapLoad = (map) => setMap(map);

//   const allAddresses = [
//     ...localAddresses.map((l) => ({
//       id: l.address,
//       selected_region: l.address,
//       latitude: l.lat,
//       longitude: l.lng,
//       fromLocal: true,
//     })),
//     ...addressDetails,
//   ];

//   if (!isLoaded) {
//     return (
//       <Box sx={{ p: 4, textAlign: "center" }}>
//         <Typography>Loading map...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Paper elevation={3} sx={{ height: "95vh", p: 3, display: "flex", flexDirection: "column" }}>
//       <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h5" fontWeight={600}>
//           Select Location
//         </Typography>
//         <IconButton onClick={() => setOpenLocation(false)}>
//           <CloseIcon />
//         </IconButton>
//       </Stack>

//       <Card variant="outlined" sx={{ mb: 2, p: 2, backgroundColor: "#f9fafb" }}>
//         <Typography variant="subtitle1" gutterBottom>
//           Saved Addresses
//         </Typography>
//         <Box sx={{ maxHeight: 150, overflowY: "auto" }}>
//           {allAddresses.length > 0 ? (
//             allAddresses.map((location) => (
//               <FormControlLabel
//                 key={location.id}
//                 control={
//                   <Checkbox
//                     checked={selectedSavedAddress?.id === location.id}
//                     onChange={() => handleSavedAddressSelect(location)}
//                   />
//                 }
//                 label={`${location.selected_region} ${location.fromLocal ? "(Local)" : ""}`}
//               />
//             ))
//           ) : (
//             <Typography variant="body2" color="text.secondary">
//               No saved addresses found.
//             </Typography>
//           )}
//         </Box>
//         {!isAddingNewAddress && (
//           <Button
//             variant="outlined"
//             fullWidth
//             sx={{ mt: 2 }}
//             onClick={() => setIsAddingNewAddress(true)}
//           >
//             + Add New Address
//           </Button>
//         )}
//       </Card>

//       {isAddingNewAddress && (
//         <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
//           <Typography variant="subtitle1" mb={1}>
//             Search Location
//           </Typography>
//           <Box mb={2}>
//             <GooglePlacesAutocomplete
//               autocompletionRequest={{ componentRestrictions: { country: "in" } }}
//               selectProps={{
//                 placeholder: "Search address...",
//                 onChange: handlePlaceSelect,
//               }}
//             />
//           </Box>
//           <Box sx={{ height: 250, borderRadius: 1, overflow: "hidden", mb: 2 }}>
//             <GoogleMap
//               mapContainerStyle={{ width: "100%", height: "100%" }}
//               center={center}
//               zoom={12}
//               onLoad={onMapLoad}
//               onClick={onMapClick}
//             >
//               {markers.map((marker, i) => (
//                 <Marker
//                   key={i}
//                   position={{ lat: marker.lat, lng: marker.lng }}
//                   onClick={() => setSelectedMarker(marker)}
//                 />
//               ))}
//               {selectedMarker && (
//                 <InfoWindow
//                   position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
//                   onCloseClick={() => setSelectedMarker(null)}
//                 >
//                   <Typography variant="body2">{selectedMarker.address}</Typography>
//                 </InfoWindow>
//               )}
//             </GoogleMap>
//           </Box>

//           {searchedLocation && (
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="body2">
//                 <strong>Selected:</strong> {searchedLocation}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Lat: {locationCoords.lat?.toFixed(6)}, Lng: {locationCoords.lng?.toFixed(6)}
//               </Typography>
//             </Box>
//           )}

//           <Stack direction="row" spacing={2}>
//             <Button
//               variant="contained"
//               onClick={handleSaveLocation}
//               sx={{ flex: 1 }}
//               disabled={!searchedLocation}
//             >
//               Save
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={() => setIsAddingNewAddress(false)}
//               sx={{ flex: 1 }}
//             >
//               Cancel
//             </Button>
//           </Stack>
//         </Card>
//       )}

//       <Divider sx={{ my: 2 }} />

//       <Button
//         variant="contained"
//         size="large"
//         onClick={handleContinue}
//         disabled={!searchedLocation && !selectedSavedAddress}
//       >
//         Continue
//       </Button>
//     </Paper>
//   );
// };

// export default LocationSection;
