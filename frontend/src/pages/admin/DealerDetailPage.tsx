import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Building2, Mail, Phone, MapPin, CreditCard, Percent } from 'lucide-react'
import { adminApi } from '@/services/api/admin'
import { formatCurrency } from '@/utils/format'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function DealerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: d, isLoading } = useQuery({ queryKey: ['admin', 'dealer', id], queryFn: () => adminApi.dealer(id!), enabled: !!id })

  if (isLoading || !d) return <div className="py-24"><LoadingSpinner /></div>

  const info = [
    { icon: Mail, label: 'Email', value: d.email },
    { icon: Phone, label: 'Phone', value: d.phone },
    { icon: MapPin, label: 'Location', value: `${d.city ?? ''}, ${d.country ?? ''}` },
    { icon: Building2, label: 'Tax No', value: d.tax_number },
  ]
  const fin = [
    { icon: CreditCard, label: 'Credit Limit', value: formatCurrency(Number(d.credit_limit)) },
    { icon: CreditCard, label: 'Balance', value: formatCurrency(Number(d.current_balance)) },
    { icon: Percent, label: 'Discount', value: `${Number(d.discount_rate)}%` },
    { icon: Building2, label: 'Orders', value: d.orders_count ?? 0 },
  ]

  return (
    <div className="max-w-4xl space-y-6">
      <Link to="/admin/dealers" className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold-dark">
        <ArrowLeft className="h-4 w-4" /> Back to dealers
      </Link>

      <div className="rounded-2xl border border-mist bg-primary p-6 text-cream">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold">{d.company_name}</h2>
            <p className="text-sm text-cream/60">{d.contact_name}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${d.status === 'approved' ? 'bg-green-500/20 text-green-300' : d.status === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>{d.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-mist bg-surface p-6">
          <h3 className="mb-4 font-heading text-lg font-semibold text-primary">Contact</h3>
          <div className="space-y-3">
            {info.map((i) => (
              <div key={i.label} className="flex items-center gap-3 text-sm">
                <i.icon className="h-4 w-4 text-gold-dark" />
                <span className="text-text-light">{i.label}:</span>
                <span className="font-medium text-charcoal">{i.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-mist bg-surface p-6">
          <h3 className="mb-4 font-heading text-lg font-semibold text-primary">Financials</h3>
          <div className="grid grid-cols-2 gap-4">
            {fin.map((f) => (
              <div key={f.label} className="rounded-xl bg-cream p-4">
                <f.icon className="h-4 w-4 text-gold-dark" />
                <p className="mt-2 text-lg font-bold text-primary">{f.value}</p>
                <p className="text-xs text-text-light">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
