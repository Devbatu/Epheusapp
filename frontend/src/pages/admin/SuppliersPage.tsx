import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Truck } from 'lucide-react'
import { adminApi } from '@/services/api/admin'
import { formatCurrency } from '@/utils/format'

export default function SuppliersPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'suppliers', search],
    queryFn: () => adminApi.suppliers({ search: search || undefined, per_page: 50 }),
  })
  const rows = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary">Suppliers</h2>
          <p className="text-sm text-text-light">{data?.meta?.total ?? 0} suppliers</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search suppliers…"
            className="w-full rounded-lg border border-mist bg-surface py-2.5 pl-10 pr-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 sm:w-72" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-mist bg-surface">
        <table className="min-w-full divide-y divide-mist">
          <thead className="bg-cream">
            <tr>{['Supplier', 'Contact', 'Location', 'Purchased', 'Balance', 'Status'].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {isLoading ? Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-mist" /></td>)}</tr>
            )) : rows.length === 0 ? (
              <tr><td colSpan={6} className="py-16 text-center text-sm text-text-light"><Truck className="mx-auto mb-2 h-8 w-8 opacity-40" /> No suppliers found.</td></tr>
            ) : rows.map((s: any) => (
              <tr key={s.id} className="hover:bg-cream/60">
                <td className="px-5 py-3"><p className="text-sm font-medium text-primary">{s.name}</p><p className="text-xs text-text-light">{s.code}</p></td>
                <td className="px-5 py-3 text-sm text-charcoal/70">{s.contact_name ?? '—'}<br /><span className="text-xs text-text-light">{s.email}</span></td>
                <td className="px-5 py-3 text-sm text-charcoal/70">{s.city}, {s.country}</td>
                <td className="px-5 py-3 text-sm font-medium text-primary">{formatCurrency(Number(s.total_purchased))}</td>
                <td className="px-5 py-3 text-sm text-charcoal/70">{formatCurrency(Number(s.outstanding_balance))}</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-cream text-text-light'}`}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
