import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const API_URL = "http://localhost:3000";

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
      navigate("/");
    }
    catch(error){
      alert(error.response.data.message);
    }
  }

  return( 
    <>
     <h1>Login</h1>
     <input type="email" placeholder="Enter email" value={email} onChange={(event)=>setEmail(event.target.value)} />
     <input type="password" placeholder="Enter password" value={password} onChange={(event)=>setPassword(event.target.value)} />
     <button onClick={handleLogin}>Login</button>
    </> 
  )
}
export default Login;