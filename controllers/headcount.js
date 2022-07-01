const { body, validationResult } = require('express-validator');
const validators = require('../helpers/validators')
const moment = require('moment')

const User = require('../models/user')
const Headcount = require('../models/headcount')

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

exports.getHeadcountPage = (req, res, next) => {
    res.render('headcount/create')
}

exports.postHeadcount = async (req, res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errorMessages = errors.errors.map(el => el.msg)
            req.flash('validationFailure', errorMessages)
            req.flash('oldForm', req.body)

            return res.redirect('back')
        }

        const host = await User.findById(req.user.user_id).exec()

        const headcount = new Headcount({
            host: host._id,
            location: req.body.location,
            datetime: moment(req.body.datetime).toISOString(),
            totalPlayers: req.body.totalPlayers,
            details: req.body.players ?? null,
            password: req.body.password ?? null,
        })

        await headcount.save()

        // TODO: redirect to individual headcount page
        req.flash('messageSuccess', 'User successfully registered')
        return res.redirect('/login')

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
                body('uniqueUrl').custom(validators.isValidSubUrl).trim().escape(),
            ]
        }
        case 'postHeadcount': {
            return [
                body('location').isLength({ min: 1, max: 255 }).trim().escape(),
                body('datetime').custom(validators.isDatetime).trim().escape(),
                body('totalPlayers').isNumeric().isLength({ min: 1 }).trim().escape(),
            ]
        }
    }
}
