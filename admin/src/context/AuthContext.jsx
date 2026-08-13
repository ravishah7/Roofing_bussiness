import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import api, { setAccessToken, setUnauthorizedHandler, refreshAccessToken } from '@/lib/api'
 
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [status, setStatus] = useState('checking') // checking | authenticated | unauthenticated
 
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // best-effort — clear client state regardless
    }
    setAccessToken(null)
    setAdmin(null)
    setStatus('unauthenticated')
  }, [])
 
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAdmin(null)
      setStatus('unauthenticated')
    })
  }, [])
 
 
  const hasRunRef = useRef(false)
  useEffect(() => {
 
    let cancelled = false
    ;(async () => {
      try {
        await refreshAccessToken()
        const me = await api.get('/auth/me')
        if (!cancelled) {
          setAdmin(me.data.data)
          setStatus('authenticated')
        }
      } catch {
        if (!cancelled) setStatus('unauthenticated')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])
 
  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setAccessToken(data.data.accessToken)
    setAdmin(data.data.admin)
    setStatus('authenticated')
    return data.data.admin
  }, [])
 
  const refreshMe = useCallback(async () => {
    const { data } = await api.get('/auth/me')
    setAdmin(data.data)
    return data.data
  }, [])
 
  const value = {
    admin,
    status,
    isAuthenticated: status === 'authenticated',
    isChecking: status === 'checking',
    login,
    logout,
    refreshMe,
    hasRole: (...roles) => admin && roles.includes(admin.role),
  }
 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
 
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
 