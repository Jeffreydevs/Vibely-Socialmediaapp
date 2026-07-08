import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

function Home() {
  const [user,setUser] = useState(null);
  const [posts,setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [commentText,setCommentText] = useState({});

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
  }

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

  async function handleLike(postId) {
    const token = localStorage.getItem("token");
    try{
      const response = await axios.post(`${API_URL}/posts/${postId}/like`,{},
        {headers: {Authorization: `Bearer ${token}`}})
      fetchPosts()
    }
    catch(error){
      console.log(error)
    }
  };

  async function handleDeletePost(postId){
    const token = localStorage.getItem("token");
    try{
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}`}
      });
      fetchPosts()
    }
    catch(error){
      console.log(error)
    }
  };

  async function handleEditPost(post){
    const newContent = prompt("Edit your post", post.content);
    if(!newContent || !newContent.trim()){
      return
    }
    const token = localStorage.getItem("token");
    try{
      await axios.put(`${API_URL}/posts/${post._id}`, {content: newContent}, {
        headers: {Authorization: `Bearer ${token}`}
      });
      fetchPosts()
    }
    catch(error){
      console.log(error)
    }
  };

  async function handleCommentPost(postId) {
    const text = commentText[postId];

    if(!text || !text.trim()){
      alert("Please write a comment")
      return
    }

    const token = localStorage.getItem("token");
    try{
      await axios.post(`${API_URL}/posts/${postId}/comment`, {text}, {
        headers: {Authorization: `Bearer ${token}`}
      });
      setCommentText({...commentText, [postId]: ""})
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
          <button onClick={() => handleLike(post._id)}>
            Like {post.likes.length}
          </button>
          {user && post.userId._id === user._id && (
            <button onClick={() => handleDeletePost(post._id)}>
              Delete
            </button>
          )}
          {user&&post.userId._id === user._id && (
            <button onClick={()=>handleEditPost(post)}>
              Edit
            </button>
          )}
          <div>
            <input
              type="text"
              placeholder="Write a comment"
              value={commentText[post._id] || ""}
              onChange={(event) => setCommentText({
                ...commentText,
                [post._id]: event.target.value
              })}
            />
            <button onClick={() => handleCommentPost(post._id)}>
              Comment
            </button>
          </div>
          {post.comments.map((comment) => (
            <p key={comment._id}>{comment.text}</p>
          ))}
        </div> 
      ))}
    </>
  );
}

export default Home;
