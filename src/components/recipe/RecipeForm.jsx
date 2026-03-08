import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiType, FiTag, FiFileText, FiClock, FiUsers, FiAward, FiSave } from 'react-icons/fi'
import Button from '../common/Button'
import { categoryApi } from '../../api/categoryApi'

const initialForm = {
  categoryId: '',
  title: '',
  description: '',
  instructions: '',
  cookingTime: '',
  difficulty: 'Medium',
  servings: 2
}

function RecipeForm({ initialValues, onSubmit, submitting }) {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(initialValues || initialForm)

  useEffect(() => {
    categoryApi.getAll().then(setCategories)
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({
          ...form,
          categoryId: Number(form.categoryId),
          cookingTime: Number(form.cookingTime),
          servings: Number(form.servings)
        })
      }}
      className="space-y-10"
    >
      <div className="card-premium p-8 md:p-12 space-y-10">
        <header className="border-b border-surface-50 pb-8">
          <h3 className="text-xl font-black text-surface-900 tracking-tight flex items-center gap-3">
            <FiFileText className="text-primary-500" />
            Core Information
          </h3>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Recipe Title</label>
            <div className="relative group">
              <FiType className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary-500 transition-colors" />
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full h-14 pl-14 pr-6 rounded-2xl bg-surface-50 border border-surface-100 text-surface-900 font-bold placeholder:text-surface-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 focus:outline-none transition-all"
                placeholder="Enter a cinematic title..."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Classification (Category)</label>
            <div className="relative group">
              <FiTag className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary-500 transition-colors" />
              <select
                className="w-full h-14 pl-14 pr-6 rounded-2xl bg-surface-50 border border-surface-100 text-surface-900 font-bold focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 focus:outline-none transition-all appearance-none"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select Category...</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Narrative Summary (Description)</label>
          <textarea
            className="w-full min-h-[120px] px-6 py-4 rounded-2xl bg-surface-50 border border-surface-100 text-surface-900 font-bold placeholder:text-surface-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 focus:outline-none transition-all resize-none"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Give your audience a taste of the experience..."
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Preparation Methodology (Instructions)</label>
          <textarea
            className="w-full min-h-[220px] px-6 py-5 rounded-2xl bg-surface-50 border border-surface-100 text-surface-900 font-bold placeholder:text-surface-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 focus:outline-none transition-all resize-none"
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            placeholder="Step-by-step guidance for the aspiring chef..."
            required
          />
        </div>

        <div className="grid gap-8 md:grid-cols-3 pt-6 border-t border-surface-50">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Time (Mins)</label>
            <div className="relative">
              <FiClock className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-300" />
              <input
                className="w-full h-14 pl-14 pr-6 rounded-2xl bg-surface-50 border border-surface-100 text-surface-900 font-bold focus:outline-none focus:border-primary-500 transition-all"
                name="cookingTime"
                type="number"
                value={form.cookingTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Skill Complexity</label>
            <div className="relative">
              <FiAward className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-300" />
              <select
                className="w-full h-14 pl-14 pr-6 rounded-2xl bg-surface-50 border border-surface-100 text-surface-900 font-bold focus:outline-none focus:border-primary-500 transition-all appearance-none"
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
              >
                <option value="Easy">Beginner</option>
                <option value="Medium">Intermediate</option>
                <option value="Hard">Mastery</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 ml-1">Portion Size</label>
            <div className="relative">
              <FiUsers className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-300" />
              <input
                className="w-full h-14 pl-14 pr-6 rounded-2xl bg-surface-50 border border-surface-100 text-surface-900 font-bold focus:outline-none focus:border-primary-500 transition-all"
                name="servings"
                type="number"
                value={form.servings}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="px-12 py-5 bg-surface-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-primary-600 transition-all shadow-xl shadow-surface-100 disabled:opacity-50"
        >
          {submitting ? 'Committing Changes...' : (
            <>
              Publish Professional Recipe
              <FiSave className="animate-pulse" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default RecipeForm
