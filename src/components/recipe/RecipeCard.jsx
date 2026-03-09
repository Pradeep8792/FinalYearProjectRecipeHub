import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiUsers, FiStar, FiChevronRight, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { favoriteApi } from '../../api/favoriteApi.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { getImageUrl } from '../../utils/formatters.jsx';



/**
 * RecipeCard component — supports favorite toggle with auth awareness.
 * @param {Object} props.recipe - Recipe data object
 * @param {boolean} props.isFavorited - Whether recipe is currently favorited
 * @param {Function} props.onFavoriteChange - Optional callback when favorite state changes
 */
const RecipeCard = ({ recipe, isFavorited: initialFavorited = false, onFavoriteChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // State for image modal
  const [showImageModal, setShowImageModal] = useState(false);

  if (!recipe) return null;

  const { user, isAuthenticated } = useAuth();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const fallbackImage = 'https://placehold.co/800x500/f8f3ec/f97316?text=RecipeHub';
  const [imageUrl, setImageUrl] = useState(
    recipe.primaryImageUrl ? getImageUrl(recipe.primaryImageUrl) :
    recipe.imageUrl ? getImageUrl(recipe.imageUrl) :
    recipe.thumbnailImageUrl ? getImageUrl(recipe.thumbnailImageUrl) :
    fallbackImage
  );

  // Fetch images for the recipe if no primary image is set
  const recipeId = recipe.recipeId || recipe.id;
  useEffect(() => {
    if (recipe.primaryImageUrl) return; // already have image
    const fetchImages = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/recipes/${recipeId}/images`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.length > 0) {
          setImageUrl(getImageUrl(data[0].imageEndpoint) || imageUrl);
        }
      } catch (e) {
        console.error('Failed to fetch recipe images', e);
      }
    };
    fetchImages();
  }, [recipeId]);

  const handleFavorite = async (e) => {
    e.preventDefault(); // Don't navigate
    e.stopPropagation();

    if (!isAuthenticated || !user?.userId) {
      toast.error('Sign in to save recipes');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setFavoriteLoading(true);
    try {
      if (favorited) {
        await favoriteApi.remove(user.userId, recipeId);
        setFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await favoriteApi.add({ userId: user.userId, recipeId });
        setFavorited(true);
        toast.success('Saved to favorites!');
      }
      onFavoriteChange?.(!favorited, recipeId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col bg-white rounded-xl border border-[#EAEAEA] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/recipes/${recipeId}`} className="block h-full w-full">
          <img
            src={imageUrl}
            alt={recipe.title || 'Recipe'}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              if (e.target.src !== fallbackImage) {
                e.target.src = fallbackImage;
              }
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#FFFFFF]/90 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#2E2E2E] shadow-sm backdrop-blur-md">
            {recipe.categoryName || 'Chef Choice'}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          disabled={favoriteLoading}
          title={favorited ? 'Remove from favorites' : 'Save to favorites'}
          className={`absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-xl glass transition-all backdrop-blur-md disabled:opacity-60 ${
            favorited
              ? 'text-danger bg-danger/10'
              : 'text-white hover:text-danger hover:scale-110'
          }`}
        >
          <FiHeart
            size={18}
            className={favorited ? 'fill-danger' : ''}
          />
        </button>

        {/* Hover CTA */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="pointer-events-auto">
                <button
                  onClick={() => setShowImageModal(true)}
                  className="px-6 py-3 rounded-full bg-[#FF6A00] text-white font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2"
                >
                  View Recipe <FiChevronRight />
                </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#FF6A00] text-[10px] font-bold uppercase tracking-wider">
            {recipe.difficulty || 'Intermediate'}
          </span>
          <div className="flex items-center gap-1 text-accent-500">
            <FiStar className="fill-current" size={12} />
            <span className="text-[10px] font-bold">
              {Number(recipe.averageRating || 0).toFixed(1)}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-[#2E2E2E] mb-2 leading-tight group-hover:text-[#FF6A00] transition-colors line-clamp-1">
          {recipe.title}
        </h3>

        <p className="text-surface-500 text-xs leading-relaxed mb-6 line-clamp-2 italic">
          {recipe.description || 'A delicious recipe crafted with care and fresh ingredients.'}
        </p>

        <div className="mt-auto pt-4 border-t border-[#EAEAEA] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#2E2E2E]">
              <FiClock size={14} className="text-[#9CA3AF]" />
              <span className="text-xs font-semibold">
                {recipe.cookingTime || 30} mins
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#2E2E2E]">
              <FiUsers size={14} className="text-[#9CA3AF]" />
              <span className="text-xs font-semibold">
                {recipe.servings || 2} Servings
              </span>
            </div>
          </div>

          <div className="text-xs font-medium text-[#9CA3AF]">
            {recipe.reviewCount || 0} reviews
          </div>
        </div>
      </div>
    </motion.div>
  );
};




export default RecipeCard;
