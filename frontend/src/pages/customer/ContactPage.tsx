import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Seo } from '@/components/shared/Seo'

const branches = [
  { city: 'İzmir (Merkez)', address: 'Alsancak Mah. Kıbrıs Şehitleri Cad. No:12', phone: '+90 232 555 0 232' },
  { city: 'İstanbul', address: 'Kadıköy Moda Cad. No:45', phone: '+90 216 555 0 216' },
  { city: 'Ankara', address: 'Çankaya Tunalı Hilmi Cad. No:78', phone: '+90 312 555 0 312' },
  { city: 'Bursa', address: 'Nilüfer FSM Bulvarı No:23', phone: '+90 224 555 0 224' },
  { city: 'Antalya', address: 'Muratpaşa Lara Cad. No:56', phone: '+90 242 555 0 242' },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    toast.success('Mesajınız alındı! En kısa sürede dönüş yapacağız.')
  }

  return (
    <div>
      <Seo
        title="İletişim"
        description="Ephesus Mediterranean Delights ile iletişime geçin. 5 şube, telefon, e-posta ve iletişim formu. İzmir merkezli, Türkiye geneli hizmet."
        keywords="ephesus iletişim, mağaza adresleri, müşteri hizmetleri"
      />

      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Bize Ulaşın</p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-white">İletişim</h1>
          <p className="mt-3 text-cream/70">Sorularınız için her zaman buradayız.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Info */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { icon: Phone, title: 'Telefon', value: '+90 232 555 0 232' },
                { icon: Mail, title: 'E-posta', value: 'info@ephesus.com' },
                { icon: MapPin, title: 'Merkez', value: 'Alsancak, İzmir' },
                { icon: Clock, title: 'Çalışma Saatleri', value: 'Hafta içi 09:00 - 18:00' },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-mist bg-surface p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-gold-dark">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-primary">{c.title}</p>
                  <p className="mt-0.5 text-sm text-text-light">{c.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-mist bg-surface p-6">
              <h3 className="font-heading text-lg font-semibold text-primary">Şubelerimiz</h3>
              <ul className="mt-4 space-y-3">
                {branches.map((b) => (
                  <li key={b.city} className="flex items-start gap-3 border-b border-mist pb-3 last:border-0">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                    <div>
                      <p className="text-sm font-semibold text-primary">{b.city}</p>
                      <p className="text-xs text-text-light">{b.address}</p>
                      <p className="text-xs text-text-light">{b.phone}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-mist bg-surface p-8">
            <h3 className="font-heading text-2xl font-bold text-primary">Mesaj Gönderin</h3>
            <p className="mt-1 text-sm text-text-light">Formu doldurun, size dönelim.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input required placeholder="Adınız" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
                <input required type="email" placeholder="E-posta" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              </div>
              <input placeholder="Konu" className="w-full rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              <textarea required rows={5} placeholder="Mesajınız" className="w-full rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              <button type="submit" disabled={sent} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-primary-dark disabled:opacity-60">
                <Send className="h-4 w-4" /> {sent ? 'Gönderildi' : 'Gönder'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
