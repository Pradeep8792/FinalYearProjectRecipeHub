import axios from 'axios'
import { storage } from '../utils/storage.jsx'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = storage.getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const path = window.location.pathname

    const isAuthPage = path === '/login' || path === '/register'

    if (status === 401 && !isAuthPage) {
      storage.clearAuth()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api