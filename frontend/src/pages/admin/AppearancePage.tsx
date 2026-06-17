import { Check, RotateCcw, Palette } from 'lucide-react'
import { toast } from 'sonner'
import { useThemeStore, PRESETS, type ThemePalette } from '@/stores/themeStore'

export default function AppearancePage() {
  const { palette, setPalette, setCustom, reset } = useThemeStore()

  const swatches: { key: keyof ThemePalette; label: string }[] = [
    { key: 'primary', label: 'Primary' },
    { key: 'primaryDark', label: 'Primary Dark' },
    { key: 'gold', label: 'Accent (Gold)' },
    { key: 'goldDark', label: 'Accent Dark' },
  ]

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">Appearance &amp; Theme</h2>
        <p className="text-sm text-text-light">Change the brand colors — applied instantly across the whole site.</p>
      </div>

      {/* Presets */}
      <section className="rounded-2xl border border-mist bg-surface p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-primary">
          <Palette className="h-4 w-4 text-gold-dark" /> Theme Presets
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((p) => {
            const active = palette.id === p.id
            return (
              <button key={p.id} onClick={() => { setPalette(p); toast.success(`${p.name} applied`) }}
                className={`flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${active ? 'border-gold shadow-md' : 'border-mist hover:border-gold/40'}`}>
                <div>
                  <p className="text-sm font-semibold text-primary">{p.name}</p>
                  <div className="mt-2 flex gap-1.5">
                    {[p.primaryDark, p.primary, p.gold, p.goldLight].map((c) => (
                      <span key={c} className="h-5 w-5 rounded-full ring-1 ring-black/10" style={{ background: c }} />
                    ))}
                  </div>
                </div>
                {active && <Check className="h-5 w-5 text-gold-dark" />}
              </button>
            )
          })}
        </div>
      </section>

      {/* Custom colors */}
      <section className="rounded-2xl border border-mist bg-surface p-6">
        <h3 className="mb-4 font-semibold text-primary">Custom Colors</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {swatches.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-4 rounded-xl bg-cream p-4">
              <div>
                <p className="text-sm font-medium text-primary">{s.label}</p>
                <p className="text-xs uppercase text-text-light">{palette[s.key]}</p>
              </div>
              <input type="color" value={palette[s.key]} onChange={(e) => setCustom({ [s.key]: e.target.value })}
                className="h-11 w-16 cursor-pointer rounded-lg border border-mist bg-transparent" />
            </div>
          ))}
        </div>
      </section>

      {/* Live preview */}
      <section className="rounded-2xl border border-mist bg-surface p-6">
        <h3 className="mb-4 font-semibold text-primary">Live Preview</h3>
        <div className="overflow-hidden rounded-xl">
          <div className="bg-primary p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Ephesus</p>
            <h4 className="mt-1 font-heading text-2xl font-bold text-white">Authentic Turkish <span className="text-gold">Delights</span></h4>
            <button className="mt-4 rounded-full bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-primary-dark">Shop Collection</button>
          </div>
        </div>
      </section>

      <button onClick={() => { reset(); toast.success('Theme reset to default') }}
        className="inline-flex items-center gap-2 rounded-lg border border-mist px-4 py-2 text-sm font-medium text-text-light hover:bg-cream">
        <RotateCcw className="h-4 w-4" /> Reset to default
      </button>
    </div>
  )
}
