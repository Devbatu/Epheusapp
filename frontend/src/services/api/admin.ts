import api from '@/lib/api'
import type { PaginatedResponse } from '@/types'

export const adminApi = {
  users: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<any>>('/admin/users', { params }).then((r) => r.data),

  suppliers: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<any>>('/admin/suppliers', { params }).then((r) => r.data),

  dealers: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<any>>('/admin/dealers', { params }).then((r) => r.data),

  dealer: (id: string) =>
    api.get<{ data: any }>(`/admin/dealers/${id}`).then((r) => r.data.data),

  approveDealer: (id: string) =>
    api.post(`/admin/dealers/${id}/approve`).then((r) => r.data),

  rejectDealer: (id: string, reason: string) =>
    api.post(`/admin/dealers/${id}/reject`, { reason }).then((r) => r.data),

  transfers: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<any>>('/admin/transfers', { params }).then((r) => r.data),

  reports: {
    sales:          () => api.get<{ data: any }>('/admin/reports/sales').then((r) => r.data.data),
    stock:          () => api.get<{ data: any[] }>('/admin/reports/stock').then((r) => r.data.data),
    profitability:  () => api.get<{ data: any[] }>('/admin/reports/profitability').then((r) => r.data.data),
    branchPerf:     () => api.get<{ data: any[] }>('/admin/reports/branch-performance').then((r) => r.data.data),
    dealerSales:    () => api.get<{ data: any[] }>('/admin/reports/dealer-sales').then((r) => r.data.data),
  },
}
