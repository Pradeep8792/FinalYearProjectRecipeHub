import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { FiClock, FiHeart, FiUsers, FiShare2, FiPrinter, FiChevronLeft, FiCheck, FiArrowRight } from 'react-icons/fi'
import AppLayout from '../../components/layout/AppLayout'
import Loader from '../../components/common/Loader'
import ReviewList from '../../components/recipe/ReviewList'
import { recipeApi } from '../../api/recipeApi.jsx'
import { favoriteApi } from '../../api/favoriteApi.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { getImageUrl } from '../../utils/formatters.jsx'
import usePageTitle from '../../hooks/usePageTitle.jsx'

function RecipeDetailsPage() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  usePageTitle(recipe?.title ? recipe.title : 'Recipe')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const [recipeData, ingredientData] = await Promise.all([
          recipeApi.getById(id),
          recipeApi.getIngredients(id)
        ])
        setRecipe(recipeData)
        setIngredients(ingredientData)
      } finally {
        setLoading(false)
      }
    }

    loadRecipe()
  }, [id])

  const handleFavorite = async () => {
    if (!isAuthenticated || !user?.userId) {
      return toast.error('Please login first')
    }

    try {
      await favoriteApi.add({ userId: user?.userId, recipeId: Number(id) })
      toast.success('Added to your collection')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save recipe')
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-40">
          <Loader />
        </div>
      </AppLayout>
    )
  }

  if (!recipe) {
    return (
      <AppLayout>
        <div className="container-app py-40 text-center">
          <h2 className="text-4xl font-black text-surface-900 mb-4">Recipe Disappeared.</h2>
          <p className="text-surface-500 mb-8">We couldn't find the dish you're looking for.</p>
          <Link to="/recipes" className="btn-primary">Browse Recipes</Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="bg-white min-h-screen pb-20">
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-100 py-4 shadow-sm"
            >
              <div className="container-app flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link to="/recipes" className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-surface-50 transition-colors">
                    <FiChevronLeft size={24} />
                  </Link>
                  <h2 className="font-black text-surface-900 tracking-tight line-clamp-1">{recipe.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleFavorite} className="btn-primary !py-2 !px-4 text-xs">Save Recipe</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden bg-surface-900">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            src={getImageUrl(recipe.thumbnailImageUrl || recipe.imageUrl)}
            alt={recipe.title}
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/40 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-app pb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-4xl"
              >
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-primary-500 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                    {recipe.categoryName || 'Gourmet'}
                  </span>
                  <div className="flex items-center gap-2 text-white/60 text-sm font-bold">
                    <FiClock /> {recipe.cookingTime} Minutes
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <FiUsers /> {recipe.servings} Servings
                  </div>
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
                  {recipe.title}
                </h1>
                <div className="flex flex-wrap gap-4">
                  <button onClick={handleFavorite} className="group relative px-8 py-4 bg-white text-surface-900 rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95">
                    <span className="relative z-10 flex items-center gap-3">
                      <FiHeart className="group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
                      Save to Collection
                    </span>
                  </button>
                  <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all">
                    <FiShare2 />
                  </button>
                  <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all">
                    <FiPrinter />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="container-app pt-20">
          <div className="grid gap-20 lg:grid-cols-[1fr,400px]">
            <div className="space-y-16">
              <div>
                <h3 className="text-primary-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">The Narrative</h3>
                <p className="text-2xl font-medium text-surface-600 leading-relaxed italic border-l-4 border-primary-500 pl-8">
                  "{recipe.description}"
                </p>
              </div>

              <div className="space-y-10">
                <h2 className="text-4xl font-black text-surface-900 tracking-tight flex items-center gap-4">
                  <div className="h-1 w-12 bg-primary-500 rounded-full" />
                  Execution Steps
                </h2>
                <div className="space-y-12">
                  {recipe.instructions.split('\n').filter((s) => s.trim()).map((step, i) => (
                    <div key={i} className="group flex gap-8">
                      <span className="text-6xl font-black text-surface-100 group-hover:text-primary-500/10 transition-colors leading-none">
                        {(i + 1).toString().padStart(2, '0')}
                      </span>
                      <div>
                        <p className="text-xl font-medium text-surface-700 leading-relaxed pt-2">
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-12">
              <div className="card-premium p-8 sticky top-32">
                <h3 className="text-2xl font-black text-surface-900 tracking-tight mb-8">Pantry List</h3>
                <div className="space-y-4">
                  {ingredients.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-50 border border-surface-100 group hover:border-primary-200 transition-all">
                      <div className="h-6 w-6 mt-1 rounded-lg border-2 border-surface-200 flex items-center justify-center text-transparent group-hover:text-primary-500 group-hover:border-primary-500 transition-all cursor-pointer">
                        <FiCheck />
                      </div>
                      <div>
                        <p className="font-bold text-surface-900">{item.name || `Essential #${item.ingredientId}`}</p>
                        <p className="text-xs font-black uppercase tracking-widest text-primary-500 mt-1">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-10 py-5 rounded-2xl bg-surface-900 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary-600 transition-all shadow-xl shadow-surface-200">
                  Add to Shopping List
                  <FiArrowRight />
                </button>
              </div>
            </aside>
          </div>
        </section>

        <section className="container-app py-32 border-t border-surface-100 mt-32">
          <ReviewList recipeId={id} />
        </section>
      </div>
    </AppLayout>
  )
}

export default RecipeDetailsPage