import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, Package } from 'lucide-react'
import { shopApi } from '@/services/api/shop'
import { ProductCard } from '@/components/shop/ProductCard'
import { Seo } from '@/components/shared/Seo'

export default function ShopPage() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? ''
  const sort     = params.get('sort') ?? ''
  const search   = params.get('search') ?? ''

  const { data: categories } = useQuery({ queryKey: ['shop', 'categories'], queryFn: shopApi.categories })
  const { data, isLoading } = useQuery({
    queryKey: ['shop', 'products', category, sort, search],
    queryFn: () => shopApi.products({
      category: category || undefined,
      sort: sort || undefined,
      search: search || undefined,
      per_page: 24,
    }),
  })

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    value ? next.set(key, value) : next.delete(key)
    setParams(next)
  }

  const products = data?.data ?? []
  const activeCat = categories?.find((c) => c.slug === category)

  return (
    <div>
      <Seo
        title={activeCat ? activeCat.name : 'Mağaza'}
        description="Premium Akdeniz ürünleri: zeytinyağı, zeytin, peynir, baklava, kuruyemiş ve daha fazlası. Filtreleyin, keşfedin, sipariş verin."
      />

      {/* Page banner */}
      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Koleksiyon</p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-white">
            {activeCat ? activeCat.name : 'Tüm Ürünler'}
          </h1>
          <p className="mt-2 text-sm text-cream/70">{data?.meta?.total ?? 0} ürün bulundu</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light" />
              <input
                defaultValue={search}
                onChange={(e) => setParam('search', e.target.value)}
                placeholder="Ürün ara…"
                className="w-full rounded-full border border-mist bg-surface py-2.5 pl-10 pr-4 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>

            <div className="rounded-2xl border border-mist bg-surface p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                <SlidersHorizontal className="h-4 w-4 text-gold-dark" /> Kategoriler
              </h3>
              <div className="space-y-1">
                <button onClick={() => setParam('category', '')}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${!category ? 'bg-primary font-medium text-cream' : 'text-text-light hover:bg-cream'}`}>
                  Tümü
                </button>
                {(categories ?? []).map((c) => (
                  <button key={c.id} onClick={() => setParam('category', c.slug)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${category === c.slug ? 'bg-primary font-medium text-cream' : 'text-text-light hover:bg-cream'}`}>
                    {c.name}
                    <span className="text-xs opacity-60">{c.products_count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-mist bg-surface p-5">
              <h3 className="mb-3 text-sm font-semibold text-primary">Sıralama</h3>
              <select value={sort} onChange={(e) => setParam('sort', e.target.value)}
                className="w-full rounded-lg border border-mist bg-cream px-3 py-2 text-sm focus:border-gold focus:outline-none">
                <option value="">Öne çıkanlar</option>
                <option value="price_asc">Fiyat: Artan</option>
                <option value="price_desc">Fiyat: Azalan</option>
                <option value="name">İsim (A-Z)</option>
              </select>
            </div>
          </aside>

          {/* Products */}
          <div>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-2xl bg-mist" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-mist text-text-light">
                <Package className="mb-2 h-8 w-8" />
                <p className="text-sm">Bu kritere uygun ürün bulunamadı.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
