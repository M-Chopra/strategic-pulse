const User = require('../models/User')
const Bookmark = require('../models/Bookmark')

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')

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
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(500).json({ message: 'Error retrieving user profile' })
  }
}

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (own user only or admin)
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params
    const { displayName, bio, avatar } = req.body

    // Check authorization
    if (
      req.user.userId.toString() !== id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'You can only edit your own profile',
      })
    }

    const allowedFields = {
      displayName,
      bio,
      avatar,
    }

    const user = await User.findByIdAndUpdate(id, allowedFields, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error('Update user profile error:', error)
    res.status(500).json({ message: 'Error updating profile' })
  }
}

// @desc    Get user's bookmarked posts
// @route   GET /api/users/:id/bookmarks
// @access  Private (own user only or admin)
exports.getUserBookmarks = async (req, res) => {
  try {
    const { id } = req.params
    const { page = 1, limit = 9 } = req.query

    // Check authorization
    if (
      req.user.userId.toString() !== id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'You can only view your own bookmarks',
      })
    }

    const skip = (page - 1) * limit

    const bookmarks = await Bookmark.find({ userId: id })
      .populate('postId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Bookmark.countDocuments({ userId: id })

    res.json({
      bookmarks: bookmarks.map((b) => b.postId),
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get user bookmarks error:', error)
    res.status(500).json({ message: 'Error retrieving bookmarks' })
  }
}

// @desc    Get user's reading history (stub for now)
// @route   GET /api/users/:id/reading-history
// @access  Private (own user only or admin)
exports.getUserReadingHistory = async (req, res) => {
  try {
    const { id } = req.params

    // Check authorization
    if (
      req.user.userId.toString() !== id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'You can only view your own reading history',
      })
    }

    // TODO: Implement reading history tracking
    res.json({
      message: 'Reading history feature coming soon',
      history: [],
    })
  } catch (error) {
    console.error('Get reading history error:', error)
    res.status(500).json({ message: 'Error retrieving reading history' })
  }
}
