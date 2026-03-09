import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiHeart, FiUsers, FiShare2, FiPrinter, FiChevronLeft, FiCheck, FiArrowRight, FiBookOpen, FiZap, FiEdit2 } from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import Loader from '../../components/common/Loader';
import ReviewList from '../../components/recipe/ReviewList';
import { recipeApi } from '../../api/recipeApi.jsx';
import { favoriteApi } from '../../api/favoriteApi.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { getImageUrl } from '../../utils/formatters.jsx';
import usePageTitle from '../../hooks/usePageTitle.jsx';
import Button from '../../components/common/Button';

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  usePageTitle(recipe?.title ? `${recipe.title} | RecipeHub` : 'Recipe');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const [recipeData, ingredientData] = await Promise.all([
          recipeApi.getById(id),
          recipeApi.getIngredients(id)
        ]);

        if (!recipeData.primaryImageUrl) {
          try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/recipes/${id}/images`);
            if (res.ok) {
              const data = await res.json();
              if (data && data.length > 0) {
                 recipeData.primaryImageUrl = data[0].imageEndpoint || data[0].imageUrl;
              }
            }
          } catch (e) {
            console.error('Failed to fetch recipe images', e);
          }
        }

        setRecipe(recipeData);
        setIngredients(Array.isArray(ingredientData) ? ingredientData : []);
      } catch (error) {
        console.error('Failed to load recipe', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const handleFavorite = async () => {
    if (!isAuthenticated || !user?.userId) {
      toast.error('Sign in to save recipes to your collection');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        await favoriteApi.remove(user.userId, Number(id));
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await favoriteApi.add({ userId: user.userId, recipeId: Number(id) });
        setIsFavorited(true);
        toast.success('Saved to your favorites!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader variant="primary" />
          <p className="mt-6 text-sm font-bold text-surface-400 uppercase tracking-widest animate-pulse">Prepping your kitchen...</p>
        </div>
      </AppLayout>
    );
  }

  if (!recipe) {
    return (
      <AppLayout>
        <div className="container-app py-40 text-center">
          <h2 className="text-4xl font-serif font-bold text-surface-900 mb-4">Recipe Disappeared.</h2>
          <p className="text-surface-500 mb-8 font-medium">We couldn't find the dish you're searching for in our archives.</p>
          <Link to="/recipes">
            <Button variant="primary">Browse Collection</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-white min-h-screen pb-24">
        {/* Immersive Scroll Header */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-surface-200 py-3 shadow-premium"
            >
              <div className="container-app flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link to="/recipes" className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-surface-50 transition-all">
                    <FiChevronLeft size={20} />
                  </Link>
                  <h2 className="font-serif font-bold text-lg text-surface-900 tracking-tight line-clamp-1">{recipe.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={handleFavorite} variant="primary" size="sm" icon={<FiHeart />}>Save</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Presentation Section */}
        <section className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden bg-surface-900">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={getImageUrl(recipe.primaryImageUrl || recipe.thumbnailImageUrl || recipe.imageUrl)}
            alt={recipe.title}
            className="h-full w-full object-cover opacity-70"
            onError={(e) => {
              const fallback = 'https://placehold.co/1200x800/f8f3ec/f97316?text=RecipeHub';
              if (e.target.src !== fallback) {
                e.target.src = fallback;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container-app pb-20">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="max-w-4xl"
              >
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <span className="px-4 py-1.5 rounded-full bg-primary-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary-500/20">
                    {recipe.categoryName || 'Signature Dish'}
                  </span>
                  <div className="h-1 w-1 bg-white/30 rounded-full" />
                  <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <FiZap className="text-accent-400" /> {recipe.difficulty || 'Intermediate'}
                  </div>
                </div>
                
                <h1 className="text-6xl md:text-9xl font-serif font-bold text-white tracking-tight mb-10 leading-[0.85]">
                  {recipe.title}
                </h1>

                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={handleFavorite}
                    className="group flex items-center gap-3 px-8 py-4 bg-white text-surface-950 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
                  >
                    <FiHeart className="text-primary-500 group-hover:fill-primary-500 transition-all" />
                    Archive Recipe
                  </button>
                  <button className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all">
                    <FiShare2 size={18} />
                  </button>
                  <button className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all">
                    <FiPrinter size={18} />
                  </button>
                  
                  {/* Edit Controls for Owner / Admin */}
                  {(user?.role === 'Admin' || user?.userId === recipe.userId) && (
                    <Link 
                      to={`/recipes/${recipe.recipeId || recipe.id}/edit`}
                      className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/20 active:scale-95 transition-all shadow-xl"
                    >
                      <FiEdit2 size={16} />
                      Edit Recipe
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Decorative stats overlay */}
          <div className="absolute bottom-0 right-0 p-12 hidden lg:block">
            <div className="flex gap-12">
              <div className="flex flex-col items-center">
                <FiClock className="text-primary-400 mb-2" size={24} />
                <span className="text-white font-serif text-2xl font-bold leading-none">{recipe.cookingTime}</span>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Mins</span>
              </div>
              <div className="flex flex-col items-center">
                <FiUsers className="text-secondary-400 mb-2" size={24} />
                <span className="text-white font-serif text-2xl font-bold leading-none">{recipe.servings}</span>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Pax</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="container-app pt-24 text-surface-900">
          <div className="grid gap-20 lg:grid-cols-[1fr,420px]">
            <div className="space-y-24">
              {/* Introduction */}
              <div>
                <div className="flex items-center gap-3 text-primary-600 mb-6">
                  <FiBookOpen size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">About This Recipe</span>
                </div>
                <p className="text-3xl font-serif text-surface-600 leading-relaxed italic border-l-4 border-primary-100 pl-10">
                  "{recipe.description || 'A timeless creation brought to life through passion and precise technique.'}"
                </p>
              </div>

              {/* Execution Steps */}
              <div className="space-y-12">
                <header className="flex items-center gap-6">
                  <h2 className="text-4xl font-serif font-bold tracking-tight">Instructions</h2>
                  <div className="h-[2px] flex-1 bg-surface-100" />
                </header>
                
                <div className="space-y-16">
                  {(recipe.instructions || '').split('\n').filter((s) => s.trim()).map((step, i, arr) => (
                    <div key={i} className="group flex gap-10">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-7xl font-serif font-bold text-surface-100 leading-none group-hover:text-primary-500/10 transition-colors">
                          {(i + 1).toString().padStart(2, '0')}
                        </span>
                        {i < arr.length - 1 && (
                          <div className="w-[2px] flex-1 bg-surface-50" />
                        )}
                      </div>
                      <div className="pt-3">
                        <p className="text-xl font-medium text-surface-700 leading-relaxed max-w-2xl">
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar / Pantry */}
            <aside className="space-y-10">
              <div className="bg-surface-50/50 rounded-[2.5rem] p-10 border border-surface-200 sticky top-32 shadow-soft-xl">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-2xl font-serif font-bold text-surface-900 tracking-tight">The Pantry</h3>
                   <span className="px-3 py-1 rounded-lg bg-white border border-surface-200 text-[10px] font-bold text-surface-400">
                    {ingredients.length} Essentials
                   </span>
                </div>
                
                <div className="space-y-4">
                  {ingredients.map((item, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-surface-100 group hover:border-primary-300 transition-all shadow-sm"
                    >
                      <div className="h-6 w-6 rounded-lg bg-surface-50 flex items-center justify-center text-primary-500 group-hover:bg-primary-50 transition-colors">
                        <FiCheck size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-surface-900">{item.name || `Signature Ingredient`}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary-500/70 mt-0.5">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 space-y-4">
                  <Button variant="primary" fullWidth size="lg">Add to Shopping Kit</Button>
                  <p className="text-center text-[10px] font-bold text-surface-400 uppercase tracking-widest">Instantly sync to your device</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Community Feedback */}
        <section className="container-app pt-32 mt-32 border-t border-surface-200">
          <ReviewList recipeId={id} />
        </section>
      </div>
    </AppLayout>
  );
};

export default RecipeDetailsPage;