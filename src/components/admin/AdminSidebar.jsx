import { NavLink, Link } from 'react-router-dom'
import { FiBarChart2, FiFileText, FiFlag, FiUsers, FiPieChart, FiChevronRight } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth.jsx'
import Loader from '../common/Loader'

const links = [
  { to: '/admin', label: 'Overview', icon: <FiBarChart2 /> },
  { to: '/admin/analytics', label: 'Analytics', icon: <FiPieChart /> },
  { to: '/admin/users', label: 'Users', icon: <FiUsers /> },
  { to: '/admin/recipes', label: 'Recipes', icon: <FiFileText /> },
  { to: '/admin/reports', label: 'Reports', icon: <FiFlag /> }
]

function AdminSidebar() {
  const { isAdmin, loading } = useAuth()

  // Show loader while auth is initializing
  if (loading) return (
    <aside className="space-y-6">
      <div className="px-4">
        <div className="h-6 w-48 bg-surface-100 rounded-md animate-pulse" />
      </div>
      <div className="px-4">
        <Loader />
      </div>
    </aside>
  )

  // If user is not admin (defensive), show a safe message and link back
  if (!isAdmin) return (
    <aside className="space-y-6">
      <div className="px-4">
        <h3 className="text-2xl font-black text-surface-900 tracking-tight">Admin Console</h3>
        <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mt-1">Platform Management</p>
      </div>
      <div className="card-premium p-6">
        <h4 className="font-black text-lg mb-2">Access Restricted</h4>
        <p className="text-sm text-surface-600 mb-6">You do not have permission to manage the platform.</p>
        <Link to="/dashboard" className="btn-secondary">Return to Dashboard</Link>
      </div>
    </aside>
  )

  return (
    <aside className="space-y-6">
      <div className="px-4">
        <h3 className="text-2xl font-black text-surface-900 tracking-tight">Admin Console</h3>
        <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mt-1">Platform Management</p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin'}
            className={({ isActive }) =>
              isActive
                ? 'group flex items-center justify-between rounded-2xl px-5 py-4 font-bold transition-all duration-300 bg-surface-900 text-white shadow-premium scale-[1.02]'
                : 'group flex items-center justify-between rounded-2xl px-5 py-4 font-bold transition-all duration-300 text-surface-500 hover:bg-white hover:text-primary-600 hover:shadow-soft-xl'
            }
          >
            <div className="flex items-center gap-4">
              <span className="text-xl">{link.icon}</span>
              <span className="tracking-tight">{link.label}</span>
            </div>
            <FiChevronRight className={`transition-transform duration-300 group-hover:translate-x-1`} />
          </NavLink>
        ))}
      </nav>

      <div className="card-premium bg-primary-500 text-white border-none mt-10">
        <h4 className="font-black text-lg mb-2">System Status</h4>
        <div className="flex items-center gap-2 text-xs font-bold text-white/80">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          All systems operational
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
