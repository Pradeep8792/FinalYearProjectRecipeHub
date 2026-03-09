import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiHeart, FiSearch, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import RecipeCard from '../../components/recipe/RecipeCard';
import { favoriteApi } from '../../api/favoriteApi.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import usePageTitle from '../../hooks/usePageTitle.jsx';
import Button from '../../components/common/Button';

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="rounded-2xl bg-white border border-surface-100 overflow-hidden animate-pulse">
    <div className="aspect-[4/5] bg-surface-200" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-surface-200 rounded-full w-16" />
      <div className="h-5 bg-surface-200 rounded-full w-3/4" />
      <div className="h-3 bg-surface-200 rounded-full w-full" />
    </div>
  </div>
);

const FavoritesPage = () => {
  const { user, loading: authLoading } = useAuth();
  usePageTitle('My Favorites | RecipeHub');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const data = await favoriteApi.getByUser(user.userId);
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load favorites', error);
      toast.error('Could not load your favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.userId) return;
    loadFavorites();
  }, [user?.userId]);

  // Remove a single favorite
  const handleRemove = async (recipeId) => {
    try {
      await favoriteApi.remove(user.userId, recipeId);
      // Optimistic update: remove from local state immediately
      setFavorites(prev => prev.filter(f => (f.recipeId || f.id) !== recipeId));
      toast.success('Removed from favorites');
    } catch {
      toast.error('Could not remove favorite');
    }
  };

  if (authLoading || (loading && favorites.length === 0)) {
    return (
      <DashboardLayout>
        <div className="space-y-8 pb-20">
          <div className="h-12 w-48 bg-surface-200 rounded-xl animate-pulse" />
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-danger mb-2">
              <FiHeart size={18} className="fill-danger" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Saved Recipes</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-surface-900 tracking-tight">
              My Favorites
            </h1>
            <p className="mt-2 text-surface-500 font-medium">
              {favorites.length} recipe{favorites.length !== 1 ? 's' : ''} saved to your collection
            </p>
          </div>
        </header>

        {/* Favorites grid */}
        <div>
          {favorites.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {favorites.map((recipe, i) => {
                  const recipeId = recipe.recipeId || recipe.id;
                  return (
                    <motion.div
                      key={recipeId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative group"
                    >
                      {/* Remove button overlay */}
                      <button
                        onClick={() => handleRemove(recipeId)}
                        className="absolute top-4 left-4 z-20 h-9 w-9 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm text-danger shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-danger hover:text-white"
                        title="Remove from favorites"
                      >
                        <FiTrash2 size={14} />
                      </button>
                      <RecipeCard recipe={recipe} isFavorited={true} onFavoriteChange={(newState) => {
                        if (!newState) handleRemove(recipeId);
                      }} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-24 text-center rounded-2xl border-2 border-dashed border-surface-200 bg-surface-50"
            >
              <div className="h-16 w-16 bg-danger/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <FiHeart className="text-danger" size={32} />
              </div>
              <h3 className="text-xl font-bold text-surface-900 mb-2">No favorites yet</h3>
              <p className="text-surface-400 font-medium mb-8 max-w-xs mx-auto">
                Start exploring recipes and save the ones you love!
              </p>
              <Link to="/recipes">
                <Button variant="primary" icon={<FiSearch />}>Explore Recipes</Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FavoritesPage;
