const express = require('express')
const router = express.Router()
const { getPosts, getPostById, createPost, deletePost } = require('../controllers/postController')
const auth = require('../middleware/auth')

router.get('/', getPosts)
router.get('/:id', getPostById)
router.post('/', auth, createPost)
router.delete('/:id', auth, deletePost)

module.exports = router
