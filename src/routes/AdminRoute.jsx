import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import Loader from '../components/common/Loader.jsx'

// AdminRoute protects admin-only routes.
// While auth is loading, show a loader to avoid incorrect redirects.
function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  )

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />
}

export default AdminRoute
