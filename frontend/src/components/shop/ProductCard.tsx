import { Link } from 'react-router-dom'
import { Plus, Package } from 'lucide-react'
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
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-surface shadow-[0_2px_20px_rgba(26,37,53,0.06)] ring-1 ring-mist/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(26,37,53,0.16)]"
    >
      <div className="relative m-3 mb-0 aspect-square overflow-hidden rounded-xl bg-cream">
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
          <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold backdrop-blur">
            Best Seller
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-2 p-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-dark">{product.brand}</p>
          <h3 className="mt-1 line-clamp-1 font-heading text-base font-semibold text-primary">{product.name}</h3>
          <p className="mt-1 text-lg font-bold text-primary">{formatCurrency(product.price)}</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-primary-dark shadow-md transition-all hover:bg-primary hover:text-gold"
          aria-label="Sepete ekle"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </Link>
  )
}
