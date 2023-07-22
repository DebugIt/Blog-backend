const jwt = require("jsonwebtoken")
const dotenv = require('dotenv').config()

const auth = (req, res, next) => {

    console.log(req.cookies);
    const token = req.cookies.token || req.headers.token

    if(!token){
        res.status(403).send("Please login first");
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decode)
        req.user = decode


    } catch (error) {
        console.log(error)
        res.status(401).send("Invalid token")
    }


    return next()
}

module.exports = auth