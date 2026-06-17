import { useState } from 'react'
import { Percent, CreditCard, Truck, Headphones, Check, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Seo } from '@/components/shared/Seo'

const benefits = [
  { icon: Percent, title: 'Wholesale Pricing', desc: '12%–20% off list prices.' },
  { icon: CreditCard, title: 'Credit Terms', desc: 'Net 30 terms and flexible payment.' },
  { icon: Truck, title: 'Priority Shipping', desc: 'Fast fulfillment on bulk orders.' },
  { icon: Headphones, title: 'Dedicated Rep', desc: 'A sales advisor assigned to you.' },
]

const tiers = [
  { name: 'Starter', min: '$2,500 / mo', perks: ['12% off', 'Net 15 terms', 'Email support'] },
  { name: 'Professional', min: '$10,000 / mo', perks: ['16% off', 'Net 30 terms', 'Priority shipping', 'Dedicated rep'], featured: true },
  { name: 'Enterprise', min: '$30,000 / mo', perks: ['20% off', 'Net 45 terms', 'Free shipping', '24/7 support'] },
]

export default function WholesalePage() {
  const [sent, setSent] = useState(false)

  return (
    <div>
      <Seo
        title="Wholesale & Partnership"
        description="Join the Ephesus partner program: special wholesale pricing, credit terms, priority shipping and a dedicated rep. B2B application."
        keywords="wholesale, b2b, partnership, bulk turkish delight, dealer application"
      />

      {/* Hero */}
      <div className="relative overflow-hidden bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">B2B Portal</p>
          <h1 className="mt-3 font-heading text-5xl font-bold text-white">Wholesale & Partnership</h1>
          <p className="mx-auto mt-4 max-w-2xl text-cream/80">
            Source the finest Turkish delights for your business at special prices.
            Join the Ephesus partner family.
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
            <h2 className="font-heading text-3xl font-bold text-primary">Partner Tiers</h2>
            <div className="mx-auto mt-4 gold-rule" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <div key={t.name} className={`rounded-2xl border p-8 ${t.featured ? 'border-gold bg-primary text-cream shadow-2xl lg:-translate-y-3' : 'border-mist bg-surface'}`}>
                {t.featured && <span className="mb-3 inline-block rounded-full bg-gold px-3 py-1 text-xs font-bold text-primary-dark">Most Popular</span>}
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
          <h2 className="font-heading text-2xl font-bold text-primary">Partner Application</h2>
          <p className="mt-1 text-sm text-text-light">We will review your application within 2 business days.</p>
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success('Application received!') }} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required placeholder="Company Name" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              <input required placeholder="Tax ID" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              <input required placeholder="Contact Name" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              <input required type="email" placeholder="Email" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              <input required placeholder="Phone" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              <input placeholder="City" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
            </div>
            <textarea rows={4} placeholder="Tell us about your business" className="w-full rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
            <button type="submit" disabled={sent} className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-gold-light disabled:opacity-60">
              <Send className="h-4 w-4" /> {sent ? 'Application Received' : 'Submit Application'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
