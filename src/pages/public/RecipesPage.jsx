import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiFilter, FiActivity, FiTag, FiChevronDown, FiSliders } from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import { recipeApi } from '../../api/recipeApi';
import { categoryApi } from '../../api/categoryApi';
import RecipeGrid from '../../components/recipe/RecipeGrid';
import Loader from '../../components/common/Loader';
import usePageTitle from '../../hooks/usePageTitle.jsx';

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="rounded-[2rem] bg-white border border-surface-100 overflow-hidden animate-pulse">
    <div className="aspect-[4/5] bg-surface-200" />
    <div className="p-6 space-y-3">
      <div className="h-3 bg-surface-200 rounded-full w-20" />
      <div className="h-5 bg-surface-200 rounded-full w-3/4" />
      <div className="h-3 bg-surface-200 rounded-full w-full" />
      <div className="h-3 bg-surface-200 rounded-full w-2/3" />
    </div>
  </div>
);

const RecipesPage = () => {
  usePageTitle('Explore Recipes | RecipeHub');
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [difficulty, setDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load categories once on mount
  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(console.error);
  }, []);

  // Fetch recipes when search/category changes
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        let data;
        if (search.trim()) {
          data = await recipeApi.search(search);
        } else if (category) {
          data = await recipeApi.getByCategory(category);
        } else {
          data = await recipeApi.getAll();
        }
        setRecipes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load recipes', error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [search, category]);

  // Client-side sort & difficulty filter (no extra API call needed)
  const filteredAndSorted = useMemo(() => {
    let result = [...recipes];

    // Filter by difficulty if selected
    if (difficulty) {
      result = result.filter(r => r.difficulty === difficulty);
    }

    // Sort results
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'time_asc':
        result.sort((a, b) => (a.cookingTime || 0) - (b.cookingTime || 0));
        break;
      case 'time_desc':
        result.sort((a, b) => (b.cookingTime || 0) - (a.cookingTime || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return result;
  }, [recipes, difficulty, sortBy]);

  // Active category display name
  const activeCategoryName = useMemo(() => {
    return categories.find(c => String(c.categoryId) === String(category))?.categoryName || 'All Recipes';
  }, [category, categories]);

  const clearAllFilters = () => {
    setSearch('');
    setCategory('');
    setDifficulty('');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters = search || category || difficulty || sortBy !== 'newest';

  return (
    <AppLayout>
      <div className="bg-[#FFFFFF] min-h-screen">
        {/* Hero Discovery Section */}
        <section className="relative bg-[#F4EDE4] border-b border-[#EAEAEA] overflow-hidden pt-20">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-[#FF6A00]/5 rounded-full blur-[100px]" />
          
          <div className="container-app py-12 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6A00]/10 text-[#FF6A00] text-[10px] font-bold uppercase tracking-widest mb-4">
                    <FiActivity size={12} /> Live Discovery
                  </span>
                  <h1 className="text-4xl md:text-6xl font-sans font-bold text-[#2E2E2E] tracking-tight mb-4">
                    {search ? (
                      <>Results for <span className="text-[#FF6A00]">"{search}"</span></>
                    ) : (
                      <>{activeCategoryName}</>
                    )}
                  </h1>
                  <p className="text-surface-500 font-medium leading-relaxed">
                    Find your next favourite dish from our community collection.
                  </p>
                </motion.div>
              </div>

              {/* Count Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-surface-900">{filteredAndSorted.length}</span>
                  <span className="text-surface-400 font-bold uppercase text-[9px] tracking-widest">Results</span>
                </div>
                <div className="h-10 w-px bg-surface-200" />
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-surface-900">{categories.length}</span>
                  <span className="text-surface-400 font-bold uppercase text-[9px] tracking-widest">Categories</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Toolbar */}
        <section className="sticky top-16 z-30 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#EAEAEA] shadow-sm">
          <div className="container-app py-3">
            <div className="flex flex-col gap-3">
              {/* Top row: search + filter toggle */}
              <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 group">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Search recipes by title, ingredient..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-11 pl-11 pr-10 rounded-xl bg-surface-50 border border-surface-200 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 focus:bg-white transition-all"
                  />
                  <AnimatePresence>
                    {search && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-lg bg-surface-200 flex items-center justify-center text-surface-500 hover:bg-surface-300 transition-colors"
                      >
                        <FiX size={14} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Filter toggle button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 h-11 px-4 rounded-xl border font-bold text-sm transition-all ${
                    showFilters || difficulty || sortBy !== 'newest'
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white border-surface-200 text-surface-600 hover:border-surface-300'
                  }`}
                >
                  <FiSliders size={16} />
                  <span className="hidden sm:inline">Filters</span>
                </button>

                {/* Clear all filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="h-11 px-4 rounded-xl bg-danger/10 text-danger font-bold text-sm hover:bg-danger hover:text-white transition-all"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category chips row */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <FiTag size={14} className="text-surface-400 flex-shrink-0" />
                <button
                  onClick={() => { setCategory(''); setSearchParams({}) }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    !category ? 'bg-surface-900 text-white' : 'bg-white border border-surface-200 text-surface-500 hover:bg-surface-50'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.categoryId}
                    onClick={() => { setCategory(cat.categoryId); setSearch('') }}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      String(category) === String(cat.categoryId)
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'bg-white border border-surface-200 text-surface-500 hover:bg-surface-50'
                    }`}
                  >
                    {cat.categoryName}
                  </button>
                ))}
              </div>

              {/* Advanced filters row (collapsible) */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center gap-4 py-2">
                      {/* Difficulty filter */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">Difficulty:</label>
                        {['Easy', 'Medium', 'Hard'].map(d => (
                          <button
                            key={d}
                            onClick={() => setDifficulty(difficulty === d ? '' : d)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              difficulty === d
                                ? 'bg-primary-50 text-primary-600 border border-primary-200'
                                : 'bg-white border border-surface-200 text-surface-500 hover:bg-surface-50'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>

                      {/* Sort select */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">Sort:</label>
                        <select
                          value={sortBy}
                          onChange={e => setSortBy(e.target.value)}
                          className="h-9 px-3 rounded-lg bg-white border border-surface-200 text-xs font-bold text-surface-700 focus:outline-none focus:border-primary-500 transition-all"
                        >
                          <option value="newest">Newest</option>
                          <option value="rating">Top Rated</option>
                          <option value="time_asc">Quickest</option>
                          <option value="time_desc">Longest</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="container-app py-10">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {filteredAndSorted.length > 0 ? (
                  <RecipeGrid recipes={filteredAndSorted} />
                ) : (
                  <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-surface-200 shadow-sm">
                    <div className="h-16 w-16 bg-surface-50 rounded-2xl flex items-center justify-center text-surface-300 mx-auto mb-6">
                      <FiSearch size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-surface-900 mb-2">No recipes found</h2>
                    <p className="text-surface-500 max-w-sm mx-auto text-sm font-medium mb-6">
                      {hasActiveFilters
                        ? 'No recipes match your current filters. Try adjusting them.'
                        : 'No recipes are available yet.'}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="px-6 py-3 rounded-xl bg-primary-50 text-primary-600 font-bold text-sm hover:bg-primary-100 transition-all"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </AppLayout>
  );
};

export default RecipesPage;
