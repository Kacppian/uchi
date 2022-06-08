import { useState } from "react";
import "./App.css";
import HomeViewer from "./components/HomeViewer";
import GeoMap from "./components/Map";
import PrimaryActions from "./components/PrimaryActions";
import StatusBar from "./components/StatusBar";

const properties = require("./data/properties.json");

function App() {
  const [selectedHome, setSelectedHome] = useState(null);

  return (
    <div className="App">
      <div className="">
        <StatusBar />
      </div>
      <div className="flex items-center">
        <HomeViewer selectedHome={selectedHome} />
      </div>
      <GeoMap
        homes={properties}
        selectedHome={selectedHome}
        onMarkerClicked={(home) => setSelectedHome(home)}
      />
      <div className="flex justify-center">
        <PrimaryActions />
      </div>
    </div>
  );
}

export default App;
