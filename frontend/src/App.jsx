import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import SinglePost from './pages/SinglePost'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import UserLogin from './pages/UserLogin'
import Signup from './pages/Signup'
import Profile from './pages/Profile'

// Protect admin routes (legacy admin only)
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth()
  return isAuthenticated && (user?.role === 'admin' || user?.username) ? children : <Navigate to="/login" replace />
}

// Protect user routes
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login-user" replace />
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<SinglePost />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-user" element={<UserLogin />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* User routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

