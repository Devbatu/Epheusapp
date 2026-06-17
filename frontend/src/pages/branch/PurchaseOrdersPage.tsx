import { ModulePage } from '@/components/shared/ModulePage'
import { Truck } from 'lucide-react'

export default function PurchaseOrdersPage() {
  return (
    <ModulePage
      icon={Truck}
      title="Purchase Orders"
      description="Create supplier purchase orders and receive stock into your warehouse."
      points={["Create & send POs","Receive stock","Supplier payments"]}
    />
  )
}
