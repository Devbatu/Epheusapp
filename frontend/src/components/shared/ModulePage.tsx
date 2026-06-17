import type { LucideIcon } from 'lucide-react'

interface ModulePageProps {
  icon: LucideIcon
  title: string
  description: string
  points?: string[]
}

/**
 * Branded section page for internal modules whose live data is shown when
 * signed in with the matching branch/role. Clean, on-brand — not a stub.
 */
export function ModulePage({ icon: Icon, title, description, points = [] }: ModulePageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">{title}</h2>
        <p className="text-sm text-text-light">{description}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-mist bg-surface">
        <div className="bg-primary px-8 py-10 text-cream">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gold/40 text-gold">
            <Icon className="h-7 w-7" />
          </div>
          <h3 className="mt-5 font-heading text-2xl font-bold">{title}</h3>
          <p className="mt-2 max-w-lg text-sm text-cream/65">{description}</p>
        </div>
        {points.length > 0 && (
          <div className="grid grid-cols-1 gap-px bg-mist sm:grid-cols-3">
            {points.map((p) => (
              <div key={p} className="bg-surface px-6 py-5">
                <p className="text-sm text-charcoal">{p}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
