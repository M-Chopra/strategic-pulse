const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// In production you'd store hashed passwords in a DB.
// For this project, credentials come from .env.
// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' })
  }

  const validUsername = process.env.ADMIN_USERNAME || 'admin'
  const validPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (username !== validUsername || password !== validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({ token, username })
})

module.exports = router
