require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose  = require("mongoose")
const app = express();
const User = require("./models/User")
const Post = require("./models/Post")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authMiddleware = require("./middleware/authMiddleware");

app.use(express.json()); 

app.get("/profile",authMiddleware, async (req,res)=>{ 
    const user = await User.findById(req.user.id);
    res.send(`Hello ${user.username}`);
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

});

app.post("/login", async (req,res) => {
 try{
    const {email,password} = req.body;
    if(email === "" || password === ""){
        return res.send("Please fill all fields")
    }

    const user = await User.findOne({email})
    if(!user){
        return res.send("User not found")
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
        return res.send("Incorrect password")
    }

    const token = jwt.sign({id: user._id},process.env.JWT_SECRET)
    res.send(token)
   }
 catch(error){
    console.log(error)
    res.send("Something went wrong")
 }    
});

app.post("/posts", authMiddleware, async (req,res) => {
   try{
     const {content} = req.body
     if(content === ""){
      return res.send("Oops.. Looks like you forgot to add something!")
     }
     const post = {
      content,
      userId: req.user.id
     };
     await Post.create(post)
     res.send("Post Created Successfully")
    } 
    catch{
      console.log(error)
      res.send("Something went wrong ")
    }
});

app.get("/posts", authMiddleware, async(req,res) => {
    const posts = await Post.find().populate("userId","email");
    res.json(posts);
});

app.get("/my-posts", authMiddleware, async(req,res) => {
    const myPosts = await Post.find({ userId: req.user.id });
    res.json(myPosts)
})

app.post("/posts/:id/like", authMiddleware, async(req,res) => {
    const post = await Post.findById(req.params.id);
    if (!post){
        return res.send("Post not found")
    }
    const alreadyLiked = post.likes.some(
     (like) => like.toString() === req.user.id
    );
    if(alreadyLiked){
        post.likes.pull(req.user.id)
    } else {
        post.likes.push(req.user.id)
    }
    await post.save()
    res.json(post);
})

app.post("/posts/:id/comment", authMiddleware, async(req,res) => {
    const {text} = req.body;
    const post = await Post.findById(req.params.id);
    if(!post){
        return res.send("Post not found")
    }
    post.comments.push({ 
      userId: req.user.id,
      text
    })
    await post.save()
    res.json(post);
});

app.delete("/posts/:id", authMiddleware, async(req,res) => {
    const post = await Post.findById(req.params.id);
    if(!post){
        return res.send("Post not found")
    }
    if (post.userId.toString() !== req.user.id) {
        return res.status(403).send("Forbidden");
    }
    await post.deleteOne();    
    res.send("Post Deleted")
});

app.put("/posts/:id", authMiddleware, async(req,res) => {
    const {content} = req.body;
    const post = await Post.findById(req.params.id)
    if(!post) {
        return res.send("Post not found")
    }
    if(post.userId.toString() !== req.user.id) {
        return res.status(403).send("forbidden");
    }
    post.content = content;
    await post.save();
    res.send("Post updated successfully")
});

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