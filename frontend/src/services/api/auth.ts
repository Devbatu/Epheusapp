import api from '@/lib/api'
import type { User } from '@/types'

export interface LoginPayload {
  email:    string
  password: string
}

export interface LoginResponse {
  user?:          User
  token?:         string
  requires_2fa?:  boolean
  two_fa_token?:  string
  message:        string
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<LoginResponse>('/auth/login', payload).then((r) => r.data),

  logout: () =>
    api.post('/auth/logout').then((r) => r.data),

  me: () =>
    api.get<{ user: User }>('/auth/me').then((r) => r.data.user),

  refresh: () =>
    api.post<{ token: string }>('/auth/refresh').then((r) => r.data.token),

  forgotPassword: (email: string) =>
    api.post('/auth/password/forgot', { email }).then((r) => r.data),

  resetPassword: (data: { token: string; email: string; password: string; password_confirmation: string }) =>
    api.post('/auth/password/reset', data).then((r) => r.data),

  verify2fa: (code: string, twoFaToken: string) =>
    api.post('/auth/2fa/verify', { code, two_fa_token: twoFaToken }).then((r) => r.data),
}
