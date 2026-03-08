import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiHeart, FiLogOut, FiMenu, FiSearch, FiUser, FiX, FiPlus, FiChevronDown } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { GiCookingPot } from 'react-icons/gi'
import { useAuth } from '../../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import useDebounce from '../../hooks/useDebounce.jsx'

function Navbar() {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, logout, user, loading: authLoading } = useAuth()
  const debouncedSearch = useDebounce(search, 450)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const value = search.trim()
    if (!value) return
    navigate(`/recipes?search=${encodeURIComponent(value)}`)
    setOpen(false)
  }

  // Auto-navigate when user stops typing (debounced)
  useEffect(() => {
    const value = debouncedSearch?.trim()
    if (value) {
      navigate(`/recipes?search=${encodeURIComponent(value)}`)
      setOpen(false)
    }
    // only trigger when debouncedSearch changes
  }, [debouncedSearch])

  const linkClass = ({ isActive }) =>
    `relative text-sm font-bold tracking-wide transition-all duration-300 ${isActive
      ? 'text-primary-600 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary-500'
      : 'text-surface-600 hover:text-primary-500 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary-300 after:transition-all hover:after:w-full'
    }`

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'h-20 glass' : 'h-24 bg-transparent'
        }`}
    >
      <div className="container-app flex h-full items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-2xl text-white shadow-lg shadow-primary-200"
          >
            <GiCookingPot />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-surface-900 group-hover:text-primary-600 transition-colors">
              RecipeHub
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-500">
              Mother's Recipe
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-10 lg:flex">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/categories" className={linkClass}>Categories</NavLink>
          <NavLink to="/recipes" className={linkClass}>Recipes</NavLink>
          <NavLink to="/meal-plans" className={linkClass}>Meal Plans</NavLink>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden w-full max-w-xs xl:block">
          <div className="group relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 transition-colors group-focus-within:text-primary-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full rounded-2xl border border-surface-200 bg-surface-50/50 py-2.5 pl-11 pr-4 text-sm transition-all focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100/50"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {authLoading ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-surface-100 animate-pulse" />
              <div className="hidden lg:flex flex-col">
                <span className="text-sm font-bold text-surface-400">Loading...</span>
              </div>
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <NavLink
                to="/favorites"
                className="hidden sm:flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-200 bg-white text-surface-600 transition-all hover:border-accent-200 hover:bg-accent-50 hover:text-accent-500 active:scale-95 lg:flex"
              >
                <FiHeart size={20} />
              </NavLink>

              <Link
                to="/recipes/create"
                className="btn-primary hidden px-6 py-2.5 sm:flex items-center gap-2"
              >
                <FiPlus className="stroke-[3]" />
                <span className="hidden xl:inline">Create Recipe</span>
              </Link>

              <div className="h-8 w-px bg-surface-200 mx-2 hidden lg:block" />

              <NavLink
                to="/dashboard"
                className="flex items-center gap-2 group"
              >
                <div className="relative">
                  <div className="h-11 w-11 overflow-hidden rounded-2xl border-2 border-primary-100 bg-primary-50 transition-all group-hover:border-primary-400">
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary-600">
                        {user?.name?.[0].toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                </div>
                <div className="hidden flex-col items-start lg:flex">
                  <span className="text-sm font-bold text-surface-900 leading-none">
                    {user?.name || 'My Account'}
                  </span>
                  <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">
                    {isAdmin ? 'Administrator' : 'Home Chef'}
                  </span>
                </div>
                <FiChevronDown className="hidden text-surface-400 lg:block transition-transform group-hover:rotate-180" />
              </NavLink>

              <button
                onClick={logout}
                className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-surface-200 bg-white text-surface-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 lg:flex"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link to="/login" className="text-sm font-bold text-surface-600 hover:text-primary-600 px-4 py-2">
                Log in
              </Link>
              <Link to="/register" className="btn-primary px-8 py-2.5">
                Join Now
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-200 bg-white text-surface-900 transition-all hover:border-primary-200 hover:bg-primary-50 lg:hidden"
            onClick={() => setOpen(!open)}
          >
            <AnimatePresence mode="wait">
              {open ? <FiX key="x" size={24} /> : <FiMenu key="menu" size={24} />}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-surface-100 bg-white shadow-premium lg:hidden"
          >
            <div className="container-app flex flex-col gap-4 py-8">
              <NavLink to="/" onClick={() => setOpen(false)} className="text-xl font-bold text-surface-900">Home</NavLink>
              <NavLink to="/categories" onClick={() => setOpen(false)} className="text-xl font-bold text-surface-900">Categories</NavLink>
              <NavLink to="/recipes" onClick={() => setOpen(false)} className="text-xl font-bold text-surface-900">Recipes</NavLink>
              <NavLink to="/meal-plans" onClick={() => setOpen(false)} className="text-xl font-bold text-surface-900">Meal Plans</NavLink>

              <div className="h-px bg-surface-100 my-2" />

              {!isAuthenticated ? (
                <div className="grid gap-4">
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary text-center">Login</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-center">Join RecipeHub</Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-secondary text-center">Dashboard</Link>
                  <button onClick={logout} className="rounded-2xl bg-red-50 py-4 font-bold text-red-600">Logout</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
