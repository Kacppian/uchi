import React from "react";
import "./index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const HomeViewer = ({ selectedHome }) => {
  return (
    <div className="viewer-container overflow-hidden">
      <Carousel>
        {selectedHome?.images.map((image) => (
          <img src={image} key={image} />
        ))}
      </Carousel>
      <div className="container px-2">
      <h2 className="text-left">{selectedHome?.title}</h2>
      </div>
    </div>
  );
};

export default HomeViewer;
