import React, { useState, useEffect } from "react";
import "./AllEvent.css";
import AdminNavbar from "../Navbar/AdminNavbar";
import { format } from "date-fns";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [updatedEvent, setUpdatedEvent] = useState({
    Eventname: "",
    Category: "",
    Venuename: "",
    Location: "",
    Tickets: "",
    Ticketsprice: "",
    startdate: "",
    enddate: "",
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/allevent");
        const data = await response.json();
        if (data.success) {
          setEvents(data.events);
        } else {
          console.error("Failed to fetch events: ", data.message);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/allevent/${eventId}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (data.success) {
        alert("Event deleted successfully!");
        setEvents(events.filter((event) => event.Id !== eventId));
      } else {
        alert("Error deleting event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUpdate = (event) => {
    setSelectedEvent(event);
    setUpdatedEvent({
      Eventname: event.Eventname,
      Category: event.Category,
      Venuename: event.Venuename,
      Location: event.Location,
      Tickets: event.Tickets,
      Ticketsprice: event.Ticketsprice,
      startdate: event.startdate
        ? new Date(event.startdate).toISOString().slice(0, 16) // ISO format for datetime-local
        : "",
      enddate: event.enddate
        ? new Date(event.enddate).toISOString().slice(0, 16) // ISO format for datetime-local
        : "",
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent({ ...updatedEvent, [name]: value });
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    const eventToUpdate = {
      ...updatedEvent,
      startdate: updatedEvent.startdate || selectedEvent.startdate,
      enddate: updatedEvent.enddate || selectedEvent.enddate,
    };

    const startDateTime = new Date(eventToUpdate.startdate);
    const endDateTime = new Date(eventToUpdate.enddate);

    if (startDateTime >= endDateTime) {
      alert("Start Date must be earlier than End Date.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/allevent/${selectedEvent.Id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventToUpdate),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Event updated successfully!");

        setEvents(
          events.map((event) =>
            event.Id === selectedEvent.Id
              ? {
                  ...event,
                  ...eventToUpdate,
                }
              : event
          )
        );

        setIsEditing(false);
      } else {
        alert("Error updating event.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("An error occurred while updating the event.");
    }
  };

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

  return (
    <div>
      <AdminNavbar />
      <div className="all-events-container">
        <h1 className="page-title">All Events</h1>
        <table className="events-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Category</th>
              <th>Venue Name</th>
              <th>Location</th>
              <th>No. of Tickets</th>
              <th>Ticket Price</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No events to display.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.Id}>
                  <td>{event.Eventname || "N/A"}</td>
                  <td>{event.Category || "N/A"}</td>
                  <td>{event.Venuename || "N/A"}</td>
                  <td>{event.Location || "N/A"}</td>
                  <td>{event.Tickets || "N/A"}</td>
                  <td>₹{event.Ticketsprice || "N/A"}</td>
                  <td>
                    {event.startdate
                      ? format(
                          new Date(event.startdate),
                          "MMMM dd, yyyy hh:mm a"
                        )
                      : "N/A"}
                  </td>
                  <td>
                    {event.enddate
                      ? format(new Date(event.enddate), "MMMM dd, yyyy hh:mm a")
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      className="btn update-btn"
                      style={{ marginRight: "60px" }}
                      onClick={() => handleUpdate(event)}
                    >
                      Update
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => handleDelete(event.Id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Event</h2>
            <form onSubmit={handleSubmitUpdate}>
              <label>
                Event Name:
                <input
                  type="text"
                  name="Eventname"
                  value={updatedEvent.Eventname}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </label>
              <label>
                Category:
                <select
                  name="Category"
                  style={{ padding: "8px" }}
                  required
                  value={updatedEvent.Category}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((Category) => (
                    <option key={Category.Id} value={Category.Categoryname}>
                      {Category.Categoryname}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Venue Name:
                <input
                  type="text"
                  name="Venuename"
                  value={updatedEvent.Venuename}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </label>
              <label>
                Location:
                <select
                  name="Location"
                  style={{ padding: "8px" }}
                  value={updatedEvent.Location}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="" disabled>
                    Select Location
                  </option>
                  {tamilNaduDistricts.map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                No. of Tickets:
                <input
                  type="number"
                  name="Tickets"
                  value={updatedEvent.Tickets}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </label>
              <label>
                Ticket Price:
                <input
                  type="number"
                  name="Ticketsprice"
                  value={updatedEvent.Ticketsprice}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </label>
              <label>
                Start Date:
                <input
                  type="datetime-local"
                  name="startdate"
                  value={updatedEvent.startdate}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </label>
              <label>
                End Date:
                <input
                  type="datetime-local"
                  name="enddate"
                  value={updatedEvent.enddate}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </label>
              <button type="submit" className="btn save-btn">
                Save Changes
              </button>
              <button
                type="button"
                className="btn cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEvents;
