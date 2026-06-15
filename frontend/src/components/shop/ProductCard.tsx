import { Link } from 'react-router-dom'
import { ShoppingBag, Package, Star } from 'lucide-react'
import { toast } from 'sonner'
import type { ShopProduct } from '@/services/api/shop'
import { useCartStore } from '@/stores/cartStore'
import { formatCurrency } from '@/utils/format'

export function ProductCard({ product }: { product: ShopProduct }) {
  const add = useCartStore((s) => s.add)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    add({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image_url: product.image_url,
    })
    toast.success(`${product.name} sepete eklendi`)
  }

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-mist bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-2xl hover:shadow-primary/10"
    >
      <div className="relative aspect-square overflow-hidden bg-cream">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gold/30">
            <Package className="h-12 w-12" />
          </div>
        )}

        {product.is_featured && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-primary-dark shadow">
            <Star className="h-3 w-3 fill-current" /> Öne Çıkan
          </span>
        )}

        <button
          onClick={handleAdd}
          className="absolute bottom-3 right-3 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-primary text-gold opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-gold hover:text-primary-dark"
          aria-label="Sepete ekle"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-dark">{product.brand}</p>
        <h3 className="mt-1.5 line-clamp-2 flex-1 font-heading text-base font-semibold leading-snug text-primary">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-primary">{formatCurrency(product.price)}</p>
          <span className="text-xs text-text-light opacity-0 transition-opacity group-hover:opacity-100">İncele →</span>
        </div>
      </div>
    </Link>
  )
}
