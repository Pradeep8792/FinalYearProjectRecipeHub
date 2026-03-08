import { useEffect, useState } from 'react'
import { FiStar, FiHeart, FiActivity, FiBookmark, FiFileText, FiCalendar } from 'react-icons/fi'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/common/StatCard'
import Loader from '../../components/common/Loader'
import RecipeGrid from '../../components/recipe/RecipeGrid'
import { userApi } from '../../api/userApi.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { motion } from 'framer-motion'
import usePageTitle from '../../hooks/usePageTitle.jsx'


function UserDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  usePageTitle('Dashboard')
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return

    setLoading(true)
    userApi.getDashboard(user.userId)
      .then(setDashboard)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.userId])

  if (authLoading) return <DashboardLayout><div className="flex justify-center py-20"><Loader /></div></DashboardLayout>
  if (loading) return <DashboardLayout><div className="flex justify-center py-20"><Loader /></div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="space-y-12">
        <header className="relative py-12 px-10 rounded-[3rem] bg-gradient-to-br from-surface-900 to-surface-800 text-white overflow-hidden shadow-premium">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              Personal Workspace
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Master Chef {dashboard?.name ? dashboard.name.split(' ')[0] : 'Chef'} 🍳
            </h1>
            <p className="text-surface-400 text-lg md:text-xl max-w-xl leading-relaxed">
              Your culinary journey is blossoming. You have {dashboard?.myRecipesCount || 0} published creations and a growing community of fans.
            </p>
          </div>

          {/* Abstract Decoration */}
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 translate-x-1/2 -translate-y-1/2">
            <FiStar size={300} />
          </div>
        </header>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
              <FiActivity size={20} />
            </div>
            <h2 className="text-3xl font-black text-surface-900 tracking-tight">Activity Overview</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <StatCard icon={<FiBookmark />} title="Saved Recipes" value={dashboard?.savedRecipesCount || 0} trend="12" />
            <StatCard icon={<FiFileText />} title="My Recipes" value={dashboard?.myRecipesCount || 0} trend="5" />
            <StatCard icon={<FiCalendar />} title="Meal Plans" value={dashboard?.mealPlansCount || 0} trend="2" />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-500">
                <FiHeart size={20} />
              </div>
              <h2 className="text-3xl font-black text-surface-900 tracking-tight">Your Favorites</h2>
            </div>
            <button className="text-sm font-bold text-primary-500 hover:text-primary-600 transition-colors">View All saved</button>
          </div>

          <div className="mt-8">
            <RecipeGrid recipes={dashboard?.favoriteRecipes || []} />
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default UserDashboardPage
