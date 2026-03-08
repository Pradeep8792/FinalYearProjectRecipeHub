import { createContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/authApi.jsx'
import { storage } from '../utils/storage.jsx'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storage.getUser())
  const [token, setToken] = useState(storage.getToken())
  // Start loading while we hydrate auth state from storage to avoid
  // route flash / redirect races on initial app load.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) storage.setToken(token)
    else storage.removeToken()
  }, [token])

  useEffect(() => {
    if (user) storage.setUser(user)
    else storage.removeUser()
  }, [user])

  // Hydration complete: turn off initial loading after mount.
  useEffect(() => {
    // Defer to next tick so callers reading `loading` during mount see true.
    const id = setTimeout(() => setLoading(false), 0)
    return () => clearTimeout(id)
  }, [])

  const login = async (payload) => {
    setLoading(true)
    try {
      const data = await authApi.login(payload)
      setToken(data.token)
      setUser({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role
      })
      return data
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      return await authApi.register(payload)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    storage.clearAuth()
  }

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'Admin',
    login,
    register,
    logout
  }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
