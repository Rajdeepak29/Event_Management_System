import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./User.css";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Space } from "antd";
import eventImage from "../assets/event.jpg";

const User = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [name, setUserName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/allevent");
        setEvents(response.data.events);
        console.log(events);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setUserName(user?.name || "User");
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logout successful!");
    navigate("/");
  };

  const handleBookTickets = (eventId) => {
    navigate(`/eventdetails/${eventId}`);
  };

  return (
    <div className="userhome-page">
      <nav className="navbar">
        <h1>User Dashboard</h1>
        <ul className="nav-links">
          <li>
            <Link to="/mybooking">My Bookings</Link>
          </li>
        </ul>

        <div
          className="user-icon-container"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <Avatar size="large" icon={<UserOutlined />} />

          <i className="fa fa-user-circle user-icon"></i>
          {showUserMenu && (
            <div className="user-menu">
              <p style={{ color: "black" }}>{name}</p>{" "}
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="user-container">
        <div
          className="dashboard-overview"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)) , url(${eventImage})`,
          }}
        >
          <h1 className="motivational-quote">
            The only way to do great work is to love what you do.
          </h1>
          <button
            className="all-events-button"
            onClick={() => navigate("/allevent")}
          >
            My Bookings
          </button>
        </div>
        <h2>List of Events</h2>
        <p>Book your events here.</p>
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.Eventname}</h3>
                <p>
                  <strong>Category:</strong> {event.Category}
                </p>
                <p>
                  <strong>Location:</strong> {event.Location}
                </p>
                <p>
                  <strong>Tickets Available:</strong> {event.Tickets}
                </p>
                <p>
                  <strong>Price:</strong> ₹{event.Ticketsprice}
                </p>{" "}
                <button
                  onClick={() => handleBookTickets(event.Id)}
                  style={{ backgroundColor: "#03458b" }}
                >
                  Book Tickets
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button
                className="confirm-btn"
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
              >
                Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <footer>
        <p>
          <i className="fa fa-info-circle" aria-hidden="true"></i> This is the
          official website of Event Management System
        </p>
      </footer>
    </div>
  );
};

export default User;
