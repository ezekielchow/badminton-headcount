const express = require('express')
var passport = require('passport')
var LocalStrategy = require('passport-local')

const authController = require('../controllers/auth')
const User = require('../models/user')

passport.use(new LocalStrategy(async function verify(email, password, cb) {

    try {
        const user = await User.find({ email })

        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }

        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return cb(err); }
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, user);
        });

    } catch (error) {
        cb(err)
    }

}));


const router = express.Router()

router.get('/register', authController.getRegister)
router.post('/register', authController.postRegister)
router.post('/login', authController.postLogin)

module.exports = router;