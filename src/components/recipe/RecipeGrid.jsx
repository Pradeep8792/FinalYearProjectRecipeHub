import RecipeCard from './RecipeCard'

function RecipeGrid({ recipes = [] }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.recipeId || recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}

export default RecipeGrid