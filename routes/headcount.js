const express = require('express')

const headcountController = require('../controllers/headcount')
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router()

router.get('/dashboard', isAuthenticated, headcountController.getDashboard)

module.exports = router;