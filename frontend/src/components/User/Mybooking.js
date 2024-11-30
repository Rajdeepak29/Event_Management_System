import React, { useState, useEffect } from "react";
import "./Mybooking.css";
import AdminNavbar from "../Navbar/Navbar1";
import { format } from "date-fns";

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setUserName(user?.name || "User");
      console.log(userName);
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log(`Fetching bookings for user: ${userName}`);

        const response = await fetch(
          `http://localhost:5000/get-booking-details/${userName}`
        );

        if (!response.ok) {
          console.error(
            `Failed to fetch: ${response.status} ${response.statusText}`
          );
          return;
        }

        const data = await response.json();
        console.log("Fetched bookings data: ", data);

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
  }, [userName]);

  return (
    <div>
      <AdminNavbar />
      <div className="event-booking-container">
        <h1 className="page-title">My Bookings</h1>
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
                <td colSpan="6" style={{ textAlign: "center" }}>
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
    </div>
  );
};

export default MyBooking;
