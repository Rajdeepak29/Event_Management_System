import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import "./Eventdetails.css";
import Navbar1 from "../Navbar/Navbar1";
import Modal from "../Popup/Modal";

const EventDetails = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketsToBook, setTicketsToBook] = useState(1);
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setUserName(user?.name || "User");
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/eventdetails/${Id}`
        );
        setEventDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch event details");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [Id]);

  const handleTicketBooking = () => {
    if (ticketsToBook > eventDetails.Tickets) {
      setModalMessage(
        `Cannot book tickets. Only ${eventDetails.Tickets} tickets are available.`
      );
      setShowModal(true);
      return;
    }

    if (ticketsToBook > 10) {
      setModalMessage("You cannot book more than 10 tickets.");
      setShowModal(true);
      return;
    }

    handleStripeCheckout();
  };

  const handleStripeCheckout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/create-checkout-session",
        {
          eventId: Id,
          eventName: eventDetails.Eventname,
          category: eventDetails.Category,
          username: userName,
          totalTickets: ticketsToBook,
          totalPrice: ticketsToBook * eventDetails.Ticketsprice,
        }
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error redirecting to Stripe:", error);
      alert("Error starting payment. Please try again.");
    }
  };

  return (
    <div>
      <Navbar1 />
      <div className="event-details-container">
        <h2>Event Details</h2>
        {loading ? (
          <p>Loading event details...</p>
        ) : error ? (
          <p>{error}</p>
        ) : eventDetails ? (
          <div className="event-details-card">
            <h3>Event name :{eventDetails.Eventname}</h3>
            <p>
              <strong>Venue:</strong> {eventDetails.Venuename}
            </p>
            <p>
              <strong>Location:</strong> {eventDetails.Location}
            </p>
            <p>
              <strong>Available Tickets:</strong> {eventDetails.Tickets}
            </p>
            <p>
              <strong>Price per Ticket:</strong> ₹{eventDetails.Ticketsprice}
            </p>
            <p>
              <strong>Event Start:</strong>{" "}
              {format(
                new Date(eventDetails.startdate),
                "MMMM dd, yyyy hh:mm a"
              )}
            </p>
            <p>
              <strong>Event End:</strong>{" "}
              {format(new Date(eventDetails.enddate), "MMMM dd, yyyy hh:mm a")}
            </p>

            <div className="booking-section">
              <label>
                Tickets to Book:
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={ticketsToBook}
                  onChange={(e) => setTicketsToBook(Number(e.target.value))}
                />
              </label>
              <button className="book-button" onClick={handleTicketBooking}>
                Proceed to Payment
              </button>
            </div>
          </div>
        ) : (
          <p>Event not found</p>
        )}
      </div>

      {showModal && (
        <Modal message={modalMessage} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default EventDetails;
