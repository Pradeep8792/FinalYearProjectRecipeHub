import api from './axios.jsx'

const unwrap = (response) => response?.data

export const adminApi = {
  // Dashboard
  dashboardOverview: async (recentRecipeCount = 5) => {
    const res = await api.get(`/admin/dashboard/overview?recentRecipeCount=${recentRecipeCount}`)
    return unwrap(res)
  },

  dashboardCategories: async () => {
    const res = await api.get('/admin/dashboard/categories')
    return unwrap(res)
  },

  dashboardReports: async () => {
    const res = await api.get('/admin/dashboard/reports')
    return unwrap(res)
  },

  // Analytics
  analyticsOverview: async () => {
    const res = await api.get('/admin/analytics/overview')
    return unwrap(res)
  },

  analyticsCategories: async () => {
    const res = await api.get('/admin/analytics/categories')
    return unwrap(res)
  },

  analyticsReports: async () => {
    const res = await api.get('/admin/analytics/reports')
    return unwrap(res)
  },

  // Tables
  getUsersTable: async () => {
    const res = await api.get('/admin/analytics/users-table')
    return unwrap(res)
  },

  getRecipesTable: async () => {
    const res = await api.get('/admin/analytics/recipes-table')
    return unwrap(res)
  },

  searchRecipes: async (query) => {
    const res = await api.get(`/admin/analytics/recipes-search?query=${encodeURIComponent(query)}`)
    return unwrap(res)
  },

  // Users
  getUsers: async () => {
    const res = await api.get('/admin/users')
    return unwrap(res)
  },

  getUserById: async (id) => {
    const res = await api.get(`/admin/users/${id}`)
    return unwrap(res)
  },

  updateUser: async (id, payload) => {
    const res = await api.put(`/admin/users/${id}`, payload)
    return unwrap(res)
  },

  updateUserStatus: async (id, isActive) => {
    const res = await api.patch(`/admin/users/${id}/status?isActive=${isActive}`)
    return unwrap(res)
  },

  updateUserRole: async (id, role) => {
    const res = await api.patch(`/admin/users/${id}/role?role=${role}`)
    return unwrap(res)
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`)
    return unwrap(res)
  },

  // Recipes
  getRecipes: async () => {
    const res = await api.get('/admin/recipes')
    return unwrap(res)
  },

  getRecipeById: async (id) => {
    const res = await api.get(`/admin/recipes/${id}`)
    return unwrap(res)
  },

  updateRecipe: async (id, payload) => {
    const res = await api.put(`/admin/recipes/${id}`, payload)
    return unwrap(res)
  },

  updateRecipeStatus: async (id, status) => {
    const res = await api.patch(`/admin/recipes/${id}/status?status=${status}`)
    return unwrap(res)
  },

  deleteRecipe: async (id) => {
    const res = await api.delete(`/admin/recipes/${id}`)
    return unwrap(res)
  },

  // Reports
  getReports: async () => {
    const res = await api.get('/admin/reports')
    return unwrap(res)
  },

  getReportsByStatus: async (status) => {
    const res = await api.get(`/admin/reports/status/${status}`)
    return unwrap(res)
  },

  resolveReport: async (id, action = 'Resolve') => {
    if (action === 'Resolve') {
      const res = await api.patch(`/admin/reports/${id}/status?status=Resolved`)
      return unwrap(res)
    }

    const res = await api.delete(`/admin/reports/${id}`)
    return unwrap(res)
  },

  deleteReport: async (id) => {
    const res = await api.delete(`/admin/reports/${id}`)
    return unwrap(res)
  }
}