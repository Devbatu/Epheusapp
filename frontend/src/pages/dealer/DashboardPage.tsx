import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShoppingBag, Package, CreditCard, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { shopApi } from '@/services/api/shop'
import { ProductCard } from '@/components/shop/ProductCard'

export default function DealerDashboardPage() {
  const { user } = useAuthStore()
  const { data } = useQuery({ queryKey: ['dealer', 'featured'], queryFn: () => shopApi.products({ featured: true, per_page: 4 }) })

  const tiles = [
    { icon: ShoppingBag, label: 'Browse Catalog', desc: 'Order at dealer pricing', to: '/dealer/shop' },
    { icon: Package, label: 'My Orders', desc: 'Track your orders', to: '/dealer/orders' },
    { icon: CreditCard, label: 'Account', desc: 'Credit & balance', to: '/dealer/orders' },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-primary p-8 text-cream">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Dealer Portal</p>
        <h2 className="mt-2 font-heading text-3xl font-bold">Welcome{user?.name ? `, ${user.name}` : ''}</h2>
        <p className="mt-2 text-sm text-cream/65">Manage your wholesale orders and account with Ephesus.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to} className="rounded-2xl border border-mist bg-surface p-6 transition-shadow hover:shadow-lg">
            <t.icon className="h-7 w-7 text-gold-dark" />
            <h3 className="mt-3 font-heading text-lg font-semibold text-primary">{t.label}</h3>
            <p className="mt-1 text-sm text-text-light">{t.desc}</p>
          </Link>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-xl font-bold text-primary">Featured Products</h3>
          <Link to="/dealer/shop" className="flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold">
            View catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {(data?.data ?? []).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  )
}
