const User = require('../models/user')

exports.passwordConfirmation = (value, { req }) => {
    if (req.body.password !== req.body.password_repeat) {
        throw new Error('Password confirmation does not match password');
    }

    // Indicates the success of this synchronous custom validator
    return true;
}

exports.emailIsUnique = value => {
    return User.findOne({ email: value }).then(user => {
        if (user) {
            return Promise.reject('E-mail already in use');
        }
    });
}