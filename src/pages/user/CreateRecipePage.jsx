import { useState } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import RecipeForm from '../../components/recipe/RecipeForm'
import RecipeImageUploader from '../../components/recipe/RecipeImageUploader'
import { recipeApi } from '../../api/recipeApi'

function CreateRecipePage() {
  const [recipeId, setRecipeId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      const response = await recipeApi.create(payload)
      setRecipeId(response.recipeId)
      toast.success('Recipe created successfully. Now upload image.')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Recipe creation failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create Recipe</h1>
          <p className="mt-2 text-slate-600">Step 1 create recipe, Step 2 upload image, Step 3 add ingredients.</p>
        </div>
        <RecipeForm onSubmit={handleSubmit} submitting={submitting} />
        {recipeId && <RecipeImageUploader recipeId={recipeId} />}
      </div>
    </DashboardLayout>
  )
}

export default CreateRecipePage
