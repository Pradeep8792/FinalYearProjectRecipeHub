import api from './axios.jsx'

export const recipeApi = {
  getAll: async () => {
    const { data } = await api.get('/recipes')
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/recipes/${id}`)
    return data
  },

  search: async (query) => {
    const { data } = await api.get(`/recipes/search?query=${encodeURIComponent(query)}`)
    return data
  },

  getTop: async (count = 4) => {
    const { data } = await api.get(`/recipes/top?count=${count}`)
    return data
  },

  getByCategory: async (categoryId) => {
    const { data } = await api.get(`/recipes/category/${categoryId}`)
    return data
  },

  getByUser: async (userId) => {
    const { data } = await api.get(`/recipes/user/${userId}`)
    return data
  },

  create: async (payload) => {
    const { data } = await api.post('/recipes', payload)
    return data
  },

  update: async (id, payload) => {
    const { data } = await api.put(`/recipes/${id}`, payload)
    return data
  },

  remove: async (id) => {
    const { data } = await api.delete(`/recipes/${id}`)
    return data
  },

  uploadImage: async (recipeId, file, isPrimary = true) => {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await api.post(
      `/recipes/${recipeId}/images?isPrimary=${isPrimary}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    return data
  },

  getImages: async (recipeId) => {
    const { data } = await api.get(`/recipes/${recipeId}/images`)
    return data
  },

  getIngredients: async (recipeId) => {
    const { data } = await api.get(`/recipes/${recipeId}/ingredients`)
    return data
  },

  addIngredient: async (recipeId, payload) => {
    const { data } = await api.post(`/recipes/${recipeId}/ingredients`, payload)
    return data
  },

  deleteIngredient: async (recipeId, ingredientId) => {
    const { data } = await api.delete(`/recipes/${recipeId}/ingredients/${ingredientId}`)
    return data
  }
}
