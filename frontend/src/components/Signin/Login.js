import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import Navbar from "../Navbar/Navbar";
import Modal from "../Popup/Modal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Email and Password are required.");
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      console.log("Server Response:", response.data);

      if (response.data.success) {
        const userName = { name: response.data.name };
        localStorage.setItem("user", JSON.stringify(userName));

        setMessage("Login successful! Redirecting...");
        setShowModal(true);

        setTimeout(() => {
          navigate("/User");
        }, 2000);
      } else {
        setMessage(response.data.message || "Invalid email or password.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(
        error.response?.data?.message ||
          "An error occurred. Please check your connection."
      );
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Navbar />
      <div className="login-container">
        <h2>User Login</h2>
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
          <label style={{ position: "relative" }}>
            Password:
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: "10px" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "38px",
                top: "60%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>
          <button type="submit" style={{ width: "150px", marginLeft: "32%" }}>
            Login
          </button>
        </form>

        <div className="signup-link">
          <p>
            Don't have an account?{" "}
            <a href="/register" style={{ color: "blue" }}>
              Sign Up
            </a>
          </p>
        </div>
      </div>

      {showModal && <Modal message={message} onClose={closeModal} />}
    </div>
  );
};

export default Login;
