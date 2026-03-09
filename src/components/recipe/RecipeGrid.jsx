import React from 'react';
import RecipeCard from './RecipeCard';
import { motion } from 'framer-motion';

const RecipeGrid = ({ recipes = [] }) => {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-20 grayscale opacity-50">
        <p className="text-surface-400 font-medium">No recipes found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe, idx) => (
        <motion.div
          key={recipe.recipeId || recipe.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <RecipeCard recipe={recipe} />
        </motion.div>
      ))}
    </div>
  );
};

export default RecipeGrid;