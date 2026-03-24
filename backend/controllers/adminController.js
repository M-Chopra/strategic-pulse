const Comment = require('../models/Comment')
const User = require('../models/User')

// @desc    Get flagged comments (reported)
// @route   GET /api/admin/comments/flagged
// @access  Private (admin only)
exports.getFlaggedComments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (page - 1) * limit

    // Find comments with reports
    const comments = await Comment.find({ 'reports.0': { $exists: true } })
      .populate('userId', 'username displayName')
      .populate('postId', 'title')
      .sort({ 'reports[0].reportedAt': -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Comment.countDocuments({
      'reports.0': { $exists: true },
    })

    res.json({
      comments,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get flagged comments error:', error)
    res.status(500).json({ message: 'Error retrieving flagged comments' })
  }
}

// @desc    Delete a comment (hard delete)
// @route   DELETE /api/admin/comments/:commentId
// @access  Private (admin only)
exports.deleteCommentAdmin = async (req, res) => {
  try {
    const { commentId } = req.params

    const comment = await Comment.findByIdAndDelete(commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    // Decrement post comment count
    const Post = require('../models/Post')
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { commentCount: -1 },
    })

    res.json({
      message: 'Comment deleted by admin',
    })
  } catch (error) {
    console.error('Delete comment by admin error:', error)
    res.status(500).json({ message: 'Error deleting comment' })
  }
}

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query
    const skip = (page - 1) * limit

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await User.countDocuments()

    res.json({
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get all users error:', error)
    res.status(500).json({ message: 'Error retrieving users' })
  }
}

// @desc    Ban/unban a user
// @route   PUT /api/admin/users/:userId
// @access  Private (admin only)
exports.updateUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params
    const { role } = req.body

    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      message: 'User updated successfully',
      user,
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ message: 'Error updating user' })
  }
}
