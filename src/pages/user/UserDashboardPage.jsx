import { useEffect, useState } from 'react';
import { FiStar, FiHeart, FiActivity, FiBookmark, FiFileText, FiCalendar, FiArrowRight, FiAward } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import Loader from '../../components/common/Loader';
import RecipeGrid from '../../components/recipe/RecipeGrid';
import { userApi } from '../../api/userApi.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle.jsx';
import Button from '../../components/common/Button';

const UserDashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  usePageTitle('Your Culinary Hub | RecipeHub');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.userId) return;

    setLoading(true);
    userApi.getDashboard(user.userId)
      .then(setDashboard)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.userId]);

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader variant="primary" />
          <p className="mt-6 text-sm font-bold text-surface-400 uppercase tracking-widest animate-pulse">Organizing your kitchen...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-16 pb-20">
        {/* Gourmet Hero Greeting */}
        <header className="relative py-16 px-12 rounded-[3.5rem] bg-surface-950 text-white overflow-hidden shadow-2xl border border-white/5">
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
            >
              <FiAward className="text-accent-400" /> Private Collection
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 leading-tight"
            >
              Welcome back, <br />
              <span className="text-primary-400 italic font-medium">Chef {dashboard?.name ? dashboard.name.split(' ')[0] : 'Member'}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-surface-400 text-lg md:text-xl leading-relaxed font-medium"
            >
              Your culinary narrative continues. Explore your {dashboard?.myRecipesCount || 0} published masterpieces and curated collection of inspirations.
            </motion.p>
          </div>

          {/* Abstract Gourmet Decoration */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none translate-x-1/4 -translate-y-1/4">
            <FiStar size={400} />
          </div>
          <div className="absolute bottom-0 right-0 p-12 opacity-10 pointer-events-none">
            <div className="h-40 w-40 rounded-full border-2 border-white/20 blur-2xl" />
          </div>
        </header>

        {/* Vital Stats */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="h-12 w-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
              <FiActivity size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-surface-900 tracking-tight">Executive Summary</h2>
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em] mt-1">Live updates from your archive</p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <StatCard 
              icon={<FiBookmark />} 
              title="Curated Favorites" 
              value={dashboard?.savedRecipesCount || 0} 
              description="Hand-picked culinary gems"
            />
            <StatCard 
              icon={<FiFileText />} 
              title="Creative Works" 
              value={dashboard?.myRecipesCount || 0} 
              description="Your original contributions"
            />
            <StatCard 
              icon={<FiCalendar />} 
              title="Dining Itinerary" 
              value={dashboard?.mealPlansCount || 0} 
              description="Structured nutrition plans"
            />
          </div>
        </section>

        {/* Quick Access / Recent Favorites */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary-50 flex items-center justify-center text-secondary-600">
                <FiHeart size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-serif font-bold text-surface-900 tracking-tight">Your Inspirations</h2>
                <p className="text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em] mt-1">Recipes saved for later</p>
              </div>
            </div>
            <Link to="/favorites">
              <Button variant="outline" size="sm" icon={<FiArrowRight />}>Explore Archive</Button>
            </Link>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            {dashboard?.favoriteRecipes?.length > 0 ? (
              <RecipeGrid recipes={dashboard.favoriteRecipes} />
            ) : (
              <div className="py-24 text-center rounded-[3rem] border-2 border-dashed border-surface-100 bg-surface-50/50">
                <FiHeart className="mx-auto text-surface-200 mb-6" size={48} />
                <h3 className="text-xl font-serif font-bold text-surface-900 mb-2">Your collection is empty</h3>
                <p className="text-surface-400 text-sm font-medium mb-8">Start saving recipes to build your personal culinary library.</p>
                <Link to="/recipes">
                  <Button variant="primary">Browse Discovery Page</Button>
                </Link>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboardPage;

