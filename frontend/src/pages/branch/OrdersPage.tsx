import { ModulePage } from '@/components/shared/ModulePage'
import { ShoppingCart } from 'lucide-react'

export default function BranchOrdersPage() {
  return (
    <ModulePage
      icon={ShoppingCart}
      title="Orders"
      description="Process customer, dealer and branch orders through their lifecycle."
      points={["Order status workflow","Packing & shipping","Customer details"]}
    />
  )
}
