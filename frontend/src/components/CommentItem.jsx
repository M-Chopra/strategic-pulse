import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import CommentForm from './CommentForm'

export default function CommentItem({ comment, postId, onCommentUpdated, onCommentDeleted }) {
  const { user } = useAuth()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [likes, setLikes] = useState(comment.likes || 0)
  const [liked, setLiked] = useState(false)
  const [error, setError] = useState('')

  const isOwnComment = user?.id === comment.userId?._id
  const isAdmin = user?.role === 'admin'
  const canDelete = isOwnComment || isAdmin

  const handleLike = async () => {
    if (liked) return

    try {
      await api.post(`/comments/${comment._id}/like`)
      setLikes(likes + 1)
      setLiked(true)
    } catch (err) {
      console.error('Failed to like comment:', err)
    }
  }

  const handleReport = async () => {
    const reason = prompt('Reason for report:', 'spam')
    if (!reason) return

    try {
      await api.post(`/comments/${comment._id}/report`, { reason })
      alert('Comment reported')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to report')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this comment?')) return

    try {
      await api.delete(`/comments/${comment._id}`)
      onCommentDeleted(comment._id)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment')
    }
  }

  return (
    <div
      style={{
        marginBottom: '1rem',
        paddingLeft: comment.parentCommentId ? '2rem' : '0',
        borderLeft: comment.parentCommentId ? '2px solid #333' : 'none',
      }}
    >
      <div style={{ background: '#0a0a0a', padding: '1rem', borderRadius: '4px' }}>
        {/* Author info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div>
            <strong style={{ color: '#00ff00' }}>
              {comment.userId?.displayName || comment.userId?.username || 'Anonymous'}
            </strong>
            <span style={{ color: '#666', marginLeft: '0.5rem', fontSize: '0.85rem' }}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          {isAdmin && (
            <span style={{ color: '#ff99ff', fontSize: '0.85rem' }}>ADMIN</span>
          )}
        </div>

        {/* Content */}
        <p style={{ margin: '0.75rem 0', color: '#ccc' }}>{comment.content}</p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', marginTop: '0.75rem' }}>
          <button
            onClick={handleLike}
            disabled={liked}
            style={{
              background: 'none',
              border: 'none',
              color: liked ? '#00ff00' : '#666',
              cursor: 'pointer',
            }}
          >
            👍 {likes}
          </button>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            style={{
              background: 'none',
              border: 'none',
              color: '#00ff00',
              cursor: 'pointer',
            }}
          >
            Reply
          </button>
          {canDelete && (
            <button
              onClick={handleDelete}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff0000',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          )}
          <button
            onClick={handleReport}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff6666',
              cursor: 'pointer',
            }}
          >
            Report
          </button>
          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              style={{
                background: 'none',
                border: 'none',
                color: '#00ff00',
                cursor: 'pointer',
                marginLeft: 'auto',
              }}
            >
              {showReplies ? '▼' : '▶'} {comment.replies.length} replies
            </button>
          )}
        </div>

        {error && <div style={{ color: '#ff0000', marginTop: '0.5rem', fontSize: '0.9rem' }}>⚠ {error}</div>}
      </div>

      {/* Reply form */}
      {showReplyForm && (
        <div style={{ marginTop: '1rem', marginLeft: '2rem' }}>
          <CommentForm
            postId={postId}
            parentCommentId={comment._id}
            onCommentAdded={() => {
              setShowReplyForm(false)
              setShowReplies(true)
            }}
          />
        </div>
      )}

      {/* Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              onCommentUpdated={onCommentUpdated}
              onCommentDeleted={onCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  )
}
