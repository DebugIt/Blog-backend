const mongoose = require("mongoose");

// for creating post
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  // reference acts as a relation to the model
  user: {type: mongoose.Types.ObjectId, ref: "User", required:true},
  location: { type: String, required: true },
  date: { type:Date, required:true },
  imageUrl: { type: String, required: true },
});

const Post = new mongoose.model("post", postSchema);
module.exports = Post
