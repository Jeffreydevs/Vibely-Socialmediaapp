import { useState } from "react"
import  axios  from "axios"

function Register() {
  const [ username, setUsername ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

  const API_URL = "http://localhost:3000";

  async function handleRegister() {
    if(!username || !email || !password){
      alert("Please fill all fields")
      return
    }
    try{
      await axios.post(`${API_URL}/register`,{
        username, email, password
      })
      alert("User registered successfully");
      setUsername("");
      setEmail("");
      setPassword("");
    }
    catch(error){
      alert(error.response.data.message);
    }

  }

  return (
    <>
     <h1>Register</h1>
     <input type="text" placeholder="Enter username" onChange={(event) =>setUsername(event.target.value)} value={username} />
     <input type="email" placeholder="Enter email" onChange={(event) =>setEmail(event.target.value)} value={email}/>
     <input type="password" placeholder="Enter password" onChange={(event) =>setPassword(event.target.value)} value={password}/>
     <button onClick={handleRegister}>Register</button>
    </>
  )

}
export default Register