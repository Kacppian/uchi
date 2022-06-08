import React from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import "./index.css";

const accessToken =
  "pk.eyJ1Ijoia2F1c2hpa2FzcCIsImEiOiJja3Rrd2hlOHAwMmkxMndwNnpvZnJ5czdzIn0.z4og6I4NbvFTq2LRDUr_eA";

const GeoMap = ({ homes, onMarkerClicked, selectedHome }) => {
  return (
    <Map
      mapboxAccessToken={accessToken}
      initialViewState={{
        longitude: 77.5946,
        latitude: 12.9716,
        zoom: 12,
      }}
      style={{ width: "100%", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/dark-v10"
    >
      {homes
        .filter((item, index) => index < 200)
        .map((home) => (
          <Marker
            key={home.title}
            longitude={home.coordinates.lng}
            latitude={home.coordinates.lat}
            onClick={() => onMarkerClicked(home)}
            anchor="bottom"
          >
            <div
              className={`${
                selectedHome.title === home.title ? "selected-marker" : "marker"
              } `}
            ></div>
          </Marker>
        ))}
    </Map>
  );
};

export default GeoMap;
