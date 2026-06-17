import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Package } from 'lucide-react'
import { shopApi } from '@/services/api/shop'
import { ProductCard } from '@/components/shop/ProductCard'

export default function DealerShopPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['dealer', 'shop', search],
    queryFn: () => shopApi.products({ search: search || undefined, per_page: 24 }),
  })
  const products = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary">Wholesale Catalog</h2>
          <p className="text-sm text-text-light">Browse products at your dealer pricing</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…"
            className="w-full rounded-lg border border-mist bg-surface py-2.5 pl-10 pr-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 sm:w-72" />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-mist" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-mist text-text-light">
          <Package className="mb-2 h-8 w-8" /> No products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
