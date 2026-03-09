import { NavLink, Link } from 'react-router-dom';
import { FiBarChart2, FiFileText, FiFlag, FiUsers, FiPieChart, FiChevronRight, FiShield, FiCpu } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth.jsx';
import Loader from '../common/Loader';

const links = [
  { to: '/admin', label: 'Overview', icon: <FiBarChart2 /> },
  { to: '/admin/analytics', label: 'Analytics', icon: <FiPieChart /> },
  { to: '/admin/users', label: 'Users', icon: <FiUsers /> },
  { to: '/admin/recipes', label: 'Recipes', icon: <FiFileText /> },
  { to: '/admin/reports', label: 'Reports', icon: <FiFlag /> }
];

const AdminSidebar = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <aside className="space-y-10">
        <div className="px-6">
          <div className="h-8 w-40 bg-surface-100 rounded-2xl animate-pulse" />
          <div className="h-4 w-24 bg-surface-50 rounded-lg mt-3 animate-pulse" />
        </div>
        <div className="px-6 flex justify-center">
          <Loader variant="primary" />
        </div>
      </aside>
    );
  }

  if (!isAdmin) {
    return (
      <aside className="space-y-8">
        <header className="px-6">
          <div className="flex items-center gap-2 text-primary-500 mb-2">
            <FiShield size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Restricted</span>
          </div>
          <h3 className="text-3xl font-serif font-bold text-surface-900 tracking-tight">Security Alert</h3>
        </header>

        <div className="mx-6 p-8 rounded-[2rem] bg-red-50 border border-red-100 text-red-900 shadow-sm">
          <h4 className="font-bold text-lg mb-2">Access Terminated</h4>
          <p className="text-sm text-red-700/80 leading-relaxed mb-6">Unauthorized attempt to access the administrative command sequence.</p>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center justify-center w-full h-12 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200"
          >
            Return to Safety
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className="space-y-12">
      <header className="px-6">
        <div className="flex items-center gap-2 text-primary-500 mb-2">
          <FiCpu size={18} />
          <span className="text-[10px] font-bold uppercase tracking-widest leading-none">System Core</span>
        </div>
        <h3 className="text-4xl font-serif font-bold text-surface-900 tracking-tight">Command</h3>
        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em] mt-2 translate-x-1">Executive Console v2.0</p>
      </header>

      <nav className="space-y-2 px-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin'}
            className={({ isActive }) =>
              `group flex items-center justify-between rounded-[1.5rem] px-5 py-4 font-bold transition-all duration-500 ${
                isActive
                  ? 'bg-surface-950 text-white shadow-xl shadow-surface-200 scale-[1.02] border border-surface-800'
                  : 'text-surface-500 hover:bg-white hover:text-primary-600 hover:shadow-premium border border-transparent'
              }`
            }
          >
            <div className="flex items-center gap-4">
              <span className={`text-xl transition-transform duration-500 group-hover:scale-110`}>{link.icon}</span>
              <span className="tracking-tight text-sm font-medium">{link.label}</span>
            </div>
            <FiChevronRight className={`transition-all duration-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-[.active]:opacity-100 group-[.active]:translate-x-0`} />
          </NavLink>
        ))}
      </nav>

      <div className="mx-4 p-8 rounded-[2.5rem] bg-surface-900 text-white border border-surface-800 relative overflow-hidden shadow-2xl group">
        <div className="relative z-10">
          <h4 className="font-serif font-bold text-lg mb-2">Infrastructure</h4>
          <div className="flex items-center gap-3 text-[10px] font-bold text-white/50 uppercase tracking-widest">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            Active & Secure
          </div>
          <p className="mt-4 text-[10px] text-white/30 font-medium leading-relaxed">
            All nodes operational. Security protocol: Grade-A Encrypted.
          </p>
        </div>
        <div className="absolute -bottom-8 -right-8 h-24 w-24 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-all duration-700" />
      </div>
    </aside>
  );
};

export default AdminSidebar;
