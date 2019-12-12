import React from "react";
import mapboxgl from "mapbox-gl";
import "../styles/home.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2F1c2hpa2FzcCIsImEiOiJjazNidnAwZTAwcHphM2NxajdjNm8wemM1In0.ExnKedz6NW_X3wgqk0B0xg";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 77.5946,
      lat: 12.9716,
      zoom: 12
    };
  }

  componentDidMount() {
    const { lat, lng, zoom } = this.state;
    new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom
    });
  }

  render() {
    return (
      <div>
        <div ref={el => (this.mapContainer = el)} className="mapContainer" />
      </div>
    );
  }
}

export default Home;
