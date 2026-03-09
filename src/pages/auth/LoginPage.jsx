import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth.jsx';
import usePageTitle from '../../hooks/usePageTitle.jsx';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const LoginPage = () => {
  usePageTitle('Login');
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form);
      const role = data?.role || data?.user?.role;
      toast.success('Welcome back to the kitchen!');
      navigate(role === 'Admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.title ||
        'Authentication failed'
      );
    }
  };

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 bg-surface-50/50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl grid lg:grid-cols-2 rounded-[2rem] overflow-hidden shadow-premium bg-white border border-surface-200"
        >
          {/* Visual Side */}
          <div className="hidden lg:flex flex-col justify-between p-12 bg-surface-900 relative overflow-hidden text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-600/20" />
            
            {/* Abstract Shapes */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-secondary-500/10 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-widest mb-8 border border-white/10">
                Exclusive Member Access
              </span>
              <h1 className="text-5xl font-serif font-bold leading-tight mb-8">
                Refine Your <br /> 
                <span className="text-primary-400 italic">Culinary</span> <br /> 
                Precision.
              </h1>
              
              <div className="space-y-5 mt-12">
                {[
                  'Access your personal recipe vault',
                  'Cloud-sync meal plans across devices',
                  'Collaborative smart shopping lists'
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 text-surface-300"
                  >
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                      <FiCheckCircle size={14} />
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-surface-900 bg-surface-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="" />
                    </div>
                  ))}
                </div>
                <p className="text-surface-400 text-xs font-semibold">
                  Trusted by <span className="text-white">10,000+</span> Home Chefs
                </p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <header className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-surface-900 tracking-tight mb-3">Welcome Back</h2>
              <p className="text-surface-500 font-medium">Enter your credentials to access your workspace.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-surface-700">Password</label>
                  <Link to="#" className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  icon={<FiLock />}
                  required
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  isLoading={loading}
                  icon={<FiArrowRight />}
                  iconPosition="right"
                >
                  Sign In to Workspace
                </Button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-surface-100 text-center lg:text-left">
              <p className="text-surface-500 text-sm font-medium">
                New to the platform?{' '}
                <Link to="/register" className="text-primary-500 hover:text-primary-600 font-bold ml-1 transition-colors">
                  Create Profile
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default LoginPage;

