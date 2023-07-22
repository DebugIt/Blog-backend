const express = require("express");

const dotenv = require("dotenv")
dotenv.config()

const User = require("../model/userModel")
// const bcrypt = require("bcryptjs")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const cookieParser = require("cookie-parser");
// middleware to come
const auth = require("../middleware/auth");



const userRouter = express.Router();
userRouter.use(cookieParser())



userRouter.post("/register", async (req, res) => {
    try {
        // get details
        const { username, password } = req.body
        // check details
        if(!(username && password)){
            res.status(400).send("Please fill all the fields")
        }
        // check for the same user
        const alreadyRegistered = await User.findOne({username});
        if(alreadyRegistered){
            res.status(401).json({ success: true, message: "User Already Exists" });
        }
        else{
            // encrypt password
            let encPassword = await bcrypt.hash(password, 10);
            // create user in db
            const newUser = await User.create({
                username,
                username,
                password: encPassword,
            });
            // create a token
            const token = jwt.sign(
                {id: newUser._id, username},
                process.env.JWT_SECRET, {
                    expiresIn:"5h"
                }
            );
            // save user ,token
            newUser.token = token;
            await newUser.save()
            // whenever you dont want to send a particular fiels to user - newUser.password = undefined
            res.status(201).json(newUser)
        }

    } catch (error) {
        res.json({message: error})
    }
})

userRouter.post("/login", async (req, res) => {
    try {
        // get data
        const { username, password } = req.body
        // check data
        if(!(username && password)){
            res.status(400).send("All Fields required")
        }
        // find user
        const user = await User.findOne({username})
        if(user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign(
                {id: user._id},
                process.env.JWT_SECRET,
                {
                    expiresIn: "5h"
                }
            )
            user.token = token

            // sending token in user cookie
            const options = {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.status(200).cookie("token", token, options).json({
                success: true,
                token,
                user
            })
        }
        else {
            res.status(401).json({ success: false, message: "Invalid username or password" });
        }
        // match the passwords
        // send a token


    } catch (error) {
        console.log(error)
    }
})

// logout
userRouter.get("/logout", auth ,async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        res.status(201).json({
            success: true,
            message: "Logged out"
        })
    } catch (error) {
        console.log(error)
    }
})

// home - protected
userRouter.get("/home", auth ,async (req, res) => {
    console.log(req.user)
    res.send("Welcome to Home")
})

module.exports = userRouter;