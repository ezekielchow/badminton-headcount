const { body, validationResult } = require('express-validator');
const validators = require('../helpers/validators')

const User = require('../models/user')

exports.getDashboard = (req, res, next) => {
    res.render('dashboard')
}

exports.getOnboarding = (req, res, next) => {
    res.render('headcount/onboarding', {
        'siteUrl': process.env.SITE_URL
    })
}

exports.postOnboarding = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errorMessages = errors.errors.map(el => el.msg)
            req.flash('validationFailure', errorMessages)
            req.flash('oldForm', req.body)

            return res.redirect('back')
        }

        const user = await User.findById(req.user.user_id).exec()
        user.uniqueUrl = req.body.uniqueUrl
        await user.save()

        req.flash('messageSuccess', 'Updated!')
        return res.redirect('/dashboard')

    } catch (error) {
        console.log(error);
        req.flash('oldForm', req.body)
        req.flash('messageFailure', error)
        return res.redirect('back')
    }
}

exports.validate = (method) => {
    switch (method) {
        case 'postOnboarding': {
            return [
                body('uniqueUrl').custom(validators.isValidSubUrl),
            ]
        }
    }
}
