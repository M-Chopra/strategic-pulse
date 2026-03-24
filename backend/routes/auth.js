const express = require('express')
const router = express.Router()
const {
  signup,
  login,
  getMe,
  refreshToken,
  adminLogin,
} = require('../controllers/authController')
const { userAuth } = require('../middleware/userAuth')

// User registration
router.post('/signup', signup)

// User login (email + password)
router.post('/login', login)

// Admin login (legacy - hardcoded from env)
router.post('/admin-login', adminLogin)

// Get current user (protected)
router.get('/me', userAuth, getMe)

// Refresh token
router.post('/refresh', refreshToken)

module.exports = router
