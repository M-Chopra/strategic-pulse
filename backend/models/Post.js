const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title too long'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Geopolitics', 'Defence', 'Tech Warfare'],
        message: 'Invalid category',
      },
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    aiSummary: {
      type: String,
      default: '',
    },
    isAutoFetched: {
      type: Boolean,
      default: false,
    },
    sourceUrl: {
      type: String,
      default: '',
    },
    // Used for deduplication of auto-fetched articles
    titleHash: {
      type: String,
      unique: true,
      sparse: true, // Only enforce uniqueness when field exists
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
)

// Text index for search
postSchema.index({ title: 'text', content: 'text', tags: 'text' })

// Regular index for filtering
postSchema.index({ category: 1, createdAt: -1 })

module.exports = mongoose.model('Post', postSchema)
