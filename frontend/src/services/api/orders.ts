import api from '@/lib/api'
import type { Order, PaginatedResponse } from '@/types'

export const ordersApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Order>>('/branch/orders', { params }).then((r) => r.data),

  show: (id: string) =>
    api.get<{ order: Order }>(`/branch/orders/${id}`).then((r) => r.data.order),

  updateStatus: (id: string, status: string) =>
    api.patch<{ order: Order; message: string }>(`/branch/orders/${id}/status`, { status }).then((r) => r.data),

  customerOrders: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Order>>('/customer/orders', { params }).then((r) => r.data),

  placeCustomerOrder: (payload: unknown) =>
    api.post<{ order: Order; message: string }>('/customer/orders', payload).then((r) => r.data),

  cancelCustomerOrder: (id: string) =>
    api.post<{ message: string }>(`/customer/orders/${id}/cancel`).then((r) => r.data),

  dealerOrders: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Order>>('/dealer/orders', { params }).then((r) => r.data),

  placeDealerOrder: (payload: unknown) =>
    api.post<{ order: Order; message: string }>('/dealer/orders', payload).then((r) => r.data),
}
