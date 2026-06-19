import { createContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/auth.api'
import { MOCK_USERS } from '../mocks/mockData'

export const AuthContext = createContext(null)

const USE_MOCK = false

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restore = async () => {
      try {
        const token = sessionStorage.getItem('accessToken')
        if (!token) { setLoading(false); return }
        if (USE_MOCK) {
          const stored = localStorage.getItem('mockUser')
          if (stored) setUser(JSON.parse(stored))
        } else {
          const resp = await authApi.getMe()
          setUser(resp.data.data)
        }
      } catch {
        sessionStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      } finally {
        setLoading(false)
      }
    }
    restore()
  }, [])

  const login = useCallback(async (email, password) => {
    if (USE_MOCK) {
      const found = MOCK_USERS.find((u) => u.email === email)
      if (!found || password !== 'password') {
        throw new Error('Invalid email or password')
      }
      const fakeToken = `mock-token-${found.id}`
      sessionStorage.setItem('accessToken', fakeToken)
      localStorage.setItem('refreshToken', `mock-refresh-${found.id}`)
      localStorage.setItem('mockUser', JSON.stringify(found))
      setUser(found)
      return found
    }
    const resp = await authApi.login(email, password)
    const { accessToken, refreshToken, user: userData } = resp.data.data
    sessionStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(async () => {
    try {
      if (!USE_MOCK) {
        const refreshToken = localStorage.getItem('refreshToken')
        await authApi.logout(refreshToken)
      }
    } finally {
      sessionStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
    }
  }, [])

  const hasRole = useCallback(
    (...roles) => user && roles.includes(user.role),
    [user]
  )

  return (
    <AuthContext.Provider
      value={{ user, login, logout, hasRole, isAuthenticated: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
