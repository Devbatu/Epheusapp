import api from '@/lib/api'
import type { Branch, PaginatedResponse } from '@/types'

export const branchesApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Branch>>('/admin/branches', { params }).then((r) => r.data),

  show: (id: string) =>
    api.get<{ data: Branch }>(`/admin/branches/${id}`).then((r) => r.data.data),

  toggleStatus: (id: string) =>
    api.patch<{ data: Branch }>(`/admin/branches/${id}/toggle-status`).then((r) => r.data.data),
}
