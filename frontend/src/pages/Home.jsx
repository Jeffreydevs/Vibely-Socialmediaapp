import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

function Home() {
  const [user,setUser] = useState(null);
  const [posts,setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [commentText,setCommentText] = useState({});
  const navigate = useNavigate()

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
    const token = localStorage.getItem("token");
    if (!token) {
     navigate("/login");
     return;
   }
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
    <section className="feed-page">
      <div className="feed-header">
        <div>
          <p className="eyebrow">Your social pulse</p>
          <h1>{user ? `Welcome back, ${user.username}` : "Welcome to Vibely"}</h1>
        </div>
        <div className="status-pill">Live feed</div>
      </div>

      <div className="composer card">
        <div className="avatar">{user?.username?.charAt(0).toUpperCase() || "V"}</div>
        <div className="composer-body">
          <textarea
            placeholder="Share a vibe with the world..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <div className="composer-actions">
            <span>{content.length}/280</span>
            <button className="primary-button" onClick={handleCreatePost}>Post</button>
          </div>
        </div>
      </div>

      {Array.isArray(posts) &&
        posts.length > 0 ? (
          <div className="post-list">
            {posts.map((post) => {
              const ownerName = post.userId?.username || "Vibely user";
              const isOwner = user && post.userId?._id === user._id;

              return (
                <article className="post-card card" key={post._id}>
                  <div className="post-top">
                    <div className="avatar">{ownerName.charAt(0).toUpperCase()}</div>
                    <div>
                      <h3>{ownerName}</h3>
                      <p>Shared a new vibe</p>
                    </div>
                  </div>

                  <p className="post-content">{post.content}</p>

                  <div className="post-actions">
                    <button onClick={() => handleLike(post._id)}>
                      Like {post.likes?.length || 0}
                    </button>
                    {isOwner && (
                      <>
                        <button onClick={()=>handleEditPost(post)}>
                          Edit
                        </button>
                        <button onClick={() => handleDeletePost(post._id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>

                  <div className="comment-box">
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

                  {(post.comments || []).length > 0 && (
                    <div className="comments">
                      {post.comments.map((comment) => {
                        const commenterId = typeof comment.userId === "string"
                          ? comment.userId
                          : comment.userId?._id;
                        const commenterName = comment.userId?.username ||
                          (user && commenterId === user._id ? user.username : "Vibely user");

                        return (
                          <div className="comment" key={comment._id}>
                            <div className="comment-avatar">
                              {commenterName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong>{commenterName}</strong>
                              <p>{comment.text}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        ) : (
          <div className="empty-state card">
            <h2>No posts yet</h2>
            <p>Start the conversation by sharing the first vibe.</p>
          </div>
        )
      }
    </section>
  );
}

export default Home;
