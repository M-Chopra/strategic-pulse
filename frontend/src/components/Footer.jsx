import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logoMark}>▲</span>
            <span className={styles.logoText}>STRATEGIC<em>PULSE</em></span>
            <p className={styles.tagline}>
              Independent intelligence analysis on geopolitics, defence, and technology warfare.
            </p>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.groupTitle}>SECTORS</h4>
            <Link to="/?category=Geopolitics">Geopolitics</Link>
            <Link to="/?category=Defence">Defence</Link>
            <Link to="/?category=Tech Warfare">Tech Warfare</Link>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.groupTitle}>PLATFORM</h4>
            <Link to="/">Home</Link>
            <Link to="/admin/login">Admin Access</Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>
            © {year} Strategic Pulse — All intelligence reports are independently produced.
          </span>
          <span className={styles.classified}>
            CLASSIFICATION: OPEN SOURCE
          </span>
        </div>
      </div>
    </footer>
  )
}
