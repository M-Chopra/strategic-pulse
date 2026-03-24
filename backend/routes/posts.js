const express = require('express')
const router = express.Router()
const { getPosts, getPostById, createPost, deletePost } = require('../controllers/postController')
const { protect } = require('../middleware/userAuth')
const commentRoutes = require('./comments')

router.get('/', getPosts)
router.get('/:id', getPostById)
router.post('/', protect, createPost)
router.delete('/:id', protect, deletePost)

// Mount comments subroute
router.use('/:postId/comments', commentRoutes)

module.exports = router
