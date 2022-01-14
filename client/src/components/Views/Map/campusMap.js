/* https://dev.to/jessicabetts/how-to-use-google-maps-api-and-react-js-26c2 */
/* https://youtu.be/WZcxJGmLbSo */

import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import mapStyles from "./mapStyles";

const libraries = ["places"];

const mapContainerStyle = {
  width: "98%",
  height: "92%",
};

const center = {
  lat: 43.662618222482855,
  lng: -79.39538737067738,
};

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  minZoom: 15,
  maxZoom: 20,
};

const CampusMap = ({ washrooms, scrollTo }) => {
  const displayMarkers = () => {
    return washrooms.map((washroom, index) => {
      return (
        <Marker
          key={index}
          id={index}
          position={{
            lat: washroom.coordinates.lat,
            lng: washroom.coordinates.lng,
          }}
          cursor="pointer"
          onClick={() => scrollTo(washroom._id)}
        />
      );
    });
  };

  const { isLoaded, loadError } = useLoadScript({
    // id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={17}
      options={options}
      // onLoad={onLoad}
      // onUnmount={onUnmount}
    >
      {displayMarkers()}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default CampusMap;
