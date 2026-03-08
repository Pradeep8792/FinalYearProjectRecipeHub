import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Loader from '../../components/common/Loader'
import RecipeForm from '../../components/recipe/RecipeForm'
import { recipeApi } from '../../api/recipeApi'

function EditRecipePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    recipeApi.getById(id)
      .then(setRecipe)
      .finally(() => setLoading(false))
  }, [id])

  const handleUpdate = async (payload) => {
    setSubmitting(true)
    try {
      await recipeApi.update(id, payload)
      toast.success('Recipe updated successfully')
      navigate('/my-recipes')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Recipe</h1>
          <p className="mt-2 text-slate-600">Update your recipe content and details.</p>
        </div>
        <RecipeForm initialValues={recipe} onSubmit={handleUpdate} submitting={submitting} />
      </div>
    </DashboardLayout>
  )
}

export default EditRecipePage
