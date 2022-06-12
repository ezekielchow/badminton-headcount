var passport = require('passport')

exports.getRegister = (req, res, next) => {
    res.render('register');
};

exports.postRegister = (req, res, next) => {
    console.log('post reg', req.body);

    try {
        const email = req.body.email
        const password = req.body.password
        const passwordRepeat = req.body.password_repeat

        if (!email || !password || !passwordRepeat) {
            throw "Missing fields"
        }

        if (password !== passwordRepeat) {
            throw "Passwords doesn't match"
        }
    } catch (error) {
        console.log(error);
    }
}

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
}