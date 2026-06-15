import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface RoleGuardProps {
  children:  React.ReactNode
  roles:     string[]
  fallback?: string
}

export function RoleGuard({ children, roles, fallback = '/' }: RoleGuardProps) {
  const { hasRole } = useAuthStore()

  if (!hasRole(roles)) {
    return <Navigate to={fallback} replace />
  }

  return <>{children}</>
}
