import { useState } from 'react'
import styles from './SearchBar.module.css'

export default function SearchBar({ onSearch, onFilterChange, placeholder = 'Search intelligence reports...' }) {
  const [value, setValue] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(value.trim())
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    if (e.target.value === '') onSearch('')
  }

  const handleFilterChange = () => {
    onFilterChange({
      startDate,
      endDate,
      sortBy,
    })
  }

  const handleClearFilters = () => {
    setStartDate('')
    setEndDate('')
    setSortBy('newest')
    onFilterChange({
      startDate: '',
      endDate: '',
      sortBy: 'newest',
    })
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.wrapper}>
          <span className={styles.icon}>⌕</span>
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={styles.input}
          />
          {value && (
            <button
              type="button"
              className={styles.clear}
              onClick={() => { setValue(''); onSearch('') }}
            >
              ✕
            </button>
          )}
          <button
            type="button"
            className={styles.filterBtn}
            onClick={() => setShowFilters(!showFilters)}
          >
            ⚙ FILTERS
          </button>
          <button type="submit" className={styles.submit}>SEARCH</button>
        </div>
      </form>

      {/* Filters */}
      {showFilters && (
        <div style={{
          background: 'rgba(10, 12, 16, 0.98)',
          border: '1px solid rgba(212, 137, 10, 0.3)',
          padding: '1.5rem',
          marginTop: '1rem',
          borderRadius: '4px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem',
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                FROM DATE
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  color: '#00ff00',
                  borderRadius: '2px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                TO DATE
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  color: '#00ff00',
                  borderRadius: '2px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                SORT BY
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  color: '#00ff00',
                  borderRadius: '2px',
                }}
              >
                <option value="newest">Newest First</option>
                <option value="trending">Trending</option>
                <option value="relevance">Most Relevant</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleFilterChange}
              style={{
                padding: '0.5rem 1rem',
                background: '#00ff00',
                color: '#000',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                color: '#00ff00',
                border: '1px solid #00ff00',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

