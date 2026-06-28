const express = require("express");
const mongoose  = require("mongoose")
const app = express();
const User = require("./models/User")
const bcrypt = require("bcryptjs")

app.use(express.json()); 

app.get("/",(req,res)=>{ 
    res.send("Hello user")
});

app.post("/register", async (req,res) => {
  try{
    const{username, email, password} = req.body;
    if(username === "" || email === "" || password === ""){
      return res.send("Please fill all fields")
    }

    const existingUsername = await User.findOne({username});
    if(existingUsername){
      return res.send("Username already exists")
    }
    const existingEmail = await User.findOne({email})
    if(existingEmail){
      return res.send("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const user = {
       username,
       email,
       password: hashedPassword 
    }
    console.log(user)

    await User.create(user)
    res.send("User registered successfully")
  }
  catch(error){
    console.log(error)
    res.send("Something went wrong")
  }   

})

mongoose.connect(process.env.MONGO_URI) 
.then(() => { 
 console.log("MongoDB connected"); 
    
  app.listen(3000, () => { 
    console.log("Server is running");
  });
}) 
.catch((error) => {
   console.log(error);
});