import api from '@/lib/api'
import type { PaginatedResponse } from '@/types'

export interface ProductListItem {
  id: string
  name: string
  slug: string
  sku: string
  barcode?: string
  status: 'active' | 'inactive' | 'draft'
  is_featured: boolean
  base_price: number
  b2b_price: number
  cost_price: number
  unit: string
  tax_rate: number
  image_url?: string
  brand?: string
  category?: string
  short_description?: string
  created_at: string
}

export const productsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<ProductListItem>>('/admin/products', { params }).then((r) => r.data),

  show: (id: string) =>
    api.get<{ data: ProductListItem }>(`/admin/products/${id}`).then((r) => r.data.data),
}
