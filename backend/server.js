const express = require("express");
const app = express(); 
app.use(express.json()); 

app.get("/",(req,res)=>{ 
    res.send("Hello user")
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