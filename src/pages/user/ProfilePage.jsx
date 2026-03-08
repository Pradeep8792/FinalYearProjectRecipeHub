import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiEdit3, FiSave, FiCheckCircle, FiGlobe } from 'react-icons/fi'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { userApi } from '../../api/userApi.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import usePageTitle from '../../hooks/usePageTitle.jsx'
import Loader from '../../components/common/Loader'

function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  usePageTitle('Profile')
  const [form, setForm] = useState({ name: '', email: '', bio: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user?.userId) return

    userApi.getProfile(user.userId).then((data) => {
      setForm({
        name: data.name || '',
        email: data.email || '',
        bio: data.bio || ''
      })
    })
  }, [user?.userId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await userApi.updateProfile(user.userId, form)
      toast.success('Professional identity updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) return <DashboardLayout><div className="flex justify-center py-20"><Loader /></div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-12 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-primary-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">Chef Identity</span>
              <h1 className="text-5xl font-black text-surface-900 tracking-tighter">
                Manage Profile
              </h1>
            </motion.div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-surface-100 flex items-center justify-center text-surface-400">
              <FiGlobe size={20} />
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Status</p>
              <p className="text-sm font-bold text-surface-900">Verified Professional</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr,350px] gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="card-premium p-8 md:p-12 space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      className="w-full h-14 pl-14 pr-6 rounded-2xl bg-surface-50 border border-surface-100 text-surface-900 font-bold placeholder:text-surface-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 focus:outline-none transition-all"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Email Connection</label>
                  <div className="relative group">
                    <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      className="w-full h-14 pl-14 pr-6 rounded-2xl bg-surface-50 border border-surface-100 text-surface-900 font-bold placeholder:text-surface-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 focus:outline-none transition-all"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="chef@recipehub.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Chef Narrative (Bio)</label>
                <div className="relative group">
                  <FiEdit3 className="absolute left-5 top-6 text-surface-300 group-focus-within:text-primary-500 transition-colors" />
                  <textarea
                    className="w-full min-h-[180px] pl-14 pr-6 py-5 rounded-2xl bg-surface-50 border border-surface-100 text-surface-900 font-bold placeholder:text-surface-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 focus:outline-none transition-all resize-none"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell the community about your culinary philosophy..."
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-surface-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="group relative px-10 py-4 bg-surface-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-primary-600 transition-all shadow-xl shadow-surface-100 disabled:opacity-50"
                >
                  {saving ? 'Processing...' : (
                    <>
                      Save Identity Changes
                      <FiSave className="group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          <aside className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="card-premium p-8 text-center"
            >
              <div className="relative mx-auto w-32 h-32 mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-1">
                  <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-inner">
                    <FiUser size={64} className="text-surface-200" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center text-primary-500">
                  <FiCheckCircle size={18} />
                </div>
              </div>
              <h3 className="text-xl font-black text-surface-900 tracking-tight">{form.name || 'Anonymous Chef'}</h3>
              <p className="text-surface-400 text-xs font-bold uppercase tracking-widest mt-1">Gourmet Contributor</p>
              <div className="mt-8 pt-8 border-t border-surface-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Recipes</p>
                  <p className="text-xl font-black text-surface-900">24</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Followers</p>
                  <p className="text-xl font-black text-surface-900">1.2k</p>
                </div>
              </div>
            </motion.div>

            <div className="bg-primary-50 rounded-[2.5rem] p-8 border border-primary-100">
              <h4 className="text-lg font-black text-primary-900 mb-4 tracking-tight">Pro Tip</h4>
              <p className="text-primary-700 text-sm leading-relaxed font-medium">
                "A complete bio helps other chefs connect with your unique cooking style and increases engagement by 40%."
              </p>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ProfilePage
