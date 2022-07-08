const express = require('express')

const headcountController = require('../controllers/headcount')
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router()

// router.get('/dashboard', isAuthenticated, headcountController.getDashboard)
// router.get('/onboarding', isAuthenticated, headcountController.getOnboarding)
router.post('/onboarding', isAuthenticated, headcountController.validate('postOnboarding'), headcountController.postOnboarding)
// router.get('/add-headcount', isAuthenticated, headcountController.getHeadcountPage)
router.post('/add', isAuthenticated, headcountController.validate('postHeadcount'), headcountController.postHeadcount)
router.get('/list', isAuthenticated, headcountController.listHeadcounts)
router.get('/:id', isAuthenticated, headcountController.getHeadcount)

module.exports = router;