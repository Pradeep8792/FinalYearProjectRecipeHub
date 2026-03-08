import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FiFileText, FiSearch, FiEdit3, FiTrash2, FiEye, FiCheckCircle, FiClock, FiArchive } from 'react-icons/fi'
import AdminLayout from '../../components/layout/AdminLayout'
import { adminApi } from '../../api/adminApi.jsx'
import Loader from '../../components/common/Loader'
import { Link } from 'react-router-dom'
import usePageTitle from '../../hooks/usePageTitle.jsx'

function AdminRecipesPage() {
  usePageTitle('Admin — Recipes')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const loadRecipes = async () => {
    try {
      const data = await adminApi.getRecipes()
      setRecipes(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecipes()
  }, [])

  const updateStatus = async (recipeId, status) => {
    try {
      await adminApi.updateRecipeStatus(recipeId, status)
      toast.success(`Status changed to ${status}`)
      loadRecipes()
    } catch {
      toast.error('Could not update status')
    }
  }

  const filteredRecipes = recipes.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.userName || r.authorName || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Published': return <FiCheckCircle className="text-green-500" />
      case 'PendingApproval': return <FiClock className="text-amber-500" />
      case 'Archived': return <FiArchive className="text-surface-400" />
      default: return <FiEdit3 className="text-primary-500" />
    }
  }

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><Loader /></div></AdminLayout>

  return (
    <AdminLayout>
      <div className="space-y-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-primary-500 font-black uppercase tracking-[0.2em] text-[10px] mb-2 block">Content Moderation</span>
            <h1 className="text-5xl font-black text-surface-900 tracking-tight">Recipe Library</h1>
          </div>

          <div className="relative group max-w-md w-full">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-surface-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-surface-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
            />
          </div>
        </header>

        <div className="card-premium overflow-hidden !p-0 border-surface-100 shadow-soft-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-50">
              <thead>
                <tr className="bg-surface-50/50">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Recipe</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Cuisine</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Moderation Controls</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-50">
                {filteredRecipes.map((recipe, i) => (
                  <motion.tr
                    key={recipe.recipeId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-surface-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-20 rounded-xl bg-surface-100 overflow-hidden">
                          <img src={recipe.imageUrl || 'https://images.unsplash.com/photo-1495195129352-aec325b55b65?auto=format&fit=crop&w=200&q=80'} className="h-full w-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="font-black text-surface-900 group-hover:text-primary-600 transition-colors line-clamp-1">{recipe.title}</p>
                          <p className="text-xs font-bold text-surface-400">by {recipe.userName || recipe.authorName || 'Chef'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex px-3 py-1.5 rounded-xl bg-surface-50 text-surface-600 text-[10px] font-black uppercase tracking-widest border border-surface-100">
                        {recipe.categoryName || 'General'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(recipe.status)}
                        <span className="text-[10px] font-black uppercase tracking-widest text-surface-700">
                          {recipe.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <select
                          className="bg-surface-50 border border-surface-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500/10 transition-all opacity-60 hover:opacity-100"
                          value={recipe.status}
                          onChange={(e) => updateStatus(recipe.recipeId, e.target.value)}
                        >
                          <option value="Draft">Draft</option>
                          <option value="PendingApproval">Pending</option>
                          <option value="Published">Publish</option>
                          <option value="Archived">Archive</option>
                        </select>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/recipes/${recipe.recipeId}`} className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface-50 text-surface-400 hover:bg-surface-900 hover:text-white transition-all shadow-sm">
                            <FiEye />
                          </Link>
                          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRecipes.length === 0 && (
            <div className="py-20 text-center">
              <FiFileText className="mx-auto text-surface-200 mb-4" size={48} />
              <p className="text-surface-400 font-bold">No recipes found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminRecipesPage
