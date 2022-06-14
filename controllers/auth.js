var passport = require('passport')
const { body, validationResult } = require('express-validator');

const validators = require('../helpers/validators')

exports.getRegister = (req, res, next) => {
    res.render('register');
};

exports.postRegister = (req, res, next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errorMessages = errors.errors.map(el => el.msg)
            req.flash('validationFailure', errorMessages)
            req.flash('oldForm', req.body)

            return res.redirect('back')
        }

        return res.redirect('back')

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
