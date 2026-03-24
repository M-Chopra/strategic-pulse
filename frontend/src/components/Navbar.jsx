import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [location])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>▲</span>
          <span className={styles.logoText}>STRATEGIC<em>PULSE</em></span>
        </Link>

        {/* Status bar */}
        <div className={styles.statusBar}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>LIVE INTEL</span>
        </div>

        {/* Desktop nav */}
        <div className={styles.links}>
          <NavLink to="/?category=Geopolitics" label="GEOPOLITICS" />
          <NavLink to="/?category=Defence" label="DEFENCE" />
          <NavLink to="/?category=Tech Warfare" label="TECH WARFARE" />
          
          {isAuthenticated ? (
            <>
              {/* User menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={styles.userMenuBtn}
                >
                  {user?.displayName || user?.username || 'Account'} ▼
                </button>
                {userMenuOpen && (
                  <div className={styles.userDropdown}>
                    <Link to="/profile">My Profile</Link>
                    <Link to="/bookmarks">My Bookmarks</Link>
                    {user?.role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login-user" className={styles.navLink}>LOGIN</Link>
              <Link to="/signup" className={styles.signupBtn}>SIGN UP</Link>
              <Link to="/login" className={styles.adminLink}>ADMIN</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/?category=Geopolitics">GEOPOLITICS</Link>
          <Link to="/?category=Defence">DEFENCE</Link>
          <Link to="/?category=Tech Warfare">TECH WARFARE</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile">MY PROFILE</Link>
              <Link to="/bookmarks">MY BOOKMARKS</Link>
              {user?.role === 'admin' && <Link to="/admin">ADMIN DASHBOARD</Link>}
              <button onClick={handleLogout} className={styles.logoutBtn}>
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link to="/login-user">LOGIN</Link>
              <Link to="/signup">SIGN UP</Link>
              <Link to="/login">ADMIN LOGIN</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

function NavLink({ to, label }) {
  return (
    <Link to={to} className={styles.navLink}>
      {label}
    </Link>
  )
}

