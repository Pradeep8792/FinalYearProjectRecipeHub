import api from './axios.jsx'

export const authApi = {
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    return data
  },

  login: async (payload) => {
    const { data } = await api.post('/auth/login', payload)
    return data
  }
}
