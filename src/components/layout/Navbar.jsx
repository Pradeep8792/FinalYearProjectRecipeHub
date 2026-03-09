import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiHeart, FiLogOut, FiMenu, FiSearch, FiUser, FiX, FiPlus, FiChevronDown, FiGrid } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { GiCookingPot } from 'react-icons/gi';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';

const Navbar = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, user, loading: authLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/recipes?search=${encodeURIComponent(search.trim())}`);
    setOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/categories', label: 'Categories' },
    { to: '/recipes', label: 'Recipes' },
    { to: '/about', label: 'About' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'h-16 bg-[#F4EDE4]/95 backdrop-blur-md shadow-sm' : 'h-20 bg-[#F4EDE4]'
      }`}
    >
      <div className="container-app h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="flex h-10 w-10 items-center justify-center text-[#FF6A00] group-hover:rotate-6 transition-transform">
            <GiCookingPot size={32} />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-[#FF6A00]">RecipeHub</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center justify-center gap-2 flex-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                px-4 py-2 text-sm font-bold transition-all
                ${isActive ? 'text-[#FF6A00]' : 'text-[#E65C00] hover:text-[#FF6A00]'}
              `}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 justify-end shrink-0">

          {authLoading ? (
            <div className="h-10 w-10 rounded-full bg-surface-100 animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-6">
              <Link to="/recipes/create" className="hidden xl:block text-white bg-[#FF6A00] hover:bg-[#E65C00] px-6 py-2.5 rounded-full font-bold shadow-md shadow-[#FF6A00]/20 transition-all">
                + Create
              </Link>
              
              <div className="relative flex items-center gap-3">
                <span className="hidden sm:block text-sm font-bold text-[#E65C00]">{user?.name || 'John User'}</span>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#FF6A00]/30 transition-all focus:outline-none"
                >
                  <div className="h-10 w-10 rounded-full bg-[#FF6A00] text-white flex items-center justify-center font-bold text-lg overflow-hidden shadow-sm">
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      user?.name?.[0].toUpperCase() || 'U'
                    )}
                  </div>
                  <FiChevronDown className={`text-surface-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 rounded-2xl bg-white border border-surface-200 shadow-xl z-20 overflow-hidden"
                      >
                        <div className="p-4 border-b border-surface-100 bg-surface-50/50">
                          <p className="text-sm font-bold text-surface-900 truncate">{user?.name || 'User'}</p>
                          <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">
                            {isAdmin ? 'Administrator' : 'Premium Member'}
                          </p>
                        </div>
                        <div className="p-2">
                          {isAdmin ? (
                            <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-surface-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all">
                              <FiGrid /> Admin Console
                            </Link>
                          ) : (
                            <Link to="/dashboard" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-surface-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all">
                              <FiGrid /> Dashboard
                            </Link>
                          )}
                          <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-surface-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all">
                            <FiUser /> Profile Settings
                          </Link>
                          <div className="h-px bg-surface-100 my-2 mx-2" />
                          <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold text-danger hover:bg-red-50 rounded-xl transition-all">
                            <FiLogOut /> Log out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-surface-900 border border-surface-200 rounded-xl hover:bg-surface-50 transition-all font-bold"
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-white lg:hidden"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-500 text-white">
                    <GiCookingPot size={24} />
                  </div>
                  <span className="text-xl font-bold">RecipeHub</span>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 rounded-xl bg-surface-100">
                  <FiX size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-1 mb-8">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) => `
                      px-4 py-4 rounded-xl text-lg font-bold transition-all
                      ${isActive ? 'bg-primary-50 text-primary-600' : 'text-surface-900 hover:bg-surface-50'}
                    `}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className="mt-auto space-y-3">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="block w-full">
                      <Button variant="secondary" fullWidth className="py-4">Log in</Button>
                    </Link>
                    <Link to="/register" onClick={() => setOpen(false)} className="block w-full">
                      <Button variant="primary" fullWidth className="py-4">Join Community</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    {isAdmin ? (
                      <Link to="/admin" onClick={() => setOpen(false)} className="block w-full">
                        <Button variant="secondary" fullWidth className="py-4">Admin Console</Button>
                      </Link>
                    ) : (
                      <Link to="/dashboard" onClick={() => setOpen(false)} className="block w-full">
                        <Button variant="secondary" fullWidth className="py-4">Dashboard</Button>
                      </Link>
                    )}
                    <button onClick={logout} className="w-full py-4 text-danger font-bold text-center bg-red-50 rounded-2xl">
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

