import React, { useState, useEffect } from "react";
import "./Eventbookings.css";
import AdminNavbar from "../Navbar/AdminNavbar";
import { format } from "date-fns";

const Eventbooking = () => {
  const [bookings, setBookings] = useState([]);
  const [userName, setUserName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedTickets, setSelectedTickets] = useState(1);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setUserName(user?.name || "User");
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/get-booking-detail`
        );
        if (!response.ok) {
          console.error(
            `Failed to fetch: ${response.status} ${response.statusText}`
          );
          return;
        }

        const data = await response.json();
        if (data && data.bookings) {
          setBookings(data.bookings);
        } else {
          console.error(
            "Failed to fetch bookings or empty bookings data:",
            data
          );
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleBookTickets = (availableTickets) => {
    if (selectedTickets > availableTickets) {
      setPopupMessage(
        `Cannot book tickets. Only ${availableTickets} tickets are available.`
      );
      setShowPopup(true);
      return;
    }

    if (selectedTickets > 10) {
      setPopupMessage("Cannot book more than 10 tickets per user.");
      setShowPopup(true);
      return;
    }

    console.log("Proceed with booking:", selectedTickets);
  };

  return (
    <div>
      <AdminNavbar />
      <div className="event-booking-container">
        <h1 className="page-title">Event Bookings</h1>
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Event Name</th>
              <th>Category</th>
              <th>User Name</th>
              <th>Tickets</th>
              <th>Booking Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No bookings to display.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.Id}>
                  <td>{booking.paymentid || "N/A"}</td>
                  <td>{booking.eventname || "N/A"}</td>
                  <td>{booking.category || "N/A"}</td>
                  <td>{booking.username || "N/A"}</td>
                  <td>{booking.tickets || "N/A"}</td>
                  <td>
                    {booking.bookingdate &&
                    !isNaN(new Date(booking.bookingdate))
                      ? format(
                          new Date(booking.bookingdate),
                          "MMMM dd, yyyy hh:mm a"
                        )
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Booking Error</h3>
            <p>{popupMessage}</p>
            <button className="close-btn" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Eventbooking;
