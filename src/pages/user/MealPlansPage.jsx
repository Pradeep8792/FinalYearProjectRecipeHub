import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCalendar, FiPlus, FiTrash2, FiClock, FiCoffee, FiSun, FiMoon, FiZap } from 'react-icons/fi'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { mealPlanApi } from '../../api/mealPlanApi.jsx'
import { recipeApi } from '../../api/recipeApi.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import usePageTitle from '../../hooks/usePageTitle.jsx'
import Loader from '../../components/common/Loader'

function MealPlansPage() {
  const { user, loading: authLoading } = useAuth()
  usePageTitle('Meal Plans')
  const [plans, setPlans] = useState([])
  const [recipes, setRecipes] = useState([])
  const [form, setForm] = useState({ recipeId: '', mealDate: '', mealType: 'Breakfast' })
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      if (!user?.userId) return
      const [planData, recipeData] = await Promise.all([
        mealPlanApi.getByUser(user.userId),
        recipeApi.getByUser(user.userId)
      ])
      setPlans(planData)
      setRecipes(recipeData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user?.userId) return
    loadData()
  }, [user?.userId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await mealPlanApi.create({
        userId: user.userId,
        recipeId: Number(form.recipeId),
        mealDate: form.mealDate,
        mealType: form.mealType
      })
      toast.success('Strategy updated: Meal added')
      setForm({ recipeId: '', mealDate: '', mealType: 'Breakfast' })
      loadData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not schedule meal')
    }
  }

  const handleDelete = async (planId) => {
    try {
      await mealPlanApi.remove(planId)
      toast.success('Schedule refined: Meal removed')
      loadData()
    } catch {
      toast.error('Could not modify schedule')
    }
  }

  const getMealIcon = (type) => {
    switch (type) {
      case 'Breakfast': return <FiCoffee />
      case 'Lunch': return <FiSun />
      case 'Dinner': return <FiMoon />
      default: return <FiZap />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-primary-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">Meal Strategy</span>
              <h1 className="text-5xl font-black text-surface-900 tracking-tighter">
                Culinary Schedule
              </h1>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-100 text-surface-600 font-bold text-sm">
            <FiCalendar />
            Week of {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-8"
        >
          <h3 className="text-xl font-black text-surface-900 tracking-tight mb-8">Schedule New Entry</h3>
          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-4 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Select Dish</label>
              <select
                className="w-full h-12 px-4 rounded-xl bg-surface-50 border border-surface-100 text-surface-900 font-bold focus:border-primary-500 focus:outline-none transition-all appearance-none"
                value={form.recipeId}
                onChange={(e) => setForm({ ...form, recipeId: e.target.value })}
                required
              >
                <option value="">Personal Vault...</option>
                {recipes.map((recipe) => (
                  <option key={recipe.recipeId} value={recipe.recipeId}>{recipe.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Target Date</label>
              <input
                className="w-full h-12 px-4 rounded-xl bg-surface-50 border border-surface-100 text-surface-900 font-bold focus:border-primary-500 focus:outline-none transition-all"
                type="date"
                value={form.mealDate}
                onChange={(e) => setForm({ ...form, mealDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Meal Window</label>
              <select
                className="w-full h-12 px-4 rounded-xl bg-surface-50 border border-surface-100 text-surface-900 font-bold focus:border-primary-500 focus:outline-none transition-all appearance-none"
                value={form.mealType}
                onChange={(e) => setForm({ ...form, mealType: e.target.value })}
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
              </select>
            </div>

            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-surface-900 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-600 transition-all shadow-lg"
            >
              <FiPlus />
              Add to Plan
            </button>
          </form>
        </motion.section>

        <div className="space-y-8">
          <h2 className="text-3xl font-black text-surface-900 tracking-tight flex items-center gap-4">
            <div className="h-1 w-12 bg-primary-500 rounded-full" />
            Planned Engagements
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.planId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-[2.5rem] border border-surface-100 p-8 shadow-soft-xl hover:border-primary-200 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8">
                    <button
                      onClick={() => handleDelete(plan.planId)}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-primary-50 text-primary-600">
                      {getMealIcon(plan.mealType)}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary-500">{plan.mealType}</p>
                      <div className="flex items-center gap-2 text-surface-400 text-xs font-bold mt-1">
                        <FiCalendar />
                        {new Date(plan.mealDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xl font-black text-surface-900 tracking-tight mb-4 group-hover:text-primary-600 transition-colors">
                    {plan.recipeTitle || plan.title}
                  </h4>

                  <div className="pt-6 border-t border-surface-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-surface-400 text-[10px] font-black uppercase tracking-widest">
                      <FiClock />
                      Execution ready
                    </div>
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {plans.length === 0 && !loading && (
              <div className="col-span-full py-24 text-center border-2 border-dashed border-surface-100 rounded-[3rem]">
                <FiCalendar className="mx-auto text-surface-100 mb-6" size={64} />
                <h3 className="text-2xl font-black text-surface-300">Strategy sequence empty.</h3>
                <p className="text-surface-400 font-medium mt-2">Begin by scheduling your first culinary engagement.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MealPlansPage
