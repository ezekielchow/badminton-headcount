const listEndpoints = require('express-list-endpoints')
const moment = require('moment')

const User = require('../models/user')

exports.passwordConfirmation = (value, { req }) => {
    if (req.body.password !== req.body.passwordRepeat) {
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

exports.isValidSubUrl = (value, { req }) => {
    const re = /^[a-z\-]+$/

    if (!re.test(value)) {
        throw new Error('Only use lower case letters and "-"')
    }

    const endPoints = listEndpoints(req.app)

    endPoints.forEach(endPoint => {
        if (endPoint.path.includes(value)) {
            throw new Error('Unique Url is already used');
        }
    });

    return true;
}

exports.isDatetime = (value, { req }) => {

    if (!moment(value).isValid()) {
        throw new Error('Not a valid date')
    }

    return true;
}