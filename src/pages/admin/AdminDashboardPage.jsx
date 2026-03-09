import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFileText,
  FiFlag,
  FiLayers,
  FiUsers,
  FiTrendingUp,
  FiActivity,
  FiArrowRight,
  FiShield,
  FiZap,
  FiClock
} from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import { adminApi } from '../../api/adminApi.jsx';
import usePageTitle from '../../hooks/usePageTitle.jsx';

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const AdminDashboardPage = () => {
  usePageTitle('Executive Console | RecipeHub Administration');

  const [data, setData] = useState({
    overview: {},
    categories: [],
    reports: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [overviewRes, categoriesRes, reportsRes] = await Promise.all([
          adminApi.dashboardOverview(6),
          adminApi.dashboardCategories(),
          adminApi.dashboardReports()
        ]);

        setData({
          overview: overviewRes || {},
          categories: normalizeArray(categoriesRes),
          reports: normalizeArray(reportsRes)
        });
      } catch (error) {
        console.error('Failed to load admin dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader variant="primary" />
          <p className="mt-6 text-sm font-bold text-surface-400 uppercase tracking-widest animate-pulse">Synchronizing Command Center...</p>
        </div>
      </AdminLayout>
    );
  }

  const stats = data?.overview || {};
  const recentRecipes = normalizeArray(stats?.recentRecipes);
  const categoryItems = data?.categories || [];

  return (
    <AdminLayout>
      <div className="space-y-16 pb-20">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-primary-500 mb-2">
              <FiShield size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Executive Authority</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-surface-900 tracking-tight leading-tight">Command Center</h1>
            <p className="mt-3 text-surface-500 text-lg font-medium leading-relaxed">
              Global oversight of the platform's culinary ecosystem and user engagement metrics.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/admin/analytics">
              <Button variant="secondary" size="lg" icon={<FiActivity />}>
                Detailed Insights
              </Button>
            </Link>
          </div>
        </header>

        {/* Executive Summary */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<FiUsers />}
            title="Active Intelligence (Users)"
            value={stats.totalUsers || 0}
            trend="12.5"
            description="Total registered identifiers"
          />
          <StatCard
            icon={<FiFileText />}
            title="Archive Volume (Recipes)"
            value={stats.totalRecipes || 0}
            trend="8.1"
            description="Documented masterpieces"
          />
          <StatCard
            icon={<FiLayers />}
            title="Structural Nodes (Categories)"
            value={stats.totalCategories || categoryItems.length || 0}
            description="Curated classifications"
          />
          <StatCard
            icon={<FiFlag />}
            title="Incident Queue (Reports)"
            value={stats.openReports || 0}
            trend="-14.2"
            description="Active reports requiring review"
          />
        </div>

        <div className="grid gap-12 xl:grid-cols-[1fr,400px]">
          {/* Main Activity Feed */}
          <section className="space-y-10">
            <div className="flex items-center justify-between border-b border-surface-100 pb-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-1.5 bg-primary-500 rounded-full" />
                <h2 className="text-3xl font-serif font-bold text-surface-900 tracking-tight">Recent Archives</h2>
              </div>
              <Link to="/admin/recipes">
                <Button variant="ghost" size="sm" icon={<FiArrowRight />}>
                  Manage All
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {recentRecipes.length === 0 ? (
                  <div className="py-20 text-center rounded-[3rem] border-2 border-dashed border-surface-100 grayscale opacity-40">
                    <FiFileText className="mx-auto text-surface-100 mb-4" size={48} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">No Recent Submissions</p>
                  </div>
                ) : (
                  recentRecipes.map((recipe, i) => (
                    <motion.div
                      key={recipe.recipeId || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group flex items-center justify-between rounded-[2.5rem] border border-surface-100 bg-white p-6 transition-all hover:shadow-premium hover:border-primary-100"
                    >
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-surface-50 flex items-center justify-center font-serif font-bold text-2xl text-surface-400 border border-surface-100 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                          {recipe?.title?.[0] || 'R'}
                        </div>
                        <div>
                          <p className="text-lg font-serif font-bold text-surface-900 group-hover:text-primary-600 transition-colors leading-tight">
                            {recipe?.title || 'Untitled Masterpiece'}
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${recipe?.status === 'Published' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                              {recipe?.status || 'Archived'}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-surface-200" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-primary-500 flex items-center gap-1">
                              <FiLayers size={10} /> {recipe?.categoryName || 'General'}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-surface-200" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-surface-400 flex items-center gap-1">
                              <FiClock size={10} /> {new Date().toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link to={`/admin/recipes/${recipe?.recipeId}`}>
                        <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-surface-50 text-surface-400 group-hover:bg-primary-500 group-hover:text-white group-hover:rotate-45 transition-all duration-500">
                          <FiArrowRight size={20} />
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Sidebar Insights */}
          <aside className="space-y-12">
            <section className="space-y-8">
              <div className="flex items-center gap-3 text-surface-900">
                <FiTrendingUp className="text-primary-500" />
                <h2 className="text-xl font-serif font-bold tracking-tight">Category Distribution</h2>
              </div>

              <div className="space-y-4">
                {categoryItems.slice(0, 5).map((item, index) => (
                  <div
                    key={item.categoryId || index}
                    className="p-6 rounded-[2rem] bg-surface-950 text-white border border-white/5 shadow-xl relative overflow-hidden group"
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-500 mb-1">Classification</p>
                        <h4 className="font-serif font-bold text-lg leading-tight group-hover:text-primary-400 transition-colors">
                          {item.categoryName}
                        </h4>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-serif font-bold text-primary-400">{item.recipeCount || 0}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-surface-500 mt-1">Units</p>
                      </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 h-24 w-24 bg-primary-500/5 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-all duration-700" />
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-primary-50 rounded-[3rem] p-10 border border-primary-100">
               <div className="flex items-center gap-3 text-primary-600 mb-6">
                  <FiZap />
                  <h3 className="text-sm font-bold uppercase tracking-widest">Rapid Response</h3>
               </div>
               <div className="space-y-3">
                  <Button variant="secondary" className="w-full justify-start bg-white" icon={<FiUsers />}>Audit Personnel</Button>
                  <Button variant="secondary" className="w-full justify-start bg-white" icon={<FiFlag />}>Review Reports</Button>
               </div>
            </section>
          </aside>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;