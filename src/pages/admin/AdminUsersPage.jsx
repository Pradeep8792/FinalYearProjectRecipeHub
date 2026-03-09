import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUsers, 
  FiShield, 
  FiUserCheck, 
  FiUserX, 
  FiSearch, 
  FiMoreVertical,
  FiMail,
  FiActivity,
  FiChevronRight,
  FiZap
} from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminApi } from '../../api/adminApi.jsx';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import usePageTitle from '../../hooks/usePageTitle.jsx';

const AdminUsersPage = () => {
  usePageTitle('Manage Users | Admin');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (user) => {
    try {
      await adminApi.updateUserStatus(user.userId, !user.isActive);
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully.`);
      loadUsers();
    } catch {
      toast.error('Could not update user status.');
    }
  };

  const toggleRole = async (user) => {
    try {
      await adminApi.updateUserRole(user.userId, user.role === 'Admin' ? 'User' : 'Admin');
      toast.success(`User role changed to ${user.role === 'Admin' ? 'User' : 'Admin'}`);
      loadUsers();
    } catch {
      toast.error('Could not update user role.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-widest ${role === 'Admin' ? 'bg-primary-50 text-primary-600 border-primary-100 shadow-sm' : 'bg-surface-50 text-surface-500 border-surface-100'}`}>
        {role === 'Admin' ? <FiShield size={10} /> : <FiUsers size={10} />}
        {role}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader variant="primary" />
          <p className="mt-6 text-sm font-bold text-surface-400 uppercase tracking-widest animate-pulse">Loading users...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-16 pb-20">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-primary-500 mb-2">
              <FiZap size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">User Management</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-surface-900 tracking-tight leading-tight">Manage Users</h1>
            <p className="mt-3 text-surface-500 text-lg font-medium leading-relaxed">
              Manage registered users, their roles, and account status.
            </p>
          </div>

          <div className="relative group max-w-md w-full">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-surface-200 rounded-[2rem] py-5 pl-16 pr-8 font-bold text-surface-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all shadow-premium text-sm placeholder:text-surface-300"
            />
          </div>
        </header>

        <div className="bg-white rounded-[3.5rem] border border-surface-200 shadow-premium overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-surface-100">
              <thead>
                <tr className="bg-surface-50/50">
                  <th className="px-10 py-8 text-left text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Personnel Identifier</th>
                  <th className="px-10 py-8 text-left text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Authority Level</th>
                  <th className="px-10 py-8 text-left text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Authentication Status</th>
                  <th className="px-10 py-8 text-right text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Administrative Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50 bg-white">
                <AnimatePresence>
                  {filteredUsers.map((user, i) => (
                    <motion.tr
                      key={user.userId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: i * 0.03 }}
                      className="group transition-colors hover:bg-primary-50/20"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="h-14 w-14 rounded-2xl bg-surface-950 text-white font-serif font-bold text-2xl flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-110 group-hover:bg-primary-500 transition-all duration-500">
                            {user.name[0]}
                          </div>
                          <div>
                            <p className="font-serif font-bold text-lg text-surface-900 group-hover:text-primary-600 transition-colors leading-tight">{user.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <FiMail size={12} className="text-surface-300" />
                               <p className="text-xs font-medium text-surface-400">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                          <div className={`h-2.5 w-2.5 rounded-full ${user.isActive ? 'bg-success shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-surface-300 grayscale'}`} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-surface-600">
                            {user.isActive ? 'Clear: Authorized' : 'Protocol: Restricted'}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleStatus(user)}
                            icon={user.isActive ? <FiUserX /> : <FiUserCheck />}
                            className={`h-11 w-11 !p-0 ${user.isActive ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border-red-100' : 'bg-success/10 text-success hover:bg-success hover:text-white border-success/20'}`}
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleRole(user)}
                            icon={<FiShield />}
                            className="h-11 w-11 !p-0 bg-primary-50 text-primary-500 hover:bg-primary-500 hover:text-white border-primary-100 shadow-sm"
                          />
                          <Button 
                            variant="ghost"
                            size="sm"
                            icon={<FiMoreVertical />}
                            className="h-11 w-11 !p-0 bg-surface-50 text-surface-400 hover:bg-surface-900 hover:text-white border-surface-100 shadow-sm"
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="py-40 text-center grayscale opacity-40">
              <FiUsers className="mx-auto text-surface-100 mb-6" size={80} />
              <h3 className="text-2xl font-serif font-bold text-surface-900">Directory Query empty</h3>
              <p className="text-surface-400 font-medium max-w-xs mx-auto mt-2 leading-relaxed">No registered identifiers found matching the current search parameters.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
