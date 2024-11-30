import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddEvent.css";
import AdminNavbar from "../Navbar/AdminNavbar";
import Modal from "../Popup/Modal";

const AddEvent = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    eventName: "",
    category: "",
    venueName: "",
    location: "",
    tickets: "",
    ticketsPrice: "",
    startDate: "",
    endDate: "",
    location: "",
  });

  const tamilNaduDistricts = [
    "Ariyalur",
    "Chennai",
    "Chengalpattu",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kanchipuram",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "The Nilgiris",
    "Theni",
    "Thiruvallur",
    "Thiruvarur",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tiruppur",
    "Vellore",
    "Villupuram",
    "Virudhunagar",
  ];

  const [categories, setCategories] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/allcategory");
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          console.error("Failed to fetch categories: ", data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/addevent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();
      if (data.success) {
        setModalMessage("Event added successfully!");
        setShowModal(true);

        setTimeout(() => {
          navigate("/allevent");
        }, 2000);

        setEventData({
          eventName: "",
          category: "",
          venueName: "",
          location: "",
          tickets: "",
          ticketsPrice: "",
          startDate: "",
          endDate: "",
        });
      } else {
        setModalMessage("Error adding event: " + data.message);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setModalMessage("An error occurred while adding the event.");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <AdminNavbar />
      <div className="form-page1">
        <div className="form-container">
          <h1 className="form-title">Add Event</h1>
          <form className="event-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Event Name</label>
              <input
                type="text"
                placeholder="Enter event name"
                required
                name="eventName"
                value={eventData.eventName}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Category</label>
              <select
                name="category"
                required
                value={eventData.category}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((category) => (
                  <option key={category.Id} value={category.Categoryname}>
                    {category.Categoryname}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Venue Name</label>
              <input
                type="text"
                placeholder="Enter venue name"
                required
                name="venueName"
                value={eventData.venueName}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>Location</label>
              <select
                required
                name="location"
                value={eventData.location}
                onChange={handleChange}
                className="location-select"
              >
                <option value="" disabled>
                  Select a district
                </option>
                {tamilNaduDistricts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>No. of Tickets</label>
              <input
                type="number"
                placeholder="Enter number of tickets"
                required
                name="tickets"
                value={eventData.tickets}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>Ticket Price</label>
              <input
                type="number"
                placeholder="Enter ticket price"
                required
                name="ticketsPrice"
                value={eventData.ticketsPrice}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>Start Date</label>
              <input
                type="datetime-local"
                required
                name="startDate"
                value={eventData.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>End Date</label>
              <input
                type="datetime-local"
                required
                name="endDate"
                value={eventData.endDate}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-button">
              Add Event
            </button>
          </form>
        </div>
      </div>

      {showModal && <Modal message={modalMessage} onClose={handleCloseModal} />}
    </div>
  );
};

export default AddEvent;
