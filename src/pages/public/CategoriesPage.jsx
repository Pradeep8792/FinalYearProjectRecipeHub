import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiChevronRight, FiGrid } from 'react-icons/fi'
import AppLayout from '../../components/layout/AppLayout'
import { categoryApi } from '../../api/categoryApi.jsx'
import Loader from '../../components/common/Loader'
import usePageTitle from '../../hooks/usePageTitle.jsx'

function CategoriesPage() {
  usePageTitle('Categories')

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await categoryApi.getAll()

        const normalizedCategories = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.categories)
              ? result.categories
              : []

        setCategories(normalizedCategories)
      } catch (error) {
        console.error('Failed to load categories:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const categoryImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=400&q=80'
  ]

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-40">
          <Loader />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-surface-50 py-24">
        <div className="container-app">
          <header className="mb-16 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">
                Cuisine Exploration
              </span>
              <h1 className="mb-6 text-5xl font-black tracking-tighter text-surface-900 md:text-7xl">
                Taste by Design
              </h1>
              <p className="text-lg font-medium leading-relaxed text-surface-500">
                Navigate through our meticulously organized collections to find exactly what your palate desires.
              </p>
            </motion.div>
          </header>

          {categories.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-soft-xl">
              <h3 className="mb-2 text-2xl font-black text-surface-900">No categories found</h3>
              <p className="text-surface-500">Categories will appear here once they are available.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {categories.map((category, i) => (
                <motion.div
                  key={category.categoryId || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/recipes?category=${category.categoryId}`}
                    className="group relative block h-[300px] overflow-hidden rounded-[2.5rem] bg-surface-900 shadow-soft-xl"
                  >
                    <img
                      src={categoryImages[i % categoryImages.length]}
                      alt={category.categoryName}
                      className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/20 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-end p-10">
                      <span className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                        Category
                      </span>
                      <h3 className="mb-4 text-3xl font-black tracking-tight text-white">
                        {category.categoryName}
                      </h3>
                      <div className="flex -translate-x-4 items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        Explore Collection
                        <FiChevronRight />
                      </div>
                    </div>

                    <div className="absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md">
                      <FiGrid />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default CategoriesPage