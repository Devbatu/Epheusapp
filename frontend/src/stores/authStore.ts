import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, AuthState } from '@/types'

interface AuthStore extends AuthState {
  login:  (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
  hasRole:       (role: string | string[]) => boolean
  hasPermission: (permission: string) => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,

      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),

      setUser: (user) =>
        set({ user }),

      hasRole: (role) => {
        const { user } = get()
        if (!user) return false
        const roles = Array.isArray(role) ? role : [role]
        return user.roles.some((r) => roles.includes(r.name))
      },

      hasPermission: (permission) => {
        const { user } = get()
        if (!user) return false
        if (user.roles.some((r) => r.name === 'super-admin')) return true
        return user.permissions.includes(permission)
      },
    }),
    {
      name:    'ephesus_auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
