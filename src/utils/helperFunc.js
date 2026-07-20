import dayjs from "dayjs";

export const getErrorMessage = (error) => {
  if (error && error.message) {
    return error.message;
  } else if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.message
  ) {
    return error.response.data.message;
  } else {
    return "An unexpected error occurred.";
  }
};

const GOOGLE_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

// Ordered preference for naming a place. Google doesn't always return
// "locality" (rural areas and many Indian towns only carry the admin levels),
// so fall through the list instead of giving up on the first miss.
const CITY_TYPES = [
  "locality",
  "postal_town",
  "administrative_area_level_3",
  "administrative_area_level_2",
  "administrative_area_level_1",
];
const TOWN_TYPES = [
  "sublocality_level_1",
  "sublocality",
  "neighborhood",
  "locality",
];

// Scan EVERY result, not just results[0] — the first is usually the exact
// street address, which often lacks the locality/sublocality components.
function pickComponent(results, types) {
  for (const type of types) {
    for (const result of results) {
      const hit = (result.address_components || []).find((c) =>
        c.types.includes(type)
      );
      if (hit?.long_name) return hit.long_name;
    }
  }
  return "";
}

async function reverseGeocode(latitude, longitude) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "OK" || !data.results?.length) {
    // Never invent a placeholder name — an empty string lets the UI show a
    // sensible prompt instead of literally displaying "City not found".
    return { lat: latitude, lng: longitude, city: "", town: "" };
  }

  const city = pickComponent(data.results, CITY_TYPES);
  const town = pickComponent(data.results, TOWN_TYPES);
  return {
    lat: latitude,
    lng: longitude,
    city: city || town,
    // Don't repeat the same name in both fields.
    town: town && town !== city ? town : "",
  };
}

// Try GPS-accurate first; if that times out (common on desktops, which have no
// GPS and can sit for ~10s before failing), retry once allowing a cached,
// network-based fix rather than failing outright.
function getPosition() {
  const highAccuracy = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };
  const fallback = {
    enableHighAccuracy: false,
    timeout: 15000,
    maximumAge: 5 * 60 * 1000, // a fix from the last 5 min is fine
  };
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, (firstError) => {
      // A denied permission won't succeed on retry — fail fast so the UI can
      // tell the user to enable location instead of hanging another 15s.
      if (firstError.code === firstError.PERMISSION_DENIED) {
        reject(
          "Location permission is blocked. Please allow location access in your browser and try again."
        );
        return;
      }
      navigator.geolocation.getCurrentPosition(
        resolve,
        (err) => reject(err.message || "Error getting location."),
        fallback
      );
    }, highAccuracy);
  });
}

export async function getCurrentCity() {
  const position = await getPosition();
  const { latitude, longitude } = position.coords;
  try {
    return await reverseGeocode(latitude, longitude);
  } catch (error) {
    // Reverse geocoding failed, but the coordinates are still valid and are
    // what the nearby-vendor distance filter actually needs — keep them.
    console.warn("Reverse geocoding failed:", error?.message || error);
    return { lat: latitude, lng: longitude, city: "", town: "" };
  }
}

// Forward-geocode a typed location (e.g. "Bangalore") into city/town/coords,
// so users can manually choose a location instead of relying on geolocation.
export async function getCityFromQuery(query) {
  const GOOGLE_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

  if (!query || !query.trim()) {
    throw new Error("Please enter a location.");
  }

  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    query.trim()
  )}&key=${GOOGLE_API_KEY}`;

  const response = await fetch(geocodingUrl);
  const data = await response.json();

  if (data.status === "OK" && data.results.length > 0) {
    const result = data.results[0];
    const addressComponents = result.address_components || [];

    const city =
      addressComponents.find((c) => c.types.includes("locality"))?.long_name ||
      addressComponents.find((c) =>
        c.types.includes("administrative_area_level_2")
      )?.long_name ||
      query.trim();

    const town =
      addressComponents.find((c) => c.types.includes("sublocality_level_1"))
        ?.long_name ||
      addressComponents.find((c) =>
        c.types.includes("administrative_area_level_1")
      )?.long_name ||
      "";

    const loc = result.geometry?.location || {};

    return {
      lat: loc.lat,
      lng: loc.lng,
      city,
      town,
    };
  }

  throw new Error("Location not found. Try a different search.");
}

export const formatCurrencyIntl = (amount) => {
  if (typeof amount !== "number") return "Invalid amount";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString, formatType = "YYYY-MM-DD HH:mm A") => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const formatOptions = {
    "YYYY-MM-DD": { year: "numeric", month: "2-digit", day: "2-digit" },
    "DD/MM/YYYY": { day: "2-digit", month: "2-digit", year: "numeric" },
    "MMMM D, YYYY": { year: "numeric", month: "long", day: "numeric" },
    "YYYY-MM-DD HH:mm A": {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
    "dddd, MMMM D YYYY": {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  };

  const options = formatOptions[formatType] || formatOptions["YYYY-MM-DD"];
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
// Format date as DD/MM/YYYY using dayjs
export const formatDate1 = (date) => {
  return dayjs(date).format("DD/MM/YYYY");
};

// export const formatTicketDate = (dateStr) => {
//   const date = new Date(dateStr);

//   const options = {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   };

//   // return date.toLocaleString("en-US", options);
//   return new Intl.DateTimeFormat("en-GB", options).format(date);
// };
export const formatTicketDate = (dateStr) => {
  const date = new Date(dateStr);

  // const options = {
  //   year:'numeric',
  //   month:'numeric',
  //   day:'numeric'
  // }

  const day = String(date.getDate()).padStart(2, "1");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
  // return new Intl.DateTimeFormat('en-GB', options).format(date);
};

export const formatProperDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
