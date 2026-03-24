import { useState, useEffect } from 'react'
import api from '../utils/api'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'
import Loader from './Loader'

export default function CommentThread({ postId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadComments()
  }, [postId, page])

  const loadComments = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get(`/posts/${postId}/comments?page=${page}&limit=20`)
      setComments(res.data.comments || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load comments')
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  const handleCommentAdded = (newComment) => {
    // Reload comments to see newly posted comment
    loadComments()
  }

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter((c) => c._id !== commentId))
  }

  return (
    <section style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>
        Comments ({comments.length || 0})
      </h2>

      {/* Comment form */}
      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />

      {/* Comments list */}
      {loading ? (
        <Loader />
      ) : error ? (
        <div style={{ color: '#ff0000', padding: '1rem' }}>⚠ {error}</div>
      ) : comments.length > 0 ? (
        <div>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={postId}
              onCommentUpdated={loadComments}
              onCommentDeleted={handleCommentDeleted}
            />
          ))}
        </div>
      ) : (
        <p style={{ color: '#666' }}>No comments yet. Be the first to comment!</p>
      )}
    </section>
  )
}
