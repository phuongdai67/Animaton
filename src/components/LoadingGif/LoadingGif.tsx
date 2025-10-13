import React from "react";
import "./LoadingGif.css";
import loadingGif from "../../assets/loading2.gif";

const LoadingGif: React.FC = () => {
  return (
    <div className="loading-container">
      <img src={loadingGif.src} alt="Loading..." className="loading-gif" />
    </div>
  );
};

export default LoadingGif;
