const express = require('express')

const authController = require('../controllers/auth')

const router = express.Router()

// router.get('/register', authController.getRegister)
router.post('/register',
    authController.validate('postRegister'),
    authController.postRegister)
// router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)

module.exports = router;