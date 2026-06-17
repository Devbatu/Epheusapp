import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight,
  Truck, Leaf, Sparkles, Gift,
} from 'lucide-react'
import { shopApi, type ShopProduct } from '@/services/api/shop'
import { ProductCard } from '@/components/shop/ProductCard'
import { Seo } from '@/components/shared/Seo'
import { useI18n } from '@/i18n'

/* ─── Hero ─────────────────────────────────────────────────────────────── */

const slides = [
  {
    eyebrow: 'Handcrafted with Tradition',
    l1: 'Authentic', l2: 'Turkish', gold: 'Delights',
    subtitle: 'Handcrafted in tradition, delivered across America.',
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1400&q=80',
  },
  {
    eyebrow: 'First Harvest',
    l1: 'The Art of', l2: 'Pistachio', gold: 'Baklava',
    subtitle: 'Layer upon golden layer, prepared fresh by master artisans.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1400&q=80',
  },
  {
    eyebrow: 'A Timeless Ritual',
    l1: 'Premium', l2: 'Turkish', gold: 'Coffee',
    subtitle: 'Rich, aromatic and steeped in centuries of heritage.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80',
  },
]

function Hero({ featured }: { featured: ShopProduct[] }) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((c) => (c + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [])
  const s = slides[i]
  const sideCards = featured.slice(0, 3)
  const labels = ['Best Seller', 'Luxury Box', 'Premium']

  return (
    <section className="relative overflow-hidden bg-primary-dark">
      <div className="pointer-events-none absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-gold/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-16 lg:grid-cols-[1fr_1.15fr] lg:py-20">
        {/* Left text */}
        <div key={i} className="animate-fade-up">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            <span className="h-px w-10 bg-gold" /> {s.eyebrow}
          </p>
          <h1 className="mt-6 font-heading text-6xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl">
            {s.l1}<br />{s.l2}<br /><span className="text-gold">{s.gold}</span>
          </h1>
          <p className="mt-7 max-w-sm text-base leading-relaxed text-cream/70">{s.subtitle}</p>
          <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-primary-dark shadow-xl transition-all hover:bg-gold-light">
            {t('hero.cta')} <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-10 flex items-center gap-3">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-10 bg-gold' : 'w-4 bg-cream/30'}`} />
            ))}
          </div>
        </div>

        {/* Right: hero image + stacked cards */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-gold/20 shadow-2xl">
            <img key={s.image} src={s.image} alt={s.gold} className="aspect-[5/4] w-full animate-fade-up object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 to-transparent" />
          </div>
          <div className="absolute right-3 top-1/2 hidden -translate-y-1/2 space-y-3 lg:block">
            {sideCards.map((p, idx) => (
              <Link key={p.id} to={`/shop/${p.slug}`}
                className="flex w-52 items-center gap-3 rounded-2xl border border-gold/15 bg-primary/85 p-2.5 shadow-2xl backdrop-blur transition-transform hover:-translate-x-1">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                  {p.image_url && <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gold">{labels[idx]}</p>
                  <p className="truncate text-sm font-medium text-white">{p.name}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-gold" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section heading ──────────────────────────────────────────────────── */

function Heading({ title, action }: { title: string; action?: { to: string; label: string } }) {
  return (
    <div className="mb-9 flex items-end justify-between">
      <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-primary sm:text-[2.5rem]">{title}</h2>
      {action && (
        <Link to={action.to} className="flex shrink-0 items-center gap-1 text-sm font-medium text-charcoal/70 hover:text-gold-dark">
          {action.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`
const collectionImages: Record<string, string> = {
  'baklava':         img('1519676867240-f03562e64548'),
  'turkish-delight': img('1606471191009-63994c53433b'),
  'gift-boxes':      img('1565958011703-44f9829ba187'),
  'turkish-coffee':  img('1495474472287-4d71bcdd2085'),
  'chocolate-nuts':  img('1599599810769-bcde5a160d32'),
  'honey-preserves': img('1601493700631-2b16ec4b4716'),
}

/* ─── Best sellers carousel ────────────────────────────────────────────── */

function Carousel({ products }: { products: ShopProduct[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  return (
    <div className="relative">
      <div ref={ref} className="flex gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => <div key={p.id} className="w-[260px] shrink-0"><ProductCard product={p} /></div>)}
      </div>
      <button onClick={() => scroll(-1)} className="absolute -left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-mist bg-surface text-primary shadow-lg transition-colors hover:bg-primary hover:text-gold lg:flex">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={() => scroll(1)} className="absolute -right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-mist bg-surface text-primary shadow-lg transition-colors hover:bg-primary hover:text-gold lg:flex">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

/* ─── Page ─────────────────────────────────────────────────────────────── */

const features = [
  { icon: Truck,    title: 'Nationwide Shipping', desc: 'Fast & reliable delivery across the USA' },
  { icon: Leaf,     title: 'Premium Ingredients', desc: 'Only the finest nuts, honey and natural flavors' },
  { icon: Sparkles, title: 'Traditional Recipes', desc: 'Made by artisans following centuries old recipes' },
  { icon: Gift,     title: 'Luxury Packaging',    desc: 'Perfect for gifting, beautifully packaged' },
]

export default function HomePage() {
  const { t } = useI18n()
  const { data: categories } = useQuery({ queryKey: ['shop', 'categories'], queryFn: shopApi.categories })
  const { data: featured } = useQuery({
    queryKey: ['shop', 'featured'],
    queryFn: () => shopApi.products({ featured: true, per_page: 10 }),
  })
  const featuredList = featured?.data ?? []
  const cats = categories ?? []
  const collectionsToShow = cats.filter((c) => ['baklava', 'turkish-delight', 'gift-boxes'].includes(c.slug))
  const shown = collectionsToShow.length ? collectionsToShow : cats.slice(0, 3)

  return (
    <div>
      <Seo
        title="Authentic Turkish Delights"
        description="Handcrafted Turkish delights, baklava, Turkish coffee and luxury gift boxes — made in tradition, delivered across America."
        keywords="turkish delight, baklava, turkish coffee, gift boxes, ephesus, gourmet"
      />

      <Hero featured={featuredList} />

      {/* Collections */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Heading title={t('home.collections')} action={{ to: '/shop', label: t('home.viewAllCollections') }} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <Link key={c.id} to={`/shop?category=${c.slug}`} className="group relative h-64 overflow-hidden rounded-2xl">
              <img src={collectionImages[c.slug] ?? img('1519676867240-f03562e64548')} alt={c.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/40 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-7">
                <h3 className="font-heading text-2xl font-bold leading-tight text-white">{c.name}<br />Collection</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-gold">
                  {t('home.shopNow')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Signature collection banner */}
        <div className="relative mt-6 overflow-hidden rounded-3xl bg-primary-dark">
          <div className="grid items-center gap-0 lg:grid-cols-2">
            <div className="p-10 lg:p-14">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{t('home.signature')}</p>
              <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-white">{t('home.ottoman')}</h2>
              <p className="mt-5 max-w-md leading-relaxed text-cream/65">
                Every bite is a reflection of centuries old recipes, prepared with the finest ingredients and timeless passion.
              </p>
              <Link to="/about" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-primary-dark transition-colors hover:bg-gold-light">
                {t('home.discoverMore')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative h-64 lg:h-full lg:min-h-[340px]">
              <img src={img('1571877227200-a0d98ea607e9')} alt="Signature collection" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-mist/40 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Heading title={t('home.bestSellers')} action={{ to: '/shop', label: t('home.viewAllProducts') }} />
          {featuredList.length > 0
            ? <Carousel products={featuredList} />
            : <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-mist" />)}</div>}
        </div>
      </section>

      {/* Our story */}
      <section className="mx-auto grid max-w-7xl items-center md:grid-cols-2">
        <div className="relative h-80 md:h-[480px]">
          <img src={img('1505253716362-afaea1d3d1af')} alt="Our story" className="h-full w-full object-cover" />
        </div>
        <div className="px-6 py-12 md:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">{t('home.ourStory')}</p>
          <h2 className="mt-3 font-heading text-4xl font-bold leading-tight text-primary sm:text-5xl">{t('home.fromAnatolia')}</h2>
          <p className="mt-6 max-w-md leading-relaxed text-charcoal/70">
            We bring the rich culinary heritage of Anatolia to your table. Made with premium ingredients and
            crafted by skilled artisans, our delights are a celebration of tradition and quality.
          </p>
          <Link to="/about" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-primary-dark transition-colors hover:bg-gold-light">
            {t('home.learnStory')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Feature bar */}
      <section className="bg-primary-dark">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/30 text-gold">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{f.title}</p>
                <p className="mt-0.5 text-xs leading-snug text-cream/55">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-cream">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row">
          <div className="text-center md:text-left">
            <h2 className="font-heading text-2xl font-bold text-primary">{t('home.clubTitle')}</h2>
            <p className="mt-1 text-sm text-charcoal/60">{t('home.clubText')}</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-md gap-2">
            <input type="email" required placeholder={t('home.emailPlaceholder')} className="flex-1 rounded-full border border-mist bg-surface px-5 py-3.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
            <button className="rounded-full bg-gold px-7 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-primary-dark transition-colors hover:bg-gold-light">
              {t('home.subscribe')}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
