import { useEffect } from 'react'

interface SeoProps {
  title: string
  description?: string
  keywords?: string
}

const BASE = 'Ephesus Mediterranean Delights'

/**
 * Lightweight SEO helper — sets document.title and meta tags per page.
 * Avoids an extra dependency while keeping pages crawler-friendly.
 */
export function Seo({ title, description, keywords }: SeoProps) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : BASE

    const setMeta = (name: string, content?: string, attr: 'name' | 'property' = 'name') => {
      if (!content) return
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', description)
    setMeta('keywords', keywords)
    setMeta('og:title', title ? `${title} — ${BASE}` : BASE, 'property')
    setMeta('og:description', description, 'property')
  }, [title, description, keywords])

  return null
}
