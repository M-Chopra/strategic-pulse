import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.css'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Already logged in
  if (isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !username || !password) {
      setError('Email, username, and password are required.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    try {
      setLoading(true)
      setError('')
      await signup(email, username, password, displayName || username)
      navigate('/')
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Signup failed.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.logoMark}>▲</span>
          <h1 className={styles.title}>JOIN STRATEGIC PULSE</h1>
          <p className={styles.subtitle}>CREATE YOUR ACCOUNT</p>
        </div>

        {/* Scanline effect */}
        <div className={styles.scanline} />

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="your@email.com"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              placeholder="choose username"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="displayName">
              DISPLAY NAME (Optional)
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={styles.input}
              placeholder="Your Display Name"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className={styles.error}>
              <span>⚠</span> {error}
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
          </button>
        </form>

        <p className={styles.hint}>
          Already have an account?{' '}
          <Link to="/login-user" style={{ color: '#00ff00' }}>
            Log in here
          </Link>
        </p>
      </div>
    </main>
  )
}
