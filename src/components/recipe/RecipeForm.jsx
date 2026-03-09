import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiType, FiTag, FiFileText, FiClock, FiUsers, FiAward, FiSave, FiAlertCircle } from 'react-icons/fi';
import Button from '../common/Button';
import Input from '../common/Input';
import { categoryApi } from '../../api/categoryApi';

const initialForm = {
  categoryId: '',
  title: '',
  description: '',
  instructions: '',
  cookingTime: '',
  difficulty: 'Medium',
  servings: 2
};

const RecipeForm = ({ initialValues, onSubmit, submitting }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialValues || initialForm);

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInnerSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      categoryId: Number(form.categoryId),
      cookingTime: Number(form.cookingTime),
      servings: Number(form.servings)
    });
  };

  return (
    <form onSubmit={handleInnerSubmit} className="space-y-8">
      <div className="bg-white rounded-[2rem] border border-surface-200 shadow-premium p-8 md:p-12">
        <header className="border-b border-surface-100 pb-8 mb-10">
          <div className="flex items-center gap-3 text-primary-600 mb-2">
            <FiFileText size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Recipe Identity</span>
          </div>
          <h3 className="text-2xl font-bold text-surface-900 tracking-tight">Recipe Details</h3>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <Input
            label="Recipe Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            icon={<FiType />}
            placeholder="e.g. Traditional Italian Lasagna"
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-700 ml-1">Category</label>
            <div className="relative group">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors z-10" />
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full h-12 pl-12 pr-10 rounded-xl bg-surface-50 border border-surface-200 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 focus:bg-white transition-all appearance-none"
              >
                <option value="">Select Category...</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-400">
                <FiAlertCircle size={14} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-700 ml-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Briefly describe what makes this dish special..."
              className="w-full min-h-[100px] p-4 rounded-xl bg-surface-50 border border-surface-200 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 focus:bg-white transition-all resize-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-700 ml-1">Instructions</label>
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              placeholder="Enter step-by-step instructions, one step per line..."
              className="w-full min-h-[200px] p-6 rounded-xl bg-surface-50 border border-surface-200 text-sm font-semibold leading-relaxed focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 focus:bg-white transition-all resize-none"
              required
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 pt-10 mt-10 border-t border-surface-100">
          <Input
            label="Cooking Time (Mins)"
            name="cookingTime"
            type="number"
            value={form.cookingTime}
            onChange={handleChange}
            icon={<FiClock />}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-700 ml-1">Difficulty</label>
            <div className="relative group">
              <FiAward className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors z-10" />
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full h-12 pl-12 pr-10 rounded-xl bg-surface-50 border border-surface-200 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 focus:bg-white transition-all appearance-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <Input
            label="Servings"
            name="servings"
            type="number"
            value={form.servings}
            onChange={handleChange}
            icon={<FiUsers />}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={submitting}
          icon={<FiSave />}
          className="px-12"
        >
          {submitting ? 'Saving...' : 'Save Recipe'}
        </Button>
      </div>
    </form>
  );
};

export default RecipeForm;

