let jwt = require('jsonwebtoken')
require('dotenv').config()


const verifyToken = (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1]; // Extract token
    if (!token) return res.send({ message: "Token missing" });

    try {
        let decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Attach decoded token to request
        next();
    } catch (err) {
        res.send({ message: "Invalid or Session expired" });
    }
};