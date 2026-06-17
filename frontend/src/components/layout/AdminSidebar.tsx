import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Package, ShoppingCart,
  ArrowLeftRight, Users, Truck, BarChart3, Store,
  Palette, Languages,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard',  permission: null },
  { to: '/admin/branches',   icon: Building2,       label: 'Branches',   permission: 'branches.view' },
  { to: '/admin/products',   icon: Package,         label: 'Products',   permission: 'products.view' },
  { to: '/admin/orders',     icon: ShoppingCart,    label: 'Orders',     permission: 'orders.view' },
  { to: '/admin/transfers',  icon: ArrowLeftRight,  label: 'Transfers',  permission: 'transfers.view' },
  { to: '/admin/users',      icon: Users,           label: 'Users',      permission: 'users.view' },
  { to: '/admin/dealers',    icon: Store,           label: 'Dealers',    permission: 'dealers.view' },
  { to: '/admin/suppliers',  icon: Truck,           label: 'Suppliers',  permission: 'purchase.view' },
  { to: '/admin/reports',    icon: BarChart3,       label: 'Reports',    permission: 'reports.view' },
]

const settingsItems = [
  { to: '/admin/settings/appearance',   icon: Palette,   label: 'Appearance' },
  { to: '/admin/settings/localization', icon: Languages, label: 'Languages' },
]

export function AdminSidebar() {
  const { hasPermission } = useAuthStore()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
      isActive
        ? 'bg-gold/15 font-medium text-gold-dark'
        : 'text-charcoal/70 hover:bg-cream hover:text-primary',
    )

  return (
    <aside className="flex h-full w-64 flex-col border-r border-mist bg-surface">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-mist px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold bg-primary brand-ephesus text-gold">E</div>
        <div>
          <p className="brand-ephesus text-sm tracking-widest text-primary">EPHESUS</p>
          <p className="brand-tagline -mt-1 text-base text-gold-dark">Mediterranean Delights</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            if (item.permission && !hasPermission(item.permission)) return null
            return (
              <li key={item.to}>
                <NavLink to={item.to} className={linkClass}>
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>

        <p className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-light">Settings</p>
        <ul className="mt-2 space-y-1">
          {settingsItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={linkClass}>
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
