import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import api from '@/lib/api'
import { formatCurrency } from '@/utils/format'

export function RevenueChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'revenue'],
    queryFn: () => api.get<{ data: Array<{ month: string; revenue: number; orders: number }> }>('/admin/analytics/revenue').then((r) => r.data.data),
  })

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-xl bg-mist " />
  }

  return (
    <div className="rounded-xl border border-mist bg-surface p-6  ">
      <h3 className="mb-4 font-semibold text-primary ">Monthly Revenue</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data ?? []}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C19B66" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#C19B66" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v: number) => [formatCurrency(v), 'Revenue']} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#C19B66"
            strokeWidth={2}
            fill="url(#revenueGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
