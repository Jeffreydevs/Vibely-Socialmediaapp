import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import  axios  from "axios"

function Register() {
  const [ username, setUsername ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  async function handleRegister() {
    if(!username || !email || !password){
      alert("Please fill all fields")
      return
    }
    try{
      const response = await axios.post(`${API_URL}/register`,{
        username, email, password
      })
      alert(response.data.message);
      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/login");
    }
    catch(error){
      alert(error.response.data.message);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-panel card">
        <p className="eyebrow">Join the room</p>
        <h1>Create your Vibely account</h1>
        <p className="muted">Choose a username, share your thoughts, and connect through posts and comments.</p>

        <div className="form-stack">
          <input type="text" placeholder="Username" onChange={(event) =>setUsername(event.target.value)} value={username} />
          <input type="email" placeholder="Email address" onChange={(event) =>setEmail(event.target.value)} value={email}/>
          <input type="password" placeholder="Password" onChange={(event) =>setPassword(event.target.value)} value={password}/>
          <button className="primary-button" onClick={handleRegister}>Register</button>
        </div>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  )

}
export default Register
