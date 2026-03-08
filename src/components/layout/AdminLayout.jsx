import AppLayout from './AppLayout'
import AdminSidebar from '../admin/AdminSidebar'

function AdminLayout({ children }) {
  return (
    <AppLayout>
      <div className="container-app py-12">
        <div className="grid gap-6 lg:grid-cols-[270px,1fr]">
          <AdminSidebar />
          <div>{children}</div>
        </div>
      </div>
    </AppLayout>
  )
}

export default AdminLayout
