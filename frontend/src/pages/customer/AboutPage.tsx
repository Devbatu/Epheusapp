import { Link } from 'react-router-dom'
import { Leaf, Award, Globe, HeartHandshake, ArrowRight } from 'lucide-react'
import { Seo } from '@/components/shared/Seo'

const stats = [
  { value: '1995', label: 'Kuruluş' },
  { value: '5', label: 'Şube' },
  { value: '5.000+', label: 'Ürün' },
  { value: '100K+', label: 'Mutlu Müşteri' },
]

const values = [
  { icon: Leaf, title: 'Doğallık', desc: 'Katkısız, geleneksel yöntemlerle üretilen ürünler.' },
  { icon: Award, title: 'Kalite', desc: 'Her ürün titizlikle seçilir ve test edilir.' },
  { icon: Globe, title: 'Sürdürülebilirlik', desc: 'Yerel üreticiyi ve doğayı koruyan tedarik.' },
  { icon: HeartHandshake, title: 'Güven', desc: 'Üreticiden sofraya şeffaf bir tedarik zinciri.' },
]

export default function AboutPage() {
  return (
    <div>
      <Seo
        title="Hakkımızda"
        description="Ephesus Mediterranean Delights — 1995'ten beri Ege'nin bereketli topraklarından premium Akdeniz lezzetleri sunan kurumsal gurme markası."
        keywords="ephesus hakkında, akdeniz gurme, zeytinyağı üreticisi, kurumsal gıda"
      />

      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1600&q=80" alt="Zeytin bahçesi" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary-dark/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Kurumsal</p>
          <h1 className="mt-2 font-heading text-5xl font-bold text-white">Hakkımızda</h1>
        </div>
      </div>

      {/* Story */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="mx-auto gold-rule" />
        <h2 className="mt-6 font-heading text-3xl font-bold text-primary">Gelenekten Gelen Lezzet</h2>
        <p className="mt-6 text-lg leading-relaxed text-text-light">
          Ephesus Mediterranean Delights, 1995 yılında İzmir’de kuruldu. Amacımız, Ege ve Akdeniz’in
          eşsiz lezzetlerini en taze, en kaliteli haliyle sofralara taşımaktı. Bugün 5 şubemiz ve
          binlerce ürünümüzle Türkiye’nin dört bir yanına hizmet veriyoruz.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-text-light">
          Zeytinyağından baklavaya, peynirden kuruyemişe kadar tüm ürünlerimiz, yerel üreticilerle
          doğrudan kurduğumuz iş birlikleriyle, geleneksel yöntemler korunarak hazırlanır.
        </p>
      </section>

      {/* Stats */}
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

      {/* Values */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-dark">Değerlerimiz</p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-primary">Bizi Biz Yapan İlkeler</h2>
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

      {/* CTA */}
      <section className="bg-mist/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 py-14 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary">Lezzeti Keşfedin</h2>
          <p className="max-w-xl text-text-light">Ege’nin bereketini sofranıza taşıyan ürünlerimizi inceleyin.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-primary-dark">
            Mağazaya Git <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
