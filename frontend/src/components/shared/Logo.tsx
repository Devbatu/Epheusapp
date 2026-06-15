import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'light' | 'dark'  // light = for dark backgrounds
  size?: 'sm' | 'md' | 'lg'
  withTagline?: boolean
  className?: string
}

const sizes = {
  sm: { ephesus: 'text-lg', tagline: 'text-base', mark: 'h-8 w-8 text-sm' },
  md: { ephesus: 'text-2xl', tagline: 'text-xl', mark: 'h-10 w-10 text-base' },
  lg: { ephesus: 'text-4xl', tagline: 'text-3xl', mark: 'h-14 w-14 text-xl' },
}

export function Logo({ variant = 'dark', size = 'md', withTagline = true, className }: LogoProps) {
  const s = sizes[size]
  const ephesusColor  = variant === 'light' ? 'text-gold' : 'text-gold-dark'
  const taglineColor  = variant === 'light' ? 'text-gold-light' : 'text-gold'

  return (
    <Link to="/" className={cn('group flex items-center gap-3', className)}>
      {/* Emblem */}
      <span className={cn(
        'flex shrink-0 items-center justify-center rounded-full border-2 border-gold bg-primary brand-ephesus text-gold shadow-md transition-transform group-hover:scale-105',
        s.mark,
      )}>
        E
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('brand-ephesus', s.ephesus, ephesusColor)}>EPHESUS</span>
        {withTagline && (
          <span className={cn('brand-tagline -mt-0.5', s.tagline, taglineColor)}>
            Mediterranean Delights
          </span>
        )}
      </span>
    </Link>
  )
}
