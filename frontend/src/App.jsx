import { useState, useEffect } from "react";
import{ useNavigate, Routes, Route, Link } from "react-router-dom"

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState( !!localStorage.getItem("token") );

  function handleLogout() {
    localStorage.removeItem("token")
    setIsLoggedIn(false);
    navigate("/login");
  }
  return (
    <>
    <nav>
      {isLoggedIn ? (
        <>
          <Link to = "/">Home</Link>
          <Link to = "/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to = "/login">Login</Link>
          <Link to = "/register">Register</Link>
        </>
      )}
    </nav>
    <Routes>
      <Route path = "/" element = {<Home />}/>
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
      <Route path = "/register" element = {<Register />}/>
      <Route path = "/profile" element = {<Profile />}/>
    </Routes>
    </>
  );
}
export default App;
