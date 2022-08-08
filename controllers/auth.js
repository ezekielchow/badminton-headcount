const { body, validationResult } = require('express-validator');
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const validators = require('../helpers/validators')
const User = require('../models/user')

exports.getRegister = (req, res, next) => {
    res.render('register', {
        'navbar': {
            hasLogin: true
        }
    });
};

exports.postRegister = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errorMessages = errors.errors.map(el => el.msg + "\n")
            return res.status(500).json({ 'error': errorMessages })
        }

        const user = new User(req.body)

        const salt = await crypto.randomBytes(128).toString('hex')
        const password = await crypto.pbkdf2Sync(
            req.body.password, salt, 1000, 64, 'sha512').toString('hex')
        const token = jwt.sign(
            { user_id: user._id, email: user.email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        user.token = token
        user.salt = salt
        user.password = password

        await user.save()

        return res
            .json({
                'data': {
                    'user': { email: user.email, id: user._id, uniqueUrl: user.uniqueUrl },
                    'access_token': token
                }
            })

    } catch (error) {
        return res.status(500).json({ 'error': error })
    }
}

exports.getLogin = (req, res, next) => {
    res.render('login', {
        'navbar': {
            hasRegister: true
        }
    })
}

exports.postLogin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email }).exec()

        if (!user) {
            return res.status(500).json({ 'error': 'Email or Password is incorrect' })
        }

        const hashedPassword = await crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, 'sha512').toString('hex');

        if (user.password !== hashedPassword) {
            return res.status(500).json({ 'error': 'Email or Password is incorrect' })
        }

        const token = jwt.sign(
            { user_id: user._id, email: user.email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        user.token = token
        await user.save();

        return res
            .json({
                'data': {
                    'user': { email: user.email, id: user._id, uniqueUrl: user.uniqueUrl },
                    'access_token': token
                }
            })
    } catch (error) {
        return res.status(500).json({ 'error': error })
    }
}

exports.validate = (method) => {
    switch (method) {
        case 'postRegister': {
            return [
                body('email').not().isEmpty().isEmail().withMessage('Invalid Email').normalizeEmail().custom(validators.emailIsUnique).trim().escape(),
                body('password').not().isEmpty().isLength(5).withMessage('Password must be at least 5 characters').trim().escape(),
                body('passwordRepeat').not().isEmpty().custom(validators.passwordConfirmation).trim().escape()
            ]
        }
    }
}
