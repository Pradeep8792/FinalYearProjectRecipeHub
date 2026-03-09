import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit3, FiEye, FiTrash2, FiClock, FiZap, FiBookOpen } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { recipeApi } from '../../api/recipeApi';
import { useAuth } from '../../hooks/useAuth.jsx';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import usePageTitle from '../../hooks/usePageTitle.jsx';

const MyRecipesPage = () => {
  const { user, loading: authLoading } = useAuth();
  usePageTitle('My Recipes | RecipeHub');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.userId) return;
    setLoading(true);
    recipeApi.getByUser(user.userId)
      .then(data => setRecipes(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [user?.userId]);

  // Delete recipe with confirmation
  const handleDelete = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe? This cannot be undone.')) return;
    try {
      await recipeApi.remove(recipeId);
      setRecipes(prev => prev.filter(r => r.recipeId !== recipeId));
      toast.success('Recipe deleted');
    } catch {
      toast.error('Failed to delete recipe');
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader variant="primary" />
          <p className="mt-6 text-sm font-bold text-surface-400 uppercase tracking-widest animate-pulse">Loading your archives...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-primary-500 mb-2">
              <FiBookOpen size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Personal Archive</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-surface-900 tracking-tight">My Recipes</h1>
            <p className="mt-2 text-surface-500 font-medium leading-relaxed">
              Manage and refine your published collection of recipes.
            </p>
          </div>
          <Link to="/recipes/create">
            <Button variant="primary" size="lg" icon={<FiPlus />}>New Recipe</Button>
          </Link>
        </header>

        <div className="bg-white rounded-[2.5rem] border border-surface-200 overflow-hidden shadow-soft-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-surface-50/50 border-b border-surface-200">
                  <th className="px-8 py-6 text-left text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Recipe</th>
                  <th className="px-8 py-6 text-left text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-left text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Difficulty</th>
                  <th className="px-8 py-6 text-left text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Time</th>
                  <th className="px-8 py-6 text-right text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                <AnimatePresence>
                  {recipes.map((recipe, idx) => (
                    <motion.tr 
                      key={recipe.recipeId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-surface-50/30 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-surface-100 overflow-hidden flex-shrink-0 border border-surface-200">
                             {recipe.thumbnailImageUrl ? (
                               <img src={recipe.thumbnailImageUrl} alt="" className="h-full w-full object-cover" />
                             ) : (
                               <div className="h-full w-full flex items-center justify-center text-surface-400">
                                 <FiBookOpen size={20} />
                               </div>
                             )}
                          </div>
                          <span className="font-bold text-surface-900 line-clamp-1">{recipe.title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                          recipe.status === 'Published' ? 'bg-success/10 text-success border border-success/20' : 'bg-surface-100 text-surface-500 border border-surface-200'
                        }`}>
                          {recipe.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-surface-500 text-sm font-medium">
                          <FiZap className="text-accent-500" /> {recipe.difficulty}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-surface-500">
                        <div className="flex items-center gap-2">
                          <FiClock className="text-primary-500" /> {recipe.cookingTime} mins
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/recipes/${recipe.recipeId}`}>
                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-surface-200 text-surface-400 hover:text-primary-500 hover:border-primary-500 hover:shadow-sm transition-all shadow-none">
                              <FiEye size={18} />
                            </button>
                          </Link>
                          <Link to={`/recipes/${recipe.recipeId}/edit`}>
                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-surface-200 text-surface-400 hover:text-secondary-500 hover:border-secondary-500 hover:shadow-sm transition-all shadow-none">
                              <FiEdit3 size={18} />
                            </button>
                          </Link>
                          <button
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-surface-200 text-surface-400 hover:text-danger hover:border-danger hover:shadow-sm transition-all shadow-none"
                            onClick={() => handleDelete(recipe.recipeId)}
                            title="Delete recipe"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {recipes.length === 0 && (
            <div className="py-32 text-center grayscale opacity-40">
              <FiBookOpen className="mx-auto mb-6 text-surface-200" size={64} />
              <h3 className="text-xl font-serif font-bold text-surface-900 mb-2">No masterpieces found</h3>
              <p className="text-surface-400 text-sm font-medium mb-8">You haven't created any recipes yet. Time to share something delicious!</p>
              <Link to="/recipes/create">
                <Button variant="primary">Create Your First Recipe</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyRecipesPage;

