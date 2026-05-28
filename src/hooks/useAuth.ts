import { useState, useCallback } from 'react'
import type { User } from '@/types'
import { authApi } from '@/api/client'

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  handleGoogleCallback: (code: string) => Promise<void>
  logout: () => void
}

const TOKEN_KEY = 'mailmind_token'
const USER_KEY = 'mailmind_user'

export function useAuthState(): AuthState {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [isLoading, setIsLoading] = useState(false)

  const persist = (token: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setToken(token); setUser(user)
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try { const r = await authApi.login(email, password); persist(r.token, r.user) }
    finally { setIsLoading(false) }
  }

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try { const r = await authApi.register(email, password, name); persist(r.token, r.user) }
    finally { setIsLoading(false) }
  }

  // Redirect to Google OAuth — browser navigates away, comes back with ?code=
  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true)
    try {
      const { url } = await authApi.getGoogleUrl()
      window.location.href = url
    } finally { setIsLoading(false) }
  }, [])

  // Called on return from Google with ?code= in URL
  const handleGoogleCallback = useCallback(async (code: string) => {
    setIsLoading(true)
    try { const r = await authApi.googleCallback(code); persist(r.token, r.user) }
    finally { setIsLoading(false) }
  }, [])

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null); setUser(null)
  }

  return { user, token, isLoading, login, register, loginWithGoogle, handleGoogleCallback, logout }
}
