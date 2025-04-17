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
export async function getCurrentCity() {
  const GOOGLE_API_KEY = "AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g";

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

        try {
          const response = await fetch(geocodingUrl);
          const data = await response.json();

          if (data.status === "OK" && data.results.length > 0) {
            const addressComponents = data.results[0].address_components;

            const city = addressComponents.find((component) =>
              component.types.includes("locality")
            )?.long_name;

            const town = addressComponents.find((component) =>
              component.types.includes("sublocality_level_1")
            )?.long_name;

            resolve({
              lat: latitude,
              lng: longitude,
              city: city || "City not found",
              town: town || "Town not found",
            });
          } else {
            resolve({
              lat: latitude,
              lng: longitude,
              city: "City not found",
              town: "Town not found",
            });
          }
        } catch (error) {
          reject("Error fetching location data.");
        }
      },
      (error) => {
        reject(error.message || "Error getting location.");
      },
      { enableHighAccuracy: true }
    );
  });
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
export const formatTicketDate  = (dateStr) => {
  const date = new Date(dateStr);

  // const options = {
  //   year:'numeric',
  //   month:'numeric',
  //   day:'numeric'
  // }

  const day = String(date.getDate()).padStart(2,'1');
  const month = String(date.getMonth() + 1).padStart(2,'0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
  // return new Intl.DateTimeFormat('en-GB', options).format(date);
}

export const formatProperDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
