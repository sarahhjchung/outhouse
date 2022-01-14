// environment configutations
import ENV from "./../config.js";
const API_HOST = ENV.api_host;
// console.log('Current environment:', ENV.env)

// Get a washroom by its id
export const getWashroom = (washroom, id) => {
  // the URL for the request
  const url = `${API_HOST}/api/washrooms/${id}`;
  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get washroom");
      }
    })
    .then((json) => {
      washroom.setState({ washroom: json.washroom });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Get all washrooms in the database
export const getWashrooms = (washrooms) => {
  // the URL for the request
  const url = `${API_HOST}/api/washrooms`;

  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get washrooms");
      }
    })
    .then((json) => {
      washrooms.setState({ washrooms: json.washrooms });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteWashroom = (washroomID) => {
  // the URL for the request
  const url = `${API_HOST}/api/washrooms/${washroomID}`;

  fetch(url, { method: "DELETE" })
    .then((res) => {
      if (res.status === 200) {
        console.log("Successfully deleted washroom");
      } else {
        alert("Could not delete washroom");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateWashroom = (
  name,
  location,
  amenities,
  gender,
  longitude,
  latitude,
  wid
) => {
  const washroomBody = {
    name: name,
    location: location,
    amenities: amenities,
    gender: gender,
    coordinates: {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
    },
  };

  // Create our request constructor with all the parameters we need
  const request = new Request(`${API_HOST}/api/washrooms/${wid}`, {
    method: "PATCH",
    body: JSON.stringify(washroomBody),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  // Send the request with fetch()
  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// A function to send a POST request to add a review to a washroom
export const addWashroom = (
  name,
  location,
  amenities,
  gender,
  longitude,
  latitude
) => {
  const washroomBody = {
    name: name,
    location: location,
    amenities: amenities,
    gender: gender,
    coordinates: {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
    },
  };

  const request = new Request(`${API_HOST}/api/washrooms/`, {
    method: "post",
    body: JSON.stringify(washroomBody),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  // Send the request with fetch()
  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
