var passport = require('passport')
const { body, validationResult } = require('express-validator');

const validators = require('../helpers/validators')

exports.getRegister = (req, res, next) => {
    res.render('register');
};

exports.postRegister = (req, res, next) => {

    try {
        console.log('post reg', req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errorMessages = errors.errors.map(el => el.msg)
            console.log(errorMessages);

            req.flash('validationFailure', errorMessages)
            return res.redirect('back')
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

exports.validate = (method) => {
    switch (method) {
        case 'postRegister': {
            return [
                body('email').isEmail().normalizeEmail(),
                body('password').isLength(5).trim().escape(),
                body('passwordConfirmation').custom(validators.passwordConfirmation)
            ]
        }
    }
}
