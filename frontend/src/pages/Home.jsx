import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

function Home() {
  const [user,setUser] = useState(null);
  const [posts,setPosts] = useState([]);
  const [content, setContent] = useState("");

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

  async function handleCreatePost() {
     if(!content.trim()){
       alert("Please write something")
       return
     }
     const token = localStorage.getItem("token");
     try{
       const response = await axios.post(`${API_URL}/posts`,{content},
         {headers: {Authorization: `Bearer ${token}`}})
       setContent("")
       fetchPosts()  
     }
     catch(error){
       console.log(error)
     }
  };

  return (
     <>
       {user && <h1>Welcome {user.username}</h1>}
       <textarea placeholder="What's on your mind?" value={content} onChange={(event) => setContent(event.target.value)}>

       </textarea>
       <button onClick={handleCreatePost}>Post</button>
       {posts.map((post) => (
         <div key={post._id}>
           <h3>{post.userId.username}</h3>
           <p>{post.content}</p>
         </div> 
       ))}
     </>
  );
}

export default Home;
