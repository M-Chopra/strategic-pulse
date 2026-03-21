import { Link } from 'react-router-dom'
import { formatDate, truncate, stripHtml, CATEGORY_CLASS } from '../utils/helpers'
import styles from './PostCard.module.css'

export default function PostCard({ post, featured = false }) {
  const badgeClass = CATEGORY_CLASS[post.category] || 'badge-default'
  const excerpt = truncate(stripHtml(post.content), featured ? 200 : 120)

  return (
    <Link to={`/post/${post._id}`} className={`${styles.card} ${featured ? styles.featured : ''}`}>
      {/* Top meta row */}
      <div className={styles.meta}>
        <span className={`${styles.badge} ${badgeClass}`}>{post.category}</span>
        {post.isAutoFetched && (
          <span className={styles.autoTag}>AUTO</span>
        )}
        <span className={styles.date}>{formatDate(post.createdAt)}</span>
      </div>

      {/* Title */}
      <h2 className={styles.title}>{post.title}</h2>

      {/* Excerpt */}
      <p className={styles.excerpt}>{excerpt}</p>

      {/* Footer */}
      <div className={styles.footer}>
        {post.tags?.length > 0 && (
          <div className={styles.tags}>
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
          </div>
        )}
        <span className={styles.readMore}>READ INTEL →</span>
      </div>

      {/* Corner accent */}
      <div className={styles.cornerAccent} />
    </Link>
  )
}
