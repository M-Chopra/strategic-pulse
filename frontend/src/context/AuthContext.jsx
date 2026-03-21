import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // On mount, check for stored token
  useEffect(() => {
    const token = localStorage.getItem('sp_token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setIsAuthenticated(true)
      setUser({ token })
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password })
    const { token } = res.data
    localStorage.setItem('sp_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setIsAuthenticated(true)
    setUser({ token })
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('sp_token')
    delete api.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
