import api from './axios.jsx'

// Adapter for shopping list API used by pages
export const shoppingListApi = {
  // existing API: GET /api/users/{userId}/shoppinglists
  getByUser: async (userId) => {
    const { data } = await api.get(`/users/${userId}/shoppinglists`)
    return data
  },

  // create a new shopping list for user
  create: async (payload) => {
    // payload expected to include userId and name
    const { userId, ...rest } = payload
    const { data } = await api.post(`/users/${userId}/shoppinglists`, rest)
    return data
  },

  // get details by list id
  getById: async (shoppingListId) => {
    const { data } = await api.get(`/shoppinglists/${shoppingListId}`)
    return data
  },

  // add item to a shopping list
  addItem: async (shoppingListId, payload) => {
    const { data } = await api.post(`/shoppinglists/${shoppingListId}/items`, payload)
    return data
  },

  // update item (full payload expected)
  updateItem: async (itemId, payload) => {
    const { data } = await api.patch(`/shoppinglists/items/${itemId}/check?isChecked=${payload.isChecked}`)
    return data
  },

  // remove item by id
  removeItem: async (itemId) => {
    const { data } = await api.delete(`/shoppinglists/items/${itemId}`)
    return data
  },

  // delete entire list
  remove: async (shoppingListId) => {
    const { data } = await api.delete(`/shoppinglists/${shoppingListId}`)
    return data
  }
}
