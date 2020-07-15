import React from "react";
import landingLogo from "../../img/logo-landing.png";
import SignUp from "../ui/SignUp";
import LogIn from "../ui/LogIn";

export default function Landing() {
  return (
    <div>
      <div className="background-image">
        <div className="container">
          <div id="landing-brand" className="row">
            <div className="col-lg-1 offset-lg-0 col-md-2 col-sm-12 offset-sm-1 col-10 offset-2 col-xl-1">
              <img
                className="bear-logo "
                src={landingLogo}
                alt="White Bear Landing Logo"
              />
            </div>

            <div className="col-xl-7 offset-xl-1 col-lg-6 offset-lg-2 col-md-6 offset-md-2 col-sm-12 offset-sm-2 col-11 offset-1">
              <h1 className="logo-text">White Bear</h1>
            </div>
          </div>
          <div className="row mt-6">
            {/* sign up card */}
            <SignUp />
            {/* log in card */}
            <LogIn />
          </div>
        </div>
      </div>
    </div>
  );
}
