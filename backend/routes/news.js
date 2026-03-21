const express = require('express')
const router = express.Router()
const { fetchNews } = require('../controllers/newsController')
const auth = require('../middleware/auth')

// POST /api/news/fetch  (protected — only admin can trigger)
router.post('/fetch', auth, fetchNews)

module.exports = router
