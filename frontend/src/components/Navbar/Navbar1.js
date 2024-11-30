import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>User Dashboard</h1>
      <ul className="nav-links">
        <li>
          <Link to="/Mybooking">My Bookings</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
