import api from '@/lib/api'
import type { Transfer, PaginatedResponse } from '@/types'

export interface CreateTransferPayload {
  from_branch_id:    string
  to_branch_id:      string
  from_warehouse_id: string
  to_warehouse_id:   string
  notes?:            string
  items: Array<{
    product_id: string
    variant_id?: string
    batch_id?:  string
    quantity:   number
  }>
}

export const transfersApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Transfer>>('/branch/transfers', { params }).then((r) => r.data),

  show: (id: string) =>
    api.get<{ transfer: Transfer }>(`/branch/transfers/${id}`).then((r) => r.data.transfer),

  create: (payload: CreateTransferPayload) =>
    api.post<{ transfer: Transfer; message: string }>('/branch/transfers', payload).then((r) => r.data),

  approve: (id: string) =>
    api.post<{ transfer: Transfer; message: string }>(`/branch/transfers/${id}/approve`).then((r) => r.data),

  reject: (id: string, reason: string) =>
    api.post<{ transfer: Transfer; message: string }>(`/branch/transfers/${id}/reject`, { reason }).then((r) => r.data),

  ship: (id: string, data: { tracking_number?: string; shipping_carrier?: string; items: Record<string, { shipped_quantity: number }> }) =>
    api.post<{ transfer: Transfer; message: string }>(`/branch/transfers/${id}/ship`, data).then((r) => r.data),

  receive: (id: string, data: { items: Record<string, { received_quantity: number }> }) =>
    api.post<{ transfer: Transfer; message: string }>(`/branch/transfers/${id}/receive`, data).then((r) => r.data),

  cancel: (id: string, reason: string) =>
    api.post<{ message: string }>(`/branch/transfers/${id}/cancel`, { reason }).then((r) => r.data),
}
