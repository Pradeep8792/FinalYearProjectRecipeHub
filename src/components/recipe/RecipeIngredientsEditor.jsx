import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { recipeApi } from '../../api/recipeApi.jsx'
import Button from '../common/Button'

function RecipeIngredientsEditor({ recipeId }) {
  const [ingredients, setIngredients] = useState([])
  const [form, setForm] = useState({ ingredientId: '', quantity: '', unit: '' })

  const loadIngredients = async () => {
    const data = await recipeApi.getIngredients(recipeId)
    setIngredients(data)
  }

  useEffect(() => {
    if (recipeId) loadIngredients()
  }, [recipeId])

  const handleAdd = async (e) => {
    e.preventDefault()

    try {
      await recipeApi.addIngredient(recipeId, {
        ingredientId: Number(form.ingredientId),
        quantity: form.quantity,
        unit: form.unit
      })
      toast.success('Ingredient added')
      setForm({ ingredientId: '', quantity: '', unit: '' })
      loadIngredients()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add ingredient')
    }
  }

  const handleDelete = async (ingredientId) => {
    try {
      await recipeApi.deleteIngredient(recipeId, ingredientId)
      toast.success('Ingredient removed')
      loadIngredients()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove ingredient')
    }
  }

  return (
    <div className="card p-6 md:p-8">
      <h3 className="text-2xl font-extrabold text-slate-900">Recipe Ingredients</h3>
      <p className="mt-2 text-slate-500">Add ingredient id, quantity, and unit based on your backend ingredient master.</p>

      <form onSubmit={handleAdd} className="mt-6 grid gap-4 md:grid-cols-4">
        <input
          type="number"
          placeholder="Ingredient ID"
          value={form.ingredientId}
          onChange={(e) => setForm({ ...form, ingredientId: e.target.value })}
          className="input-base"
          required
        />
        <input
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="input-base"
          required
        />
        <input
          placeholder="Unit"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          className="input-base"
          required
        />
        <Button type="submit">Add Ingredient</Button>
      </form>

      <div className="mt-6 space-y-3">
        {ingredients.map((item) => (
          <div key={item.recipeIngredientId || item.ingredientId} className="flex items-center justify-between rounded-2xl border border-orange-100 px-4 py-3">
            <div>
              <p className="font-semibold text-slate-900">{item.name || `Ingredient #${item.ingredientId}`}</p>
              <p className="text-sm text-slate-500">{item.quantity} {item.unit}</p>
            </div>
            <button
              onClick={() => handleDelete(item.ingredientId)}
              className="text-sm font-bold text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecipeIngredientsEditor
