import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FiArrowRight, FiHeart, FiSearch, FiClock, FiUsers, FiStar, FiZap, FiTarget, FiLayers } from 'react-icons/fi'
import { GiMeal, GiCookingPot, GiChefToque } from 'react-icons/gi'
import AppLayout from '../../components/layout/AppLayout'
import { recipeApi } from '../../api/recipeApi'
import { categoryApi } from '../../api/categoryApi'
import RecipeGrid from '../../components/recipe/RecipeGrid'
import Loader from '../../components/common/Loader'
import usePageTitle from '../../hooks/usePageTitle.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  }
}

function HomePage() {
  usePageTitle('Home')
  const navigate = useNavigate()
  const [topRecipes, setTopRecipes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [top, categoryList] = await Promise.all([
          recipeApi.getTop(4),
          categoryApi.getAll()
        ])
        setTopRecipes(top)
        setCategories(categoryList)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#2E2E2E]">
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 z-0 opacity-100"
        >
          <img
            src="/organic-hero-bg.png"
            alt="Healthy Organic Meal"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#212121]/95 via-[#212121]/70 to-transparent" />
        </motion.div>

        <div className="container-app relative z-10 pt-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block text-[#EAEAEA] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                ORGANIC • FRESH • HEALTHY
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-white leading-[1.1] mb-6 tracking-tight">
                Healthy<br />Organic Food
              </h1>
              <p className="text-lg md:text-xl text-[#EAEAEA] mb-10 max-w-lg leading-relaxed font-normal">
                Discover fresh and healthy recipes made with natural ingredients.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/recipes" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF6A00] hover:bg-[#E65C00] text-white rounded-full font-bold shadow-lg shadow-[#FF6A00]/30 transition-all duration-300 transform hover:-translate-y-1">
                Explore Recipes <FiArrowRight className="mt-0.5" />
              </Link>
            </motion.div>
          </div>
        </div>
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-[15%] hidden xl:block"
        >
          <div className="glass p-6 rounded-3xl border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-accent-500 flex items-center justify-center text-white text-2xl">
                <FiStar />
              </div>
              <div>
                <p className="text-white font-black text-2xl">4.9/5</p>
                <p className="text-surface-400 text-xs font-bold uppercase tracking-wider">User Satisfaction</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Discovery Section */}
      <section className="container-app -mt-24 relative z-20 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium grid lg:grid-cols-4 gap-8"
        >
          {[
            { icon: <FiSearch />, title: 'Smart Search', desc: 'Find by ingredients or time' },
            { icon: <FiHeart />, title: 'Save Favorites', desc: 'Build your personal book' },
            { icon: <FiTarget />, title: 'Meal Plans', desc: 'Organize your weekly diet' },
            { icon: <FiLayers />, title: 'Shopping List', desc: 'Auto-generate from ingredients' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4 group">
              <div className="h-16 w-16 mb-6 rounded-2xl bg-surface-50 text-surface-900 text-2xl flex items-center justify-center transition-all group-hover:bg-primary-500 group-hover:text-white group-hover:rotate-6 group-hover:shadow-xl group-hover:shadow-primary-100">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black text-surface-900 mb-2 tracking-tight">{item.title}</h3>
              <p className="text-surface-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Categories Grid */}
      <section className="container-app py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-primary-500 font-black uppercase tracking-[0.2em] text-xs">Browse by Cuisine</span>
            <h2 className="text-5xl md:text-7xl font-black text-surface-900 tracking-tighter mt-4">Discover Your <br /> Next Obsession</h2>
          </div>
          <Link to="/categories" className="btn-secondary group">
            View All Categories <FiArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
        >
          {categories.slice(0, 6).map((cat) => (
            <motion.div
              key={cat.categoryId}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="aspect-square rounded-[2rem] bg-white border border-surface-100 shadow-sm overflow-hidden p-6 flex flex-col items-center justify-center transition-all group-hover:shadow-xl group-hover:border-primary-100 group-hover:bg-primary-50/30">
                <div className="text-4xl mb-4 text-surface-900 transition-transform group-hover:scale-125 group-hover:text-primary-500 duration-500">
                  <GiCookingPot />
                </div>
                <h4 className="font-bold text-surface-900 text-center uppercase tracking-wider text-xs">{cat.categoryName}</h4>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Recipes */}
      <section className="bg-surface-900 py-32 overflow-hidden relative">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-600/5 to-transparent skew-x-12 translate-x-1/2" />

        <div className="container-app relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-3xl bg-primary-500 flex items-center justify-center text-4xl text-white shadow-2xl shadow-primary-500/40">
                <GiChefToque />
              </div>
              <div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Trending Now</h2>
                <p className="text-surface-400 mt-2 text-xl">The most loved recipes in the community this week.</p>
              </div>
            </div>
            <Link to="/recipes" className="glass px-8 py-4 rounded-2xl text-white font-bold hover:bg-white/10 border-white/10 tracking-wide transition-all">
              Explore All Recipes
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader /></div>
          ) : (
            <RecipeGrid recipes={topRecipes} />
          )}
        </div>
      </section>

      {/* Community Section */}
      <section className="container-app py-32">
        <div className="rounded-[4rem] bg-gradient-to-br from-primary-50 to-orange-100 p-12 md:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
          <div className="relative z-10 lg:w-1/2">
            <h2 className="text-5xl md:text-7xl font-black text-surface-900 tracking-tighter mb-8 leading-[1.1]">
              Share your <br />
              <span className="text-primary-600">signature</span> recipe with the world
            </h2>
            <p className="text-xl text-surface-600 mb-12 max-w-lg leading-relaxed">
              Join thousands of home chefs. Upload your creations, get feedback, and inspire others to cook healthy, delicious meals.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/recipes/create" 
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    toast.error('Sign in to create a recipe');
                    navigate('/login', { state: { from: '/recipes/create' } });
                  }
                }}
                className="btn-primary py-5 px-10 text-lg"
              >
                Create First Recipe
              </Link>
              <Link to="/about" className="btn-secondary py-5 px-10 text-lg">Learn More</Link>
            </div>
          </div>

          <div className="lg:w-1/2 relative group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80" alt="Cooking" className="w-full" />
            </motion.div>
            <div className="absolute -top-10 -right-10 bg-accent-500 text-white p-8 rounded-full shadow-2xl z-20 animate-float hidden md:block">
              <FiZap size={40} />
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 right-0 p-20 text-white/10 pointer-events-none">
            <GiCookingPot size={400} />
          </div>
        </div>
      </section>

      {/* Footer pre-action */}
      {!isAuthenticated && (
        <section className="container-app py-20 text-center border-t border-surface-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-surface-900 mb-6 tracking-tight">Ready to start your culinary journey?</h2>
            <p className="text-xl text-surface-500 mb-10 leading-relaxed">
              Create an account today and get access to exclusive features like the meal planner and smart shopping lists.
            </p>
            <Link to="/register" className="btn-primary px-12 py-5 text-xl">Sign Up for Free</Link>
          </div>
        </section>
      )}
    </AppLayout>
  )
}

export default HomePage
