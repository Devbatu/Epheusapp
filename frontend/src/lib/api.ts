import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30_000,
})

// ─── Request interceptor — attach token ───────────────────────────────────

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response interceptor — handle errors ─────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const status  = error.response?.status
    const message = error.response?.data?.message

    if (status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (status === 403) {
      toast.error('You do not have permission to perform this action.')
    }

    if (status === 422) {
      const errors = error.response?.data?.errors
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg))
      } else if (message) {
        toast.error(message)
      }
    }

    if (status === 429) {
      toast.error('Too many requests. Please wait before trying again.')
    }

    if (status && status >= 500) {
      toast.error('A server error occurred. Please try again later.')
    }

    return Promise.reject(error)
  },
)

export default api
