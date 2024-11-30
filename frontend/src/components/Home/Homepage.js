import React, { useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const togglePanel = () => {
    setIsRightPanelActive(!isRightPanelActive);
  };

  return (
    <div className="home-page">
      <h2 style={{ marginTop: "3%" }}>Welcome to Event Management</h2>
      <div
        className={`container ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
        id="container"
      >
        <div className="form-container sign-in-container">
          <form action="#">
            <h1 style={{ color: "black" }}>Hello! Admin</h1>
            <p>Login to access your admin account</p>
            <Link to="/adminlogin" style={{ textDecoration: "none" }}>
              <button style={{ color: "whitesmoke" }}>Sign In</button>
            </Link>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-right">
              <h1 style={{ color: "whitesmoke" }}>Hello! User</h1>
              <p style={{ color: "whitesmoke" }}>
                Login and explore our website and register for exciting
                events...
              </p>
              <Link to="/Login" style={{ color: "whitesmoke" }}>
                <button className="ghost" style={{ color: "whitesmoke" }}>
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <p>
          <i className="fa fa-info-circle" aria-hidden="true"></i>
          This is the official website of Event Management System!!!
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
