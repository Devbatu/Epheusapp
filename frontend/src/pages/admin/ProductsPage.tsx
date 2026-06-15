import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Package, Star } from 'lucide-react'
import { productsApi } from '@/services/api/products'
import { formatCurrency } from '@/utils/format'

export default function ProductsPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', search],
    queryFn: () => productsApi.list({ search: search || undefined, per_page: 24 }),
  })

  const products = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ürünler</h2>
          <p className="text-sm text-gray-500">Akdeniz ürün kataloğu — {data?.meta?.total ?? 0} ürün</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ürün veya SKU ara…"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:w-72"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400 dark:border-gray-800">
          <Package className="mb-2 h-8 w-8" />
          <p className="text-sm">Ürün bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300">
                    <Package className="h-10 w-10" />
                  </div>
                )}
                {p.is_featured && (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-medium text-white">
                    <Star className="h-3 w-3" /> Öne çıkan
                  </span>
                )}
                <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-900/90 dark:text-gray-300">
                  {p.category}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-amber-600">{p.brand}</p>
                <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                  {p.name}
                </h3>
                <p className="mt-1 text-xs text-gray-400">{p.sku}</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(p.base_price)}
                    </p>
                    <p className="text-xs text-gray-400">B2B: {formatCurrency(p.b2b_price)}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.status === 'active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {p.status === 'active' ? 'Aktif' : p.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
