import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // On mount, check for stored token and user info
  useEffect(() => {
    const token = localStorage.getItem('sp_token')
    const userData = localStorage.getItem('sp_user')

    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setIsAuthenticated(true)
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
    setLoading(false)
  }, [])

  const signup = async (email, username, password, displayName) => {
    const res = await api.post('/auth/signup', {
      email,
      username,
      password,
      displayName,
    })
    const { accessToken, refreshToken, user: userData } = res.data

    // Store tokens
    localStorage.setItem('sp_token', accessToken)
    localStorage.setItem('sp_refreshToken', refreshToken)
    localStorage.setItem('sp_user', JSON.stringify(userData))

    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    setIsAuthenticated(true)
    setUser(userData)

    return res.data
  }

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { accessToken, refreshToken, user: userData } = res.data

    // Store tokens
    localStorage.setItem('sp_token', accessToken)
    localStorage.setItem('sp_refreshToken', refreshToken)
    localStorage.setItem('sp_user', JSON.stringify(userData))

    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    setIsAuthenticated(true)
    setUser(userData)

    return res.data
  }

  const adminLogin = async (username, password) => {
    // Legacy admin login
    const res = await api.post('/auth/admin-login', { username, password })
    const { accessToken } = res.data

    localStorage.setItem('sp_token', accessToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    setIsAuthenticated(true)
    setUser({ username, role: 'admin' })

    return res.data
  }

  const logout = () => {
    localStorage.removeItem('sp_token')
    localStorage.removeItem('sp_refreshToken')
    localStorage.removeItem('sp_user')
    delete api.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
    setUser(null)
  }

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('sp_refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token')
      }

      const res = await api.post('/auth/refresh', { refreshToken })
      const { accessToken } = res.data

      localStorage.setItem('sp_token', accessToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      return accessToken
    } catch (error) {
      logout()
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        signup,
        login,
        adminLogin,
        logout,
        refreshAccessToken,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

