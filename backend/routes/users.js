const express = require('express')
const router = express.Router()
const {
  getUserProfile,
  updateUserProfile,
  getUserBookmarks,
  getUserReadingHistory,
} = require('../controllers/userController')
const { userAuth } = require('../middleware/userAuth')

// Get public user profile
router.get('/:id', getUserProfile)

// Update user profile (protected)
router.put('/:id', userAuth, updateUserProfile)

// Get user's bookmarks (protected)
router.get('/:id/bookmarks', userAuth, getUserBookmarks)

// Get user's reading history (protected)
router.get('/:id/reading-history', userAuth, getUserReadingHistory)

module.exports = router
