import React from "react";
import { Link } from "react-router-dom";
import "./AdminNavbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/admin">
        <h1>Admin Dashboard</h1>
      </Link>
      <ul className="nav-links1">
        <li>
          <Link to="/addevent">Add Event</Link>
        </li>
        <li>
          <Link to="/addcategory">Add Category</Link>
        </li>
        <li>
          <Link to="/allevent">All Events</Link>
        </li>
        <li>
          <Link to="/allcategory">All Categories</Link>
        </li>
        <li>
          <Link to="/eventbookings">Event Bookings</Link>
        </li>

        <li>
          <Link to="/">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
