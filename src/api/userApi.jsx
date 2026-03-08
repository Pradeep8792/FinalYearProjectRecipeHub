import api from './axios.jsx'

export const userApi = {
  getProfile: async (id) => {
    const { data } = await api.get(`/users/${id}`)
    return data
  },

  updateProfile: async (id, payload) => {
    const { data } = await api.put(`/users/${id}`, payload)
    return data
  },

  getDashboard: async (userId) => {
    const { data } = await api.get(`/users/${userId}/dashboard`)
    return data
  }
}
