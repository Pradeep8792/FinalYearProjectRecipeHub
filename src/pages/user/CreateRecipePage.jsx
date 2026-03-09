import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlusCircle, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RecipeForm from '../../components/recipe/RecipeForm';
import RecipeImageUploader from '../../components/recipe/RecipeImageUploader';
import { recipeApi } from '../../api/recipeApi';
import usePageTitle from '../../hooks/usePageTitle';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth.jsx';

const CreateRecipePage = () => {
  usePageTitle('Create Recipe | RecipeHub');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipeId, setRecipeId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Create the recipe details
  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      const response = await recipeApi.create({ ...payload, userId: user.userId });
      setRecipeId(response.recipeId);
      toast.success('Recipe created! Now add some photos.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create recipe');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        {/* Page header */}
        <header className="max-w-3xl">
          <div className="flex items-center gap-3 text-primary-500 mb-2">
            <FiPlusCircle size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">New Recipe</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-surface-900 tracking-tight leading-tight">
            Create a Recipe
          </h1>
          <p className="mt-3 text-surface-500 font-medium leading-relaxed">
            Share your culinary creation with the RecipeHub community.
          </p>
        </header>

        {/* Step indicator */}
        <div className="flex items-center gap-4">
          {/* Step 1 */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
            !recipeId ? 'bg-primary-500 text-white' : 'bg-success/10 text-success'
          }`}>
            {recipeId ? <FiCheckCircle /> : <span className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>}
            Recipe Details
          </div>
          <div className="h-px flex-1 bg-surface-200" />
          {/* Step 2 */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
            recipeId ? 'bg-primary-500 text-white' : 'bg-surface-100 text-surface-400'
          }`}>
            <span className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
            Add Photos
          </div>
        </div>

        {/* Step content */}
        {!recipeId ? (
          <RecipeForm onSubmit={handleSubmit} submitting={submitting} />
        ) : (
          <div className="space-y-8">
            {/* Image uploader */}
            <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8">
              <h2 className="text-xl font-bold text-surface-900 mb-6">Upload Recipe Photos</h2>
              <RecipeImageUploader recipeId={recipeId} />
            </div>

            {/* Action buttons after images */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-end">
              <Button
                variant="secondary"
                onClick={() => navigate('/my-recipes')}
              >
                View My Recipes
              </Button>
              <Button
                variant="primary"
                icon={<FiArrowRight />}
                onClick={() => navigate(`/recipes/${recipeId}`)}
              >
                View Recipe
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateRecipePage;
