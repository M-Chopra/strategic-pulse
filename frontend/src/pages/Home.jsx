import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import PostCard from '../components/PostCard'
import CategoryFilter from '../components/CategoryFilter'
import SearchBar from '../components/SearchBar'
import Loader from '../components/Loader'
import styles from './Home.module.css'

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  const LIMIT = 9

  // Sync category from URL params
  useEffect(() => {
    const cat = searchParams.get('category') || ''
    setCategory(cat)
    setPage(1)
  }, [searchParams])

  const { posts, loading, error, total } = usePosts({
    category: category || undefined,
    search: search || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    sortBy: sortBy || undefined,
    page,
    limit: LIMIT,
  })

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    setPage(1)
    if (cat) setSearchParams({ category: cat })
    else setSearchParams({})
  }

  const handleSearch = (q) => {
    setSearch(q)
    setPage(1)
  }

  const handleFilterChange = (filters) => {
    setStartDate(filters.startDate || '')
    setEndDate(filters.endDate || '')
    setSortBy(filters.sortBy || 'newest')
    setPage(1)
  }

  const totalPages = Math.ceil(total / LIMIT)
  const featuredPost = page === 1 && !search && !category ? posts[0] : null
  const gridPosts = featuredPost ? posts.slice(1) : posts

  return (
    <main className={styles.main}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            STRATEGIC INTELLIGENCE PLATFORM
          </div>
          <h1 className={styles.heroTitle}>
            STRATEGIC<br /><em>PULSE</em>
          </h1>
          <p className={styles.heroSub}>
            Deep analysis on geopolitics, defence doctrine, and technology warfare.
            Curated for strategic thinkers.
          </p>

          <div className={styles.heroSearch}>
            <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
          </div>

          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{total || '—'}</span>
              <span className={styles.statLabel}>REPORTS</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>3</span>
              <span className={styles.statLabel}>SECTORS</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>24/7</span>
              <span className={styles.statLabel}>MONITORING</span>
            </div>
          </div>
        </div>

        {/* Decorative grid overlay */}
        <div className={styles.heroDecor}>
          <div className={styles.crosshair} />
        </div>
      </section>

      {/* ── Content ── */}
      <div className="container">
        {/* Filters bar */}
        <div className={styles.filtersBar}>
          <CategoryFilter active={category} onChange={handleCategoryChange} />
          {(search || category || startDate || endDate || sortBy !== 'newest') && (
            <button
              className={styles.clearFilters}
              onClick={() => {
                setSearch('')
                setStartDate('')
                setEndDate('')
                setSortBy('newest')
                handleCategoryChange('')
              }}
            >
              CLEAR FILTERS ✕
            </button>
          )}
        </div>

        {/* Results label */}
        {search && (
          <div className={styles.resultsLabel}>
            <span className={styles.mono}>QUERY:</span> &ldquo;{search}&rdquo;
            &nbsp;—&nbsp;{total} result{total !== 1 ? 's' : ''} found
          </div>
        )}

        {/* Loading / Error / Posts */}
        {loading ? (
          <Loader />
        ) : error ? (
          <div className={styles.errorBox}>
            <span className={styles.errorIcon}>⚠</span>
            <p>Failed to load intelligence feed: {error}</p>
            <p className={styles.errorHint}>Ensure the backend server is running on port 5000.</p>
          </div>
        ) : posts.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>◎</span>
            <p>No intelligence reports found.</p>
            {(search || category) && (
              <p className={styles.emptyHint}>Try adjusting your search or category filter.</p>
            )}
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featuredPost && (
              <div className={styles.featuredWrapper}>
                <div className={styles.sectionLabel}>LEAD REPORT</div>
                <PostCard post={featuredPost} featured />
              </div>
            )}

            {/* Post grid */}
            {gridPosts.length > 0 && (
              <div className={styles.gridWrapper}>
                {!featuredPost && <div className={styles.sectionLabel}>INTELLIGENCE FEED</div>}
                <div className={styles.grid}>
                  {gridPosts.map((post, i) => (
                    <div
                      key={post._id}
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← PREV
                </button>
                <div className={styles.pageNums}>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.pageNum} ${page === i + 1 ? styles.pageActive : ''}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  NEXT →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
