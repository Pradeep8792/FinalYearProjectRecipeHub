import api from './axios.jsx'

export const favoriteApi = {
  getByUser: async (userId) => {
    const { data } = await api.get(`/favorites/user/${userId}`)
    return data
  },

  add: async (payload) => {
    const { data } = await api.post('/favorites', payload)
    return data
  },

  remove: async (userId, recipeId) => {
    const { data } = await api.delete(`/favorites?userId=${userId}&recipeId=${recipeId}`)
    return data
  }
}
