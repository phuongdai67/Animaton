import React from "react";
import Button from "../ui/Button/Button";
import "./PageNotFound.css";

const PageNotFound: React.FC = () => {
  return (
    <div className="page-not-found-container">
      <Button className="btn-go-home" href="/">
        Back To Home
      </Button>
    </div>
  );
};

export default PageNotFound;