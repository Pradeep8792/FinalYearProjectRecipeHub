import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../hooks/useAuth.jsx'
import usePageTitle from '../../hooks/usePageTitle.jsx'

function LoginPage() {
  usePageTitle('Login')
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await login(form)
      const role = data?.role || data?.user?.role
      toast.success('Welcome back, Chef!')
      navigate(role === 'Admin' ? '/admin' : '/dashboard')
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.title ||
        'Authentication failed'
      )
    }
  }

  return (
    <AppLayout>
      <div className="min-h-[90vh] flex items-center justify-center bg-surface-50 py-20 px-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 rounded-[3rem] overflow-hidden shadow-soft-xl bg-white border border-surface-100">

          {/* Visual Side */}
          <div className="hidden lg:flex flex-col justify-between p-16 bg-surface-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-accent-600/20" />
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />

            <div className="relative z-10">
              <span className="text-primary-400 font-black uppercase tracking-[0.3em] text-[10px] mb-8 block">Member Access</span>
              <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.9] mb-8">
                Refine Your <br /> Culinary <br /> Precision.
              </h1>
              <div className="space-y-6 mt-12">
                {[
                  'Access personal recipe vault',
                  'Sync meal plans across devices',
                  'Manage collaborative shopping lists'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-white/70">
                    <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-primary-400">
                      <FiCheckCircle size={14} />
                    </div>
                    <span className="font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-12 border-t border-white/10">
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                Trusted by 10,000+ Home Chefs
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <header className="mb-12">
                <h2 className="text-4xl font-black text-surface-900 tracking-tight mb-4">Welcome Back</h2>
                <p className="text-surface-500 font-medium">Enter your credentials to access your workspace.</p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="chef@recipehub.com"
                      className="w-full h-14 pl-14 pr-6 rounded-2xl bg-surface-50 border border-surface-100 text-surface-900 font-bold placeholder:text-surface-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-surface-400">Security Password</label>
                    <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-primary-500 hover:text-primary-600 transition-colors">Forgot?</Link>
                  </div>
                  <div className="relative group">
                    <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full h-14 pl-14 pr-6 rounded-2xl bg-surface-50 border border-surface-100 text-surface-900 font-bold placeholder:text-surface-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 mt-4 bg-surface-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary-600 transition-all shadow-xl shadow-surface-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? 'Authenticating...' : (
                    <>
                      Sign In to Workspace
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-12 pt-8 border-t border-surface-100 text-center">
                <p className="text-surface-500 text-sm font-medium">
                  New to the platform?{' '}
                  <Link to="/register" className="font-black text-primary-500 hover:text-primary-600 transition-colors ml-1 uppercase text-xs tracking-widest">
                    Create Profile
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default LoginPage
