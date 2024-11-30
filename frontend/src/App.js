import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./components/Admin/Admin";
import User from "./components/User/User";
import Login from "./components/Signin/Login";
import Register from "./components/Signup/Register";
import HomePage from "./components/Home/Homepage";
import AddEvent from "./components/Event/AddEvent";
import AllEvent from "./components/Event/AllEvent";
import Eventbookings from "./components/Admin/Eventbookings";
import AdminLogin from "./components/Signin/Adminlogin";
import EventDetails from "./components/Payment/Eventdetails";
import AddCategory from "./components/Category/Addcategory";
import AllCategories from "./components/Category/AllCategory";
import Mybooking from "./components/User/Mybooking";
import PaymentSuccess from "./components/Payment/PaymentSuccess";
import AdNavbar from "./components/Navbar/Navbar2";
function App() {
  return (
    <Router>
      <div className="app">
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user" element={<User />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/addevent" element={<AddEvent />} />
          <Route path="/allevent" element={<AllEvent />} />
          <Route path="/eventbookings" element={<Eventbookings />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/eventdetails/:Id" element={<EventDetails />} />
          <Route path="/addcategory" element={<AddCategory />} />
          <Route path="/allcategory" element={<AllCategories />} />
          <Route path="/Mybooking" element={<Mybooking />} />
          <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          <Route path="/adnavbar" element={<AdNavbar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
