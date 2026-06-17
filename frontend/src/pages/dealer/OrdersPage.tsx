import { Link } from 'react-router-dom'
import { Package, ArrowRight } from 'lucide-react'

export default function DealerOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">My Orders</h2>
        <p className="text-sm text-text-light">Your wholesale order history</p>
      </div>
      <div className="flex flex-col items-center rounded-2xl border border-mist bg-surface px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-gold-dark">
          <Package className="h-8 w-8" />
        </div>
        <h3 className="mt-5 font-heading text-xl font-bold text-primary">No orders yet</h3>
        <p className="mt-2 max-w-sm text-sm text-text-light">Place your first wholesale order from the catalog.</p>
        <Link to="/dealer/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-cream hover:bg-primary-dark">
          Browse Catalog <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
