import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiFileText,
  FiFlag,
  FiLayers,
  FiUsers,
  FiTrendingUp,
  FiActivity,
  FiArrowRight
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
  if (Array.isArray(value?.recentRecipes)) return value.recentRecipes
  if (Array.isArray(value?.reports)) return value.reports
  return []
}

function AdminDashboardPage() {
  usePageTitle('Admin — Dashboard')

  const [data, setData] = useState({
    overview: {},
    categories: [],
    reports: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [overviewRes, categoriesRes, reportsRes] = await Promise.all([
          adminApi.dashboardOverview(6),
          adminApi.dashboardCategories(),
          adminApi.dashboardReports()
        ])

        setData({
          overview: overviewRes || {},
          categories: normalizeArray(categoriesRes),
          reports: normalizeArray(reportsRes)
        })
      } catch (error) {
        console.error('Failed to load admin dashboard:', error)
        setData({
          overview: {},
          categories: [],
          reports: []
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
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

  const stats = data?.overview || {}
  const recentRecipes = normalizeArray(stats?.recentRecipes)
  const categoryItems = normalizeArray(data?.categories)

  return (
    <AdminLayout>
      <div className="space-y-12">
        <header className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">
              System Operations
            </span>
            <h1 className="text-5xl font-black tracking-tight text-surface-900">
              Platform Hub
            </h1>
          </div>

          <div className="flex gap-4">
            <Link to="/admin/analytics" className="btn-secondary px-6">
              Detailed Analytics
            </Link>
          </div>
        </header>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<FiUsers />}
            title="Total Users"
            value={stats.totalUsers || 0}
            trend="4"
          />
          <StatCard
            icon={<FiFileText />}
            title="Recipes"
            value={stats.totalRecipes || 0}
            trend="6"
          />
          <StatCard
            icon={<FiLayers />}
            title="Categories"
            value={stats.totalCategories || categoryItems.length || 0}
          />
          <StatCard
            icon={<FiFlag />}
            title="Active Reports"
            value={stats.openReports || stats.totalReports || 0}
            trend="-2"
          />
        </div>

        <div className="grid gap-10 xl:grid-cols-2">
          <section>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-3xl font-black tracking-tight text-surface-900">
                <FiActivity className="text-primary-500" />
                Recent Submissions
              </h2>

              <Link
                to="/admin/recipes"
                className="text-xs font-black uppercase tracking-widest text-primary-500 transition-colors hover:text-primary-600"
              >
                Manage All
              </Link>
            </div>

            <div className="space-y-4">
              {recentRecipes.length === 0 ? (
                <div className="rounded-3xl border border-surface-100 bg-white p-6 text-surface-500">
                  No recent recipes found.
                </div>
              ) : (
                recentRecipes.map((recipe, i) => (
                  <motion.div
                    key={recipe.recipeId || recipe.id || i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="group flex items-center justify-between rounded-3xl border border-surface-100 bg-white p-5 transition-all hover:shadow-soft-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-50 font-black text-surface-900">
                        {recipe?.title?.[0] || 'R'}
                      </div>

                      <div>
                        <p className="font-black text-surface-900 transition-colors group-hover:text-primary-600">
                          {recipe?.title || 'Untitled Recipe'}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">
                            {recipe?.status || 'Unknown'}
                          </span>
                          <div className="h-1 w-1 rounded-full bg-surface-200" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary-500">
                            {recipe?.categoryName || 'General'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/admin/recipes/${recipe?.recipeId || recipe?.id}`}
                      className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-primary-50"
                    >
                      <FiArrowRight className="text-surface-400 group-hover:text-primary-500" />
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          <section>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-3xl font-black tracking-tight text-surface-900">
                <FiTrendingUp className="text-accent-500" />
                Category Pulse
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {categoryItems.length === 0 ? (
                <div className="col-span-2 rounded-3xl border border-surface-100 bg-white p-6 text-surface-500">
                  No category data found.
                </div>
              ) : (
                categoryItems.slice(0, 6).map((item, index) => (
                  <div
                    key={item.categoryId || item.categoryName || index}
                    className="card-premium cursor-default p-6 transition-all hover:border-accent-100"
                  >
                    <p className="font-black tracking-tight text-surface-900">
                      {item.categoryName || 'Unknown Category'}
                    </p>

                    <div className="mt-6 flex items-end justify-between">
                      <span className="text-3xl font-black text-accent-500">
                        {item.recipeCount || 0}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">
                        Recipes
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboardPage