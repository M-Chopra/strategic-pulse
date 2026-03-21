import styles from './Loader.module.css'

export default function Loader({ text = 'LOADING INTEL...' }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {[...Array(9)].map((_, i) => (
          <div key={i} className={styles.cell} style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  )
}
