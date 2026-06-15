import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, Leaf, Award } from 'lucide-react'
import { shopApi } from '@/services/api/shop'
import { ProductCard } from '@/components/shop/ProductCard'
import { Seo } from '@/components/shared/Seo'

const slides = [
  {
    eyebrow: 'Ege’den Sofranıza',
    title: 'Akdeniz’in En Taze Lezzetleri',
    subtitle: 'Bereketli topraklardan özenle seçilmiş zeytinyağı, zeytin, peynir ve daha fazlası.',
    cta: 'Alışverişe Başla',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1600&q=80',
  },
  {
    eyebrow: 'Geleneksel Tarif',
    title: 'El Yapımı Baklava & Tatlılar',
    subtitle: 'Gaziantep fıstığıyla hazırlanan eşsiz tatlar, taptaze paketlenerek kapınıza gelir.',
    cta: 'Tatlıları Keşfet',
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1600&q=80',
  },
  {
    eyebrow: 'İlk Hasat',
    title: 'Soğuk Sıkım Zeytinyağı',
    subtitle: 'Erken devşirme, naturel sızma. Doğallığın altın rengi sofranızda.',
    cta: 'Zeytinyağlarını Gör',
    image: 'https://images.unsplash.com/photo-1601300576530-d3b1f0c8e6c5?auto=format&fit=crop&w=1600&q=80',
  },
]

const features = [
  { icon: Truck,       title: 'Hızlı Teslimat',   desc: 'Türkiye geneli 1-3 iş günü' },
  { icon: Leaf,        title: '%100 Doğal',       desc: 'Katkısız, taze ürünler' },
  { icon: ShieldCheck, title: 'Güvenli Ödeme',    desc: '256-bit SSL koruması' },
  { icon: Award,       title: 'Kalite Garantisi', desc: 'Ege’den özenle seçilmiş' },
]

function HeroSlider() {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative h-[500px] overflow-hidden sm:h-[580px]">
      {slides.map((slide, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary/55 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-6">
              <div className={`max-w-xl ${i === current ? 'animate-fade-up' : ''}`}>
                <p className="mb-3 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-gold">
                  <span className="h-px w-8 bg-gold" /> {slide.eyebrow}
                </p>
                <h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-6xl">
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-lg text-lg text-cream/85">{slide.subtitle}</p>
                <Link
                  to="/shop"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-wide text-primary-dark shadow-xl transition-all hover:bg-gold-light hover:shadow-gold/30"
                >
                  {slide.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-primary-dark/40 text-gold backdrop-blur transition-colors hover:bg-gold hover:text-primary-dark">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-primary-dark/40 text-gold backdrop-blur transition-colors hover:bg-gold hover:text-primary-dark">
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'w-10 bg-gold' : 'w-2 bg-cream/50'}`} />
        ))}
      </div>
    </div>
  )
}

const categoryImages: Record<string, string> = {
  'olive-oil-vinegar': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  'olives-pickles':    'https://images.unsplash.com/photo-1611171711791-b34fa42e9fc4?auto=format&fit=crop&w=600&q=80',
  'cheese-dairy':      'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80',
  'nuts-dried-fruit':  'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80',
  'sweets-baklava':    'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=600&q=80',
  'spreads-sauces':    'https://images.unsplash.com/photo-1612187209234-3f9b3d5f8b1f?auto=format&fit=crop&w=600&q=80',
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-dark">{eyebrow}</p>
      <h2 className="mt-2 font-heading text-4xl font-bold text-primary">{title}</h2>
      <div className="mx-auto mt-4 gold-rule" />
      {subtitle && <p className="mt-4 text-text-light">{subtitle}</p>}
    </div>
  )
}

export default function HomePage() {
  const { data: categories } = useQuery({ queryKey: ['shop', 'categories'], queryFn: shopApi.categories })
  const { data: featured } = useQuery({
    queryKey: ['shop', 'featured'],
    queryFn: () => shopApi.products({ featured: true, per_page: 8 }),
  })

  return (
    <div>
      <Seo
        title="Premium Akdeniz Lezzetleri"
        description="Ege'nin bereketli topraklarından premium zeytinyağı, zeytin, peynir, baklava ve Akdeniz lezzetleri. Hızlı teslimat, %100 doğal ürünler."
        keywords="zeytinyağı, baklava, zeytin, akdeniz ürünleri, gurme gıda, ephesus"
      />
      <HeroSlider />

      {/* Features */}
      <div className="border-b border-mist bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cream text-gold-dark">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">{f.title}</p>
                <p className="text-xs text-text-light">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading eyebrow="Koleksiyon" title="Kategoriler" subtitle="Akdeniz mutfağının vazgeçilmezleri" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {(categories ?? []).map((c) => (
            <Link key={c.id} to={`/shop?category=${c.slug}`} className="group relative aspect-square overflow-hidden rounded-2xl shadow-md">
              <img
                src={categoryImages[c.slug] ?? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
                alt={c.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/85 via-primary-dark/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-center">
                <p className="font-heading text-base font-semibold text-white">{c.name}</p>
                <p className="text-xs text-gold">{c.products_count} ürün</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-mist/40 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Seçkin" title="Öne Çıkan Ürünler" subtitle="En çok tercih edilen lezzetler" />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {(featured?.data ?? []).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/shop" className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3 text-sm font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-cream">
              Tüm Ürünleri Gör <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Story strip */}
      <section className="relative overflow-hidden bg-primary">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">1995’ten Beri</p>
            <h2 className="mt-3 font-heading text-4xl font-bold text-white">Gelenekten Gelen Lezzet</h2>
            <div className="mt-4 gold-rule" />
            <p className="mt-5 leading-relaxed text-cream/80">
              Ephesus Mediterranean Delights, Ege’nin bereketli topraklarındaki üreticilerle
              doğrudan çalışarak en taze ve kaliteli ürünleri sofranıza taşır. Her ürün, geleneksel
              yöntemlerle, katkısız ve özenle hazırlanır.
            </p>
            <Link to="/about" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-gold-light">
              Hikâyemiz <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=500&q=80" alt="Zeytin hasadı" className="aspect-[3/4] w-full rounded-2xl object-cover" />
            <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=80" alt="Taze ürünler" className="mt-8 aspect-[3/4] w-full rounded-2xl object-cover" />
          </div>
        </div>
      </section>

      {/* Wholesale CTA */}
      <section className="bg-gradient-to-r from-gold-dark to-gold">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-16 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary-dark sm:text-4xl">Toptan alım mı yapıyorsunuz?</h2>
          <p className="max-w-2xl text-primary-dark/80">
            Bayi portalımıza katılın; özel fiyatlar, kredi limiti ve hızlı sipariş avantajlarından yararlanın.
          </p>
          <Link to="/wholesale" className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream shadow-lg transition-transform hover:scale-105">
            Bayi Başvurusu
          </Link>
        </div>
      </section>
    </div>
  )
}
