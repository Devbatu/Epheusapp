import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Package, Plus, Pencil, Star, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { productsApi } from '@/services/api/products'
import { formatCurrency } from '@/utils/format'

const STATUS = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'inactive', label: 'Inactive' },
]

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', search, status],
    queryFn: () => productsApi.list({ search: search || undefined, status: status || undefined, per_page: 50 }),
  })

  const products = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary">Product Management</h2>
          <p className="text-sm text-text-light">{data?.meta?.total ?? 0} products in catalog</p>
        </div>
        <button onClick={() => toast.info('Product editor — coming soon in this demo')}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> New Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or SKU…"
            className="w-full rounded-lg border border-mist bg-surface py-2.5 pl-10 pr-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light" />
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-mist bg-surface py-2.5 pl-9 pr-8 text-sm focus:border-gold focus:outline-none">
            {STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-mist bg-surface">
        <table className="min-w-full divide-y divide-mist">
          <thead className="bg-cream">
            <tr>
              {['Product', 'Category', 'Brand', 'Retail', 'B2B', 'Status', ''].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                  <td key={j} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-mist" /></td>
                ))}</tr>
              ))
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="py-16 text-center text-sm text-text-light">
                <Package className="mx-auto mb-2 h-8 w-8 opacity-40" /> No products found.
              </td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-cream/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                      {p.image_url && <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
                        {p.name}
                        {p.is_featured && <Star className="h-3 w-3 fill-gold text-gold" />}
                      </p>
                      <p className="text-xs text-text-light">{p.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-charcoal/70">{p.category}</td>
                <td className="px-5 py-3 text-sm text-charcoal/70">{p.brand}</td>
                <td className="px-5 py-3 text-sm font-semibold text-primary">{formatCurrency(p.base_price)}</td>
                <td className="px-5 py-3 text-sm text-charcoal/70">{formatCurrency(p.b2b_price)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    p.status === 'active' ? 'bg-green-100 text-green-700'
                    : p.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-cream text-text-light'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => toast.info('Edit — coming soon in this demo')}
                    className="rounded-lg p-2 text-text-light transition-colors hover:bg-cream hover:text-gold-dark">
                    <Pencil className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
