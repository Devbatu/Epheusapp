import api from '@/lib/api'
import type { PaginatedResponse } from '@/types'

export interface ShopProduct {
  id: string
  name: string
  slug: string
  sku: string
  price: number
  image_url?: string
  brand?: string
  category?: string
  category_slug?: string
  is_featured: boolean
  short_description?: string
}

export interface ShopProductDetail extends ShopProduct {
  description?: string
  barcode?: string
  unit?: string
  origin?: string
  tax_rate?: number
  images?: string[]
  related: ShopProduct[]
}

export interface ShopCategory {
  id: string
  name: string
  slug: string
  products_count: number
}

export const shopApi = {
  products: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<ShopProduct>>('/shop/products', { params }).then((r) => r.data),

  product: (slug: string) =>
    api.get<{ data: ShopProductDetail }>(`/shop/products/${slug}`).then((r) => r.data.data),

  categories: () =>
    api.get<{ data: ShopCategory[] }>('/shop/categories').then((r) => r.data.data),
}
