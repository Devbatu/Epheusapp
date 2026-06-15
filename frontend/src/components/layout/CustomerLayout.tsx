import { useState } from 'react'
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Search, Menu, X, Phone, Truck, MapPin, Mail, Instagram, Facebook, Twitter } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { Logo } from '@/components/shared/Logo'

const navLinks = [
  { to: '/', label: 'Ana Sayfa', end: true },
  { to: '/shop', label: 'Mağaza' },
  { to: '/shop?category=olive-oil-vinegar', label: 'Zeytinyağı' },
  { to: '/shop?category=sweets-baklava', label: 'Tatlılar' },
  { to: '/about', label: 'Hakkımızda' },
  { to: '/wholesale', label: 'Toptan / Bayilik' },
  { to: '/contact', label: 'İletişim' },
]

export function CustomerLayout() {
  const { isAuthenticated } = useAuthStore()
  const cartCount = useCartStore((s) => s.count())
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/shop?search=${encodeURIComponent(search)}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* Announcement bar */}
      <div className="bg-primary-dark text-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
          <span className="hidden items-center gap-2 sm:flex">
            <Truck className="h-3.5 w-3.5 text-gold" /> 500₺ üzeri siparişlerde ücretsiz kargo
          </span>
          <span className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-gold" /> +90 232 555 0 232
          </span>
          <span className="hidden items-center gap-2 md:flex">
            <MapPin className="h-3.5 w-3.5 text-gold" /> 5 şube · Türkiye geneli teslimat
          </span>
        </div>
      </div>

      {/* Main navbar */}
      <header className="sticky top-0 z-50 border-b border-gold/20 bg-primary shadow-lg">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
          <Logo variant="light" size="md" />

          {/* Search (desktop) */}
          <form onSubmit={submitSearch} className="hidden flex-1 lg:block lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/50" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Akdeniz lezzetlerinde ara…"
                className="w-full rounded-full border border-gold/30 bg-cream py-2.5 pl-11 pr-4 text-sm text-charcoal placeholder-primary/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-cream/90 transition-colors hover:bg-white/10 hover:text-gold"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{isAuthenticated ? 'Hesabım' : 'Giriş'}</span>
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-cream/90 transition-colors hover:bg-white/10 hover:text-gold"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden sm:inline">Sepet</span>
              {cartCount > 0 && (
                <span className="absolute -right-0.5 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-primary-dark">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="ml-1 rounded-full p-2 text-cream lg:hidden"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Nav links (desktop) */}
        <nav className="hidden border-t border-white/10 bg-primary-dark/40 lg:block">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-6">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `relative px-4 py-3 text-sm font-medium tracking-wide transition-colors ${
                    isActive ? 'text-gold' : 'text-cream/80 hover:text-gold'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="border-t border-white/10 bg-primary-dark lg:hidden">
            <div className="space-y-1 px-4 py-3">
              <form onSubmit={submitSearch} className="mb-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ara…"
                  className="w-full rounded-full bg-cream px-4 py-2 text-sm text-charcoal focus:outline-none"
                />
              </form>
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-2.5 text-sm font-medium ${
                      isActive ? 'bg-white/10 text-gold' : 'text-cream/80'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary-dark text-cream/80">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo variant="light" size="md" />
              <p className="mt-4 text-sm leading-relaxed text-cream/60">
                Ege’nin bereketli topraklarından özenle seçilmiş premium Akdeniz lezzetleri.
                1995’ten beri kalite ve gelenek.
              </p>
              <div className="mt-5 flex gap-3">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors hover:bg-gold hover:text-primary-dark">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-lg font-semibold text-gold">Kurumsal</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link to="/about" className="hover:text-gold">Hakkımızda</Link></li>
                <li><Link to="/wholesale" className="hover:text-gold">Toptan & Bayilik</Link></li>
                <li><Link to="/contact" className="hover:text-gold">İletişim</Link></li>
                <li><Link to="/faq" className="hover:text-gold">Sıkça Sorulan Sorular</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading text-lg font-semibold text-gold">Alışveriş</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link to="/shop" className="hover:text-gold">Tüm Ürünler</Link></li>
                <li><Link to="/shop?category=olive-oil-vinegar" className="hover:text-gold">Zeytinyağı & Sirke</Link></li>
                <li><Link to="/shop?category=sweets-baklava" className="hover:text-gold">Tatlı & Baklava</Link></li>
                <li><Link to="/shop?category=cheese-dairy" className="hover:text-gold">Peynir & Süt Ürünleri</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading text-lg font-semibold text-gold">İletişim</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Alsancak, İzmir</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> +90 232 555 0 232</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> info@ephesus.com</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-cream/50 sm:flex-row">
            <p>© {new Date().getFullYear()} Ephesus Mediterranean Delights. Tüm hakları saklıdır.</p>
            <p>Premium Akdeniz Gurme · İzmir · Türkiye</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
