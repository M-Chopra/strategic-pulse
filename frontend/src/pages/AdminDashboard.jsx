import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../context/AuthContext'
import { formatDate, CATEGORIES, CATEGORY_CLASS, stripHtml, truncate } from '../utils/helpers'
import api from '../utils/api'
import styles from './AdminDashboard.module.css'

const EMPTY_FORM = {
  title: '',
  category: 'Geopolitics',
  content: '',
  tags: '',
}

export default function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { posts, loading, error, refetch, total } = usePosts({ limit: 50 })

  const [tab, setTab] = useState('posts') // 'posts' | 'create' | 'autofetch'
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchResult, setFetchResult] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // ── Form Handlers ───────────────────────────────

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) {
      setFormError('Title and content are required.')
      return
    }
    try {
      setFormLoading(true)
      setFormError('')
      const tags = form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
      await api.post('/posts', { ...form, tags })
      setSuccessMsg('Intelligence report published successfully.')
      setForm(EMPTY_FORM)
      setTab('posts')
      refetch()
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  // ── Delete ──────────────────────────────────────

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return
    try {
      setDeleteId(id)
      await api.delete(`/posts/${id}`)
      refetch()
    } catch (err) {
      alert('Delete failed: ' + err.message)
    } finally {
      setDeleteId(null)
    }
  }

  // ── Auto Fetch ──────────────────────────────────

  const handleAutoFetch = async () => {
    try {
      setFetchLoading(true)
      setFetchResult(null)
      const res = await api.post('/news/fetch')
      setFetchResult(res.data)
    } catch (err) {
      setFetchResult({ error: err.message })
    } finally {
      setFetchLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <main className={styles.main}>
      <div className="container">
        {/* ── Page Header ── */}
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.headerMeta}>ADMIN TERMINAL</div>
            <h1 className={styles.pageTitle}>OPERATIONS DASHBOARD</h1>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            LOGOUT ↗
          </button>
        </div>

        {/* ── Stats Bar ── */}
        <div className={styles.statsBar}>
          <Stat label="TOTAL REPORTS" value={total} />
          <Stat label="CATEGORIES" value={3} />
          <Stat
            label="AUTO FETCHED"
            value={posts.filter(p => p.isAutoFetched).length}
          />
          <Stat
            label="MANUAL"
            value={posts.filter(p => !p.isAutoFetched).length}
          />
        </div>

        {/* Success message */}
        {successMsg && (
          <div className={styles.successBanner}>
            <span>✓</span> {successMsg}
          </div>
        )}

        {/* ── Tabs ── */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'posts' ? styles.tabActive : ''}`}
            onClick={() => setTab('posts')}
          >
            MANAGE REPORTS
          </button>
          <button
            className={`${styles.tab} ${tab === 'create' ? styles.tabActive : ''}`}
            onClick={() => setTab('create')}
          >
            + NEW REPORT
          </button>
          <button
            className={`${styles.tab} ${tab === 'autofetch' ? styles.tabActive : ''}`}
            onClick={() => setTab('autofetch')}
          >
            AUTO FETCH
          </button>
        </div>

        {/* ── Tab: Manage Posts ── */}
        {tab === 'posts' && (
          <section className={styles.section}>
            {loading ? (
              <p className={styles.loadingText}>LOADING REPORTS...</p>
            ) : error ? (
              <p className={styles.errorText}>Error: {error}</p>
            ) : posts.length === 0 ? (
              <div className={styles.empty}>
                <p>No reports found.</p>
                <button onClick={() => setTab('create')} className={styles.emptyAction}>
                  CREATE FIRST REPORT →
                </button>
              </div>
            ) : (
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <span>TITLE</span>
                  <span>CATEGORY</span>
                  <span>DATE</span>
                  <span>TYPE</span>
                  <span>ACTIONS</span>
                </div>
                {posts.map(post => {
                  const badgeClass = CATEGORY_CLASS[post.category] || 'badge-default'
                  return (
                    <div key={post._id} className={styles.tableRow}>
                      <span className={styles.postTitle}>
                        {truncate(post.title, 60)}
                      </span>
                      <span>
                        <span className={`${styles.catBadge} ${badgeClass}`}>
                          {post.category}
                        </span>
                      </span>
                      <span className={styles.postDate}>{formatDate(post.createdAt)}</span>
                      <span className={styles.typeTag}>
                        {post.isAutoFetched
                          ? <span className={styles.autoTag}>AUTO</span>
                          : <span className={styles.manualTag}>MANUAL</span>
                        }
                      </span>
                      <span className={styles.actions}>
                        <button
                          className={styles.viewBtn}
                          onClick={() => navigate(`/post/${post._id}`)}
                        >
                          VIEW
                        </button>
                        <button
                          className={styles.delBtn}
                          onClick={() => handleDelete(post._id)}
                          disabled={deleteId === post._id}
                        >
                          {deleteId === post._id ? '...' : 'DELETE'}
                        </button>
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* ── Tab: Create Post ── */}
        {tab === 'create' && (
          <section className={styles.section}>
            <div className={styles.formWrap}>
              <h2 className={styles.formTitle}>NEW INTELLIGENCE REPORT</h2>

              <form className={styles.form} onSubmit={handleCreate}>
                <div className={styles.fieldRow}>
                  <Field label="TITLE *">
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleFormChange}
                      className={styles.input}
                      placeholder="Report headline..."
                    />
                  </Field>
                </div>

                <div className={styles.fieldRow2}>
                  <Field label="CATEGORY *">
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleFormChange}
                      className={styles.input}
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="TAGS (comma-separated)">
                    <input
                      type="text"
                      name="tags"
                      value={form.tags}
                      onChange={handleFormChange}
                      className={styles.input}
                      placeholder="NATO, Russia, OSINT..."
                    />
                  </Field>
                </div>

                <Field label="CONTENT *">
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleFormChange}
                    className={styles.textarea}
                    placeholder="Write the full intelligence report here. HTML tags are supported (e.g. <p>, <h2>, <strong>)..."
                    rows={14}
                  />
                </Field>

                {formError && (
                  <div className={styles.formError}>⚠ {formError}</div>
                )}

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => { setForm(EMPTY_FORM); setTab('posts') }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className={styles.publishBtn}
                    disabled={formLoading}
                  >
                    {formLoading ? 'PUBLISHING...' : 'PUBLISH REPORT →'}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* ── Tab: Auto Fetch ── */}
        {tab === 'autofetch' && (
          <section className={styles.section}>
            <div className={styles.fetchPanel}>
              <div className={styles.fetchHeader}>
                <span className={styles.fetchIcon}>◉</span>
                <div>
                  <h2 className={styles.fetchTitle}>AUTOMATED INTEL FEED</h2>
                  <p className={styles.fetchSub}>
                    Fetch the latest geopolitics and defence news from external sources.
                    Articles are deduplicated automatically.
                  </p>
                </div>
              </div>

              <div className={styles.fetchInfo}>
                <InfoItem label="SOURCE" value="NewsAPI.org" />
                <InfoItem label="TOPICS" value="Geopolitics, Defence, Tech Warfare" />
                <InfoItem label="DEDUP" value="By title hash — no duplicates" />
                <InfoItem label="AI SUMMARY" value="Auto-generated on fetch" />
              </div>

              <button
                className={styles.fetchBtn}
                onClick={handleAutoFetch}
                disabled={fetchLoading}
              >
                {fetchLoading ? (
                  <>
                    <span className={styles.fetchSpinner} /> FETCHING INTELLIGENCE...
                  </>
                ) : (
                  '⬇ FETCH LATEST NEWS'
                )}
              </button>

              {fetchResult && (
                <div className={`${styles.fetchResult} ${fetchResult.error ? styles.fetchError : styles.fetchSuccess}`}>
                  {fetchResult.error ? (
                    <>
                      <strong>⚠ FETCH FAILED</strong>
                      <p>{fetchResult.error}</p>
                      <p className={styles.fetchHint}>
                        Ensure NEWS_API_KEY is set in your backend .env file.
                      </p>
                    </>
                  ) : (
                    <>
                      <strong>✓ FETCH COMPLETE</strong>
                      <p>
                        Fetched: <b>{fetchResult.fetched}</b> articles &nbsp;|&nbsp;
                        Saved: <b>{fetchResult.saved}</b> new reports &nbsp;|&nbsp;
                        Skipped: <b>{fetchResult.skipped}</b> duplicates
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

// ── Small helpers ───────────────────────────────

function Stat({ label, value }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 4,
      padding: '16px 24px',
      background: 'rgba(20,23,32,0.6)',
      border: '1px solid var(--border)',
      borderRadius: 3,
      flex: 1,
    }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--amber)' }}>
        {value}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--amber-dim)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--amber-dim)', width: 100, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{value}</span>
    </div>
  )
}
