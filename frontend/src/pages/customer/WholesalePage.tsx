import { useState } from 'react'
import { Percent, CreditCard, Truck, Headphones, Check, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Seo } from '@/components/shared/Seo'

const benefits = [
  { icon: Percent, title: 'Özel Bayi Fiyatları', desc: 'Listede %12–%20 arası indirim.' },
  { icon: CreditCard, title: 'Kredi Limiti', desc: 'Net 30 vade ve esnek ödeme.' },
  { icon: Truck, title: 'Öncelikli Sevkiyat', desc: 'Toplu siparişlerde hızlı teslimat.' },
  { icon: Headphones, title: 'Özel Temsilci', desc: 'Size atanmış satış danışmanı.' },
]

const tiers = [
  { name: 'Başlangıç', min: '₺10.000 / ay', perks: ['%12 indirim', 'Net 15 vade', 'E-posta destek'] },
  { name: 'Profesyonel', min: '₺50.000 / ay', perks: ['%16 indirim', 'Net 30 vade', 'Öncelikli sevkiyat', 'Özel temsilci'], featured: true },
  { name: 'Kurumsal', min: '₺150.000 / ay', perks: ['%20 indirim', 'Net 45 vade', 'Ücretsiz kargo', '7/24 destek'] },
]

export default function WholesalePage() {
  const [sent, setSent] = useState(false)

  return (
    <div>
      <Seo
        title="Toptan & Bayilik"
        description="Ephesus bayi portalına katılın: özel toptan fiyatlar, kredi limiti, öncelikli sevkiyat ve özel temsilci. B2B başvuru formu."
        keywords="toptan gıda, bayilik, b2b, toptan zeytinyağı, bayi başvurusu"
      />

      {/* Hero */}
      <div className="relative overflow-hidden bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">B2B Portal</p>
          <h1 className="mt-3 font-heading text-5xl font-bold text-white">Toptan & Bayilik</h1>
          <p className="mx-auto mt-4 max-w-2xl text-cream/80">
            İşletmeniz için Akdeniz’in en kaliteli ürünlerini özel fiyatlarla tedarik edin.
            Ephesus bayi ailesine katılın.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-2xl border border-mist bg-surface p-6 text-center transition-shadow hover:shadow-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-gold-dark">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-primary">{b.title}</h3>
              <p className="mt-2 text-sm text-text-light">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="bg-mist/40 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold text-primary">Bayi Kademeleri</h2>
            <div className="mx-auto mt-4 gold-rule" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <div key={t.name} className={`rounded-2xl border p-8 ${t.featured ? 'border-gold bg-primary text-cream shadow-2xl lg:-translate-y-3' : 'border-mist bg-surface'}`}>
                {t.featured && <span className="mb-3 inline-block rounded-full bg-gold px-3 py-1 text-xs font-bold text-primary-dark">En Popüler</span>}
                <h3 className={`font-heading text-2xl font-bold ${t.featured ? 'text-gold' : 'text-primary'}`}>{t.name}</h3>
                <p className={`mt-1 text-sm ${t.featured ? 'text-cream/70' : 'text-text-light'}`}>Min. {t.min}</p>
                <ul className="mt-6 space-y-3">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm">
                      <Check className={`h-4 w-4 ${t.featured ? 'text-gold' : 'text-gold-dark'}`} />
                      <span className={t.featured ? 'text-cream/90' : 'text-charcoal'}>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-mist bg-surface p-8">
          <h2 className="font-heading text-2xl font-bold text-primary">Bayi Başvuru Formu</h2>
          <p className="mt-1 text-sm text-text-light">Başvurunuzu inceleyip 2 iş günü içinde dönüş yapacağız.</p>
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success('Başvurunuz alındı!') }} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required placeholder="Firma Adı" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              <input required placeholder="Vergi No" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              <input required placeholder="Yetkili Ad Soyad" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              <input required type="email" placeholder="E-posta" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              <input required placeholder="Telefon" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              <input placeholder="Şehir" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
            </div>
            <textarea rows={4} placeholder="İşletmeniz hakkında kısa bilgi" className="w-full rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
            <button type="submit" disabled={sent} className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-gold-light disabled:opacity-60">
              <Send className="h-4 w-4" /> {sent ? 'Başvuru Alındı' : 'Başvuruyu Gönder'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
