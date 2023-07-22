const mongoose = require("mongoose");

// for user login and registeration
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 5,
        required: true
    },
    token: {
        type: String
    },
    // differentiate users and their posts
    posts:[{
        type: mongoose.Types.ObjectId, ref: "Post"
        
    }]
})

const User = mongoose.model("user", userSchema);
// module.exports = User;
module.exports = mongoose.model("User", userSchema);