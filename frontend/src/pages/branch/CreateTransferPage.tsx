import { ModulePage } from '@/components/shared/ModulePage'
import { Plus } from 'lucide-react'

export default function CreateTransferPage() {
  return (
    <ModulePage
      icon={Plus}
      title="New Transfer"
      description="Request a stock transfer from one branch to another."
      points={["Select source & destination","Add products & quantities","Submit for approval"]}
    />
  )
}
