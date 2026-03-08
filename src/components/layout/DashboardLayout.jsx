import { NavLink } from 'react-router-dom'
import AppLayout from './AppLayout'
import { motion } from 'framer-motion'
import {
  FiLayout, FiFileText, FiHeart, FiCalendar,
  FiShoppingCart, FiUser, FiSettings, FiChevronRight
} from 'react-icons/fi'

const items = [
  { to: '/dashboard', label: 'Overview', icon: <FiLayout /> },
  { to: '/my-recipes', label: 'My Creations', icon: <FiFileText /> },
  { to: '/favorites', label: 'Saved Recipes', icon: <FiHeart /> },
  { to: '/meal-plans', label: 'Meal Planner', icon: <FiCalendar /> },
  { to: '/shopping-lists', label: 'Grocery Lists', icon: <FiShoppingCart /> },
  { to: '/profile', label: 'Chef Profile', icon: <FiUser /> }
]

function DashboardLayout({ children }) {
  return (
    <AppLayout>
      <div className="container-app py-16">
        <div className="grid gap-10 lg:grid-cols-[300px,1fr]">
          <aside className="space-y-8">
            <div className="px-4">
              <h3 className="text-3xl font-black text-surface-900 tracking-tight">Chef Workspace</h3>
              <p className="text-xs font-bold text-primary-500 uppercase tracking-[0.2em] mt-1">Manage your culinary life</p>
            </div>

            <nav className="space-y-2">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard'}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-2xl px-5 py-4 font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-200 scale-[1.02]'
                        : 'text-surface-500 hover:bg-white hover:text-primary-600 hover:shadow-soft-xl'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-4">
                        <span className="text-xl">{item.icon}</span>
                        <span className="tracking-tight">{item.label}</span>
                      </div>
                      <FiChevronRight
                        className={`transition-transform duration-300 group-hover:translate-x-1 ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="rounded-[2.5rem] bg-gradient-to-br from-surface-900 to-surface-800 p-8 text-white relative overflow-hidden shadow-premium">
              <div className="relative z-10">
                <p className="text-primary-400 font-black uppercase text-[10px] tracking-widest mb-2">Pro Feature</p>
                <h4 className="text-xl font-black mb-4 leading-tight">Master the kitchen with Pro tips.</h4>
                <button className="text-xs font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all border border-white/10">Upgrade Now</button>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-10 rotate-12">
                <FiSettings size={120} />
              </div>
            </div>
          </aside>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="min-h-[600px]"
          >
            {children}
          </motion.section>
        </div>
      </div>
    </AppLayout>
  )
}

export default DashboardLayout