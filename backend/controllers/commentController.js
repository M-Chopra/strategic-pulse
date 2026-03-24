const Comment = require('../models/Comment')
const Post = require('../models/Post')

// @desc    Get all comments for a post (threaded)
// @route   GET /api/posts/:postId/comments
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params
    const { page = 1, limit = 20 } = req.query

    const skip = (page - 1) * limit

    // Get top-level comments (no parent) and their replies
    const comments = await Comment.find({
      postId,
      parentCommentId: null,
      isDeleted: false,
    })
      .populate('userId', 'username displayName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    // Populate replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentCommentId: comment._id,
          isDeleted: false,
        })
          .populate('userId', 'username displayName avatar')
          .sort({ createdAt: 1 })

        return {
          ...comment.toObject(),
          replies,
        }
      })
    )

    const total = await Comment.countDocuments({
      postId,
      parentCommentId: null,
      isDeleted: false,
    })

    res.json({
      comments: commentsWithReplies,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get comments error:', error)
    res.status(500).json({ message: 'Error retrieving comments' })
  }
}

// @desc    Create a new comment
// @route   POST /api/posts/:postId/comments
// @access  Private
exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params
    const { content, parentCommentId } = req.body

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' })
    }

    // Check if post exists
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const comment = new Comment({
      postId,
      userId: req.user.userId,
      content: content.trim(),
      parentCommentId: parentCommentId || null,
    })

    await comment.save()

    // Increment post comment count
    await Post.findByIdAndUpdate(postId, {
      $inc: { commentCount: 1 },
    })

    // Populate user info
    await comment.populate('userId', 'username displayName avatar')

    res.status(201).json({
      message: 'Comment created successfully',
      comment,
    })
  } catch (error) {
    console.error('Create comment error:', error)
    res.status(500).json({ message: 'Error creating comment' })
  }
}

// @desc    Update a comment
// @route   PUT /api/comments/:commentId
// @access  Private (own comment only or admin)
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const { content } = req.body

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' })
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    // Check authorization
    if (
      comment.userId.toString() !== req.user.userId.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'You can only edit your own comments',
      })
    }

    comment.content = content.trim()
    await comment.save()

    await comment.populate('userId', 'username displayName avatar')

    res.json({
      message: 'Comment updated successfully',
      comment,
    })
  } catch (error) {
    console.error('Update comment error:', error)
    res.status(500).json({ message: 'Error updating comment' })
  }
}

// @desc    Delete a comment (soft delete)
// @route   DELETE /api/comments/:commentId
// @access  Private (own comment only or admin)
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params

    const comment = await Comment.findById(commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    // Check authorization
    if (
      comment.userId.toString() !== req.user.userId.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'You can only delete your own comments',
      })
    }

    // Soft delete
    comment.isDeleted = true
    comment.content = '[deleted]'
    await comment.save()

    // Decrement post comment count
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { commentCount: -1 },
    })

    res.json({
      message: 'Comment deleted successfully',
    })
  } catch (error) {
    console.error('Delete comment error:', error)
    res.status(500).json({ message: 'Error deleting comment' })
  }
}

// @desc    Like a comment
// @route   POST /api/comments/:commentId/like
// @access  Private
exports.likeComment = async (req, res) => {
  try {
    const { commentId } = req.params

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likes: 1 } },
      { new: true }
    ).populate('userId', 'username displayName avatar')

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    res.json({
      message: 'Comment liked',
      comment,
    })
  } catch (error) {
    console.error('Like comment error:', error)
    res.status(500).json({ message: 'Error liking comment' })
  }
}

// @desc    Report a comment
// @route   POST /api/comments/:commentId/report
// @access  Private
exports.reportComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const { reason } = req.body

    if (!reason) {
      return res.status(400).json({ message: 'Report reason is required' })
    }

    const validReasons = ['spam', 'inappropriate', 'offensive', 'other']
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ message: 'Invalid report reason' })
    }

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $push: {
          reports: {
            userId: req.user.userId,
            reason,
            reportedAt: new Date(),
          },
        },
      },
      { new: true }
    )

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    res.json({
      message: 'Comment reported successfully',
    })
  } catch (error) {
    console.error('Report comment error:', error)
    res.status(500).json({ message: 'Error reporting comment' })
  }
}
