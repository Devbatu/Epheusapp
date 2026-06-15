import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import type { Stock } from '@/types'

export function LowStockTable({ items }: { items: any[] }) {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <AlertTriangle className="h-5 w-5 text-green-600" />
        </div>
        <p className="text-sm text-gray-500">All products are sufficiently stocked.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-2 text-left text-xs font-medium uppercase text-gray-400">Product</th>
            <th className="pb-2 text-right text-xs font-medium uppercase text-gray-400">Stock</th>
            <th className="pb-2 text-right text-xs font-medium uppercase text-gray-400">Min</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {items.slice(0, 8).map((item) => (
            <tr key={`${item.product_id}-${item.warehouse_id}`} className="hover:bg-gray-50">
              <td className="py-2.5">
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-400">{item.sku}</p>
              </td>
              <td className="py-2.5 text-right">
                <span className={`text-sm font-semibold ${item.quantity === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                  {item.quantity}
                </span>
              </td>
              <td className="py-2.5 text-right text-sm text-gray-400">
                {item.min_stock_alert}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
