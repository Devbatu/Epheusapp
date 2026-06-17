import { useQuery } from '@tanstack/react-query'
import { ArrowLeftRight } from 'lucide-react'
import { adminApi } from '@/services/api/admin'
import { TransferStatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/utils/format'

export default function AdminTransfersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'transfers'],
    queryFn: () => adminApi.transfers({ include: 'fromBranch,toBranch,items', per_page: 50 }),
  })
  const rows = data?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">Inter-Branch Transfers</h2>
        <p className="text-sm text-text-light">{data?.meta?.total ?? 0} transfers across all branches</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-mist bg-surface">
        <table className="min-w-full divide-y divide-mist">
          <thead className="bg-cream">
            <tr>{['Transfer #', 'From', 'To', 'Items', 'Status', 'Date'].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {isLoading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-mist" /></td>)}</tr>
            )) : rows.length === 0 ? (
              <tr><td colSpan={6} className="py-16 text-center text-sm text-text-light"><ArrowLeftRight className="mx-auto mb-2 h-8 w-8 opacity-40" /> No transfers yet.</td></tr>
            ) : rows.map((t: any) => (
              <tr key={t.id} className="hover:bg-cream/60">
                <td className="px-5 py-3 text-sm font-medium text-primary">{t.transfer_number}</td>
                <td className="px-5 py-3 text-sm text-charcoal/70">{t.from_branch?.name ?? '—'}</td>
                <td className="px-5 py-3 text-sm text-charcoal/70">{t.to_branch?.name ?? '—'}</td>
                <td className="px-5 py-3 text-sm text-charcoal/70">{t.items?.length ?? 0}</td>
                <td className="px-5 py-3"><TransferStatusBadge status={t.status} /></td>
                <td className="px-5 py-3 text-sm text-text-light">{formatDate(t.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
