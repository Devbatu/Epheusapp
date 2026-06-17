import { Link, useNavigate } from 'react-router-dom'
import { User, Package, Heart, LogOut, Mail, Phone } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/services/api/auth'
import { toast } from 'sonner'
import { Seo } from '@/components/shared/Seo'

export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await authApi.logout() } finally { logout(); navigate('/'); toast.success('Signed out') }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Seo title="My Account" />
      <h1 className="font-heading text-3xl font-bold text-primary">My Account</h1>
      <p className="mt-1 text-sm text-text-light">Manage your profile and orders</p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        {/* Profile card */}
        <div className="rounded-2xl border border-mist bg-surface p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-gold">
            <User className="h-9 w-9" />
          </div>
          <h2 className="mt-4 font-heading text-xl font-bold text-primary">{user?.name}</h2>
          <div className="mt-4 space-y-2 text-left text-sm">
            <p className="flex items-center gap-2 text-charcoal/70"><Mail className="h-4 w-4 text-gold-dark" /> {user?.email}</p>
            {user?.phone && <p className="flex items-center gap-2 text-charcoal/70"><Phone className="h-4 w-4 text-gold-dark" /> {user.phone}</p>}
          </div>
          <button onClick={handleLogout} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-mist py-2.5 text-sm font-medium text-text-light hover:bg-cream">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link to="/account/orders" className="rounded-2xl border border-mist bg-surface p-6 transition-shadow hover:shadow-lg">
            <Package className="h-7 w-7 text-gold-dark" />
            <h3 className="mt-3 font-heading text-lg font-semibold text-primary">My Orders</h3>
            <p className="mt-1 text-sm text-text-light">Track and review your order history.</p>
          </Link>
          <Link to="/shop" className="rounded-2xl border border-mist bg-surface p-6 transition-shadow hover:shadow-lg">
            <Heart className="h-7 w-7 text-gold-dark" />
            <h3 className="mt-3 font-heading text-lg font-semibold text-primary">Continue Shopping</h3>
            <p className="mt-1 text-sm text-text-light">Discover more handcrafted delights.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
