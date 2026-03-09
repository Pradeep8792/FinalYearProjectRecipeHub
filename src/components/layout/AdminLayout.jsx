import AppLayout from './AppLayout'
import AdminSidebar from '../admin/AdminSidebar'
import { motion } from 'framer-motion'

/**
 * AdminLayout - wraps all admin pages with the shared sidebar and navbar spacing.
 * pt-20 ensures content is not hidden behind the fixed Navbar.
 */
function AdminLayout({ children }) {
  return (
    <AppLayout>
      <div className="container-app pt-20 pb-12">
        <div className="grid gap-6 lg:grid-cols-[270px,1fr]">
          <AdminSidebar />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  )
}

export default AdminLayout
