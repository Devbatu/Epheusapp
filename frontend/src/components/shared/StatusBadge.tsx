import { cn } from '@/lib/utils'
import type { TransferStatus, OrderStatus, DealerStatus } from '@/types'

const transferColors: Record<TransferStatus, string> = {
  pending:   'bg-amber-100 text-amber-800  ',
  approved:  'bg-blue-100 text-blue-800  ',
  rejected:  'bg-red-100 text-red-800  ',
  shipped:   'bg-purple-100 text-purple-800  ',
  received:  'bg-green-100 text-green-800  ',
  cancelled: 'bg-cream text-charcoal/70  ',
}

const orderColors: Record<OrderStatus, string> = {
  draft:      'bg-cream text-charcoal/70',
  pending:    'bg-amber-100 text-amber-800',
  confirmed:  'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  packed:     'bg-violet-100 text-violet-800',
  shipped:    'bg-purple-100 text-purple-800',
  delivered:  'bg-green-100 text-green-800',
  returned:   'bg-orange-100 text-orange-800',
  cancelled:  'bg-red-100 text-red-800',
}

const dealerColors: Record<DealerStatus, string> = {
  pending:   'bg-amber-100 text-amber-800',
  approved:  'bg-green-100 text-green-800',
  rejected:  'bg-red-100 text-red-800',
  suspended: 'bg-cream text-charcoal/70',
}

function Badge({ className, label }: { className: string; label: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', className)}>
      {label.replace(/_/g, ' ')}
    </span>
  )
}

export function TransferStatusBadge({ status }: { status: TransferStatus }) {
  return <Badge className={transferColors[status]} label={status} />
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge className={orderColors[status]} label={status} />
}

export function DealerStatusBadge({ status }: { status: DealerStatus }) {
  return <Badge className={dealerColors[status]} label={status} />
}
