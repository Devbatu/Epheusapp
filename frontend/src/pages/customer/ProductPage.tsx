import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Minus, Plus, ShoppingBag, ChevronRight, ChevronDown, Package, Heart,
  Truck, ShieldCheck, Leaf, Gift, Star, Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { shopApi } from '@/services/api/shop'
import { useCartStore } from '@/stores/cartStore'
import { ProductCard } from '@/components/shop/ProductCard'
import { formatCurrency } from '@/utils/format'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Seo } from '@/components/shared/Seo'

function Stars({ value = 4.8 }: { value?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= Math.round(value) ? 'fill-gold text-gold' : 'text-cream/25'}`} />
      ))}
    </div>
  )
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-white/10">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between py-4 text-left">
        <span className="font-heading text-base font-semibold text-cream">{title}</span>
        <ChevronDown className={`h-5 w-5 text-gold transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-5 text-sm leading-relaxed text-cream/65">{children}</div>}
    </div>
  )
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [qty, setQty] = useState(1)
  const [active, setActive] = useState(0)
  const [wish, setWish] = useState(false)
  const add = useCartStore((s) => s.add)

  const { data: product, isLoading } = useQuery({
    queryKey: ['shop', 'product', slug],
    queryFn: () => shopApi.product(slug!),
    enabled: !!slug,
  })

  useEffect(() => { setActive(0); setQty(1); setWish(false); window.scrollTo({ top: 0 }) }, [slug])

  if (isLoading || !product) {
    return <div className="flex min-h-screen items-center justify-center bg-primary-dark"><LoadingSpinner /></div>
  }

  const gallery = (product.images && product.images.length ? product.images : [product.image_url].filter(Boolean)) as string[]

  const handleAdd = () => {
    add({ id: product.id, name: product.name, slug: product.slug, price: product.price, image_url: product.image_url }, qty)
    toast.success(`${qty} × ${product.name} added to cart`)
  }

  const specs = [
    ['Brand', product.brand],
    ['Category', product.category],
    ['SKU', product.sku],
    ['Origin', product.origin === 'TR' ? 'Türkiye (Anatolia)' : product.origin ?? '—'],
    ['Unit', product.unit ?? '—'],
  ].filter(([, v]) => v)

  return (
    <div className="bg-primary-dark text-cream">
      {/* Breadcrumb */}
      <div className="border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center gap-1 px-6 py-4 text-sm text-cream/50">
          <Link to="/" className="hover:text-gold">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/shop" className="hover:text-gold">Shop</Link>
          <ChevronRight className="h-4 w-4" />
          {product.category_slug && <><Link to={`/shop?category=${product.category_slug}`} className="hover:text-gold">{product.category}</Link><ChevronRight className="h-4 w-4" /></>}
          <span className="truncate text-cream">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:py-16">
        <Seo title={product.name} description={product.short_description ?? undefined} />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* ── Gallery ── */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            {gallery.length > 1 && (
              <div className="flex gap-3 sm:flex-col">
                {gallery.map((src, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${active === i ? 'border-gold shadow-lg shadow-gold/20' : 'border-white/10 hover:border-gold/50'}`}>
                    <img src={src} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="group relative flex-1">
              <div className="relative overflow-hidden rounded-[2rem] border border-gold/20 shadow-2xl">
                {gallery[active] ? (
                  <img src={gallery[active]} alt={product.name} className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-primary text-gold/30"><Package className="h-24 w-24" /></div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-dark/30 to-transparent" />
              </div>
              {product.is_featured && (
                <span className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-dark shadow">
                  <Star className="h-3 w-3 fill-current" /> Best Seller
                </span>
              )}
            </div>
          </div>

          {/* ── Info ── */}
          <div className="lg:py-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{product.brand}</p>
            <h1 className="mt-3 font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">{product.name}</h1>

            <div className="mt-4 flex items-center gap-3">
              <Stars />
              <span className="text-sm text-cream/50">4.8 · 126 reviews</span>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <p className="font-heading text-4xl font-bold text-gold">{formatCurrency(product.price)}</p>
              <span className="mb-1.5 rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-semibold text-green-300">In Stock</span>
            </div>
            <p className="mt-1 text-xs text-cream/45">Tax included · Free shipping over $75</p>

            <div className="my-7 gold-rule" />

            <p className="leading-relaxed text-cream/75">{product.short_description}</p>

            {/* Quantity + actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-white/15">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-12 w-12 items-center justify-center text-cream/60 transition-colors hover:text-gold"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center font-semibold text-white">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="flex h-12 w-12 items-center justify-center text-cream/60 transition-colors hover:text-gold"><Plus className="h-4 w-4" /></button>
              </div>
              <button onClick={handleAdd}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-wide text-primary-dark shadow-lg shadow-gold/20 transition-all hover:bg-gold-light">
                <ShoppingBag className="h-5 w-5" /> Add to Cart
              </button>
              <button onClick={() => { setWish((w) => !w); toast.success(wish ? 'Removed from wishlist' : 'Added to wishlist') }}
                className={`flex items-center justify-center rounded-full border p-3.5 transition-colors ${wish ? 'border-gold bg-gold/15 text-gold' : 'border-white/15 text-cream/60 hover:border-gold/50 hover:text-gold'}`}>
                <Heart className={`h-5 w-5 ${wish ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Feature strip */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Truck, label: 'Fast Shipping' },
                { icon: Leaf, label: '100% Natural' },
                { icon: ShieldCheck, label: 'Secure Checkout' },
                { icon: Gift, label: 'Gift Ready' },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center">
                  <b.icon className="h-5 w-5 text-gold" />
                  <span className="text-xs font-medium text-cream/65">{b.label}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="mt-8">
              <Accordion title="Description" defaultOpen>{product.description ?? product.short_description}</Accordion>
              <Accordion title="Specifications">
                <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {specs.map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-4 border-b border-white/5 py-1.5">
                      <dt className="text-cream/45">{k}</dt>
                      <dd className="font-medium text-cream">{v as string}</dd>
                    </div>
                  ))}
                </dl>
              </Accordion>
              <Accordion title="Shipping & Returns">
                <ul className="space-y-2">
                  {['Ships within 1–2 business days', 'Free delivery on orders over $75', '14-day returns on unopened items', 'Carefully packaged for freshness'].map((t) => (
                    <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> {t}</li>
                  ))}
                </ul>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Related */}
        {product.related?.length > 0 && (
          <section className="mt-20">
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Curated For You</p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-white">You May Also Like</h2>
              <div className="mx-auto mt-4 gold-rule" />
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {product.related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
