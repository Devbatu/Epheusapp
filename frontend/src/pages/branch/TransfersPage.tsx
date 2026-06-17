import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Eye, CheckCircle, XCircle, Truck, Package } from 'lucide-react'
import { toast } from 'sonner'
import { transfersApi } from '@/services/api/transfers'
import type { Transfer, TransferStatus } from '@/types'
import { formatDate }      from '@/utils/format'
import { TransferStatusBadge } from '@/components/shared/StatusBadge'

const STATUS_FILTERS: { label: string; value: TransferStatus | 'all' }[] = [
  { label: 'All',        value: 'all' },
  { label: 'Pending',    value: 'pending' },
  { label: 'Approved',   value: 'approved' },
  { label: 'Shipped',    value: 'shipped' },
  { label: 'Received',   value: 'received' },
  { label: 'Rejected',   value: 'rejected' },
  { label: 'Cancelled',  value: 'cancelled' },
]

export default function TransfersPage() {
  const [statusFilter, setStatusFilter] = useState<TransferStatus | 'all'>('all')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['branch', 'transfers', statusFilter],
    queryFn: () => transfersApi.list({
      ...(statusFilter !== 'all' && { 'filter[status]': statusFilter }),
      include: 'fromBranch,toBranch,items',
    }),
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => transfersApi.approve(id),
    onSuccess: () => {
      toast.success('Transfer approved.')
      queryClient.invalidateQueries({ queryKey: ['branch', 'transfers'] })
    },
  })

  const transfers = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary ">Transfers</h2>
          <p className="text-sm text-text-light">Manage inter-branch stock transfers</p>
        </div>
        <Link
          to="/branch/transfers/create"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-cream hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          New Transfer
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 overflow-x-auto">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === f.value
                ? 'bg-gold/15 text-gold-dark'
                : 'text-text-light hover:bg-cream '
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-mist bg-surface  ">
        <table className="min-w-full divide-y divide-mist ">
          <thead className="bg-cream ">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-light">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-light">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist ">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 animate-pulse rounded bg-mist " />
                    </td>
                  ))}
                </tr>
              ))
            ) : transfers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-text-light">
                  No transfers found.
                </td>
              </tr>
            ) : (
              transfers.map((transfer: Transfer) => (
                <tr key={transfer.id} className="hover:bg-cream ">
                  <td className="px-6 py-4 text-sm font-medium text-primary ">
                    {transfer.transfer_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-light">
                    {transfer.from_branch?.name ?? transfer.from_branch_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-light">
                    {transfer.to_branch?.name ?? transfer.to_branch_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-light">
                    {transfer.items?.length ?? 0} items
                  </td>
                  <td className="px-6 py-4">
                    <TransferStatusBadge status={transfer.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-text-light">
                    {formatDate(transfer.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/branch/transfers/${transfer.id}`}
                        className="rounded p-1 text-text-light hover:text-gold-dark"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {transfer.status === 'pending' && (
                        <button
                          onClick={() => approveMutation.mutate(transfer.id)}
                          className="rounded p-1 text-text-light hover:text-green-600"
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
