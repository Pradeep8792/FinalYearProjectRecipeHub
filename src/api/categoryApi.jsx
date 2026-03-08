import api from './axios.jsx'

export const categoryApi = {
  getAll: async () => {
    const { data } = await api.get('/categories')
    return data
  }
}
