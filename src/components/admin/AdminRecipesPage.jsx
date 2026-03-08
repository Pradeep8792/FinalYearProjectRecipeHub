import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import { adminApi } from '../../api/adminApi'

function AdminRecipesPage() {
  const [recipes, setRecipes] = useState([])

  const loadRecipes = async () => {
    const data = await adminApi.getRecipes()
    setRecipes(data)
  }

  useEffect(() => {
    loadRecipes()
  }, [])

  const updateStatus = async (recipeId, status) => {
    try {
      await adminApi.updateRecipeStatus(recipeId, status)
      toast.success('Recipe status updated')
      loadRecipes()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Recipes</h1>
          <p className="mt-2 text-slate-600">Moderate recipe lifecycle and publishing state.</p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Author</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Change Status</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.recipeId} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-medium text-slate-900">{recipe.title}</td>
                  <td className="px-5 py-4">{recipe.categoryName}</td>
                  <td className="px-5 py-4">{recipe.userName || recipe.authorName}</td>
                  <td className="px-5 py-4">{recipe.status}</td>
                  <td className="px-5 py-4">
                    <select
                      className="rounded-xl border border-slate-200 px-3 py-2"
                      defaultValue={recipe.status}
                      onChange={(e) => updateStatus(recipe.recipeId, e.target.value)}
                    >
                      <option>Draft</option>
                      <option>PendingApproval</option>
                      <option>Published</option>
                      <option>Archived</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminRecipesPage
