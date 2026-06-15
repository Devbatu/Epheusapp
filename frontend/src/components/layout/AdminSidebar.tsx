import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Package, ShoppingCart,
  ArrowLeftRight, Users, Truck, BarChart3, Store,
  Warehouse, FileText, Bell, Settings,
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

export function AdminSidebar() {
  const { hasPermission } = useAuthStore()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6 dark:border-gray-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600">
          <span className="text-sm font-bold text-white">E</span>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">Ephesus</p>
          <p className="text-xs text-gray-500">Mediterranean Delights</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            if (item.permission && !hasPermission(item.permission)) return null
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-amber-50 text-amber-700 font-medium dark:bg-amber-950 dark:text-amber-400'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom links */}
      <div className="border-t border-gray-200 p-3 dark:border-gray-800">
        <NavLink
          to="/admin/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
      </div>
    </aside>
  )
}
