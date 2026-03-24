const express = require('express')
const router = express.Router()
const {
  getBookmarks,
  createBookmark,
  deleteBookmark,
  isBookmarked,
} = require('../controllers/bookmarkController')
const { userAuth } = require('../middleware/userAuth')

// Get user's bookmarks (protected)
router.get('/', userAuth, getBookmarks)

// Create a bookmark (protected)
router.post('/', userAuth, createBookmark)

// Delete a bookmark (protected)
router.delete('/:bookmarkId', userAuth, deleteBookmark)

// Check if post is bookmarked (protected)
router.get('/check/:postId', userAuth, isBookmarked)

module.exports = router
