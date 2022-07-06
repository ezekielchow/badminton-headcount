const express = require('express')

const headcountController = require('../controllers/headcount')
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router()

// router.get('/dashboard', isAuthenticated, headcountController.getDashboard)
// router.get('/onboarding', isAuthenticated, headcountController.getOnboarding)
router.post('/onboarding', isAuthenticated, headcountController.validate('postOnboarding'), headcountController.postOnboarding)
// router.get('/add-headcount', isAuthenticated, headcountController.getHeadcountPage)
router.post('/add-headcount', isAuthenticated, headcountController.validate('postHeadcount'), headcountController.postHeadcount)
router.get('/list-headcounts', isAuthenticated, headcountController.listHeadcounts)

module.exports = router;