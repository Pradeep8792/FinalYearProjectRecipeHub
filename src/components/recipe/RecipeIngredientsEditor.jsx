import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiBox, FiLayers, FiHash, FiCheckCircle } from 'react-icons/fi';
import { recipeApi } from '../../api/recipeApi.jsx';
import Button from '../common/Button';
import Input from '../common/Input';

const RecipeIngredientsEditor = ({ recipeId }) => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ingredientId: '', quantity: '', unit: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadIngredients = async () => {
    try {
      const data = await recipeApi.getIngredients(recipeId);
      setIngredients(data);
    } catch (error) {
      console.error('Failed to load ingredients', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recipeId) loadIngredients();
  }, [recipeId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.ingredientId || !form.quantity || !form.unit) {
      return toast.error('Please fulfill all ingredient specifications');
    }

    setSubmitting(true);
    try {
      await recipeApi.addIngredient(recipeId, {
        ingredientId: Number(form.ingredientId),
        quantity: form.quantity,
        unit: form.unit
      });
      toast.success('Pantry item synchronized');
      setForm({ ingredientId: '', quantity: '', unit: '' });
      loadIngredients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add ingredient');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (ingredientId) => {
    try {
      await recipeApi.deleteIngredient(recipeId, ingredientId);
      toast.success('Ingredient removed from archive');
      loadIngredients();
    } catch (error) {
       toast.error('Could not remove ingredient');
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-surface-200 p-8 md:p-10 shadow-premium">
      <header className="mb-10">
        <div className="flex items-center gap-3 text-primary-500 mb-2">
          <FiLayers size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Pantry Management</span>
        </div>
        <h3 className="text-2xl font-bold text-surface-900 tracking-tight">Recipe Ingredients</h3>
        <p className="text-surface-400 text-xs font-medium mt-1">Configure the essential components of your signature dish.</p>
      </header>

      {/* Add Ingredient Form */}
      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-[140px,1fr,1fr,auto] gap-4 items-end bg-surface-50/50 p-6 rounded-2xl border border-surface-100 mb-10">
        <Input
          label="ID"
          type="number"
          placeholder="001"
          value={form.ingredientId}
          onChange={(e) => setForm({ ...form, ingredientId: e.target.value })}
          required
        />
        <Input
          label="Quantity"
          placeholder="e.g. 500"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <Input
          label="Unit"
          placeholder="e.g. grams"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          required
        />
        <Button 
          type="submit" 
          variant="primary" 
          size="md" 
          isLoading={submitting}
          icon={<FiPlus />}
          className="h-12"
        >
          Add
        </Button>
      </form>

      {/* Ingredients List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {ingredients.map((item, idx) => (
            <motion.div 
              key={item.recipeIngredientId || item.ingredientId} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-4 px-6 rounded-2xl bg-white border border-surface-100 hover:border-primary-200 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-surface-50 flex items-center justify-center text-primary-500 group-hover:bg-primary-50 transition-colors">
                  <FiCheckCircle size={18} />
                </div>
                <div>
                  <p className="font-bold text-surface-900 leading-none">{item.name || `Essential #${item.ingredientId}`}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mt-1.5">
                    {item.quantity} {item.unit}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(item.ingredientId)}
                className="h-10 w-10 flex items-center justify-center rounded-xl text-surface-300 hover:text-danger hover:bg-danger/5 transition-all opacity-0 group-hover:opacity-100"
                title="Remove ingredient"
              >
                <FiTrash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {ingredients.length === 0 && !loading && (
          <div className="text-center py-12 grayscale opacity-30 border-2 border-dashed border-surface-100 rounded-[2rem]">
            <FiBox className="mx-auto mb-3" size={32} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Pantry is currently empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeIngredientsEditor;

