import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  fullscreen?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }

export function LoadingSpinner({ fullscreen = false, size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center', fullscreen && 'h-screen w-screen')}>
      <Loader2 className={cn('animate-spin text-gold-dark', sizeMap[size])} />
    </div>
  )
}
