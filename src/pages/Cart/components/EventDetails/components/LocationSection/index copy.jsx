// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   FormControlLabel,
//   Checkbox,
// } from "@mui/material";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";
// import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
// import CloseIcon from "@mui/icons-material/Close";
// import authService from "../../../../../../api/ApiService";
// import { useDispatch, useSelector } from "react-redux";
// import { setLoading } from "../../../../../../redux/slice/LoaderSlice";
// import { getErrorMessage } from "../../../../../../utils/helperFunc";

// const LocationSection = ({ onContinue, setOpenLocation }) => {
//   const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
//   const [searchedLocation, setSearchedLocation] = useState(null);
//   const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);
//   const [savedLocations, setSavedLocations] = useState([]);
//   const [locationCoords, setLocationCoords] = useState({
//     lat: null,
//     lng: null,
//   });
//   const [addressDetails, setAddressDetails] = useState([]);
//   const userDetails = useSelector((state) => state.auth.userDetails);
//   const dispatch = useDispatch();

//   const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
//     libraries: ["places"],
//   });

//   const handlePlaceSelect = async (place) => {
//     if (!place) return;

//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ placeId: place.value.place_id }, (results, status) => {
//       if (status === "OK" && results[0]) {
//         setSearchedLocation(results[0].formatted_address);
//         setSelectedSavedAddress(null);
//         setLocationCoords({
//           lat: results[0].geometry.location.lat(),
//           lng: results[0].geometry.location.lng(),
//         });
//       }
//     });
//   };

//   const getAddress = async () => {
//     try {
//       dispatch(setLoading(true));
//       const res = await authService.getUserProfile(userDetails._id);
//       setAddressDetails(res.data.saved_address);
//       dispatch(setLoading(false));
//     } catch (error) {
//       dispatch(setLoading(false));
//       getErrorMessage(error);
//     }
//   };

//   const handleSaveLocation = async () => {
//     if (searchedLocation) {
//       await authService.addAddress(userDetails._id, {
//         saved_address: {
//           id: Date.now(),
//           selected_region: searchedLocation,
//           latitude: locationCoords.lat,
//           longitude: locationCoords.lng,
//           latitudeDelta: 0.015,
//           longitudeDelta: 0.0121,
//         },
//       });
//       getAddress();
//       setIsAddingNewAddress(false);
//       setSearchedLocation("");
//     }
//   };

//   const handleSavedAddressSelect = (location) => {
//     setSelectedSavedAddress(location);
//     setSearchedLocation(null);
//     setLocationCoords({ lat: location.latitude, lng: location.longitude });
//   };

//   const handleContinue = () => {
//     if (searchedLocation) {
//       // If user searched a new location
//       onContinue({
//         address: searchedLocation,
//         lat: locationCoords.lat,
//         lng: locationCoords.lng,
//       });
//     } else if (selectedSavedAddress) {
//       // If user selected a saved address
//       onContinue({
//         address: selectedSavedAddress.selected_region,
//         lat: selectedSavedAddress.latitude,
//         lng: selectedSavedAddress.longitude,
//       });
//     } else {
//       alert("Please select or search for a location before continuing.");
//     }
//   };

//   useEffect(() => {
//     getAddress();
//   }, []);

//   if (!isLoaded) {
//     return <Typography>Loading...</Typography>;
//   }

//   return (
//     <Box>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           paddingBottom: "1rem",
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Saved Address
//         </Typography>
//         <CloseIcon
//           sx={{ cursor: "pointer" }}
//           onClick={() => setOpenLocation(false)}
//         />
//       </Box>

//       {addressDetails.map((location) => (
//         <FormControlLabel
//           key={location._id}
//           control={
//             <Checkbox
//               checked={selectedSavedAddress?.id === location.id}
//               onChange={() => handleSavedAddressSelect(location)}
//             />
//           }
//           label={location.selected_region}
//         />
//       ))}

//       {!isAddingNewAddress ? (
//         <Button
//           variant="outlined"
//           fullWidth
//           sx={{ marginTop: 2, border: "1px solid #c026d3", color: "#c026d3" }}
//           onClick={() => setIsAddingNewAddress(true)}
//         >
//           + Add New Address
//         </Button>
//       ) : (
//         <Box
//           sx={{
//             marginTop: 2,
//             padding: 2,
//             border: "1px solid #ddd",
//             borderRadius: 2,
//           }}
//         >
//           <Typography variant="subtitle1 " gutterBottom>
//             Add New Address
//           </Typography>

//           {/* Google Places Autocomplete Input */}
//           <GooglePlacesAutocomplete
//             apiKey={GOOGLE_MAPS_API_KEY}
//             selectProps={{
//               value: searchedLocation
//                 ? { label: searchedLocation, value: searchedLocation }
//                 : null,
//               onChange: handlePlaceSelect,
//               placeholder: "Enter a location",
//             }}
//           />

//           <GoogleMap
//             mapContainerStyle={{
//               height: "200px",
//               width: "100%",
//               marginTop: "10px",
//             }}
//             center={
//               locationCoords.lat
//                 ? locationCoords
//                 : { lat: 12.9716, lng: 77.5946 }
//             }
//             zoom={12}
//           />

//           <Box display="flex" justifyContent="space-between" mt={2}>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSaveLocation}
//               disabled={!searchedLocation}
//             >
//               Save Location
//             </Button>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={() => setIsAddingNewAddress(false)}
//             >
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       )}

//       <Button
//         variant="contained"
//         fullWidth
//         sx={{ mt: 2, backgroundColor: "#c026d3" }}
//         onClick={handleContinue} // Now properly handles saved address selection
//       >
//         Continue
//       </Button>
//     </Box>
//   );
// };

// export default LocationSection;

// // import React, { useEffect, useState } from "react";
// // import {
// //   Box,
// //   Button,
// //   Typography,
// //   FormControlLabel,
// //   Checkbox,
// // } from "@mui/material";
// // import GooglePlacesAutocomplete from "react-google-places-autocomplete";
// // import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
// // import CloseIcon from "@mui/icons-material/Close";
// // import authService from "../../../../../../api/ApiService";
// // import { useDispatch, useSelector } from "react-redux";
// // import { setLoading } from "../../../../../../redux/slice/LoaderSlice";
// // import { getErrorMessage } from "../../../../../../utils/helperFunc";

// // const LocationSection = ({ onContinue, setOpenLocation }) => {
// //   const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
// //   const [searchedLocation, setSearchedLocation] = useState(null);
// //   const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);
// //   const [addressDetails, setAddressDetails] = useState([]);
// //   const [locationCoords, setLocationCoords] = useState({
// //     lat: null,
// //     lng: null,
// //   });
// //   const userDetails = useSelector((state) => state.auth.userDetails);
// //   const dispatch = useDispatch();

// //   const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

// //   const { isLoaded } = useJsApiLoader({
// //     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
// //     libraries: ["places"],
// //   });

// //   // ✅ Fetch saved addresses
// //   const getAddress = async () => {
// //     try {
// //       dispatch(setLoading(true));
// //       const res = await authService.getUserProfile(userDetails._id);
// //       if (res?.data?.saved_address) {
// //         setAddressDetails(res.data.saved_address);
// //       } else {
// //         setAddressDetails([]);
// //       }
// //       dispatch(setLoading(false));
// //     } catch (error) {
// //       dispatch(setLoading(false));
// //       getErrorMessage(error);
// //     }
// //   };

// //   // ✅ Handle Google place selection
// //   const handlePlaceSelect = async (place) => {
// //     if (!place) return;
// //     const geocoder = new window.google.maps.Geocoder();
// //     geocoder.geocode({ placeId: place.value.place_id }, (results, status) => {
// //       if (status === "OK" && results[0]) {
// //         setSearchedLocation(results[0].formatted_address);
// //         setSelectedSavedAddress(null);
// //         setLocationCoords({
// //           lat: results[0].geometry.location.lat(),
// //           lng: results[0].geometry.location.lng(),
// //         });
// //       }
// //     });
// //   };

// //   // ✅ Save a new address
// //   const handleSaveLocation = async () => {
// //     if (!searchedLocation || !locationCoords.lat) {
// //       alert("Please select a valid location first.");
// //       return;
// //     }

// //     try {
// //       dispatch(setLoading(true));

// //       const newAddress = {
// //         id: Date.now(),
// //         selected_region: searchedLocation,
// //         latitude: locationCoords.lat,
// //         longitude: locationCoords.lng,
// //         latitudeDelta: 0.015,
// //         longitudeDelta: 0.0121,
// //       };

// //       // ⬇️ Sending correct format to backend
// //       const res = await authService.addAddress(userDetails._id, {
// //         saved_address: newAddress,
// //       });

// //       if (res.status === 200 || res.status === 201) {
// //         await getAddress(); // refresh list
// //         setIsAddingNewAddress(false);
// //         setSearchedLocation(null);
// //         setLocationCoords({ lat: null, lng: null });
// //       } else {
// //         alert("Failed to save address. Please try again.");
// //       }

// //       dispatch(setLoading(false));
// //     } catch (error) {
// //       dispatch(setLoading(false));
// //       getErrorMessage(error);
// //     }
// //   };

// //   // ✅ Select saved address
// //   const handleSavedAddressSelect = (location) => {
// //     setSelectedSavedAddress(location);
// //     setSearchedLocation(null);
// //     setLocationCoords({
// //       lat: location.latitude,
// //       lng: location.longitude,
// //     });
// //   };

// //   // ✅ Continue button handler
// //   const handleContinue = () => {
// //     if (searchedLocation && locationCoords.lat) {
// //       onContinue({
// //         address: searchedLocation,
// //         lat: locationCoords.lat,
// //         lng: locationCoords.lng,
// //       });
// //     } else if (selectedSavedAddress) {
// //       onContinue({
// //         address: selectedSavedAddress.selected_region,
// //         lat: selectedSavedAddress.latitude,
// //         lng: selectedSavedAddress.longitude,
// //       });
// //     } else {
// //       alert("Please select or search for a location before continuing.");
// //     }
// //   };

// //   useEffect(() => {
// //     getAddress();
// //   }, []);

// //   if (!isLoaded) {
// //     return <Typography>Loading map...</Typography>;
// //   }

// //   return (
// //     <Box>
// //       {/* Header */}
// //       <Box
// //         sx={{
// //           display: "flex",
// //           justifyContent: "space-between",
// //           alignItems: "center",
// //           paddingBottom: "1rem",
// //         }}
// //       >
// //         <Typography variant="h6" gutterBottom>
// //           Saved Addresses
// //         </Typography>
// //         <CloseIcon
// //           sx={{ cursor: "pointer" }}
// //           onClick={() => setOpenLocation(false)}
// //         />
// //       </Box>

// //       {/* Saved addresses list */}
// //       {addressDetails && addressDetails.length > 0 ? (
// //         addressDetails.map((location) => (
// //           <FormControlLabel
// //             key={location.id}
// //             control={
// //               <Checkbox
// //                 checked={selectedSavedAddress?.id === location.id}
// //                 onChange={() => handleSavedAddressSelect(location)}
// //               />
// //             }
// //             label={location.selected_region}
// //           />
// //         ))
// //       ) : (
// //         <Typography variant="body2" color="text.secondary">
// //           No saved addresses found.
// //         </Typography>
// //       )}

// //       {/* Add new address section */}
// //       {!isAddingNewAddress ? (
// //         <Button
// //           variant="outlined"
// //           fullWidth
// //           sx={{
// //             marginTop: 2,
// //             border: "1px solid #c026d3",
// //             color: "#c026d3",
// //           }}
// //           onClick={() => setIsAddingNewAddress(true)}
// //         >
// //           + Add New Address
// //         </Button>
// //       ) : (
// //         <Box
// //           sx={{
// //             marginTop: 2,
// //             padding: 2,
// //             border: "1px solid #ddd",
// //             borderRadius: 2,
// //           }}
// //         >
// //           <Typography variant="subtitle1" gutterBottom>
// //             Add New Address
// //           </Typography>

// //           {/* Google Autocomplete */}
// //           <GooglePlacesAutocomplete
// //             apiKey={GOOGLE_MAPS_API_KEY}
// //             selectProps={{
// //               value: searchedLocation
// //                 ? { label: searchedLocation, value: searchedLocation }
// //                 : null,
// //               onChange: handlePlaceSelect,
// //               placeholder: "Enter a location",
// //             }}
// //           />

// //           {/* Map Preview */}
// //           <GoogleMap
// //             mapContainerStyle={{
// //               height: "200px",
// //               width: "100%",
// //               marginTop: "10px",
// //             }}
// //             center={
// //               locationCoords.lat
// //                 ? locationCoords
// //                 : { lat: 12.9716, lng: 77.5946 }
// //             }
// //             zoom={13}
// //           />

// //           <Box display="flex" justifyContent="space-between" mt={2}>
// //             <Button
// //               variant="contained"
// //               sx={{ backgroundColor: "#c026d3" }}
// //               onClick={handleSaveLocation}
// //               disabled={!searchedLocation}
// //             >
// //               Save Location
// //             </Button>
// //             <Button
// //               variant="outlined"
// //               color="secondary"
// //               onClick={() => setIsAddingNewAddress(false)}
// //             >
// //               Cancel
// //             </Button>
// //           </Box>
// //         </Box>
// //       )}

// //       {/* Continue Button */}
// //       <Button
// //         variant="contained"
// //         fullWidth
// //         sx={{ mt: 2, backgroundColor: "#c026d3" }}
// //         onClick={handleContinue}
// //       >
// //         Continue
// //       </Button>
// //     </Box>
// //   );
// // };

// // export default LocationSection;
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   FormControlLabel,
//   Checkbox,
// } from "@mui/material";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";
// import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
// import CloseIcon from "@mui/icons-material/Close";
// import authService from "../../../../../../api/ApiService";
// import { useDispatch, useSelector } from "react-redux";
// import { setLoading } from "../../../../../../redux/slice/LoaderSlice";
// import { getErrorMessage } from "../../../../../../utils/helperFunc";

// const LocationSection = ({ onContinue, setOpenLocation }) => {
//   const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
//   const [searchedLocation, setSearchedLocation] = useState(null);
//   const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);
//   const [addressDetails, setAddressDetails] = useState([]);
//   const [locationCoords, setLocationCoords] = useState({
//     lat: null,
//     lng: null,
//   });
//   const userDetails = useSelector((state) => state.auth.userDetails);
//   const dispatch = useDispatch();

//   const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
//     libraries: ["places"],
//   });
//   const [searchInput, setSearchInput] = useState("");

//   const mapUrl = searchInput
//     ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBF48uqsKVyp9P2NlDX-heBJksvvT_8Cqk&q=${encodeURIComponent(
//         searchInput
//       )}&zoom=14`
//     : `https://www.google.com/maps/embed/v1/place?key=AIzaSyBF48uqsKVyp9P2NlDX-heBJksvvT_8Cqk&q=India&zoom=4`;

//   // ✅ Fetch saved addresses
//   const getAddress = async () => {
//     try {
//       dispatch(setLoading(true));
//       const res = await authService.getUserProfile(userDetails._id);
//       if (res?.data?.saved_address) {
//         setAddressDetails(res.data.saved_address);
//       } else {
//         setAddressDetails([]);
//       }
//       dispatch(setLoading(false));
//     } catch (error) {
//       dispatch(setLoading(false));
//       getErrorMessage(error);
//     }
//   };

//   // ✅ Handle Google place selection
//   const handlePlaceSelect = async (place) => {
//     if (!place) return;
//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ placeId: place.value.place_id }, (results, status) => {
//       if (status === "OK" && results[0]) {
//         setSearchedLocation(results[0].formatted_address);
//         setSelectedSavedAddress(null);
//         setLocationCoords({
//           lat: results[0].geometry.location.lat(),
//           lng: results[0].geometry.location.lng(),
//         });
//       }
//     });
//   };

//   // ✅ Save a new address
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

//       // ⬇️ Sending correct format to backend
//       const res = await authService.addAddress(userDetails._id, {
//         saved_address: newAddress,
//       });

//       if (res.status === 200 || res.status === 201) {
//         await getAddress(); // refresh list
//         setIsAddingNewAddress(false);
//         setSearchedLocation(null);
//         setLocationCoords({ lat: null, lng: null });
//       } else {
//         alert("Failed to save address. Please try again.");
//       }

//       dispatch(setLoading(false));
//     } catch (error) {
//       dispatch(setLoading(false));
//       getErrorMessage(error);
//     }
//   };

//   // ✅ Select saved address
//   const handleSavedAddressSelect = (location) => {
//     setSelectedSavedAddress(location);
//     setSearchedLocation(null);
//     setLocationCoords({
//       lat: location.latitude,
//       lng: location.longitude,
//     });
//   };

//   // ✅ Continue button handler
//   const handleContinue = () => {
//     if (searchedLocation && locationCoords.lat) {
//       onContinue({
//         address: searchedLocation,
//         lat: locationCoords.lat,
//         lng: locationCoords.lng,
//       });
//     } else if (selectedSavedAddress) {
//       onContinue({
//         address: selectedSavedAddress.selected_region,
//         lat: selectedSavedAddress.latitude,
//         lng: selectedSavedAddress.longitude,
//       });
//     } else {
//       alert("Please select or search for a location before continuing.");
//     }
//   };

//   useEffect(() => {
//     getAddress();
//   }, []);

//   if (!isLoaded) {
//     return <Typography>Loading map...</Typography>;
//   }

//   return (
//     <Box>
//       {/* Header */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           paddingBottom: "1rem",
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Saved Addresses
//         </Typography>
//         <CloseIcon
//           sx={{ cursor: "pointer" }}
//           onClick={() => setOpenLocation(false)}
//         />
//       </Box>

//       {/* Saved addresses list */}
//       {addressDetails && addressDetails.length > 0 ? (
//         addressDetails.map((location) => (
//           <FormControlLabel
//             key={location.id}
//             control={
//               <Checkbox
//                 checked={selectedSavedAddress?.id === location.id}
//                 onChange={() => handleSavedAddressSelect(location)}
//               />
//             }
//             label={location.selected_region}
//           />
//         ))
//       ) : (
//         <Typography variant="body2" color="text.secondary">
//           No saved addresses found.
//         </Typography>
//       )}

//       {/* Add new address section */}
//       {!isAddingNewAddress ? (
//         <Button
//           variant="outlined"
//           fullWidth
//           sx={{
//             marginTop: 2,
//             border: "1px solid #c026d3",
//             color: "#c026d3",
//           }}
//           onClick={() => setIsAddingNewAddress(true)}
//         >
//           + Add New Address
//         </Button>
//       ) : (
//         <Box
//           sx={{
//             marginTop: 2,
//             padding: 2,
//             border: "1px solid #ddd",
//             borderRadius: 2,
//           }}
//         >
//           <Typography variant="subtitle1" gutterBottom>
//             Add New Address
//           </Typography>

//           {/* Google Autocomplete */}
//           {/* <GooglePlacesAutocomplete
//             apiKey={GOOGLE_MAPS_API_KEY}
//             selectProps={{
//               value: searchedLocation
//                 ? { label: searchedLocation, value: searchedLocation }
//                 : null,
//               onChange: handlePlaceSelect,
//               placeholder: "Enter a location",
//             }}
//           /> */}

//           {/* Map Preview */}
//           {/* <GoogleMap
//             mapContainerStyle={{
//               height: "200px",
//               width: "100%",
//               marginTop: "10px",
//             }}
//             center={
//               locationCoords.lat
//                 ? locationCoords
//                 : { lat: 12.9716, lng: 77.5946 }
//             }
//             zoom={13}
//           /> */}
//           <div style={{ position: "relative", height: "400px" }}>
//             <input
//               type="text"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Search location (e.g., area, city)"
//               style={{ borderRadius: 8, fontSize: 14 }}
//             />
//             <iframe
//               title="map"
//               width="100%"
//               height="100%"
//               style={{ border: 0 }}
//               loading="lazy"
//               src={mapUrl}
//             />
//           </div>
//           <Box display="flex" justifyContent="space-between" mt={2}>
//             <Button
//               variant="contained"
//               sx={{ backgroundColor: "#c026d3" }}
//               onClick={handleSaveLocation}
//               disabled={!searchedLocation}
//             >
//               Save Location
//             </Button>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={() => setIsAddingNewAddress(false)}
//             >
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       )}

//       {/* Continue Button */}
//       <Button
//         variant="contained"
//         fullWidth
//         sx={{ mt: 2, backgroundColor: "#c026d3" }}
//         onClick={handleContinue}
//       >
//         Continue
//       </Button>
//     </Box>
//   );
// };

// export default LocationSection;

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
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

const LocationSection = ({ onContinue, setOpenLocation }) => {
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);
  const [addressDetails, setAddressDetails] = useState([]);
  const [locationCoords, setLocationCoords] = useState({
    lat: null,
    lng: null,
  });
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({
    lat: 28.6139,
    lng: 77.209, // Default to Delhi
  });
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const dispatch = useDispatch();
  const mapRef = useRef();

  const GOOGLE_MAPS_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Fetch saved addresses
  const getAddress = async () => {
    try {
      dispatch(setLoading(true));
      const res = await authService.getUserProfile(userDetails._id);
      if (res?.data?.saved_address) {
        setAddressDetails(
          Array.isArray(res.data.saved_address)
            ? res.data.saved_address
            : [res.data.saved_address]
        );
      } else {
        setAddressDetails([]);
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      getErrorMessage(error);
    }
  };

  // Handle Google place selection
  const handlePlaceSelect = async (place) => {
    if (!place?.value?.place_id) return;

    try {
      const results = await geocodeByPlaceId(place.value.place_id);
      const result = results[0];

      const newLocation = {
        address: result.formatted_address,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      };

      setSearchedLocation(newLocation.address);
      setLocationCoords({
        lat: newLocation.lat,
        lng: newLocation.lng,
      });
      setSelectedSavedAddress(null);

      // Update map center and add marker
      setCenter({ lat: newLocation.lat, lng: newLocation.lng });
      setMarkers([newLocation]);
      setSelectedMarker(newLocation);

      if (map) {
        map.panTo(newLocation);
        map.setZoom(15);
      }
    } catch (error) {
      console.error("Error selecting place:", error);
    }
  };

  // Save a new address
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
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      };

      const res = await authService.addAddress(userDetails._id, {
        saved_address: newAddress,
      });

      if (res.status === 200 || res.status === 201) {
        await getAddress(); // refresh list
        setIsAddingNewAddress(false);
        setSearchedLocation(null);
        setLocationCoords({ lat: null, lng: null });
        setMarkers([]);
        toast.success("Address saved successfully!");
      } else {
        alert("Failed to save address. Please try again.");
      }

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      getErrorMessage(error);
    }
  };

  // Select saved address
  const handleSavedAddressSelect = (location) => {
    const savedLocation = {
      address: location.selected_region,
      lat: location.latitude,
      lng: location.longitude,
    };

    setSelectedSavedAddress(location);
    setSearchedLocation(savedLocation.address);
    setLocationCoords({
      lat: savedLocation.lat,
      lng: savedLocation.lng,
    });

    // Update map
    setCenter({ lat: savedLocation.lat, lng: savedLocation.lng });
    setMarkers([savedLocation]);
    setSelectedMarker(savedLocation);

    if (map) {
      map.panTo(savedLocation);
      map.setZoom(15);
    }
  };

  // Map click handler
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
  };

  // Continue button handler
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

    if (selectedLocation) {
      onContinue(selectedLocation);
    } else {
      alert("Please select or search for a location before continuing.");
    }
  };

  // Initialize map
  const onMapLoad = (map) => {
    setMap(map);
  };

  useEffect(() => {
    if (userDetails?._id) {
      getAddress();
    }
  }, [userDetails]);

  if (!isLoaded) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>Loading map...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "600px", display: "flex", flexDirection: "column" }}>
      {/* Header */}
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
        <CloseIcon
          sx={{ cursor: "pointer" }}
          onClick={() => setOpenLocation(false)}
        />
      </Box>

      {/* Saved Addresses */}
      <Box sx={{ p: 2, maxHeight: "200px", overflowY: "auto" }}>
        <Typography variant="subtitle1" gutterBottom>
          Saved Addresses
        </Typography>
        {addressDetails.length > 0 ? (
          addressDetails.map((location) => (
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

      {/* Add New Address Section */}
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

          {/* Google Places Autocomplete */}
          <GooglePlacesAutocomplete
            autocompletionRequest={{
              componentRestrictions: { country: "in" }, // India only
            }}
            selectProps={{
              placeholder: "Search address...",
              value: null,
              onChange: handlePlaceSelect,
              styles: {
                input: (provided) => ({
                  ...provided,
                  padding: "12px",
                  fontSize: "14px",
                }),
                option: (provided) => ({
                  ...provided,
                  padding: "12px",
                  fontSize: "14px",
                }),
              },
            }}
          />

          {/* Interactive Map */}
          <Box sx={{ flex: 1, mt: 2, position: "relative" }}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={12}
              onLoad={onMapLoad}
              onClick={onMapClick}
            >
              {markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => setSelectedMarker(marker)}
                >
                  {selectedMarker?.lat === marker.lat &&
                    selectedMarker?.lng === marker.lng && (
                      <InfoWindow>
                        <Typography variant="body2">
                          {marker.address}
                        </Typography>
                      </InfoWindow>
                    )}
                </Marker>
              ))}
            </GoogleMap>
          </Box>

          {/* Selected Location Info */}
          {/* Selected Location Info */}
          {searchedLocation && (
            <Box sx={{ p: 2, bgcolor: "#f0f8ff", borderRadius: 1, mt: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Selected:
              </Typography>
              <Typography variant="body2">{searchedLocation}</Typography>
              <Typography variant="caption" color="text.secondary">
                Lat:{" "}
                {locationCoords.lat ? locationCoords.lat.toFixed(6) : "N/A"},
                Lng:{" "}
                {locationCoords.lng ? locationCoords.lng.toFixed(6) : "N/A"}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              sx={{ flex: 1, backgroundColor: "#c026d3" }}
              onClick={handleSaveLocation}
              disabled={!searchedLocation}
            >
              Save Address
            </Button>
            <Button
              variant="outlined"
              sx={{ flex: 1 }}
              onClick={() => setIsAddingNewAddress(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      <Divider />

      {/* Continue Button */}
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
