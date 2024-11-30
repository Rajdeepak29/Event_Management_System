import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";
import Navbar2 from "../Navbar/Navbar2";
import Modal from "../Popup/Modal";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin24@gmail.com");
  const [password, setPassword] = useState("Admin2024");
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Email and Password are required.");
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/adminlogin", {
        email,
        password,
      });

      console.log("Server Response:", response.data);

      if (response.data.success) {
        setMessage(response.data.message || "Login successful! Redirecting...");
        setShowModal(true);

        setTimeout(() => {
          navigate("/admin");
        }, 2000);
      } else {
        setMessage(response.data.message || "Invalid email or password.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setMessage(
          error.response.data.message || "An error occurred. Please try again."
        );
      } else if (error.request) {
        setMessage("No response from server. Please check your connection.");
      } else {
        setMessage(
          "An error occurred while setting up the request. Please try again."
        );
      }

      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Navbar2 />
      <div className="login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email ID:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <div className="password-input-wrapper">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "340px" }}
                className="password-input"
              />
              <span
                className="eye-icon"
                style={{
                  position: "absolute",
                  right: "38px",
                  top: "48%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </label>

          <button type="submit" style={{ width: "150px", marginLeft: "32%" }}>
            Login
          </button>
        </form>
      </div>

      {showModal && <Modal message={message} onClose={closeModal} />}
    </div>
  );
};

export default AdminLogin;
