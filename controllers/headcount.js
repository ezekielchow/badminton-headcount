const { body, validationResult } = require('express-validator');
const validators = require('../helpers/validators')
const moment = require('moment')
const mongoose = require('mongoose')

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
            let errorMessages = errors.errors.map(el => el.msg + "\n")
            return res.status(500).json({ 'error': errorMessages })
        }

        const user = await User.findById(req.body.userId).exec()

        if (!user) {
            return res.status(500).json({ 'error': 'User doesn\'t exist' })
        }

        user.uniqueUrl = req.body.uniqueUrl
        await user.save()

        return res
            .json({
                'data': {
                    'uniqueUrl': user.uniqueUrl,
                }
            })
    } catch (error) {
        return res.status(500).json({ 'error': error })
    }
}

exports.getHeadcountPage = (req, res, next) => {
    res.render('headcount/create')
}

exports.postHeadcount = async (req, res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errorMessages = errors.errors.map(el => el.msg + "\n")
            return res.status(500).json({ 'error': errorMessages })
        }

        const host = await User.findById(req.body.userId).exec()

        const headcount = new Headcount({
            host: host._id,
            location: req.body.location,
            datetime: moment(req.body.datetime).toISOString(),
            totalPlayers: req.body.totalPlayers,
            details: req.body.details ?? null,
            password: req.body.password ?? null,
        })

        await headcount.save()

        return res
            .json({
                'data': {
                    'headcount': headcount
                }
            })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 'error': error })
    }
}

exports.listHeadcounts = async (req, res) => {

    try {
        if (!req.query.userId) {
            return res.status(500).json({ 'error': "Missing required credentials" })
        }

        const query = Headcount.find({ 'host': new mongoose.Types.ObjectId(req.query.userId) })
        const totalRows = await query.clone().countDocuments()

        if (req.query.perPage) {
            query.limit(req.query.perPage)

            if (req.query.currentPage && req.query.currentPage > 1) {
                query.skip(req.query.currentPage - 1 * req.query.perPage)
            }
        }

        const sortDirection = req.query?.sortDesc && req.query.sortDesc.toLowerCase() == 'true' ? 'desc' : 'asc'
        if (req.query.sortBy) {
            query.sort({ [req.query.sortBy]: sortDirection })
        } else {
            query.sort({ datetime: sortDirection })
        }

        const headcounts = await query.exec()

        return res
            .json({
                'data': {
                    'headcounts': headcounts,
                    totalRows
                }
            })
    } catch (error) {
        return res.status(500).json({ 'error': 'Unable to list Sessions' })
    }
}

exports.getHeadcount = async (req, res) => {

    try {
        const headcount = await Headcount.findById(req.params.id)

        return res
            .json({
                headcount
            })

    } catch (error) {
        return res.status(500).json({ 'error': 'Unable to find Session' })
    }
}

exports.validate = (method) => {
    switch (method) {
        case 'postOnboarding': {
            return [
                body('uniqueUrl').not().isEmpty().custom(validators.isValidSubUrl).trim().escape(),
                body('userId').not().isEmpty().trim().escape()
            ]
        }
        case 'postHeadcount': {
            return [
                body('location').not().isEmpty().isLength({ min: 1, max: 255 }).trim().escape(),
                body('datetime').not().isEmpty().custom(validators.isDatetime).trim().escape(),
                body('totalPlayers').not().isEmpty().isNumeric().isLength({ min: 1 }).trim().escape(),
                body('details').isLength({ max: 1024 }).trim().escape(),
                body('password').isLength({ max: 255 }).trim().escape(),
                body('userId').not().isEmpty().trim().escape()
            ]
        }
    }
}
