const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
// cors
const cors = require("cors")
const userRouter = require("./routes/userRoute")
const postRouter = require("./routes/postRoute")


app.use(cors())
app.use(express.json())
app.use(cookieParser())

// route with extension
app.use("/auth", userRouter);
// post route with extension
app.use("/posts", postRouter);


// .env
const dontenv = require("dotenv");
dontenv.config()

// port 
const PORT = process.env.PORT || 5000;

// DB connection
require("./DB/connections")

// routes and requests
app.get("/", (req, res) => {
    res.json({message:"Server started"})
})


app.listen(PORT, () => {
    console.log(`server up and running on http://localhost:${PORT}`)
})