import { useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

export function usePosts(params = {}) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get('/posts', { params })
      setPosts(res.data.posts || res.data)
      setTotal(res.data.total || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return { posts, loading, error, total, refetch: fetchPosts }
}

export function usePost(id) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return { post, loading, error }
}
