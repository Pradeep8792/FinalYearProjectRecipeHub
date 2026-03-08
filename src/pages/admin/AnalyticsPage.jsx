import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiTrendingUp,
  FiPieChart,
  FiUsers,
  FiFileText,
  FiFlag,
  FiArrowUpRight
} from 'react-icons/fi'
import AdminLayout from '../../components/layout/AdminLayout'
import Loader from '../../components/common/Loader'
import StatCard from '../../components/common/StatCard'
import { adminApi } from '../../api/adminApi.jsx'
import usePageTitle from '../../hooks/usePageTitle.jsx'

function normalizeArray(value) {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.categories)) return value.categories
  if (Array.isArray(value?.reports)) return value.reports
  if (Array.isArray(value?.recipes)) return value.recipes
  return []
}

function AnalyticsPage() {
  usePageTitle('Admin — Analytics')

  const [analytics, setAnalytics] = useState({
    overview: {},
    categories: [],
    reports: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [overview, categories, reports] = await Promise.all([
          adminApi.analyticsOverview(),
          adminApi.analyticsCategories(),
          adminApi.analyticsReports()
        ])

        setAnalytics({
          overview: overview || {},
          categories: normalizeArray(categories),
          reports: normalizeArray(reports)
        })
      } catch (error) {
        console.error('Failed to load analytics:', error)
        setAnalytics({
          overview: {},
          categories: [],
          reports: []
        })
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      </AdminLayout>
    )
  }

  const overview = analytics?.overview || {}
  const categories = normalizeArray(analytics?.categories)
  const totalRecipes = overview?.totalRecipes || 1

  return (
    <AdminLayout>
      <div className="space-y-12">
        <header>
          <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">
            Enterprise Analytics
          </span>
          <h1 className="text-5xl font-black tracking-tight text-surface-900">
            Platform Insights
          </h1>
          <p className="mt-2 text-lg font-medium text-surface-500">
            Real-time data on user engagement, content growth, and moderation.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          <StatCard
            icon={<FiUsers />}
            title="Active Community"
            value={overview?.totalUsers || 0}
            trend="15"
            subtitle="Total registered users"
          />
          <StatCard
            icon={<FiFileText />}
            title="Content Library"
            value={overview?.totalRecipes || 0}
            trend="8"
            subtitle="Verified sharing recipes"
          />
          <StatCard
            icon={<FiFlag />}
            title="Moderation Load"
            value={overview?.totalReports || 0}
            trend="-5"
            subtitle="Open user reports"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card-premium">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="flex items-center gap-3 text-2xl font-black tracking-tight text-surface-900">
                <FiPieChart className="text-primary-500" />
                Cuisine Distribution
              </h3>
              <button className="text-xs font-black uppercase tracking-widest text-primary-500">
                Details
              </button>
            </div>

            <div className="space-y-6">
              {categories.length === 0 ? (
                <div className="rounded-2xl bg-surface-50 p-6 text-surface-500">
                  No category analytics found.
                </div>
              ) : (
                categories.map((cat, i) => (
                  <div key={cat.categoryId || cat.categoryName || i} className="group">
                    <div className="mb-2 flex justify-between">
                      <span className="font-bold text-surface-700">
                        {cat.categoryName || 'Unknown'}
                      </span>
                      <span className="text-xs font-black text-surface-400">
                        {cat.recipeCount || 0}
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-50">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${((cat.recipeCount || 0) / totalRecipes) * 100}%`
                        }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card-premium border-surface-800 bg-surface-900 text-white">
            <div className="mb-10 flex items-center justify-between">
              <h3 className="flex items-center gap-3 text-2xl font-black tracking-tight">
                <FiTrendingUp className="text-primary-400" />
                Growth Trajectory
              </h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all group-hover:bg-primary-500">
                <FiArrowUpRight />
              </div>
            </div>

            <div className="mb-8 flex h-48 items-end gap-2">
              {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${val}%` }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                  className="flex-1 rounded-t-lg bg-primary-500/20 transition-all hover:bg-primary-500"
                />
              ))}
            </div>

            <p className="text-sm font-medium leading-relaxed text-surface-400">
              High velocity detected in <span className="font-black text-white">Italian</span> and{' '}
              <span className="font-black text-white">Vegan</span> categories over the last 30 days.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AnalyticsPage