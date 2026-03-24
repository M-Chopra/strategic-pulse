const Bookmark = require('../models/Bookmark')
const Post = require('../models/Post')

// @desc    Get user's bookmarks
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = async (req, res) => {
  try {
    const { page = 1, limit = 9 } = req.query
    const skip = (page - 1) * limit

    const bookmarks = await Bookmark.find({ userId: req.user.userId })
      .populate('postId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Bookmark.countDocuments({ userId: req.user.userId })

    res.json({
      bookmarks: bookmarks.map((b) => b.postId),
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get bookmarks error:', error)
    res.status(500).json({ message: 'Error retrieving bookmarks' })
  }
}

// @desc    Create a bookmark
// @route   POST /api/bookmarks
// @access  Private
exports.createBookmark = async (req, res) => {
  try {
    const { postId } = req.body

    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' })
    }

    // Check if post exists
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      userId: req.user.userId,
      postId,
    })

    if (existingBookmark) {
      return res.status(409).json({ message: 'Post already bookmarked' })
    }

    const bookmark = new Bookmark({
      userId: req.user.userId,
      postId,
    })

    await bookmark.save()

    res.status(201).json({
      message: 'Post bookmarked successfully',
      bookmark,
    })
  } catch (error) {
    console.error('Create bookmark error:', error)
    res.status(500).json({ message: 'Error bookmarking post' })
  }
}

// @desc    Delete a bookmark
// @route   DELETE /api/bookmarks/:bookmarkId
// @access  Private
exports.deleteBookmark = async (req, res) => {
  try {
    const { bookmarkId } = req.params

    const bookmark = await Bookmark.findById(bookmarkId)
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' })
    }

    // Check authorization
    if (
      bookmark.userId.toString() !== req.user.userId.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'You can only delete your own bookmarks',
      })
    }

    await Bookmark.findByIdAndDelete(bookmarkId)

    res.json({
      message: 'Bookmark deleted successfully',
    })
  } catch (error) {
    console.error('Delete bookmark error:', error)
    res.status(500).json({ message: 'Error deleting bookmark' })
  }
}

// @desc    Check if post is bookmarked
// @route   GET /api/bookmarks/check/:postId
// @access  Private
exports.isBookmarked = async (req, res) => {
  try {
    const { postId } = req.params

    const bookmark = await Bookmark.findOne({
      userId: req.user.userId,
      postId,
    })

    res.json({
      isBookmarked: !!bookmark,
      bookmarkId: bookmark?._id,
    })
  } catch (error) {
    console.error('Check bookmark error:', error)
    res.status(500).json({ message: 'Error checking bookmark status' })
  }
}
