import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Store, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { adminApi } from '@/services/api/admin'
import { formatCurrency } from '@/utils/format'

const TABS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export default function DealersPage() {
  const [status, setStatus] = useState('')
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dealers', status],
    queryFn: () => adminApi.dealers({ status: status || undefined, per_page: 50 }),
  })
  const approve = useMutation({
    mutationFn: (id: string) => adminApi.approveDealer(id),
    onSuccess: () => { toast.success('Dealer approved'); qc.invalidateQueries({ queryKey: ['admin', 'dealers'] }) },
  })
  const reject = useMutation({
    mutationFn: (id: string) => adminApi.rejectDealer(id, 'Rejected by admin'),
    onSuccess: () => { toast.success('Dealer rejected'); qc.invalidateQueries({ queryKey: ['admin', 'dealers'] }) },
  })
  const rows = data?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">Dealers</h2>
        <p className="text-sm text-text-light">B2B dealer management &amp; approvals</p>
      </div>

      <div className="flex gap-1">
        {TABS.map((t) => (
          <button key={t.value} onClick={() => setStatus(t.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${status === t.value ? 'bg-primary text-cream' : 'text-text-light hover:bg-cream'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-mist bg-surface">
        <table className="min-w-full divide-y divide-mist">
          <thead className="bg-cream">
            <tr>{['Company', 'Contact', 'Credit', 'Discount', 'Orders', 'Status', ''].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {isLoading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-mist" /></td>)}</tr>
            )) : rows.length === 0 ? (
              <tr><td colSpan={7} className="py-16 text-center text-sm text-text-light"><Store className="mx-auto mb-2 h-8 w-8 opacity-40" /> No dealers found.</td></tr>
            ) : rows.map((d: any) => (
              <tr key={d.id} className="hover:bg-cream/60">
                <td className="px-5 py-3"><Link to={`/admin/dealers/${d.id}`} className="text-sm font-medium text-primary hover:text-gold-dark">{d.company_name}</Link><p className="text-xs text-text-light">{d.city}</p></td>
                <td className="px-5 py-3 text-sm text-charcoal/70">{d.contact_name}<br /><span className="text-xs text-text-light">{d.email}</span></td>
                <td className="px-5 py-3 text-sm text-charcoal/70">{formatCurrency(Number(d.credit_limit))}</td>
                <td className="px-5 py-3 text-sm text-charcoal/70">{Number(d.discount_rate)}%</td>
                <td className="px-5 py-3 text-sm text-charcoal/70">{d.orders_count}</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${d.status === 'approved' ? 'bg-green-100 text-green-700' : d.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{d.status}</span></td>
                <td className="px-5 py-3 text-right">
                  {d.status === 'pending' && (
                    <div className="flex justify-end gap-1">
                      <button onClick={() => approve.mutate(d.id)} className="rounded-lg p-2 text-green-600 hover:bg-green-50"><Check className="h-4 w-4" /></button>
                      <button onClick={() => reject.mutate(d.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><X className="h-4 w-4" /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
