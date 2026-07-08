import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

function Profile() {
   const [user,setUser] = useState(null);

   useEffect(() => {
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

      fetchProfile();
   },[]);

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
            </div>
         </div>
      </section>
   )
}
export default Profile;
