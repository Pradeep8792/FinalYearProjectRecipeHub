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
  },

  // POST /api/users/{id}/profile-photo
  uploadPhoto: async (id, formData) => {
    const { data } = await api.post(`/users/${id}/profile-photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  },

  // GET /api/users/{id}/profile-photo — returns blob URL
  getPhotoUrl: (id) => `/users/${id}/profile-photo`
}
