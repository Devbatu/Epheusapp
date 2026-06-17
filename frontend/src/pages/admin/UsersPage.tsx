import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Users as UsersIcon, ShieldCheck } from 'lucide-react'
import { adminApi } from '@/services/api/admin'
import { formatDate } from '@/utils/format'

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', search],
    queryFn: () => adminApi.users({ search: search || undefined, per_page: 50 }),
  })
  const users = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary">Users &amp; Roles</h2>
          <p className="text-sm text-text-light">{data?.meta?.total ?? 0} users</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…"
            className="w-full rounded-lg border border-mist bg-surface py-2.5 pl-10 pr-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 sm:w-72" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-mist bg-surface">
        <table className="min-w-full divide-y divide-mist">
          <thead className="bg-cream">
            <tr>{['User', 'Roles', 'Branch', 'Status', 'Joined'].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-light">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {isLoading ? Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-mist" /></td>)}</tr>
            )) : users.length === 0 ? (
              <tr><td colSpan={5} className="py-16 text-center text-sm text-text-light"><UsersIcon className="mx-auto mb-2 h-8 w-8 opacity-40" /> No users found.</td></tr>
            ) : users.map((u: any) => (
              <tr key={u.id} className="hover:bg-cream/60">
                <td className="px-5 py-3">
                  <p className="text-sm font-medium text-primary">{u.name}</p>
                  <p className="text-xs text-text-light">{u.email}</p>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {u.roles.map((r: string) => (
                      <span key={r} className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-xs font-medium capitalize text-gold-dark">
                        <ShieldCheck className="h-3 w-3" /> {r.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-charcoal/70">{u.branch ?? '—'}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-cream text-text-light'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-text-light">{formatDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
