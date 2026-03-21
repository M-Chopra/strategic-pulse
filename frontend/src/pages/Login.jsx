import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Already logged in
  if (isAuthenticated) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('All fields required.')
      return
    }
    try {
      setLoading(true)
      setError('')
      await login(username, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Authentication failed.')
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
          <h1 className={styles.title}>ADMIN ACCESS</h1>
          <p className={styles.subtitle}>STRATEGIC PULSE — SECURE TERMINAL</p>
        </div>

        {/* Scanline effect */}
        <div className={styles.scanline} />

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">USERNAME</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={styles.input}
              placeholder="admin"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">PASSWORD</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
            {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM →'}
          </button>
        </form>

        <p className={styles.hint}>
          Default credentials: <code>admin</code> / <code>admin123</code>
        </p>
      </div>
    </main>
  )
}
