const express = require('express')

const headcountController = require('../controllers/headcount')
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router()

router.get('/dashboard', isAuthenticated, headcountController.getDashboard)
router.get('/onboarding', isAuthenticated, headcountController.getOnboarding)
router.post('/onboarding', isAuthenticated, headcountController.validate('postOnboarding'), headcountController.postOnboarding)

module.exports = router;