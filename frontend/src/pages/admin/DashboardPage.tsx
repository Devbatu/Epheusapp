import { useQuery } from '@tanstack/react-query'
import {
  TrendingUp, ShoppingCart, Package, ArrowLeftRight,
  Store, AlertTriangle, Building2,
} from 'lucide-react'
import api from '@/lib/api'
import type { DashboardKPI } from '@/types'
import { KpiCard }         from '@/components/dashboard/KpiCard'
import { TopProductsChart } from '@/components/dashboard/TopProductsChart'
import { RevenueChart }     from '@/components/dashboard/RevenueChart'
import { LowStockTable }    from '@/components/dashboard/LowStockTable'
import { BranchPerformanceTable } from '@/components/dashboard/BranchPerformanceTable'
import { formatCurrency }   from '@/utils/format'

function useDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.get<DashboardKPI>('/admin/dashboard').then((r) => r.data),
    refetchInterval: 60_000,
  })
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-mist " />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary ">Dashboard</h2>
        <p className="text-sm text-text-light">Welcome back — here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Today's Sales"
          value={formatCurrency(data?.today_sales?.amount ?? 0)}
          sub={`${data?.today_sales?.count ?? 0} orders`}
          icon={<TrendingUp className="h-5 w-5" />}
          color="green"
        />
        <KpiCard
          title="Monthly Revenue"
          value={formatCurrency(data?.monthly_revenue?.total ?? 0)}
          sub={`${data?.monthly_revenue?.orders ?? 0} orders`}
          icon={<ShoppingCart className="h-5 w-5" />}
          color="blue"
        />
        <KpiCard
          title="Pending Transfers"
          value={String(data?.pending_transfers ?? 0)}
          sub="Awaiting action"
          icon={<ArrowLeftRight className="h-5 w-5" />}
          color="amber"
          href="/admin/transfers"
        />
        <KpiCard
          title="Dealer Revenue"
          value={formatCurrency(data?.dealer_revenue?.revenue ?? 0)}
          sub={`${data?.dealer_revenue?.orders ?? 0} dealer orders`}
          icon={<Store className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <TopProductsChart products={data?.top_products ?? []} />
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-mist bg-surface p-6  ">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-gold-dark" />
            <h3 className="font-semibold text-primary ">Low Stock Alert</h3>
          </div>
          <LowStockTable items={data?.low_stock_products ?? []} />
        </div>

        <div className="rounded-xl border border-mist bg-surface p-6  ">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-500" />
            <h3 className="font-semibold text-primary ">Branch Performance</h3>
          </div>
          <BranchPerformanceTable />
        </div>
      </div>
    </div>
  )
}
