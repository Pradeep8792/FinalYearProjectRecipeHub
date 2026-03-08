import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import { adminApi } from '../../api/adminApi'

function AdminUsersPage() {
  const [users, setUsers] = useState([])

  const loadUsers = async () => {
    const data = await adminApi.getUsers()
    setUsers(data)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const toggleStatus = async (user) => {
    try {
      await adminApi.updateUserStatus(user.userId, !user.isActive)
      toast.success('User status updated')
      loadUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed')
    }
  }

  const toggleRole = async (user) => {
    try {
      const nextRole = user.role === 'Admin' ? 'User' : 'Admin'
      await adminApi.updateUserRole(user.userId, nextRole)
      toast.success('User role updated')
      loadUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Role update failed')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="mt-2 text-slate-600">Manage user status and roles.</p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="px-5 py-4">{user.email}</td>
                  <td className="px-5 py-4">{user.role}</td>
                  <td className="px-5 py-4">{user.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => toggleStatus(user)} className="font-semibold text-brand-600">Toggle Status</button>
                      <button onClick={() => toggleRole(user)} className="font-semibold text-slate-700">Toggle Role</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminUsersPage