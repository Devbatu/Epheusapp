import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Seo } from '@/components/shared/Seo'

const branches = [
  { city: 'New York (HQ)', address: '350 5th Avenue, New York, NY', phone: '+1 (212) 555-0232' },
  { city: 'Boston', address: '120 Newbury St, Boston, MA', phone: '+1 (617) 555-0216' },
  { city: 'Chicago', address: '8 W Ohio St, Chicago, IL', phone: '+1 (312) 555-0312' },
  { city: 'San Francisco', address: '220 Mission St, San Francisco, CA', phone: '+1 (415) 555-0224' },
  { city: 'Miami', address: '700 Biscayne Blvd, Miami, FL', phone: '+1 (305) 555-0242' },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    toast.success('Message received! We will get back to you shortly.')
  }

  return (
    <div>
      <Seo
        title="Contact Us"
        description="Get in touch with Ephesus Mediterranean Delights. Locations, phone, email and contact form. Serving customers across the USA."
        keywords="ephesus contact, store locations, customer service"
      />

      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Get in Touch</p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-white">Contact Us</h1>
          <p className="mt-3 text-cream/70">We are always here to help.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Info */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { icon: Phone, title: 'Phone', value: '+1 (212) 555-0232' },
                { icon: Mail, title: 'Email', value: 'info@ephesus.com' },
                { icon: MapPin, title: 'Headquarters', value: 'New York, NY' },
                { icon: Clock, title: 'Business Hours', value: 'Mon–Fri 9:00am – 6:00pm' },
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
              <h3 className="font-heading text-lg font-semibold text-primary">Our Locations</h3>
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
            <h3 className="font-heading text-2xl font-bold text-primary">Send a Message</h3>
            <p className="mt-1 text-sm text-text-light">Fill out the form and we will get back to you.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input required placeholder="Your name" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
                <input required type="email" placeholder="Email" className="rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              </div>
              <input placeholder="Subject" className="w-full rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              <textarea required rows={5} placeholder="Your message" className="w-full rounded-lg border border-mist bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
              <button type="submit" disabled={sent} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-primary-dark disabled:opacity-60">
                <Send className="h-4 w-4" /> {sent ? 'Sent' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
