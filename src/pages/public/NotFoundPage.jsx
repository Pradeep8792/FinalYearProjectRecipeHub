import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiSearch, FiArrowLeft } from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/common/Button';
import usePageTitle from '../../hooks/usePageTitle.jsx';

const NotFoundPage = () => {
  usePageTitle('Page Not Found | RecipeHub');

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-24 px-4 bg-surface-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg w-full text-center"
        >
          {/* Big 404 number */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative mb-8"
          >
            <span className="text-[180px] font-serif font-black text-surface-100 leading-none select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-primary-500/10 flex items-center justify-center">
                <FiSearch className="text-primary-500" size={40} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 mb-10"
          >
            <h1 className="text-4xl font-serif font-bold text-surface-900 tracking-tight">
              Page Not Found
            </h1>
            <p className="text-surface-500 text-lg leading-relaxed">
              The page you're looking for has moved, been deleted, or never existed.
              Let's get you back on track.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/">
              <Button variant="primary" size="lg" icon={<FiHome />}>
                Back to Home
              </Button>
            </Link>
            <Link to="/recipes">
              <Button variant="secondary" size="lg" icon={<FiSearch />}>
                Explore Recipes
              </Button>
            </Link>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex items-center justify-center gap-4"
          >
            <div className="h-px flex-1 bg-surface-200" />
            <span className="text-xs font-bold text-surface-300 uppercase tracking-widest px-4">
              RecipeHub
            </span>
            <div className="h-px flex-1 bg-surface-200" />
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default NotFoundPage;
