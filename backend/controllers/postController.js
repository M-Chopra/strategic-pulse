const Post = require('../models/Post')

// GET /api/posts
// Supports: ?category=, ?search=, ?page=, ?limit=
async function getPosts(req, res) {
  try {
    const { category, search, page = 1, limit = 9 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const query = {}

    if (category) {
      query.category = category
    }

    if (search) {
      // Use text index search if available, fallback to regex
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $elemMatch: { $regex: search, $options: 'i' } } },
      ]
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-titleHash') // Don't expose hash to client
        .lean(),
      Post.countDocuments(query),
    ])

    res.json({ posts, total, page: parseInt(page) })
  } catch (err) {
    console.error('getPosts error:', err)
    res.status(500).json({ message: 'Failed to fetch posts' })
  }
}

// GET /api/posts/:id
async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id).select('-titleHash').lean()
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid post ID' })
    }
    res.status(500).json({ message: 'Failed to fetch post' })
  }
}

// POST /api/posts  (protected)
async function createPost(req, res) {
  try {
    const { title, category, content, tags, aiSummary, sourceUrl } = req.body

    if (!title || !category || !content) {
      return res.status(400).json({ message: 'Title, category, and content are required' })
    }

    const post = await Post.create({
      title: title.trim(),
      category,
      content,
      tags: Array.isArray(tags) ? tags : [],
      aiSummary: aiSummary || '',
      sourceUrl: sourceUrl || '',
    })

    res.status(201).json(post)
  } catch (err) {
    console.error('createPost error:', err)
    res.status(500).json({ message: err.message || 'Failed to create post' })
  }
}

// DELETE /api/posts/:id  (protected)
async function deletePost(req, res) {
  try {
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json({ message: 'Post deleted successfully' })
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid post ID' })
    }
    res.status(500).json({ message: 'Failed to delete post' })
  }
}

module.exports = { getPosts, getPostById, createPost, deletePost }
