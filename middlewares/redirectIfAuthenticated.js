const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.access_token;

    if (!token) {
        return res.redirect('/login')
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
        return res.redirect('/dashboard')
    } catch (err) {
        return res.redirect('/login')
    }
};

module.exports = verifyToken;
