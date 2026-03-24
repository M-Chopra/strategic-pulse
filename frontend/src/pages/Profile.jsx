import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import styles from './AdminDashboard.module.css'

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [bookmarks, setBookmarks] = useState([])
  const [loadingBookmarks, setLoadingBookmarks] = useState(true)

  // Not authenticated
  if (!isAuthenticated || !user?.id) return <Navigate to="/login-user" replace />

  // Load user profile on mount
  useEffect(() => {
    setDisplayName(user.displayName || '')
    setBio(user.bio || '')
    setAvatar(user.avatar || '')
    loadBookmarks()
  }, [user])

  const loadBookmarks = async () => {
    try {
      setLoadingBookmarks(true)
      const res = await api.get(`/bookmarks?limit=6`)
      setBookmarks(res.data.bookmarks || [])
    } catch (err) {
      console.error('Error loading bookmarks:', err)
    } finally {
      setLoadingBookmarks(false)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      await api.put(`/users/${user.id}`, {
        displayName,
        bio,
        avatar,
      })

      setSuccess('Profile updated successfully!')
      setEditing(false)

      // Refresh user in context
      setTimeout(() => navigate('/'), 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <main className={styles.container}>
      <div className={styles.panel}>
        <h1 className={styles.title}>MY PROFILE</h1>

        {/* Profile Info */}
        <div style={{ marginBottom: '2rem' }}>
          <h2>Account Information</h2>
          <div style={{ background: '#0a0a0a', padding: '1rem', borderRadius: '4px', marginTop: '1rem' }}>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Edit Profile */}
        <div style={{ marginBottom: '2rem' }}>
          <h2>
            Edit Profile
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                style={{
                  marginLeft: '1rem',
                  padding: '0.5rem 1rem',
                  background: '#00ff00',
                  color: '#000',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
            )}
          </h2>

          {editing && (
            <form onSubmit={handleSaveProfile} style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label>
                  Display Name:
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginTop: '0.5rem',
                      background: '#1a1a1a',
                      border: '1px solid #00ff00',
                      color: '#00ff00',
                    }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>
                  Bio:
                  <textarea
                    rows="4"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginTop: '0.5rem',
                      background: '#1a1a1a',
                      border: '1px solid #00ff00',
                      color: '#00ff00',
                    }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>
                  Avatar URL:
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginTop: '0.5rem',
                      background: '#1a1a1a',
                      border: '1px solid #00ff00',
                      color: '#00ff00',
                    }}
                  />
                </label>
              </div>

              {error && <div style={{ color: '#ff0000', marginBottom: '1rem' }}>⚠ {error}</div>}
              {success && (
                <div style={{ color: '#00ff00', marginBottom: '1rem' }}>✓ {success}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginRight: '1rem',
                  padding: '0.5rem 1rem',
                  background: '#00ff00',
                  color: '#000',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#333',
                  color: '#00ff00',
                  border: '1px solid #00ff00',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {/* Bookmarks */}
        <div style={{ marginBottom: '2rem' }}>
          <h2>My Bookmarks</h2>
          {loadingBookmarks ? (
            <p>Loading bookmarks...</p>
          ) : bookmarks.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              {bookmarks.map((post) => (
                <div
                  key={post._id}
                  style={{
                    background: '#0a0a0a',
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/post/${post._id}`)}
                >
                  <h3>{post.title}</h3>
                  <p>{post.category}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No bookmarks yet</p>
          )}
        </div>

        {/* Logout */}
        <div>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: '#ff0000',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              marginTop: '2rem',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  )
}
