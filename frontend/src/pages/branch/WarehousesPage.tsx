import { ModulePage } from '@/components/shared/ModulePage'
import { Warehouse } from 'lucide-react'

export default function WarehousesPage() {
  return (
    <ModulePage
      icon={Warehouse}
      title="Warehouses"
      description="Manage the warehouses and storage zones for your branch."
      points={["Multiple warehouses per branch","Per-warehouse stock","Capacity overview"]}
    />
  )
}
