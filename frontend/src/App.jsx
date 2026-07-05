import{ BrowserRouter, Routes, Route, Link } from "react-router-dom"

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to = "/">Home</Link>
        <Link to = "/login">Login</Link>
        <Link to = "/register">Register</Link>
        <Link to = "/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path = "/" element = {<Home />}/>
        <Route path = "/login" element = {<Login />} />
        <Route path = "/register" element = {<Register />}/>
        <Route path = "/profile" element = {<Profile />}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;