import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency, truncate } from '@/utils/format'

interface TopProduct {
  product_id: string
  name: string
  total_qty: number
  total_revenue: number
}

export function TopProductsChart({ products }: { products: TopProduct[] }) {
  return (
    <div className="rounded-xl border border-mist bg-surface p-6  ">
      <h3 className="mb-4 font-semibold text-primary ">Top Products</h3>
      {products.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-light">No data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={products} layout="vertical">
            <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 10 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => truncate(v, 14)}
            />
            <Tooltip formatter={(v: number) => [formatCurrency(v), 'Revenue']} />
            <Bar dataKey="total_revenue" fill="#C19B66" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
