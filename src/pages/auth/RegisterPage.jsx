import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiLock, FiMail, FiUser, FiArrowRight, FiActivity, FiGlobe, FiShield } from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth.jsx';
import usePageTitle from '../../hooks/usePageTitle.jsx';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const RegisterPage = () => {
  usePageTitle('Register');
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success('Account created! Welcome to the culinary collective.');
      navigate('/login');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.title ||
        'Registration failed'
      );
    }
  };

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 bg-surface-50/50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-6xl grid lg:grid-cols-2 rounded-[2.5rem] overflow-hidden shadow-premium bg-white border border-surface-200"
        >
          {/* Form Side */}
          <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center order-2 lg:order-1">
            <header className="mb-10">
              <h2 className="text-3xl font-bold text-surface-900 tracking-tight mb-3">Join the Collective</h2>
              <p className="text-surface-500 font-medium">Create your professional profile and start your journey.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                name="name"
                placeholder="Chef Auguste Escoffier"
                value={form.name}
                onChange={handleChange}
                icon={<FiUser />}
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="chef@recipehub.com"
                value={form.email}
                onChange={handleChange}
                icon={<FiMail />}
                required
              />

              <Input
                label="Create Password"
                type="password"
                name="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                icon={<FiLock />}
                required
              />

              <div className="pt-4">
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  isLoading={loading}
                  icon={<FiArrowRight />}
                  iconPosition="right"
                  className="h-14"
                >
                  Create Your Identity
                </Button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-surface-100 text-center">
              <p className="text-surface-500 text-sm font-medium">
                Already part of the community?{' '}
                <Link to="/login" className="text-primary-500 hover:text-primary-600 font-bold ml-1 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Visual Side */}
          <div className="hidden lg:flex flex-col justify-between p-16 bg-surface-900 relative overflow-hidden order-1 lg:order-2 text-white">
            <div className="absolute inset-0 bg-gradient-to-bl from-secondary-600/20 to-primary-600/20" />
            
            {/* Animated Glow */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary-500 blur-[100px]" 
            />

            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-accent-500/10 text-accent-400 text-[10px] font-bold uppercase tracking-widest mb-8 border border-accent-500/20">
                New Enrollment
              </span>
              <h1 className="text-6xl font-serif font-bold leading-tight mb-8">
                Unleash <br /> 
                <span className="text-secondary-400 italic">Gourmet</span> <br /> 
                Excellence.
              </h1>

              <div className="grid grid-cols-2 gap-y-10 gap-x-8 mt-16">
                {[
                  { icon: <FiGlobe />, title: 'Global Palette', desc: 'Discover dishes from every corner.' },
                  { icon: <FiActivity />, title: 'Meal Mastery', desc: 'Precision planning for every week.' },
                  { icon: <FiShield />, title: 'Chef Verified', desc: 'Community curated excellence.' },
                  { icon: <FiArrowRight />, title: 'And More', desc: 'Tools designed for professionals.' }
                ].map((item, i) => (
                  <div key={i} className="space-y-3 group">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-secondary-400 border border-white/5 group-hover:bg-primary-500/20 transition-colors">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-white text-[11px] uppercase tracking-widest">{item.title}</h4>
                    <p className="text-surface-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-12 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[10, 11, 12, 13].map(i => (
                    <div key={i} className="h-9 w-9 rounded-full border-2 border-surface-900 bg-surface-800 overflow-hidden ring-2 ring-transparent group-hover:ring-primary-500/50 transition-all">
                      <img src={`https://i.pravatar.cc/100?img=${i}`} alt="" />
                    </div>
                  ))}
                </div>
                <p className="text-surface-400 text-xs font-semibold">Joined by <span className="text-white">120 chefs</span> today</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default RegisterPage;

