import { useState, useEffect } from "react";
import{ useNavigate, Routes, Route, Link } from "react-router-dom"

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("token")
    navigate("/login");
  }
  return (
    <>
    <nav>
      <Link to = "/">Home</Link>
      <Link to = "/login">Login</Link>
      <Link to = "/register">Register</Link>
      <Link to = "/profile">Profile</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
    <Routes>
      <Route path = "/" element = {<Home />}/>
      <Route path = "/login" element = {<Login />} />
      <Route path = "/register" element = {<Register />}/>
      <Route path = "/profile" element = {<Profile />}/>
    </Routes>
    </>
  );
}
export default App;