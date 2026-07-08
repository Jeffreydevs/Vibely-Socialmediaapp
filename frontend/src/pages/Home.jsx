import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

function Home() {
  const [user,setUser] = useState(null);
  const [posts,setPosts] = useState([]);

  async function fetchProfile(){
     const token = localStorage.getItem("token");
     try{
       const response = await axios.get(`${API_URL}/profile`, {
         headers: { Authorization: `Bearer ${token}`}
       });
       setUser(response.data);
      }
     catch(error){
       console.log(error)
      }
  };

  async function fetchPosts(){
     const token = localStorage.getItem("token");
     try{
       const response = await axios.get(`${API_URL}/posts`,{
         headers: { Authorization: `Bearer ${token}`}
       });
       setPosts(response.data);
     }
     catch(error){
       console.log(error)
     }
  };

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  },[]);

  return (
     <>
       {user && <h1>Welcome {user.username}</h1>}
       {posts.map((post) => (
         <p key={post._id}>{post.content}</p>
       ))}
     </>
  );
}

export default Home;
