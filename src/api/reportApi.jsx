import api from './axios.jsx'

export const reportApi = {
  create: async (payload) => {
    const { data } = await api.post('/reports', payload)
    return data
  }
}
