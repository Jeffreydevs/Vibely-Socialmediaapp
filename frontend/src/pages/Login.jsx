import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

function Login({setIsLoggedIn}) {
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  async function handleLogin(){
    if(!email || !password){
      alert("Please fill all fields")
      return
    }
    try{
      const response = await axios.post(`${API_URL}/login`,{
        email,password
      });
      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true);
      navigate("/");
    }
    catch(error){
      alert(error.response.data.message);
    }
  }

  return(
    <section className="auth-page">
      <div className="auth-panel card">
        <p className="eyebrow">Welcome back</p>
        <h1>Log in to Vibely</h1>
        <p className="muted">Catch up with your feed, post updates, and keep the conversation moving.</p>

        <div className="form-stack">
          <input type="email" placeholder="Email address" value={email} onChange={(event)=>setEmail(event.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(event)=>setPassword(event.target.value)} />
          <button className="primary-button" onClick={handleLogin}>Login</button>
        </div>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  )
}
export default Login;
