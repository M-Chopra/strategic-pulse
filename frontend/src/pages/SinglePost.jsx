import { useParams, Link, useNavigate } from 'react-router-dom'
import { usePost } from '../hooks/usePosts'
import { useAuth } from '../context/AuthContext'
import { formatDate, CATEGORY_CLASS } from '../utils/helpers'
import Loader from '../components/Loader'
import CommentThread from '../components/CommentThread'
import BookmarkButton from '../components/BookmarkButton'
import api from '../utils/api'
import styles from './SinglePost.module.css'

export default function SinglePost() {
  const { id } = useParams()
  const { post, loading, error } = usePost(id)
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!window.confirm('Delete this intelligence report permanently?')) return
    try {
      await api.delete(`/posts/${id}`)
      navigate('/')
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  if (loading) return <div className={styles.loadingWrap}><Loader text="RETRIEVING REPORT..." /></div>

  if (error || !post) {
    return (
      <div className={styles.errorWrap}>
        <span className={styles.errorCode}>404</span>
        <h2>REPORT NOT FOUND</h2>
        <p>This intelligence report may have been declassified or removed.</p>
        <Link to="/" className={styles.backBtn}>← RETURN TO FEED</Link>
      </div>
    )
  }

  const badgeClass = CATEGORY_CLASS[post.category] || 'badge-default'
  const isOwnPost = user?.id === post.userId || user?.role === 'admin'

  return (
    <main className={styles.main}>
      {/* Back link */}
      <div className={styles.topBar}>
        <div className="container">
          <Link to="/" className={styles.back}>← INTELLIGENCE FEED</Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <BookmarkButton postId={id} size="medium" />
            {isOwnPost && (
              <button onClick={handleDelete} className={styles.deleteBtn}>
                DELETE REPORT
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <article className={styles.article}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.meta}>
              <span className={`${styles.badge} ${badgeClass}`}>{post.category}</span>
              {post.isAutoFetched && (
                <span className={styles.autoTag}>AUTO-FETCHED</span>
              )}
              <span className={styles.date}>{formatDate(post.createdAt)}</span>
            </div>

            <h1 className={styles.title}>{post.title}</h1>

            {post.tags?.length > 0 && (
              <div className={styles.tags}>
                {post.tags.map(tag => (
                  <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
              </div>
            )}

            {/* Divider line */}
            <div className={styles.divider} />
          </header>

          {/* AI Summary */}
          {post.aiSummary && (
            <aside className={styles.aiSummary}>
              <div className={styles.aiSummaryHeader}>
                <span className={styles.aiIcon}>◈</span>
                <span>AI INTELLIGENCE BRIEF</span>
              </div>
              <p>{post.aiSummary}</p>
            </aside>
          )}

          {/* Content */}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Source link (for auto-fetched) */}
          {post.sourceUrl && (
            <div className={styles.sourceLink}>
              <span className={styles.sourceMono}>SOURCE:</span>{' '}
              <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer">
                {post.sourceUrl}
              </a>
            </div>
          )}

          {/* Engagement stats */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(212, 137, 10, 0.05)',
            border: '1px solid rgba(212, 137, 10, 0.2)',
            borderRadius: '4px',
            display: 'flex',
            gap: '2rem',
            fontSize: '0.9rem',
          }}>
            <div>👁 {post.views || 0} views</div>
            <div>💬 {post.commentCount || 0} comments</div>
            <div>👍 {post.likes || 0} likes</div>
          </div>

          {/* Comments Section */}
          <CommentThread postId={id} />
        </article>
      </div>
    </main>
  )
}
