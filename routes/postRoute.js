const express = require("express");
const dotenv = require("dotenv")
dotenv.config()

// requiring model
const Post = require("../model/postModel")

// middleware
const auth = require("../middleware/auth");
const User = require("../model/userModel");
const { default: mongoose } = require("mongoose");


const postRouter = express.Router();
// getting post - find()
// TODO: auth to add 
postRouter.get("/all", async (req, res) => {
    let posts;
    try {
        posts = await Post.find();
    } catch (error) {
        console.log(error)
    }
    if(!posts){
        return res.status(404).json({message:"No Post's found"})
    }
    return res.status(200).json({posts})
})

// creating post
postRouter.post("/create-post", async(req, res) => {
    const {title, content, user, location, date, imageUrl} = req.body;
    if(!(title || content || user || location || date || imageUrl)){
        res.status(422).json({message:"Invalid Data"});
    }
    let existingUser;
    try {
        // only if this user is found then it will proceed
        existingUser = await User.findById(user);
    } catch (error) {
        console.log(error)
    }
    // vaidation for user
    if(!existingUser){
        return res.status(404).json({message: "user not found"})
    }


    let post;
    try {
        post = new Post({title, content, user, location, date: new Date(`${date}`), imageUrl})
        
        // creating a session to save the posts in a particular user's post array
        const session = await mongoose.startSession();
        session.startTransaction();
        existingUser.posts.push(post);
        await existingUser.save({session});
        // 
        post = await post.save({session});
        // commiting session transactions
        session.commitTransaction();


    } catch (error) {
        console.log(error)
    }

    if(!post){
        res.status(404).json({message: "No Post's found"});
    }
    res.status(201).json({post})
})



// getting post by post id
postRouter.get('/:id',async (req,res)=>{
    const id = req.params.id;
    let post;

    try {
        post = await Post.findById(id);
    } catch (error) {
        console.log(error)
    }

    if(!post){
        return res.status(404).json({message:"No such Post found"});
    }
    return res.status(200).json({post});
})

// TODO: if wants to update : https://youtu.be/MffV_9iZamA

// deleting posts - from users post array
postRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    let post;
    try {
        // creating session
        const session = await mongoose.startSession();
        session.startTransaction();
        post = await Post.findById(id).populate("user");
        post.user.posts.pull(post);
        await post.user.save({session})

        post = await Post.findByIdAndRemove(id);
        session.commitTransaction()
    } catch (error) {
        console.log(error)
    }
    if(!post){
        return res.status(500).json({message: "Unable to Delete"})
    }
    return res.status(200).json({message: "Deleted successfully"})
})


module.exports = postRouter;