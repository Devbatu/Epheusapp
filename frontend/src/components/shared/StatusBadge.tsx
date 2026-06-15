import { cn } from '@/lib/utils'
import type { TransferStatus, OrderStatus, DealerStatus } from '@/types'

const transferColors: Record<TransferStatus, string> = {
  pending:   'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  approved:  'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  rejected:  'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  shipped:   'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
  received:  'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

const orderColors: Record<OrderStatus, string> = {
  draft:      'bg-gray-100 text-gray-600',
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
  suspended: 'bg-gray-100 text-gray-600',
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
