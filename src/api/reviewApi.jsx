import api from './axios.jsx'

export const reviewApi = {
  getByRecipe: async (recipeId) => {
    const { data } = await api.get(`/reviews/recipe/${recipeId}`)
    return data
  },
  create: async (payload) => {
    const { data } = await api.post('/reviews', payload)
    return data
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/reviews/${id}`, payload)
    return data
  },
  remove: async (id) => {
    const { data } = await api.delete(`/reviews/${id}`)
    return data
  }
}
