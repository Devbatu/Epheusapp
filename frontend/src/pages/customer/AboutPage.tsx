import { Link } from 'react-router-dom'
import { Leaf, Award, Globe, HeartHandshake, ArrowRight } from 'lucide-react'
import { Seo } from '@/components/shared/Seo'

const stats = [
  { value: '1995', label: 'Established' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '120+', label: 'Products' },
  { value: '48', label: 'US States Served' },
]

const values = [
  { icon: Leaf, title: 'All Natural', desc: 'No additives — crafted with traditional methods.' },
  { icon: Award, title: 'Premium Quality', desc: 'Every product is carefully selected and tested.' },
  { icon: Globe, title: 'Sustainability', desc: 'Sourcing that respects growers and the land.' },
  { icon: HeartHandshake, title: 'Trust', desc: 'A transparent supply chain from artisan to table.' },
]

export default function AboutPage() {
  return (
    <div>
      <Seo
        title="Our Story"
        description="Ephesus Mediterranean Delights — since 1995, bringing authentic handcrafted Turkish delights, baklava and coffee from Anatolia to America."
        keywords="about ephesus, turkish delight brand, baklava, anatolian heritage"
      />

      <div className="relative h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1600&q=80" alt="Heritage" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary-dark/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">Our Story</p>
          <h1 className="mt-2 font-heading text-5xl font-bold text-white">From Anatolia to America</h1>
        </div>
      </div>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="mx-auto gold-rule" />
        <h2 className="mt-6 font-heading text-3xl font-bold text-primary">A Taste Rooted in Tradition</h2>
        <p className="mt-6 text-lg leading-relaxed text-text-light">
          Ephesus Mediterranean Delights was founded in 1995 with a simple mission: to share the authentic
          flavors of Anatolia with the world. Today we deliver handcrafted baklava, Turkish delight and coffee
          to homes across America — made the traditional way, with the finest ingredients.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-text-light">
          From our master artisans to your table, every box is a celebration of centuries-old recipes and
          timeless passion.
        </p>
      </section>

      <section className="bg-primary">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-4xl font-bold text-gold">{s.value}</p>
              <p className="mt-1 text-sm uppercase tracking-wide text-cream/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-dark">Our Values</p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-primary">What Makes Us Who We Are</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-mist bg-surface p-6 text-center transition-shadow hover:shadow-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-gold-dark">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-primary">{v.title}</h3>
              <p className="mt-2 text-sm text-text-light">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-mist/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 py-14 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary">Discover the Flavor</h2>
          <p className="max-w-xl text-text-light">Explore our handcrafted collection of Turkish delights.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-primary-dark">
            Shop Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
