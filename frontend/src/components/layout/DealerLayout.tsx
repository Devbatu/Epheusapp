import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, ShoppingCart, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TopBar } from './TopBar'

const navItems = [
  { to: '/dealer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dealer/shop',      icon: ShoppingBag,     label: 'Shop' },
  { to: '/dealer/orders',    icon: ShoppingCart,    label: 'My Orders' },
]

export function DealerLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-cream ">
      <aside className="flex h-full w-60 flex-col border-r border-mist bg-surface  ">
        <div className="flex h-16 items-center gap-3 border-b border-mist px-5 ">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-600">
            <span className="text-xs font-bold text-white">D</span>
          </div>
          <p className="text-sm font-bold text-primary ">Dealer Portal</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-green-50 text-green-700 font-medium  '
                      : 'text-charcoal/70 hover:bg-cream  ',
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
