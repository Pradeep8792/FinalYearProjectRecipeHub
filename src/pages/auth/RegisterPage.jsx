import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FiLock, FiMail, FiUser, FiArrowRight, FiActivity, FiGlobe, FiShield } from 'react-icons/fi'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../hooks/useAuth.jsx'
import usePageTitle from '../../hooks/usePageTitle.jsx'

function RegisterPage() {
  usePageTitle('Register')
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(form)
      toast.success('Account created! Welcome to the culinary collective.')
      navigate('/login')
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.title ||
        'Registration failed'
      )
    }
  }

  return (
    <AppLayout>
      <div className="min-h-[90vh] flex items-center justify-center bg-surface-50 py-20 px-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 rounded-[3rem] overflow-hidden shadow-soft-xl bg-white border border-surface-100">

          {/* Form Side */}
          <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <header className="mb-12">
                <h2 className="text-4xl font-black text-surface-900 tracking-tight mb-4">Join the Collective</h2>
                <p className="text-surface-500 font-medium">Create your professional profile and start your journey.</p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Full Identity</label>
                  <div className="relative group">
                    <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Chef Auguste Escoffier"
                      className="w-full h-14 pl-14 pr-6 rounded-2xl bg-surface-50 border border-surface-100 text-surface-900 font-bold placeholder:text-surface-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

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
                  <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Access Password</label>
                  <div className="relative group">
                    <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min. 8 premium characters"
                      className="w-full h-14 pl-14 pr-6 rounded-2xl bg-surface-50 border border-surface-100 text-surface-900 font-bold placeholder:text-surface-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 mt-4 bg-primary-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary-600 transition-all shadow-xl shadow-primary-100 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? 'Initializing...' : (
                    <>
                      Begin My Journey
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-12 pt-8 border-t border-surface-100 text-center">
                <p className="text-surface-500 text-sm font-medium">
                  Already have an account?{' '}
                  <Link to="/login" className="font-black text-primary-500 hover:text-primary-600 transition-colors ml-1 uppercase text-xs tracking-widest">
                    Sign In
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Visual Side */}
          <div className="hidden lg:flex flex-col justify-between p-16 bg-surface-900 relative overflow-hidden order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-bl from-accent-600/20 to-primary-600/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent-500/10 blur-3xl animate-pulse" />

            <div className="relative z-10">
              <span className="text-accent-400 font-black uppercase tracking-[0.3em] text-[10px] mb-8 block">New Enrollment</span>
              <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.9] mb-8">
                Unleash <br /> Your Inner <br /> Gastronome.
              </h1>

              <div className="grid grid-cols-2 gap-8 mt-16">
                {[
                  { icon: <FiGlobe />, title: 'Global Palette', desc: 'Discover dishes from every corner.' },
                  { icon: <FiActivity />, title: 'Meal Mastery', desc: 'Precision planning for every week.' },
                  { icon: <FiShield />, title: 'Chef Verified', desc: 'Community curated excellence.' },
                  { icon: <FiArrowRight />, title: 'And More', desc: 'Tools designed for professionals.' }
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-accent-400 border border-white/5">
                      {item.icon}
                    </div>
                    <h4 className="font-black text-white text-xs uppercase tracking-widest">{item.title}</h4>
                    <p className="text-white/40 text-[11px] leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-12 border-t border-white/10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-surface-900 bg-surface-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="" />
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-xs font-bold">Joined by 120 chefs today</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default RegisterPage
