import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiPlus, FiTrash2, FiClock, FiCoffee, FiSun, FiMoon, FiZap, FiTarget, FiMap } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { mealPlanApi } from '../../api/mealPlanApi.jsx';
import { recipeApi } from '../../api/recipeApi.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import usePageTitle from '../../hooks/usePageTitle.jsx';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const MealPlansPage = () => {
  const { user, loading: authLoading } = useAuth();
  usePageTitle('Meal Plans | RecipeHub');
  const [plans, setPlans] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({ recipeId: '', mealDate: '', mealType: 'Breakfast' });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      if (!user?.userId) return;
      const [planData, recipeData] = await Promise.all([
        mealPlanApi.getByUser(user.userId),
        recipeApi.getByUser(user.userId)
      ]);
      setPlans(planData);
      setRecipes(recipeData);
    } catch (error) {
      console.error('Failed to load meal strategy', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.userId) return;
    loadData();
  }, [user?.userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await mealPlanApi.create({
        userId: user.userId,
        recipeId: Number(form.recipeId),
        mealDate: form.mealDate,
        mealType: form.mealType
      });
      toast.success('Meal added to your plan!');
      setForm({ recipeId: '', mealDate: '', mealType: 'Breakfast' });
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not schedule meal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (planId) => {
    try {
      await mealPlanApi.remove(planId);
      toast.success('Meal plan entry removed');
      loadData();
    } catch {
      toast.error('Could not remove meal plan entry');
    }
  };

  const getMealIcon = (type) => {
    switch (type) {
      case 'Breakfast': return <FiCoffee />;
      case 'Lunch': return <FiSun />;
      case 'Dinner': return <FiMoon />;
      default: return <FiZap />;
    }
  };

  if (authLoading || (loading && plans.length === 0)) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader variant="primary" />
          <p className="mt-6 text-sm font-bold text-surface-400 uppercase tracking-widest animate-pulse">Drafting your itinerary...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-16 pb-24">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-primary-500 mb-2">
              <FiMap size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Meal Planning</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-surface-900 tracking-tight leading-tight">Meal Plans</h1>
            <p className="mt-3 text-surface-500 text-lg font-medium leading-relaxed">
              Plan your meals for the week and stay on track with your diet.
            </p>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-surface-200 shadow-sm text-surface-600 font-bold text-sm">
            <FiCalendar className="text-primary-500" />
            <span>Today: {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        {/* Scheduling Engine */}
        <section className="bg-surface-950 rounded-[3rem] p-10 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <FiPlus size={200} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10 text-primary-400">
              <FiTarget size={20} />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Schedule a Meal</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-4 items-end">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 ml-1">Recipe</label>
                <div className="relative">
                  <select
                    className="w-full h-14 pl-5 pr-10 rounded-2xl bg-white/5 border border-white/10 text-white font-bold focus:bg-white/10 focus:border-primary-500 focus:outline-none transition-all appearance-none cursor-pointer"
                    value={form.recipeId}
                    onChange={(e) => setForm({ ...form, recipeId: e.target.value })}
                    required
                  >
                    <option value="" className="bg-surface-900">Choose a recipe...</option>
                    {recipes.map((recipe) => (
                      <option key={recipe.recipeId} value={recipe.recipeId} className="bg-surface-900">{recipe.title}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-500">
                     <FiPlus />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 ml-1">Date</label>
                <input
                  className="w-full h-14 px-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold focus:bg-white/10 focus:border-primary-500 focus:outline-none transition-all cursor-pointer [color-scheme:dark]"
                  type="date"
                  value={form.mealDate}
                  onChange={(e) => setForm({ ...form, mealDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-surface-400 ml-1">Meal Type</label>
                <div className="relative">
                  <select
                    className="w-full h-14 pl-5 pr-10 rounded-2xl bg-white/5 border border-white/10 text-white font-bold focus:bg-white/10 focus:border-primary-500 focus:outline-none transition-all appearance-none cursor-pointer"
                    value={form.mealType}
                    onChange={(e) => setForm({ ...form, mealType: e.target.value })}
                  >
                    <option className="bg-surface-900">Breakfast</option>
                    <option className="bg-surface-900">Lunch</option>
                    <option className="bg-surface-900">Dinner</option>
                    <option className="bg-surface-900">Snack</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-500">
                     <FiPlus />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                icon={<FiPlus />}
                className="w-full h-14 shadow-xl shadow-primary-500/10"
              >
                Add to Plan
              </Button>
            </form>
          </div>
        </section>

        {/* Itinerary Display */}
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-12 bg-primary-500 rounded-full" />
            <h2 className="text-2xl font-serif font-bold text-surface-900 tracking-tight">Your Meal Plans</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.planId}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, opacity: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-[3rem] border border-surface-200 p-10 shadow-soft-xl hover:border-primary-300 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8">
                    <button
                      onClick={() => handleDelete(plan.planId)}
                      className="h-10 w-10 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white transform group-hover:scale-110"
                      title="Remove from itinerary"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center text-2xl shadow-sm border border-primary-100">
                      {getMealIcon(plan.mealType)}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary-500">{plan.mealType}</p>
                      <div className="flex items-center gap-2 text-surface-400 text-xs font-bold mt-1.5 uppercase tracking-tighter">
                        <FiCalendar className="text-surface-300" />
                        {new Date(plan.mealDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-2xl font-serif font-bold text-surface-900 tracking-tight mb-6 group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[4rem]">
                    {plan.recipeTitle || plan.title}
                  </h4>

                  <div className="pt-8 border-t border-surface-100 flex items-center justify-between">
                    <Link to={`/recipes/${plan.recipeId}`} className="text-[10px] font-bold uppercase tracking-widest text-surface-400 hover:text-primary-500 transition-colors flex items-center gap-2">
                      <FiClock /> View Procedure
                    </Link>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold text-success uppercase tracking-widest">Scheduled</span>
                       <span className="h-2 w-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {plans.length === 0 && !loading && (
              <div className="col-span-full py-32 text-center border-2 border-dashed border-surface-100 rounded-[4rem] grayscale opacity-40">
                <FiCalendar className="mx-auto text-surface-100 mb-6" size={80} />
                <h3 className="text-xl font-serif font-bold text-surface-900 mb-2">No meal plans yet</h3>
                <p className="text-surface-400 font-medium max-w-xs mx-auto">Start planning your meals by scheduling a recipe above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MealPlansPage;

