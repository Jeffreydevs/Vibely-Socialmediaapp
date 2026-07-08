import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function formatDate(dateString){
   if(!dateString){
      return "Recently";
   }

   return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
   });
}

function Profile() {
   const [user,setUser] = useState(null);
   const [myPosts,setMyPosts] = useState([]);
   const [loading,setLoading] = useState(true);
   const [error,setError] = useState("");

   useEffect(() => {
      async function fetchProfileData(){
         const token = localStorage.getItem("token");
         try{
            setLoading(true);
            setError("");

            const headers = { Authorization: `Bearer ${token}`};
            const [profileResponse, postsResponse] = await Promise.all([
               axios.get(`${API_URL}/profile`, {headers}),
               axios.get(`${API_URL}/my-posts`, {headers})
            ]);

            setUser(profileResponse.data);
            setMyPosts(postsResponse.data);
         }
         catch(error){
            console.log(error)
            setError("Could not load your profile right now.");
         }
         finally{
            setLoading(false);
         }
      }

      fetchProfileData();
   },[]);

   const totalLikes = myPosts.reduce((total, post) => total + (post.likes?.length || 0), 0);
   const totalComments = myPosts.reduce((total, post) => total + (post.comments?.length || 0), 0);

   return (
      <section className="profile-page">
         <div className="profile-card card">
            <div className="profile-banner"></div>
            <div className="profile-content">
               <div className="avatar profile-avatar">
                  {user?.username?.charAt(0).toUpperCase() || "V"}
               </div>
               <p className="eyebrow">Vibely profile</p>
               <h1>{user?.username || "Loading profile"}</h1>
               <p className="muted">{user?.email || "Your account details will appear here."}</p>

               {loading && (
                  <div className="notice-card">
                     Loading your profile...
                  </div>
               )}

               {error && (
                  <div className="notice-card error-card">
                     {error}
                  </div>
               )}

               {!loading && !error && (
                  <>
                     <div className="profile-stats">
                        <div>
                           <strong>{myPosts.length}</strong>
                           <span>Posts</span>
                        </div>
                        <div>
                           <strong>{totalLikes}</strong>
                           <span>Likes</span>
                        </div>
                        <div>
                           <strong>{totalComments}</strong>
                           <span>Comments</span>
                        </div>
                     </div>

                     <div className="profile-posts">
                        <h2>Your posts</h2>
                        {myPosts.length > 0 ? (
                           myPosts.map((post) => (
                              <article className="profile-post" key={post._id}>
                                 <p>{post.content}</p>
                                 <span>
                                    {formatDate(post.createdAt)} · {post.likes?.length || 0} likes · {post.comments?.length || 0} comments
                                 </span>
                              </article>
                           ))
                        ) : (
                           <p className="muted">You have not posted yet.</p>
                        )}
                     </div>
                  </>
               )}
            </div>
         </div>
      </section>
   )
}
export default Profile;
