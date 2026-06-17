import { Globe, Check, Star } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n, LOCALES } from '@/i18n'

export default function LocalizationPage() {
  const { enabled, defaultLocale, locale, toggleEnabled, setDefault, setLocale } = useI18n()

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">Languages &amp; Localization</h2>
        <p className="text-sm text-text-light">Manage which languages are available on the storefront.</p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-mist bg-surface">
        <div className="flex items-center gap-2 border-b border-mist px-6 py-4">
          <Globe className="h-4 w-4 text-gold-dark" />
          <h3 className="font-semibold text-primary">Available Languages</h3>
        </div>
        <div className="divide-y divide-mist">
          {LOCALES.map((l) => {
            const isEnabled = enabled.includes(l.code)
            const isDefault = defaultLocale === l.code
            return (
              <div key={l.code} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{l.flag}</span>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                      {l.label}
                      {isDefault && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase text-gold-dark">Default</span>}
                      {locale === l.code && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">Active</span>}
                    </p>
                    <p className="text-xs uppercase text-text-light">{l.code}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => { setDefault(l.code); toast.success(`${l.label} set as default`) }}
                    disabled={!isEnabled}
                    className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${isDefault ? 'bg-gold/15 text-gold-dark' : 'text-text-light hover:bg-cream disabled:opacity-40'}`}>
                    <Star className={`h-3.5 w-3.5 ${isDefault ? 'fill-current' : ''}`} /> Default
                  </button>
                  <button onClick={() => { setLocale(l.code); toast.success(`Previewing ${l.label}`) }}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-text-light hover:bg-cream">
                    Preview
                  </button>
                  <button onClick={() => toggleEnabled(l.code)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${isEnabled ? 'bg-primary' : 'bg-mist'}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow transition-all ${isEnabled ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="rounded-2xl border border-mist bg-cream p-5 text-sm text-text-light">
        <p className="flex items-center gap-2 font-medium text-primary"><Check className="h-4 w-4 text-gold-dark" /> How it works</p>
        <p className="mt-2">Enabled languages appear in the storefront language switcher. The default language is used for first-time visitors. Translations are managed in <code className="rounded bg-mist px-1">src/i18n.ts</code>.</p>
      </div>
    </div>
  )
}
