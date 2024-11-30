import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Modal from "../Popup/Modal";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const passwordCriteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid =
    passwordCriteria.length &&
    passwordCriteria.uppercase &&
    passwordCriteria.lowercase &&
    passwordCriteria.number &&
    passwordCriteria.specialChar;

  const isPasswordMatch = password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid || !isPasswordMatch) return;

    try {
      const response = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        setModalMessage("Registration Successful!");
        setShowModal(true);

        setTimeout(() => {
          setShowModal(false);
          navigate("/login");
        }, 2000);
      } else {
        setModalMessage(response.data.message);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setModalMessage("An error occurred. Please try again.");
      setShowModal(true);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-container">
        <h2>Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              placeholder="Email"
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
                placeholder="Password"
                value={password}
                style={{ width: "90%" }}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordFocus && (
              <div className="password-instructions">
                <p className={passwordCriteria.length ? "valid" : "invalid"}>
                  At least 8 characters
                </p>
                <p className={passwordCriteria.uppercase ? "valid" : "invalid"}>
                  At least one uppercase letter
                </p>
                <p className={passwordCriteria.lowercase ? "valid" : "invalid"}>
                  At least one lowercase letter
                </p>
                <p className={passwordCriteria.number ? "valid" : "invalid"}>
                  At least one number
                </p>
                <p
                  className={passwordCriteria.specialChar ? "valid" : "invalid"}
                >
                  At least one special character (!@#$%^&*)
                </p>
              </div>
            )}
          </label>
          <label>
            Confirm Password:
            <div className="password-input-wrapper">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                style={{ width: "90%" }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {confirmPassword && (
              <p
                className={
                  isPasswordMatch
                    ? "password-match valid"
                    : "password-match invalid"
                }
              >
                {isPasswordMatch
                  ? "Passwords match!"
                  : "Passwords do not match."}
              </p>
            )}
          </label>
          <button
            type="submit"
            disabled={!isPasswordValid || !isPasswordMatch}
            style={{ width: "60%", marginLeft: "20%" }}
          >
            Submit
          </button>
        </form>
      </div>
      {showModal && <Modal message={modalMessage} />}
    </div>
  );
};

export default Register;
