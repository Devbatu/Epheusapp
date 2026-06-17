import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Seo } from '@/components/shared/Seo'

const faqs = [
  { q: 'When will my order arrive?', a: 'Orders ship within 1–2 business days of payment. Standard delivery across the USA takes 2–5 business days.' },
  { q: 'How much is shipping?', a: 'Shipping is free on orders over $75. Orders below that have a flat $7.90 shipping fee.' },
  { q: 'Are your products all natural?', a: 'Yes. All our products are 100% natural — no preservatives, colorings or artificial additives.' },
  { q: 'What is your return policy?', a: 'Unopened, undamaged items can be returned within 14 days of delivery. For food-safety reasons, opened items cannot be returned.' },
  { q: 'Do you offer wholesale pricing?', a: 'Yes. Apply through our dealer portal for special wholesale pricing, credit terms and priority shipping.' },
  { q: 'How fresh are the products?', a: 'Every product is batch and date tracked. We always ship you the freshest batch available.' },
  { q: 'Which payment methods do you accept?', a: 'We accept all major credit/debit cards and bank transfers. Dealers may use net payment terms.' },
]

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-2xl border border-mist bg-surface">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
        <span className="font-medium text-primary">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-gold-dark transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="border-t border-mist px-6 py-4 text-sm leading-relaxed text-text-light">{a}</p>}
    </div>
  )
}

export default function FaqPage() {
  return (
    <div>
      <Seo
        title="FAQ"
        description="Frequently asked questions about Ephesus Mediterranean Delights — shipping, returns, payment, wholesale and product information."
        keywords="faq, shipping, returns, delivery, payment methods"
      />
      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">Help</p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-white">Frequently Asked Questions</h1>
        </div>
      </div>
      <section className="mx-auto max-w-3xl space-y-3 px-6 py-14">
        {faqs.map((f) => <Item key={f.q} {...f} />)}
      </section>
    </div>
  )
}
