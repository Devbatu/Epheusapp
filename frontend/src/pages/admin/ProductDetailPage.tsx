import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Package, Star } from 'lucide-react'
import { productsApi } from '@/services/api/products'
import { formatCurrency } from '@/utils/format'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: p, isLoading } = useQuery({ queryKey: ['admin', 'product', id], queryFn: () => productsApi.show(id!), enabled: !!id })

  if (isLoading || !p) return <div className="py-24"><LoadingSpinner /></div>

  const meta = [
    { label: 'Retail Price', value: formatCurrency(p.base_price) },
    { label: 'B2B Price', value: formatCurrency(p.b2b_price) },
    { label: 'Cost', value: formatCurrency(p.cost_price) },
    { label: 'Tax Rate', value: `${p.tax_rate}%` },
    { label: 'Category', value: p.category ?? '—' },
    { label: 'Brand', value: p.brand ?? '—' },
    { label: 'SKU', value: p.sku },
    { label: 'Status', value: p.status },
  ]

  return (
    <div className="max-w-4xl space-y-6">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold-dark">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <div className="aspect-square overflow-hidden rounded-2xl border border-mist bg-cream">
          {p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" /> :
            <div className="flex h-full items-center justify-center text-gold/30"><Package className="h-16 w-16" /></div>}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-2xl font-bold text-primary">{p.name}</h2>
            {p.is_featured && <Star className="h-5 w-5 fill-gold text-gold" />}
          </div>
          <p className="mt-1 text-sm text-text-light">{p.short_description}</p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {meta.map((m) => (
              <div key={m.label} className="rounded-xl border border-mist bg-surface p-4">
                <p className="text-xs uppercase tracking-wide text-text-light">{m.label}</p>
                <p className="mt-1 font-semibold capitalize text-primary">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
