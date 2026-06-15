export default function ProductDetailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ürün Detayı</h2>
        <p className="text-sm text-gray-500">Ürün bilgileri, varyantlar, görseller</p>
      </div>
      <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-400">Bu sayfa yakında</p>
          <p className="mt-1 text-xs text-gray-400">ProductDetailPage</p>
        </div>
      </div>
    </div>
  )
}