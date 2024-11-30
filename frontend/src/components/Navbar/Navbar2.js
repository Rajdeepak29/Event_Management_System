import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar1">
      <h1>Admin Dashboard</h1>
      <ul className="nav-links">
        <li>
          <Link to="/adminlogin">Admin Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
