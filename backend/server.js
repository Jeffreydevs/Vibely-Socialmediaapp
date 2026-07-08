require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose  = require("mongoose")
const app = express();
app.use(cors());
const User = require("./models/User")
const Post = require("./models/Post")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authMiddleware = require("./middleware/authMiddleware");


app.use(express.json()); 

app.get("/profile",authMiddleware, async (req,res)=>{
  try{
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  }
  catch(error){
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" });
  }  
});

app.post("/register", async (req,res) => {
  try{
    const{username, email, password} = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const existingUsername = await User.findOne({username});
    if(existingUsername){
      return res.status(409).json({ message: "Username already exists" });
    }
    const existingEmail = await User.findOne({email})
    if(existingEmail){
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const user = {
      username,
      email,
      password: hashedPassword 
    }
    console.log(user)

    await User.create(user)
    return res.status(201).json({ message: "User registered successfully" });
  }
  catch(error){
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" });
  }   
});

app.post("/login", async (req,res) => {
  try{
    const {email,password} = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const user = await User.findOne({email})
    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({id: user._id},process.env.JWT_SECRET)
    return res.status(200).json({ token });
  }
  catch(error){
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" });
  }    
});

app.post("/posts", authMiddleware, async (req,res) => {
  try{
    const {content} = req.body
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content cannot be empty" });
    }
    const post = {
      content,
      userId: req.user.id
    };
    const createdPost = await Post.create(post);
    return res.status(201).json({
      message: "Post created successfully",
      post: createdPost
    });
  } 
  catch(error){
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/posts", authMiddleware, async(req,res) => {
  try{
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId","username email")
      .populate("comments.userId","username email");
    res.json(posts);
  }
  catch(error){
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/my-posts", authMiddleware, async(req,res) => {
  try{
    const myPosts = await Post.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(myPosts)
  }
  catch(error){
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/posts/:id/like", authMiddleware, async(req,res) => {
  try{
    const post = await Post.findById(req.params.id);
    if (!post){
      return res.status(404).json({ message: "Post not found" });
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
  }
  catch(error){
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/posts/:id/comment", authMiddleware, async(req,res) => {
  try{
    const {text} = req.body;
    const post = await Post.findById(req.params.id);
    if(!post){
      return res.status(404).json({ message: "Post not found" });
    }
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }
    post.comments.push({ 
      userId: req.user.id,
      text
    })
    await post.save()
    const updatedPost = await Post.findById(req.params.id)
      .populate("userId","username email")
      .populate("comments.userId","username email");
    res.json(updatedPost);
  }
  catch(error) {
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" }); 
  }
});
    
app.delete("/posts/:id", authMiddleware, async(req,res) => {
  try{
    const post = await Post.findById(req.params.id);
    if(!post){
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await post.deleteOne();    
    return res.status(200).json({ message: "Post deleted successfully" });
  }
  catch(error){
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }

});

app.put("/posts/:id", authMiddleware, async(req,res) => {
  try{
    const {content} = req.body;
    const post = await Post.findById(req.params.id)
    if(!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if(post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content cannot be empty" });
    }
    post.content = content;
    await post.save();
    return res.status(200).json({ message: "Post updated successfully", post });
  }
  catch(error){
    console.log(error)
    return res.status(500).json({ message: "Something went wrong" });
  }

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
