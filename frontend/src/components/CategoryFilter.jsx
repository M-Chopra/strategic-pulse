import { CATEGORIES } from '../utils/helpers'
import styles from './CategoryFilter.module.css'

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.btn} ${!active ? styles.active : ''}`}
        onClick={() => onChange('')}
      >
        ALL SECTORS
      </button>
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          className={`${styles.btn} ${active === cat ? styles.active : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
