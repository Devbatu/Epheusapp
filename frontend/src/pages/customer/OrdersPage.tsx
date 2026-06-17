import { Link } from 'react-router-dom'
import { Package, ArrowRight } from 'lucide-react'
import { Seo } from '@/components/shared/Seo'

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Seo title="My Orders" />
      <h1 className="font-heading text-3xl font-bold text-primary">My Orders</h1>
      <p className="mt-1 text-sm text-text-light">Your order history and tracking</p>

      <div className="mt-10 flex flex-col items-center rounded-2xl border border-mist bg-surface px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-gold-dark">
          <Package className="h-8 w-8" />
        </div>
        <h2 className="mt-5 font-heading text-xl font-bold text-primary">No orders yet</h2>
        <p className="mt-2 max-w-sm text-sm text-text-light">
          When you place an order, it will appear here with live tracking and status updates.
        </p>
        <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-cream hover:bg-primary-dark">
          Start Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
