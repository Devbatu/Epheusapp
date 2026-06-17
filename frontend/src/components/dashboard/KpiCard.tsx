import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const colorMap = {
  green:  'bg-green-50 text-green-700  ',
  blue:   'bg-blue-50 text-blue-700  ',
  amber:  'bg-gold/15 text-gold-dark',
  red:    'bg-red-50 text-red-700  ',
  purple: 'bg-purple-50 text-purple-700  ',
  gray:   'bg-cream text-charcoal  ',
}

interface KpiCardProps {
  title: string
  value: string
  sub?:  string
  icon:  React.ReactNode
  color: keyof typeof colorMap
  href?: string
  trend?: { value: number; direction: 'up' | 'down' }
}

export function KpiCard({ title, value, sub, icon, color, href }: KpiCardProps) {
  const content = (
    <div className="flex items-center justify-between rounded-xl border border-mist bg-surface p-6 shadow-sm transition-shadow hover:shadow-md  ">
      <div>
        <p className="text-sm font-medium text-text-light ">{title}</p>
        <p className="mt-1 text-2xl font-bold text-primary ">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-text-light">{sub}</p>}
      </div>
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', colorMap[color])}>
        {icon}
      </div>
    </div>
  )

  if (href) {
    return <Link to={href} className="block">{content}</Link>
  }

  return content
}
