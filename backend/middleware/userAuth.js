const jwt = require('jsonwebtoken')

// Middleware to protect routes with user authentication
// Works with new user JWT tokens
const userAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    )

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      isLegacyAdmin: decoded.isLegacyAdmin || false,
    }

    next()
  } catch (error) {
    console.error('Auth error:', error.message)

    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired, please refresh' })
    }

    res.status(401).json({ message: 'Invalid token' })
  }
}

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  if (req.user.role !== 'admin' && !req.user.isLegacyAdmin) {
    return res.status(403).json({ message: 'Admin access required' })
  }

  next()
}

// Middleware to protect routes - allow both new users and legacy admin
const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    )

    // Support both legacy admin (username) and new users (userId)
    if (decoded.userId) {
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      }
    } else if (decoded.username) {
      // Legacy admin
      req.user = {
        username: decoded.username,
        role: decoded.role,
        isLegacyAdmin: true,
      }
    }

    next()
  } catch (error) {
    console.error('Auth error:', error.message)

    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired, please refresh' })
    }

    res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = { userAuth, isAdmin, protect }
