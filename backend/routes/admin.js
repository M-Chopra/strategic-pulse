const express = require('express')
const router = express.Router()
const {
  getFlaggedComments,
  deleteCommentAdmin,
  getAllUsers,
  updateUserByAdmin,
} = require('../controllers/adminController')
const { userAuth, isAdmin } = require('../middleware/userAuth')

// All admin routes are protected by userAuth and isAdmin middleware
router.use(userAuth, isAdmin)

// Get flagged comments
router.get('/comments/flagged', getFlaggedComments)

// Delete comment (admin)
router.delete('/comments/:commentId', deleteCommentAdmin)

// Get all users
router.get('/users', getAllUsers)

// Update user by admin
router.put('/users/:userId', updateUserByAdmin)

module.exports = router
