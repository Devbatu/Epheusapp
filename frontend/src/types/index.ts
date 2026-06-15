// ─── Core API Response Types ───────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  branch_id?: string
  branch?: Branch
  roles: Role[]
  permissions: string[]
  two_factor_enabled: boolean
  is_active: boolean
  last_login_at?: string
  created_at: string
}

export interface Role {
  id: number
  name: string
  permissions: string[]
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// ─── Branch ────────────────────────────────────────────────────────────────

export type BranchStatus = 'active' | 'inactive' | 'suspended'
export type BranchType   = 'flagship' | 'standard' | 'kiosk' | 'warehouse_only'

export interface Branch {
  id: string
  name: string
  slug: string
  code: string
  type: BranchType
  status: BranchStatus
  country: string
  city: string
  district?: string
  address: string
  phone?: string
  email?: string
  manager_name?: string
  warehouses_count?: number
  created_at: string
}

// ─── Warehouse ─────────────────────────────────────────────────────────────

export interface Warehouse {
  id: string
  branch_id: string
  branch?: Branch
  name: string
  code: string
  type: 'main' | 'cold' | 'dry' | 'returns' | 'damaged'
  status: 'active' | 'inactive'
  is_default: boolean
  capacity?: number
  created_at: string
}

// ─── Product ───────────────────────────────────────────────────────────────

export type ProductStatus = 'active' | 'inactive' | 'draft'
export type ProductType   = 'simple' | 'variant' | 'bundle'

export interface ProductCategory {
  id: string
  parent_id?: string
  name: string
  slug: string
  image?: string
  is_active: boolean
  children?: ProductCategory[]
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
  is_active: boolean
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  sku: string
  barcode?: string
  price?: number
  weight?: number
  attributes: Record<string, string>
  status: 'active' | 'inactive'
}

export interface Product {
  id: string
  brand_id?: string
  brand?: Brand
  category_id: string
  category?: ProductCategory
  name: string
  slug: string
  sku: string
  barcode?: string
  description?: string
  short_description?: string
  type: ProductType
  status: ProductStatus
  is_featured: boolean
  has_expiration: boolean
  base_price: number
  cost_price?: number
  b2b_price?: number
  unit: string
  weight?: number
  tax_rate: number
  min_stock_alert: number
  min_order_qty: number
  variants?: ProductVariant[]
  images?: MediaItem[]
  created_at: string
}

export interface MediaItem {
  id: number
  name: string
  file_name: string
  original_url: string
  preview_url?: string
  conversions?: Record<string, string>
}

// ─── Inventory ─────────────────────────────────────────────────────────────

export interface Stock {
  id: string
  branch_id: string
  warehouse_id: string
  warehouse?: Warehouse
  product_id: string
  product?: Product
  variant_id?: string
  variant?: ProductVariant
  batch_id?: string
  quantity: number
  reserved_quantity: number
  damaged_quantity: number
  average_cost: number
}

export interface StockMovement {
  id: string
  type: string
  quantity: number
  quantity_before: number
  quantity_after: number
  product?: Product
  notes?: string
  moved_at: string
  performed_by?: string
}

// ─── Transfer ──────────────────────────────────────────────────────────────

export type TransferStatus = 'pending' | 'approved' | 'rejected' | 'shipped' | 'received' | 'cancelled'

export interface TransferItem {
  id: string
  product_id: string
  product?: Product
  variant_id?: string
  variant?: ProductVariant
  requested_quantity: number
  approved_quantity?: number
  shipped_quantity?: number
  received_quantity?: number
}

export interface Transfer {
  id: string
  transfer_number: string
  from_branch_id: string
  from_branch?: Branch
  to_branch_id: string
  to_branch?: Branch
  from_warehouse_id: string
  to_warehouse_id: string
  status: TransferStatus
  items: TransferItem[]
  notes?: string
  rejection_reason?: string
  shipping_carrier?: string
  tracking_number?: string
  approved_at?: string
  shipped_at?: string
  received_at?: string
  created_at: string
}

// ─── Order ─────────────────────────────────────────────────────────────────

export type OrderStatus   = 'draft' | 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'returned' | 'cancelled'
export type OrderChannel  = 'customer' | 'dealer' | 'branch' | 'pos'
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded' | 'failed'

export interface OrderItem {
  id: string
  product_id: string
  product_name: string
  variant_name?: string
  sku: string
  quantity: number
  unit_price: number
  discount_amount: number
  tax_amount: number
  subtotal: number
}

export interface Order {
  id: string
  order_number: string
  channel: OrderChannel
  status: OrderStatus
  payment_status: PaymentStatus
  subtotal: number
  discount_amount: number
  tax_amount: number
  shipping_amount: number
  total: number
  currency: string
  items: OrderItem[]
  shipping_address?: Record<string, string>
  tracking_number?: string
  shipped_at?: string
  delivered_at?: string
  created_at: string
}

// ─── Dealer ────────────────────────────────────────────────────────────────

export type DealerStatus = 'pending' | 'approved' | 'rejected' | 'suspended'

export interface Dealer {
  id: string
  company_name: string
  tax_number: string
  contact_name: string
  email: string
  phone: string
  status: DealerStatus
  credit_limit: number
  current_balance: number
  discount_rate: number
  payment_terms_days: number
  created_at: string
}

// ─── Supplier ──────────────────────────────────────────────────────────────

export interface Supplier {
  id: string
  name: string
  code: string
  contact_name?: string
  email?: string
  phone?: string
  country: string
  city?: string
  is_active: boolean
  total_purchased: number
  outstanding_balance: number
}

// ─── Analytics ─────────────────────────────────────────────────────────────

export interface DashboardKPI {
  today_sales: { count: number; amount: number }
  monthly_revenue: { total: number; orders: number; avg_order: number }
  low_stock_products: Stock[]
  pending_transfers: number
  dealer_revenue: { orders: number; revenue: number }
  top_products: Array<{ product_id: string; name: string; total_qty: number; total_revenue: number }>
}

// ─── Notification ──────────────────────────────────────────────────────────

export interface Notification {
  id: string
  type: string
  channel: 'in_app' | 'email' | 'sms' | 'whatsapp'
  title: string
  body: string
  data?: Record<string, unknown>
  action_url?: string
  is_read: boolean
  read_at?: string
  created_at: string
}
