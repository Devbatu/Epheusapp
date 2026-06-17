import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Building2, MapPin, Phone, Mail, Warehouse } from 'lucide-react'
import { branchesApi } from '@/services/api/branches'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function BranchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: b, isLoading } = useQuery({ queryKey: ['admin', 'branch', id], queryFn: () => branchesApi.show(id!), enabled: !!id })

  if (isLoading || !b) return <div className="py-24"><LoadingSpinner /></div>

  const info = [
    { icon: MapPin, label: 'Location', value: `${b.city}, ${b.country}` },
    { icon: MapPin, label: 'Address', value: b.address },
    { icon: Phone, label: 'Phone', value: b.phone ?? '—' },
    { icon: Mail, label: 'Email', value: b.email ?? '—' },
    { icon: Warehouse, label: 'Warehouses', value: (b as any).warehouses_count ?? 0 },
  ]

  return (
    <div className="max-w-3xl space-y-6">
      <Link to="/admin/branches" className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold-dark">
        <ArrowLeft className="h-4 w-4" /> Back to branches
      </Link>

      <div className="rounded-2xl border border-mist bg-primary p-6 text-cream">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-gold text-gold"><Building2 className="h-6 w-6" /></div>
          <div>
            <h2 className="font-heading text-2xl font-bold">{b.name}</h2>
            <p className="text-sm text-cream/60">{b.code} · <span className="capitalize">{b.status}</span></p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-mist bg-surface p-6">
        <h3 className="mb-4 font-heading text-lg font-semibold text-primary">Branch Information</h3>
        <div className="space-y-3">
          {info.map((i) => (
            <div key={i.label} className="flex items-start gap-3 text-sm">
              <i.icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
              <span className="w-28 shrink-0 text-text-light">{i.label}</span>
              <span className="font-medium text-charcoal">{i.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
