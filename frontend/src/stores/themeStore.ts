import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Runtime theming. Tailwind v4 utilities (bg-primary, text-gold…) compile to
 * `var(--color-primary)` etc, so overriding these CSS variables on <html>
 * re-themes the whole app live — no rebuild needed.
 */

export interface ThemePalette {
  id: string
  name: string
  primary: string
  primaryDark: string
  primaryLight: string
  gold: string
  goldDark: string
  goldLight: string
}

export const PRESETS: ThemePalette[] = [
  { id: 'royal',    name: 'Ephesus Night & Gold', primary: '#16202E', primaryDark: '#0F1521', primaryLight: '#243345', gold: '#C19B66', goldDark: '#A07E4C', goldLight: '#D8B886' },
  { id: 'emerald',  name: 'Emerald & Gold',    primary: '#1F3D34', primaryDark: '#102019', primaryLight: '#2c5446', gold: '#C19B66', goldDark: '#A07E4C', goldLight: '#D8B886' },
  { id: 'bordeaux', name: 'Bordeaux & Gold',   primary: '#4A1F2B', primaryDark: '#2C1117', primaryLight: '#65303d', gold: '#C19B66', goldDark: '#A07E4C', goldLight: '#D8B886' },
  { id: 'espresso', name: 'Espresso & Copper', primary: '#3B2A20', primaryDark: '#231911', primaryLight: '#54392b', gold: '#C0884E', goldDark: '#9c6b39', goldLight: '#d9a877' },
  { id: 'charcoal', name: 'Charcoal & Brass',  primary: '#262626', primaryDark: '#171717', primaryLight: '#403d3d', gold: '#C19B66', goldDark: '#A07E4C', goldLight: '#D8B886' },
]

interface ThemeStore {
  palette: ThemePalette
  setPalette: (p: ThemePalette) => void
  setCustom: (partial: Partial<ThemePalette>) => void
  apply: () => void
  reset: () => void
}

function paint(p: ThemePalette) {
  const r = document.documentElement
  r.style.setProperty('--color-primary', p.primary)
  r.style.setProperty('--color-primary-dark', p.primaryDark)
  r.style.setProperty('--color-primary-light', p.primaryLight)
  r.style.setProperty('--color-gold', p.gold)
  r.style.setProperty('--color-gold-dark', p.goldDark)
  r.style.setProperty('--color-gold-light', p.goldLight)
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      palette: PRESETS[0],

      setPalette: (p) => { set({ palette: p }); paint(p) },

      setCustom: (partial) => {
        const next = { ...get().palette, ...partial, id: 'custom', name: 'Custom' }
        set({ palette: next }); paint(next)
      },

      apply: () => paint(get().palette),

      reset: () => { set({ palette: PRESETS[0] }); paint(PRESETS[0]) },
    }),
    { name: 'ephesus_theme_v2' },
  ),
)
