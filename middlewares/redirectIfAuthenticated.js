const jwt = require("jsonwebtoken");

const config = process.env;
const User = require('../models/user')

const verifyToken = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.access_token;

    if (!token) {
        return res.redirect('/login')
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;

        const userFromDb = await User.findById(req.user.user_id).exec()

        if (userFromDb.uniqueUrl) {
            return res.redirect('/dashboard')
        }

        return res.redirect('/onboarding')
    } catch (err) {
        console.log(err);
        return res.redirect('/login')
    }
};

module.exports = verifyToken;
