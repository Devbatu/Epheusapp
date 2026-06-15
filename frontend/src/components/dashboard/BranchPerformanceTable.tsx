import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { formatCurrency } from '@/utils/format'

export function BranchPerformanceTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'branch-performance'],
    queryFn: () => api.get<{ data: Array<{ id: string; name: string; code: string; monthly_orders: number; monthly_revenue: number }> }>('/admin/analytics/branch-performance').then((r) => r.data.data ?? []),
  })

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-gray-100">
          <th className="pb-2 text-left text-xs font-medium uppercase text-gray-400">Branch</th>
          <th className="pb-2 text-right text-xs font-medium uppercase text-gray-400">Orders</th>
          <th className="pb-2 text-right text-xs font-medium uppercase text-gray-400">Revenue</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {(data ?? []).map((branch) => (
          <tr key={branch.id} className="hover:bg-gray-50">
            <td className="py-2.5">
              <p className="text-sm font-medium text-gray-900">{branch.name}</p>
              <p className="text-xs text-gray-400">{branch.code}</p>
            </td>
            <td className="py-2.5 text-right text-sm text-gray-600">{branch.monthly_orders}</td>
            <td className="py-2.5 text-right text-sm font-semibold text-gray-900">
              {formatCurrency(branch.monthly_revenue ?? 0)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
