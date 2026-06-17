import { ModulePage } from '@/components/shared/ModulePage'
import { DollarSign } from 'lucide-react'

export default function FinancePage() {
  return (
    <ModulePage
      icon={DollarSign}
      title="Finance"
      description="Income, expenses and cash flow for your branch."
      points={["Income & expense ledger","Cash flow summary","Branch profitability"]}
    />
  )
}
