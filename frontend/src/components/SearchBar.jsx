import { useState } from 'react'
import styles from './SearchBar.module.css'

export default function SearchBar({ onSearch, placeholder = 'Search intelligence reports...' }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(value.trim())
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    if (e.target.value === '') onSearch('')
  }

  return (
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
        <button type="submit" className={styles.submit}>SEARCH</button>
      </div>
    </form>
  )
}
