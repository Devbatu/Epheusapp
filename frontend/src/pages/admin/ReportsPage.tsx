import { useQuery } from '@tanstack/react-query'
import { TrendingUp, DollarSign, Package, Store } from 'lucide-react'
import { adminApi } from '@/services/api/admin'
import { formatCurrency } from '@/utils/format'

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-mist bg-surface p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream text-gold-dark">{icon}</span>
        <h3 className="font-heading text-lg font-semibold text-primary">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function ReportsPage() {
  const sales = useQuery({ queryKey: ['rep', 'sales'], queryFn: adminApi.reports.sales })
  const profit = useQuery({ queryKey: ['rep', 'profit'], queryFn: adminApi.reports.profitability })
  const branch = useQuery({ queryKey: ['rep', 'branch'], queryFn: adminApi.reports.branchPerf })
  const dealer = useQuery({ queryKey: ['rep', 'dealer'], queryFn: adminApi.reports.dealerSales })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">Reports &amp; Analytics</h2>
        <p className="text-sm text-text-light">Sales, profitability and performance insights</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-mist bg-primary p-6 text-cream">
          <DollarSign className="h-6 w-6 text-gold" />
          <p className="mt-3 text-2xl font-bold">{formatCurrency(sales.data?.total_revenue ?? 0)}</p>
          <p className="text-sm text-cream/60">Total Revenue</p>
        </div>
        <div className="rounded-2xl border border-mist bg-surface p-6">
          <TrendingUp className="h-6 w-6 text-gold-dark" />
          <p className="mt-3 text-2xl font-bold text-primary">{sales.data?.total_orders ?? 0}</p>
          <p className="text-sm text-text-light">Total Orders</p>
        </div>
        <div className="rounded-2xl border border-mist bg-surface p-6">
          <Store className="h-6 w-6 text-gold-dark" />
          <p className="mt-3 text-2xl font-bold text-primary">{(sales.data?.by_channel ?? []).find((c: any) => c.channel === 'dealer')?.orders ?? 0}</p>
          <p className="text-sm text-text-light">Dealer Orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Top Products by Profit" icon={<Package className="h-4 w-4" />}>
          <table className="min-w-full text-sm">
            <tbody className="divide-y divide-mist">
              {(profit.data ?? []).slice(0, 8).map((p: any) => (
                <tr key={p.name}>
                  <td className="py-2 text-charcoal">{p.name}</td>
                  <td className="py-2 text-right text-text-light">{p.units} units</td>
                  <td className="py-2 text-right font-semibold text-primary">{formatCurrency(p.profit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Branch Performance" icon={<TrendingUp className="h-4 w-4" />}>
          <table className="min-w-full text-sm">
            <tbody className="divide-y divide-mist">
              {(branch.data ?? []).map((b: any) => (
                <tr key={b.name}>
                  <td className="py-2 text-charcoal">{b.name}</td>
                  <td className="py-2 text-right text-text-light">{b.orders} orders</td>
                  <td className="py-2 text-right font-semibold text-primary">{formatCurrency(Number(b.revenue))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Dealer Sales" icon={<Store className="h-4 w-4" />}>
          <table className="min-w-full text-sm">
            <tbody className="divide-y divide-mist">
              {(dealer.data ?? []).length === 0 ? <tr><td className="py-3 text-text-light">No dealer sales yet.</td></tr> :
                (dealer.data ?? []).map((d: any) => (
                <tr key={d.name}>
                  <td className="py-2 text-charcoal">{d.name}</td>
                  <td className="py-2 text-right text-text-light">{d.orders} orders</td>
                  <td className="py-2 text-right font-semibold text-primary">{formatCurrency(Number(d.revenue))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Sales by Channel" icon={<DollarSign className="h-4 w-4" />}>
          <table className="min-w-full text-sm">
            <tbody className="divide-y divide-mist">
              {(sales.data?.by_channel ?? []).map((c: any) => (
                <tr key={c.channel}>
                  <td className="py-2 capitalize text-charcoal">{c.channel}</td>
                  <td className="py-2 text-right text-text-light">{c.orders} orders</td>
                  <td className="py-2 text-right font-semibold text-primary">{formatCurrency(Number(c.revenue))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  )
}
