export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Finans</h2>
        <p className="text-sm text-gray-500">Gelir, gider, nakit akışı</p>
      </div>
      <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-400">Bu sayfa yakında</p>
          <p className="mt-1 text-xs text-gray-400">FinancePage</p>
        </div>
      </div>
    </div>
  )
}