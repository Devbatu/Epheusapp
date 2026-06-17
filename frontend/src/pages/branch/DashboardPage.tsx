import { ModulePage } from '@/components/shared/ModulePage'
import { LayoutDashboard } from 'lucide-react'

export default function BranchDashboardPage() {
  return (
    <ModulePage
      icon={LayoutDashboard}
      title="Branch Dashboard"
      description="Real-time KPIs for your branch — sales, stock and transfers."
      points={["Today and monthly sales","Low-stock alerts","Pending transfers"]}
    />
  )
}
