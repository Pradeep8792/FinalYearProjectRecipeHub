import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTrendingUp,
  FiPieChart,
  FiUsers,
  FiFileText,
  FiFlag,
  FiArrowUpRight,
  FiActivity,
  FiRefreshCw,
  FiCalendar,
  FiZap
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

const AnalyticsPage = () => {
  usePageTitle('Advanced Analytics | Executive Console');

  const [analytics, setAnalytics] = useState({
    overview: {},
    categories: [],
    reports: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overview, categories, reports] = await Promise.all([
        adminApi.analyticsOverview(),
        adminApi.analyticsCategories(),
        adminApi.analyticsReports()
      ]);

      setAnalytics({
        overview: overview || {},
        categories: normalizeArray(categories),
        reports: normalizeArray(reports)
      });
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(err?.message || 'Synchronization failure in data stream');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader variant="primary" />
          <p className="mt-6 text-sm font-bold text-surface-400 uppercase tracking-widest animate-pulse">Aggregating Global Metrics...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40">
           <div className="bg-white rounded-[3rem] border border-surface-200 shadow-premium p-12 max-w-lg text-center">
             <div className="h-20 w-20 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-8">
                <FiRefreshCw size={32} className="animate-spin-slow" />
             </div>
             <h3 className="text-3xl font-serif font-bold text-surface-900 mb-4">Metric Disruption</h3>
             <p className="text-surface-500 font-medium mb-10 leading-relaxed">{error}</p>
             <Button variant="primary" size="lg" onClick={loadAnalytics} icon={<FiRefreshCw />}>Re-establish Connection</Button>
           </div>
        </div>
      </AdminLayout>
    );
  }

  const overview = analytics?.overview || {};
  const categories = analytics?.categories || [];
  const totalRecipes = overview?.totalRecipes || 1;

  return (
    <AdminLayout>
      <div className="space-y-16 pb-20">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-primary-500 mb-2">
              <FiActivity size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Intelligence Stream</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-surface-900 tracking-tight leading-tight">Data Insights</h1>
            <p className="mt-3 text-surface-500 text-lg font-medium leading-relaxed">
              Deep-dive metrics into content distribution, user growth trajectories, and operational efficiency.
            </p>
          </div>

          <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white border border-surface-200 shadow-sm">
             <FiCalendar className="text-primary-500" />
             <span className="text-sm font-bold text-surface-600">Cycle: Last 30 Days</span>
          </div>
        </header>

        {/* Global Key Metrics */}
        <div className="grid gap-8 md:grid-cols-3">
          <StatCard
            icon={<FiUsers />}
            title="Community Density"
            value={overview?.totalUsers || 0}
            trend="14.2"
            description="Active user accounts globally"
          />
          <StatCard
            icon={<FiFileText />}
            title="Archive Saturation"
            value={overview?.totalRecipes || 0}
            trend="9.8"
            description="Verified culinary documents"
          />
          <StatCard
            icon={<FiFlag />}
            title="Operational Load"
            value={overview?.totalReports || 0}
            trend="-22.5"
            description="Pending moderation queue"
          />
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Distribution Visualization */}
          <section className="bg-white rounded-[4rem] border border-surface-200 shadow-premium p-12">
            <header className="mb-12 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 text-primary-500 mb-2">
                  <FiPieChart />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Structural Analysis</span>
                </div>
                <h3 className="text-3xl font-serif font-bold text-surface-900 tracking-tight">Cuisine Density</h3>
              </div>
              <Button variant="ghost" size="sm" icon={<FiZap />}>Details</Button>
            </header>

            <div className="space-y-8">
              {categories.length === 0 ? (
                <div className="py-20 text-center grayscale opacity-40">
                  <FiPieChart className="mx-auto text-surface-100 mb-4" size={48} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No Category Data Stream</p>
                </div>
              ) : (
                categories.slice(0, 6).map((cat, i) => (
                  <div key={cat.categoryId || i} className="group">
                    <div className="mb-3 flex justify-between items-end">
                      <span className="font-serif font-bold text-lg text-surface-800 group-hover:text-primary-600 transition-colors">
                        {cat.categoryName}
                      </span>
                      <div className="text-right">
                        <span className="text-xl font-serif font-bold text-primary-500">
                          {cat.recipeCount}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-surface-400 ml-2">Units</span>
                      </div>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-50 border border-surface-100 p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${((cat.recipeCount || 0) / totalRecipes) * 100}%`
                        }}
                        transition={{ duration: 1.5, ease: "circOut", delay: i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 shadow-[0_0_12px_rgba(234,88,12,0.2)]"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Velocity Visualization */}
          <section className="bg-surface-950 rounded-[4rem] border border-white/5 shadow-2xl p-12 text-white relative overflow-hidden group">
            <header className="mb-12 flex items-center justify-between relative z-10">
              <div>
                <div className="flex items-center gap-3 text-primary-400 mb-2">
                  <FiTrendingUp />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Velocity Metrics</span>
                </div>
                <h3 className="text-3xl font-serif font-bold tracking-tight">Growth Trajectory</h3>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary-400 border border-white/10 group-hover:bg-primary-500 group-hover:text-white group-hover:rotate-45 transition-all duration-700">
                <FiArrowUpRight size={24} />
              </div>
            </header>

            <div className="mb-12 flex h-48 items-end gap-3 relative z-10">
              {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${val}%` }}
                  transition={{ duration: 1.5, ease: "backOut", delay: i * 0.05 }}
                  className="flex-1 rounded-t-xl bg-white/5 transition-all hover:bg-primary-500 relative group/bar"
                >
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-primary-600 px-2 py-1 rounded-lg">
                      +{val}%
                   </div>
                </motion.div>
              ))}
            </div>

            <div className="relative z-10 space-y-4">
              <p className="text-lg font-serif font-medium leading-relaxed text-surface-300">
                Performance audit detects high velocity in <span className="text-primary-400 font-bold italic underline underline-offset-4 decoration-primary-400/30">Mediterranean</span> and{' '}
                <span className="text-primary-400 font-bold italic underline underline-offset-4 decoration-primary-400/30">Sustainable Plant-Based</span> vectors over the current cycle.
              </p>
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-surface-500 pt-6">
                 <FiZap className="text-success" />
                 Optimization recommended for highlighted sectors
              </div>
            </div>

            <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-all duration-700" />
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;