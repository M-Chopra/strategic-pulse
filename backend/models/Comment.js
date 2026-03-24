const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: [2000, 'Comment must not exceed 2000 characters'],
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    reports: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        reason: {
          type: String,
          enum: ['spam', 'inappropriate', 'offensive', 'other'],
        },
        reportedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for quick retrieval
commentSchema.index({ postId: 1, createdAt: -1 })
commentSchema.index({ parentCommentId: 1 })
commentSchema.index({ userId: 1 })

module.exports = mongoose.model('Comment', commentSchema)
