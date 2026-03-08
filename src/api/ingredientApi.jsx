import api from './axios.jsx'

export const ingredientApi = {
    getAll: async () => (await api.get('/ingredients')).data,
    create: async (payload) => (await api.post('/ingredients', payload)).data,
    update: async (id, payload) => (await api.put(`/ingredients/${id}`, payload)).data,
    remove: async (id) => (await api.delete(`/ingredients/${id}`)).data,

    // Recipe-specific ingredients
    getByRecipe: async (recipeId) => (await api.get(`/recipes/${recipeId}/ingredients`)).data,
    addToRecipe: async (recipeId, payload) => (await api.post(`/recipes/${recipeId}/ingredients`, payload)).data,
    removeFromRecipe: async (recipeId, ingredientId) => (await api.delete(`/recipes/${recipeId}/ingredients/${ingredientId}`)).data
}
