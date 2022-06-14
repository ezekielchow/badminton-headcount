const { body, validationResult } = require('express-validator');
const crypto = require('crypto')

const validators = require('../helpers/validators')
const User = require('../models/user')

exports.getRegister = (req, res, next) => {
    res.render('register');
};

exports.postRegister = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errorMessages = errors.errors.map(el => el.msg)
            req.flash('validationFailure', errorMessages)
            req.flash('oldForm', req.body)

            return res.redirect('back')
        }

        const user = new User(req.body)

        const salt = await crypto.randomBytes(128).toString('hex')
        const password = await crypto.pbkdf2Sync(
            req.body.password, salt, 1000, 64, 'sha512').toString('hex')

        user.salt = salt
        user.password = password

        await user.save()

        req.flash('messageSuccess', 'User successfully registered')
        return res.redirect('/login')

    } catch (error) {
        req.flash('oldForm', req.body)
        req.flash('messageFailure', error)
        return res.redirect('back')
    }
}

exports.getLogin = (req, res, next) => {
    res.render('login')
}

exports.postLogin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email }).exec()

        if (!user) {
            req.flash('oldForm', req.body)
            req.flash('messageFailure', 'User not found')
            return res.redirect('back')
        }

        const hashedPassword = await crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, 'sha512').toString('hex');

        if (user.password !== hashedPassword) {
            req.flash('oldForm', req.body)
            req.flash('messageFailure', 'Incorrect username or password')
            return res.redirect('back')
        }

        return res.redirect('/dashboard')
    } catch (error) {
        req.flash('oldForm', req.body)
        req.flash('messageFailure', error)
        return res.redirect('back')
    }
}

exports.validate = (method) => {
    switch (method) {
        case 'postRegister': {
            return [
                body('email').isEmail().withMessage('Invalid Email').normalizeEmail(),
                body('password').isLength(5).withMessage('Password must be at least 5 characters').trim().escape(),
                body('passwordConfirmation').custom(validators.passwordConfirmation)
            ]
        }
    }
}
