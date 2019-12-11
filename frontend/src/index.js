import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import mapboxgl from "mapbox-gl";
import * as serviceWorker from "./serviceWorker";

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2F1c2hpa2FzcCIsImEiOiJjazNidnAwZTAwcHphM2NxajdjNm8wemM1In0.ExnKedz6NW_X3wgqk0B0xg";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
