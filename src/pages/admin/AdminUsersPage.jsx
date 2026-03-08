import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FiUsers, FiShield, FiUserCheck, FiUserX, FiSearch, FiMoreVertical } from 'react-icons/fi'
import AdminLayout from '../../components/layout/AdminLayout'
import { adminApi } from '../../api/adminApi.jsx'
import Loader from '../../components/common/Loader'
import usePageTitle from '../../hooks/usePageTitle.jsx'

function AdminUsersPage() {
  usePageTitle('Admin — Users')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const loadUsers = async () => {
    try {
      const data = await adminApi.getUsers()
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const toggleStatus = async (user) => {
    try {
      await adminApi.updateUserStatus(user.userId, !user.isActive)
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`)
      loadUsers()
    } catch {
      toast.error('Could not update status')
    }
  }

  const toggleRole = async (user) => {
    try {
      await adminApi.updateUserRole(user.userId, user.role === 'Admin' ? 'User' : 'Admin')
      toast.success(`User role changed to ${user.role === 'Admin' ? 'User' : 'Admin'}`)
      loadUsers()
    } catch {
      toast.error('Could not update role')
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><Loader /></div></AdminLayout>

  return (
    <AdminLayout>
      <div className="space-y-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-primary-500 font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">User Management</span>
            <h1 className="text-5xl font-black text-surface-900 tracking-tight">Community Directory</h1>
          </div>

          <div className="relative group max-w-md w-full">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-surface-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-surface-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
            />
          </div>
        </header>

        <div className="card-premium overflow-hidden !p-0 border-surface-100 shadow-soft-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-50">
              <thead>
                <tr className="bg-surface-50/50">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Member</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Role</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-50">
                {filteredUsers.map((user, i) => (
                  <motion.tr
                    key={user.userId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-surface-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-surface-100 flex items-center justify-center text-surface-900 font-black text-lg">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-black text-surface-900 group-hover:text-primary-600 transition-colors">{user.name}</p>
                          <p className="text-sm font-bold text-surface-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${user.role === 'Admin' ? 'bg-primary-50 text-primary-600' : 'bg-surface-50 text-surface-500'
                        }`}>
                        {user.role === 'Admin' && <FiShield size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${user.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-surface-300'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-surface-600">
                          {user.isActive ? 'Authorized' : 'Restricted'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleStatus(user)}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                          className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${user.isActive ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white'
                            }`}
                        >
                          {user.isActive ? <FiUserX /> : <FiUserCheck />}
                        </button>
                        <button
                          onClick={() => toggleRole(user)}
                          title="Change Role"
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-50 text-primary-500 hover:bg-primary-500 hover:text-white transition-all"
                        >
                          <FiShield />
                        </button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface-50 text-surface-400 hover:bg-surface-900 hover:text-white transition-all">
                          <FiMoreVertical />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <FiUsers className="mx-auto text-surface-200 mb-4" size={48} />
              <p className="text-surface-400 font-bold">No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminUsersPage
