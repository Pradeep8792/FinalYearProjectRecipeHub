import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Loader from '../../components/common/Loader'
import Button from '../../components/common/Button'
import { recipeApi } from '../../api/recipeApi'
import { useAuth } from '../../hooks/useAuth.jsx'
import usePageTitle from '../../hooks/usePageTitle.jsx'

function MyRecipesPage() {
  const { user, loading: authLoading } = useAuth()
  usePageTitle('My Recipes')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return

    setLoading(true)
    recipeApi.getByUser(user.userId)
      .then(setRecipes)
      .finally(() => setLoading(false))
  }, [user?.userId])

  if (authLoading) return <DashboardLayout><div className="flex justify-center py-20"><Loader /></div></DashboardLayout>
  if (loading) return <DashboardLayout><Loader /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Recipes</h1>
            <p className="mt-2 text-slate-600">Manage recipes created from your account.</p>
          </div>
          <Link to="/recipes/create"><Button>Create New Recipe</Button></Link>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Difficulty</th>
                  <th className="px-5 py-4">Time</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => (
                  <tr key={recipe.recipeId} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-medium text-slate-900">{recipe.title}</td>
                    <td className="px-5 py-4">{recipe.status}</td>
                    <td className="px-5 py-4">{recipe.difficulty}</td>
                    <td className="px-5 py-4">{recipe.cookingTime} mins</td>
                    <td className="px-5 py-4">
                      <Link className="font-semibold text-brand-600" to={`/recipes/${recipe.recipeId}/edit`}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyRecipesPage
