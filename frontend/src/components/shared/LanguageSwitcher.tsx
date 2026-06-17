import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { useI18n, LOCALES } from '@/i18n'

export function LanguageSwitcher({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { locale, setLocale, enabled } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const active = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]
  const base = variant === 'light' ? 'text-cream/80 hover:bg-surface/10 hover:text-gold' : 'text-charcoal hover:bg-cream'

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className={`flex items-center gap-1.5 rounded-full px-2.5 py-2.5 text-sm font-medium transition-colors ${base}`}>
        <Globe className="h-5 w-5" />
        <span className="hidden text-xs sm:inline">{active.flag}</span>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-mist bg-surface py-1 shadow-2xl">
          {LOCALES.filter((l) => enabled.includes(l.code)).map((l) => (
            <button key={l.code} onClick={() => { setLocale(l.code); setOpen(false) }}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-charcoal hover:bg-cream">
              <span className="flex items-center gap-2">{l.flag} {l.label}</span>
              {l.code === locale && <Check className="h-4 w-4 text-gold-dark" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
