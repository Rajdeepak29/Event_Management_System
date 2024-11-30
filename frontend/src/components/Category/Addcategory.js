import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Addcategory.css";
import AdminNavbar from "../Navbar/AdminNavbar";
import Modal from "../Popup/Modal";

const AddCategory = () => {
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState({
    Categorytitle: "",
    Categorydescription: "",
  });

  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({
      ...categoryData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/addcategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();
      if (data.success) {
        setModalMessage("Category added successfully!");
        setShowModal(true);

        setTimeout(() => {
          navigate("/allcategory");
        }, 2000);

        setCategoryData({
          Categorytitle: "",
          Categorydescription: "",
        });
      } else {
        setModalMessage(data.message || "An error occurred.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setModalMessage("An error occurred while adding the category.");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <AdminNavbar />
      <div className="form-page2">
        <div className="form-container1">
          <h1 className="form-title">Add Category</h1>
          <form className="category-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Category Title</label>
              <input
                type="text"
                placeholder="Enter category title"
                required
                name="Categorytitle"
                value={categoryData.Categorytitle}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Category Description</label>
              <textarea
                placeholder="Enter category description"
                required
                name="Categorydescription"
                value={categoryData.Categorydescription}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-button">
              Add Category
            </button>
          </form>
        </div>
      </div>

      {showModal && <Modal message={modalMessage} onClose={handleCloseModal} />}
    </div>
  );
};

export default AddCategory;
