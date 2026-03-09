import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiEdit3, FiArrowLeft, FiImage } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import RecipeForm from '../../components/recipe/RecipeForm';
import RecipeImageUploader from '../../components/recipe/RecipeImageUploader';
import { recipeApi } from '../../api/recipeApi';
import usePageTitle from '../../hooks/usePageTitle';
import Button from '../../components/common/Button';

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState('details'); // 'details' or 'images'

  usePageTitle(`Edit Recipe | RecipeHub`);

  useEffect(() => {
    recipeApi.getById(id)
      .then(setRecipe)
      .catch(() => toast.error('Failed to load recipe'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (payload) => {
    setSubmitting(true);
    try {
      await recipeApi.update(id, payload);
      toast.success('Recipe updated successfully!');
      navigate('/my-recipes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader variant="primary" />
          <p className="mt-6 text-sm font-bold text-surface-400 uppercase tracking-widest animate-pulse">
            Loading recipe...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!recipe) {
    return (
      <DashboardLayout>
        <div className="text-center py-40">
          <p className="text-surface-500 font-medium mb-4">Recipe not found.</p>
          <Link to="/my-recipes">
            <Button variant="primary">Back to My Recipes</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              to="/my-recipes"
              className="inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-primary-600 mb-4 transition-colors"
            >
              <FiArrowLeft size={16} />
              Back to My Recipes
            </Link>
            <div className="flex items-center gap-3 text-primary-500 mb-1">
              <FiEdit3 size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Editing</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-surface-900 tracking-tight line-clamp-1">
              {recipe.title}
            </h1>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 bg-surface-100 p-1 rounded-xl">
            <button
              onClick={() => setTab('details')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                tab === 'details' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <FiEdit3 size={14} /> Details
            </button>
            <button
              onClick={() => setTab('images')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                tab === 'images' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <FiImage size={14} /> Photos
            </button>
          </div>
        </div>

        {/* Tab content */}
        {tab === 'details' ? (
          <RecipeForm
            initialValues={recipe}
            onSubmit={handleUpdate}
            submitting={submitting}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-surface-900 mb-6">Recipe Photos</h2>
            <RecipeImageUploader recipeId={Number(id)} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditRecipePage;
