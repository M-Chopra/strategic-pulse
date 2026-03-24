import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import styles from './PostCard.module.css'

export default function CommentForm({ postId, onCommentAdded, parentCommentId = null }) {
  const { user, isAuthenticated } = useAuth()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('Comment cannot be empty')
      return
    }

    try {
      setLoading(true)
      setError('')

      const res = await api.post(`/posts/${postId}/comments`, {
        content: content.trim(),
        parentCommentId,
      })

      setContent('')
      onCommentAdded(res.data.comment)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div style={{ background: '#0a0a0a', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
        <p>
          <a href="/login-user" style={{ color: '#00ff00' }}>
            Log in
          </a>{' '}
          to comment
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentCommentId ? 'Write a reply...' : 'Write a comment...'}
        rows="3"
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '4px',
          border: '1px solid #333',
          background: '#1a1a1a',
          color: '#fff',
          fontFamily: 'inherit',
          resize: 'vertical',
        }}
        disabled={loading}
      />
      {error && <div style={{ color: '#ff0000', marginTop: '0.5rem', fontSize: '0.9rem' }}>⚠ {error}</div>}
      <button
        type="submit"
        disabled={loading || !content.trim()}
        style={{
          marginTop: '0.75rem',
          padding: '0.5rem 1rem',
          background: '#00ff00',
          color: '#000',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Posting...' : parentCommentId ? 'Reply' : 'Comment'}
      </button>
    </form>
  )
}
