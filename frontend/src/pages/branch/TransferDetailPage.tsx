import { ModulePage } from '@/components/shared/ModulePage'
import { ArrowLeftRight } from 'lucide-react'

export default function TransferDetailPage() {
  return (
    <ModulePage
      icon={ArrowLeftRight}
      title="Transfer Detail"
      description="Review a transfer, its items and approval workflow."
      points={["Item quantities","Approve / ship / receive","Status history"]}
    />
  )
}
