import React, { useState, useEffect } from "react";
import "./Allcategory.css";
import AdminNavbar from "../Navbar/AdminNavbar";

const AllCategories = () => {
  const [categories, setCategories] = useState([]);

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

  const handleDelete = async (categoryId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/allcategory/${categoryId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Category deleted successfully!");
        setCategories(
          categories.filter((category) => category.Id !== categoryId)
        );
      } else {
        alert("Error deleting category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleUpdate = async (categoryId) => {
    const updatedName = prompt("Enter the new Category Name:");
    if (updatedName) {
      try {
        const response = await fetch(
          `http://localhost:5000/allcategory/${categoryId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ Categoryname: updatedName }),
          }
        );
        const data = await response.json();
        if (data.success) {
          alert("Category updated successfully!");
          setCategories(
            categories.map((category) =>
              category.Id === categoryId
                ? { ...category, Categoryname: updatedName }
                : category
            )
          );
        } else {
          alert("Error updating category.");
        }
      } catch (error) {
        console.error("Error updating category:", error);
      }
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="all-categories-container">
        <h1 className="page-title">All Categories</h1>
        <table className="categories-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No categories to display.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.Id}>
                  <td>{category.Categoryname || "N/A"}</td>
                  <td>{category.Categorydescription || "N/A"}</td>
                  <td>
                    <button
                      className="btn update-btn"
                      onClick={() => handleUpdate(category.Id)}
                    >
                      Update
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => handleDelete(category.Id)}
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
    </div>
  );
};

export default AllCategories;
