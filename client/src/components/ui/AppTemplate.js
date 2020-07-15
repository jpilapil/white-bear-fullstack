import React from "react";
import Header from "../ui/Header";
import Navigation from "../ui/Navigation";

export default function AppTemplate(props) {
  return (
    <div className="container">
      <div className="row mt-1">
        <div className="col-12 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2 col-md-10 offset-md-1">
          <Header />
          <Navigation />
          {/* displays everything passed into AppTemplate component */}
          {props.children}
        </div>
      </div>
    </div>
  );
}
