import api from './axios.jsx'

export const mealPlanApi = {
  getByUser: async (userId) => {
    const { data } = await api.get(`/mealplans/user/${userId}`)
    return data
  },

  create: async (payload) => {
    const { data } = await api.post('/mealplans', payload)
    return data
  },

  update: async (id, payload) => {
    const { data } = await api.put(`/mealplans/${id}`, payload)
    return data
  },

  getByRange: async (userId, startDate, endDate) => {
    const { data } = await api.get(`/mealplans/user/${userId}/range?startDate=${startDate}&endDate=${endDate}`)
    return data
  },

  remove: async (id) => {
    const { data } = await api.delete(`/mealplans/${id}`)
    return data
  }
}
