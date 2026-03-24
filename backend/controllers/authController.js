const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Generate Access Token
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )
}

// Generate Refresh Token (longer expiry)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    { expiresIn: '30d' }
  )
}

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { email, username, password, displayName } = req.body

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({
        message: 'Email, username, and password are required',
      })
    }

    // Check if user already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() })
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(409).json({ message: 'Username already taken' })
    }

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      username,
      password,
      displayName: displayName || username,
    })

    await user.save()

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ message: 'Error registering user' })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    // Find user and explicitly select password
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    )
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password)
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)

    res.json({
      message: 'Logged in successfully',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Error logging in' })
  }
}

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Get me error:', error)
    res.status(500).json({ message: 'Error retrieving user' })
  }
}

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (requires valid refresh token)
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' })
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'
    )

    // Check if user still exists
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id, user.role)

    res.json({
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(401).json({ message: 'Invalid or expired refresh token' })
  }
}

// @desc    Admin login (legacy - hardcoded admin)
// @route   POST /api/auth/admin-login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password required',
      })
    }

    const validUsername = process.env.ADMIN_USERNAME || 'admin'
    const validPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (username !== validUsername || password !== validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const accessToken = jwt.sign(
      { username, role: 'admin', isLegacyAdmin: true },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Admin logged in successfully',
      accessToken,
      username,
      role: 'admin',
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ message: 'Error logging in' })
  }
}
