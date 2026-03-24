import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.css'

export default function UserLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Already logged in
  if (isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Email and password are required.')
      return
    }
    try {
      setLoading(true)
      setError('')
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Login failed.'
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
          <h1 className={styles.title}>WELCOME BACK</h1>
          <p className={styles.subtitle}>LOG IN TO YOUR ACCOUNT</p>
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
            <label className={styles.label} htmlFor="password">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
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
            {loading ? 'LOGGING IN...' : 'LOG IN →'}
          </button>
        </form>

        <p className={styles.hint}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#00ff00' }}>
            Create one here
          </Link>
        </p>
      </div>
    </main>
  )
}
