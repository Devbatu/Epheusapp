import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Minus, Plus, ShoppingCart, ChevronRight, Package, Truck, ShieldCheck, Leaf } from 'lucide-react'
import { toast } from 'sonner'
import { shopApi } from '@/services/api/shop'
import { useCartStore } from '@/stores/cartStore'
import { ProductCard } from '@/components/shop/ProductCard'
import { formatCurrency } from '@/utils/format'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Seo } from '@/components/shared/Seo'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [qty, setQty] = useState(1)
  const add = useCartStore((s) => s.add)

  const { data: product, isLoading } = useQuery({
    queryKey: ['shop', 'product', slug],
    queryFn: () => shopApi.product(slug!),
    enabled: !!slug,
  })

  if (isLoading || !product) {
    return <div className="py-32"><LoadingSpinner /></div>
  }

  const handleAdd = () => {
    add({ id: product.id, name: product.name, slug: product.slug, price: product.price, image_url: product.image_url }, qty)
    toast.success(`${qty} adet ${product.name} sepete eklendi`)
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Seo title={product.name} description={product.short_description ?? undefined} />
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link to="/" className="hover:text-gold-dark">Ana Sayfa</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/shop" className="hover:text-gold-dark">Mağaza</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 dark:text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-3xl bg-gray-50 dark:bg-gray-800">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="aspect-square w-full object-cover" />
          ) : (
            <div className="flex aspect-square items-center justify-center text-gray-300">
              <Package className="h-20 w-20" />
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gold-dark">{product.brand}</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
          <p className="mt-2 text-sm text-gray-500">{product.category} · SKU: {product.sku}</p>

          <p className="mt-6 text-4xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(product.price)}
          </p>
          <p className="mt-1 text-xs text-gray-400">KDV dahil</p>

          <p className="mt-6 leading-relaxed text-gray-600 dark:text-gray-300">
            {product.short_description}
          </p>

          {/* Quantity + add */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-gray-300 dark:border-gray-700">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center text-gray-500 hover:text-gold-dark">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold text-gray-900 dark:text-white">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="flex h-11 w-11 items-center justify-center text-gray-500 hover:text-gold-dark">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 font-semibold text-white shadow-lg transition-colors hover:bg-primary-dark"
            >
              <ShoppingCart className="h-5 w-5" />
              Sepete Ekle
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6 dark:border-gray-800">
            {[
              { icon: Truck, label: 'Hızlı Kargo' },
              { icon: Leaf, label: '%100 Doğal' },
              { icon: ShieldCheck, label: 'Güvenli Ödeme' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-2 text-center">
                <b.icon className="h-6 w-6 text-gold-dark" />
                <span className="text-xs text-gray-500">{b.label}</span>
              </div>
            ))}
          </div>

          {product.description && (
            <div className="mt-8 border-t border-gray-100 pt-6 dark:border-gray-800">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Ürün Açıklaması</h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {product.related?.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {product.related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
