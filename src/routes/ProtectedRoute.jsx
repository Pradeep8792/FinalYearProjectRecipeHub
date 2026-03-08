import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import Loader from '../components/common/Loader.jsx'

// Protects routes for authenticated users.
// While auth state is loading we show a loader to avoid flashing redirects.
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  // If auth is initializing, render a safe loader fallback
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  )

  // When not loading, either render nested routes or redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
