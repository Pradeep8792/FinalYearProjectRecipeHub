import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiFilter, FiX, FiChevronDown, FiGrid, FiList } from 'react-icons/fi'
import AppLayout from '../../components/layout/AppLayout'
import { recipeApi } from '../../api/recipeApi'
import { categoryApi } from '../../api/categoryApi'
import RecipeGrid from '../../components/recipe/RecipeGrid'
import Loader from '../../components/common/Loader'
import usePageTitle from '../../hooks/usePageTitle.jsx'

function RecipesPage() {
  usePageTitle('Recipes')
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  const initialCategory = searchParams.get('category') || ''

  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState(initialCategory)
  const [recipes, setRecipes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true)
      try {
        let data
        if (search.trim()) {
          data = await recipeApi.search(search)
        } else if (category) {
          data = await recipeApi.getByCategory(category)
        } else {
          data = await recipeApi.getAll()
        }
        setRecipes(data)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [search, category])

  const activeCategoryName = useMemo(() => {
    return categories.find(c => String(c.categoryId) === String(category))?.categoryName || 'All Recipes'
  }, [category, categories])

  return (
    <AppLayout>
      <div className="bg-surface-50 min-h-screen">
        {/* Header Section */}
        <section className="bg-white border-b border-surface-100">
          <div className="container-app py-16">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-primary-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">Discovery Hub</span>
                <h1 className="text-5xl md:text-7xl font-black text-surface-900 tracking-tighter mb-6">
                  {search ? `Searching for "${search}"` : activeCategoryName}
                </h1>
                <p className="text-surface-500 text-lg md:text-xl font-medium leading-relaxed">
                  Explore our curated collection of five-star recipes, from fast weeknight dinners to professional gourmet creations.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="sticky top-[80px] z-30 bg-white/80 backdrop-blur-xl border-b border-surface-100 shadow-sm">
          <div className="container-app py-4 flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-1 group w-full">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by ingredients, title, or chef..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-50 border border-surface-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-surface-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-surface-200 flex items-center justify-center text-surface-600 hover:bg-surface-300 transition-colors"
                >
                  <FiX />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar max-w-full">
              <button
                onClick={() => { setCategory(''); setSearchParams({}) }}
                className={`whitespace-nowrap px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${!category ? 'bg-surface-900 text-white shadow-lg' : 'bg-white border border-surface-100 text-surface-500 hover:bg-surface-50'
                  }`}
              >
                All Types
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.categoryId}
                  onClick={() => { setCategory(cat.categoryId); setSearch('') }}
                  className={`whitespace-nowrap px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${String(category) === String(cat.categoryId) ? 'bg-primary-500 text-white shadow-lg shadow-primary-200' : 'bg-white border border-surface-100 text-surface-500 hover:bg-surface-50'
                    }`}
                >
                  {cat.categoryName}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Recipe Listing */}
        <section className="container-app py-16">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-20"
              >
                <Loader />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {recipes.length > 0 ? (
                  <RecipeGrid recipes={recipes} />
                ) : (
                  <div className="text-center py-32">
                    <div className="h-24 w-24 bg-surface-100 rounded-[2.5rem] flex items-center justify-center text-surface-300 mx-auto mb-8">
                      <FiSearch size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-surface-900 mb-4 tracking-tight">No flavors found.</h2>
                    <p className="text-surface-500 max-w-sm mx-auto font-medium">We couldn't find any recipes matching your criteria. Try adjusting your search or filters.</p>
                    <button
                      onClick={() => { setSearch(''); setCategory('') }}
                      className="mt-10 btn-secondary"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </AppLayout>
  )
}

export default RecipesPage
