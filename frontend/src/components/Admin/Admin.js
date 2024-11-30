import React, { useState, useEffect } from "react";
import "./Admin.css";
import AdminNavbar from "../Navbar/AdminNavbar";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useNavigate } from "react-router-dom";
import eventImage from "../assets/event.jpg";
const Admin = () => {
  const [eventCount, setEventCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await fetch("http://localhost:5000/allevent");
        const eventData = await eventResponse.json();
        if (eventData.success) {
          setEventCount(eventData.events.length);
        }

        const categoryResponse = await fetch(
          "http://localhost:5000/allcategory"
        );
        const categoryData = await categoryResponse.json();
        if (categoryData.success) {
          setCategoryCount(categoryData.categories.length); // Set the category count based on the response length
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="admin-container">
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
            All Events
          </button>
        </div>
        <p>Manage your events and customer information here.</p>

        <div className="dashboard-metrics">
          <div className="metric">
            <h3>Events Registered</h3>
            <p>{eventCount}</p>
          </div>
          <div className="metric">
            <h3>Categories</h3>
            <p>{categoryCount}</p>
          </div>
        </div>

        <div className="chart-container">
          <div className="bar-chart">
            <BarChart
              series={[
                {
                  data: [eventCount],
                  label: "Events Registered",
                  color: "#4caf50",
                },
                {
                  data: [categoryCount],
                  label: "Categories Count",
                  color: "#2196f3",
                },
              ]}
              height={290}
              xAxis={[{ data: ["Q1"], scaleType: "band" }]}
              yAxis={[{ label: "Count", tickFormat: (value) => value }]}
              margin={{ top: 80, bottom: 30, left: 40, right: 20 }}
              legend={{ position: "top" }}
            />
          </div>

          <div className="pie-chart">
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: eventCount, label: "Events" },
                    { id: 1, value: categoryCount, label: "Categories" },
                  ],
                },
              ]}
              width={500}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
