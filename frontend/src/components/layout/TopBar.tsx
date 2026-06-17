import { Bell, Moon, Sun, LogOut, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/services/api/auth'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Notification } from '@/types'

export function TopBar() {
  const { theme, setTheme } = useTheme()
  const { user, logout }    = useAuthStore()
  const navigate            = useNavigate()

  const { data: unreadCount } = useQuery({
    queryKey: ['notifications', 'unread_count'],
    queryFn: () => api.get<{ count: number }>('/notifications?is_read=0&per_page=1').then((r) => r.data),
    refetchInterval: 30_000, // poll every 30s
  })

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } finally {
      logout()
      navigate('/login')
      toast.success('Logged out successfully.')
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-mist bg-surface px-6  ">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-primary ">
          Ephesus ERP
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-lg p-2 text-text-light hover:bg-cream "
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-text-light hover:bg-cream "
          onClick={() => navigate('/admin/notifications')}
        >
          <Bell className="h-4 w-4" />
          {unreadCount && (unreadCount as any).count > 0 && (
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
        </button>

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cream">
            <User className="h-4 w-4 text-gold-dark" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-primary ">{user?.name}</p>
            <p className="text-xs text-text-light">{user?.roles?.[0]?.name}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-text-light hover:bg-red-50 hover:text-red-600 "
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
