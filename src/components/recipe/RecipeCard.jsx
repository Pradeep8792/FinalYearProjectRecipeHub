import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiClock, FiUsers, FiStar, FiChevronRight } from 'react-icons/fi'

function RecipeCard({ recipe }) {
    if (!recipe) return null

    const imageUrl = recipe.imageUrl || recipe.primaryImageUrl || 'https://images.unsplash.com/photo-1495195129352-aec325b55b65?auto=format&fit=crop&w=800&q=80'

    return (
        <motion.div
            whileHover={{ y: -12 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative h-full flex flex-col rounded-[2.5rem] bg-white border border-surface-100 shadow-premium transition-all hover:shadow-soft-xl overflow-hidden"
        >
            {/* Image Area */}
            <div className="relative aspect-[4/5] overflow-hidden">
                <Link to={`/recipes/${recipe.recipeId || recipe.id}`} className="block h-full w-full">
                    <img
                        src={imageUrl}
                        alt={recipe.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                </Link>

                {/* Badges on Image */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="glass px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                        {recipe.categoryName || 'Kitchen'}
                    </span>
                </div>

                <div className="absolute top-6 right-6 glass h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <div className="flex flex-col items-center">
                        <FiStar className="text-primary-400 fill-primary-400" size={14} />
                        <span className="text-xs font-black">{Number(recipe.averageRating || 0).toFixed(1)}</span>
                    </div>
                </div>

                {/* Floating View Button on Image Hover */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:bottom-10 transition-all duration-500">
                    <Link to={`/recipes/${recipe.recipeId || recipe.id}`} className="btn-primary py-3 px-6 whitespace-nowrap shadow-2xl">
                        View Recipe
                    </Link>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg">
                        {recipe.difficulty || 'Medium'}
                    </span>
                    <div className="h-1 w-1 rounded-full bg-surface-300" />
                    <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">
                        {recipe.reviewCount || 0} reviews
                    </span>
                </div>

                <h3 className="text-2xl font-black text-surface-900 mb-4 tracking-tight group-hover:text-primary-600 transition-colors line-clamp-1">
                    {recipe.title}
                </h3>

                <p className="text-surface-500 line-clamp-2 text-sm leading-relaxed mb-6">
                    {recipe.description || 'Experience the authentic flavors of this carefully crafted home recipe.'}
                </p>

                <div className="mt-auto pt-6 border-t border-surface-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-surface-400 text-xs font-bold">
                            <FiClock className="text-primary-400" />
                            <span>{recipe.cookingTime || 30}m</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-surface-400 text-xs font-bold">
                            <FiUsers className="text-primary-400" />
                            <span>{recipe.servings || 2} pers</span>
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ x: 5 }}
                        className="h-10 w-10 rounded-xl bg-surface-50 flex items-center justify-center text-surface-400 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm"
                    >
                        <FiChevronRight size={20} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

export default RecipeCard
