const mongoose = require('mongoose')

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post ID is required'],
    },
  },
  {
    timestamps: true,
  }
)

// Ensure unique bookmarks per user per post
bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true })

module.exports = mongoose.model('Bookmark', bookmarkSchema)
