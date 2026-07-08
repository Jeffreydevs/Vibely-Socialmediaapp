import { useState, useEffect } from "react";
import{ useNavigate, Routes, Route, Link } from "react-router-dom"
import "./App.css";

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
    <div className="app-shell">
      <nav className="topbar">
        <Link to="/" className="brand">
          <img className="brand-logo" src="/vibely-logo.svg" alt="Vibely" />
          <span>Vibely</span>
        </Link>

        <div className="nav-links">
          {isLoggedIn ? (
            <>
              <Link to = "/">Home</Link>
              <Link to = "/profile">Profile</Link>
              <button className="ghost-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to = "/login">Login</Link>
              <Link to = "/register" className="primary-link">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="app-main">
        <Routes>
          <Route path = "/" element = {<Home />}/>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path = "/register" element = {<Register />}/>
          <Route path = "/profile" element = {<Profile />}/>
        </Routes>
      </main>
    </div>
  );
}
export default App;
