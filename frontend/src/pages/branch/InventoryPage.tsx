import { ModulePage } from '@/components/shared/ModulePage'
import { Package } from 'lucide-react'

export default function InventoryPage() {
  return (
    <ModulePage
      icon={Package}
      title="Inventory"
      description="Track stock, batches, lots and expirations across your warehouses."
      points={["Stock levels per warehouse","Batch & expiration tracking","Manual adjustments"]}
    />
  )
}
