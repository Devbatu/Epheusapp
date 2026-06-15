import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const colorMap = {
  green:  'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
  blue:   'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  amber:  'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  red:    'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
  gray:   'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
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
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
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
