import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Seo } from '@/components/shared/Seo'

const faqs = [
  { q: 'Siparişim ne zaman elime ulaşır?', a: 'Siparişleriniz, ödeme onayından sonra 1-3 iş günü içinde kargoya verilir. Türkiye geneli teslimat süresi ortalama 2-4 iş günüdür.' },
  { q: 'Kargo ücreti ne kadar?', a: '500 ₺ ve üzeri siparişlerde kargo ücretsizdir. Bu tutarın altındaki siparişlerde sabit 49,90 ₺ kargo ücreti uygulanır.' },
  { q: 'Ürünleriniz katkı maddesi içeriyor mu?', a: 'Tüm ürünlerimiz %100 doğaldır. Koruyucu, renklendirici veya yapay katkı maddesi kullanmıyoruz.' },
  { q: 'İade ve değişim koşulları nelerdir?', a: 'Açılmamış ve bozulmamış ürünleri teslimattan itibaren 14 gün içinde iade edebilirsiniz. Gıda güvenliği nedeniyle açılmış ürünlerde iade kabul edilmez.' },
  { q: 'Toptan alım yapabilir miyim?', a: 'Evet. Bayi portalımıza başvurarak özel toptan fiyatları, kredi limiti ve öncelikli sevkiyat avantajlarından yararlanabilirsiniz.' },
  { q: 'Ürünlerin son kullanma tarihi ne kadar?', a: 'Her üründe parti/lot ve son kullanma tarihi takibi yapılır. Size her zaman en taze partiyi gönderiyoruz.' },
  { q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', a: 'Kredi/banka kartı, havale/EFT ve kapıda ödeme seçeneklerini sunuyoruz. Bayilerimiz için vadeli ödeme imkânı mevcuttur.' },
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
        title="Sıkça Sorulan Sorular"
        description="Ephesus Mediterranean Delights hakkında sıkça sorulan sorular: teslimat, kargo, iade, ödeme, toptan alım ve ürün bilgileri."
        keywords="sss, kargo, iade, teslimat, ödeme yöntemleri"
      />

      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Yardım</p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-white">Sıkça Sorulan Sorular</h1>
        </div>
      </div>

      <section className="mx-auto max-w-3xl space-y-3 px-6 py-14">
        {faqs.map((f) => <Item key={f.q} {...f} />)}
      </section>
    </div>
  )
}
