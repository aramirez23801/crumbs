import { create } from 'zustand'
import type { User } from '../api/auth'

interface AuthState {
  user: User | null
  apiKey: string | null
  isAuthenticated: boolean
  setAuth: (user: User, apiKey: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  apiKey: localStorage.getItem('crumbs_api_key'),
  isAuthenticated: !!localStorage.getItem('crumbs_api_key'),

  setAuth: (user, apiKey) => {
    localStorage.setItem('crumbs_api_key', apiKey)
    set({ user, apiKey, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('crumbs_api_key')
    set({ user: null, apiKey: null, isAuthenticated: false })
  },
}))
