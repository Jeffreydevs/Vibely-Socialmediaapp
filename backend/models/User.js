const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    required: true,
    unique: true,
    type: String
  },
  email: {
    required: true,
    unique: true,
    type: String
  },
  password: {
    required: true,
    type: String
  }
})
const User = mongoose.model("User", userSchema);
module.exports = User