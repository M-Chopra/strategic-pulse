const express = require('express')
const router = express.Router({ mergeParams: true })
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  reportComment,
} = require('../controllers/commentController')
const { userAuth } = require('../middleware/userAuth')

// Get all comments for a post
router.get('/', getComments)

// Create a comment (protected)
router.post('/', userAuth, createComment)

// Update a comment (protected)
router.put('/:commentId', userAuth, updateComment)

// Delete a comment (protected)
router.delete('/:commentId', userAuth, deleteComment)

// Like a comment (protected)
router.post('/:commentId/like', userAuth, likeComment)

// Report a comment (protected)
router.post('/:commentId/report', userAuth, reportComment)

module.exports = router
