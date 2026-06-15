import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, MapPin, Warehouse, Power } from 'lucide-react'
import { toast } from 'sonner'
import { branchesApi } from '@/services/api/branches'
import type { Branch } from '@/types'

export default function BranchesPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'branches'],
    queryFn: () => branchesApi.list({ per_page: 50 }),
  })

  const toggle = useMutation({
    mutationFn: (id: string) => branchesApi.toggleStatus(id),
    onSuccess: () => {
      toast.success('Şube durumu güncellendi.')
      queryClient.invalidateQueries({ queryKey: ['admin', 'branches'] })
    },
  })

  const branches = data?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Şubeler</h2>
        <p className="text-sm text-gray-500">{branches.length} şube — stok, depo ve personel yönetimi</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((b: Branch & { warehouses_count?: number }) => (
            <div
              key={b.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{b.name}</h3>
                    <p className="text-xs text-gray-400">{b.code}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  b.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {b.status === 'active' ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" /> {b.city}, {b.country}
                </p>
                <p className="flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-gray-400" /> {b.warehouses_count ?? 0} depo
                </p>
              </div>

              <button
                onClick={() => toggle.mutate(b.id)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <Power className="h-4 w-4" />
                {b.status === 'active' ? 'Pasifleştir' : 'Aktifleştir'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
