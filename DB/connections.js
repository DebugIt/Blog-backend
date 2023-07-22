const mongoose = require("mongoose");
const dontenv = require("dotenv")
dontenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connection to DB success")).catch((err) => console.log(err))