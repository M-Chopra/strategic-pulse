import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export default function BookmarkButton({ postId, size = 'medium' }) {
  const { isAuthenticated, user } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bookmarkId, setBookmarkId] = useState(null)

  useEffect(() => {
    if (isAuthenticated && postId) {
      checkBookmarkStatus()
    }
  }, [postId, isAuthenticated])

  const checkBookmarkStatus = async () => {
    try {
      const res = await api.get(`/bookmarks/check/${postId}`)
      setIsBookmarked(res.data.isBookmarked)
      setBookmarkId(res.data.bookmarkId)
    } catch (err) {
      console.error('Failed to check bookmark status:', err)
    }
  }

  const handleToggleBookmark = async (e) => {
    e.stopPropagation()

    if (!isAuthenticated) {
      window.location.href = '/login-user'
      return
    }

    try {
      setLoading(true)

      if (isBookmarked && bookmarkId) {
        // Remove bookmark
        await api.delete(`/bookmarks/${bookmarkId}`)
        setIsBookmarked(false)
        setBookmarkId(null)
      } else {
        // Add bookmark
        const res = await api.post('/bookmarks', { postId })
        setIsBookmarked(true)
        setBookmarkId(res.data.bookmark._id)
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err)
    } finally {
      setLoading(false)
    }
  }

  const sizeMap = {
    small: '1rem',
    medium: '1.5rem',
    large: '2rem',
  }

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={loading}
      title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      style={{
        background: 'none',
        border: 'none',
        fontSize: sizeMap[size] || sizeMap.medium,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.5 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      {isBookmarked ? '💚' : '🤍'}
    </button>
  )
}
