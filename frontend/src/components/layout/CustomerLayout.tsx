import { useState, useEffect } from 'react'
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Search, Menu, X, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { Logo } from '@/components/shared/Logo'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { useI18n } from '@/i18n'

const navLinks = [
  { to: '/shop', key: 'nav.shop' },
  { to: '/shop?category=baklava', key: 'nav.baklava' },
  { to: '/shop?category=turkish-delight', key: 'nav.turkishDelight' },
  { to: '/shop?category=turkish-coffee', key: 'nav.turkishCoffee' },
  { to: '/shop?category=gift-boxes', key: 'nav.giftBoxes' },
  { to: '/about', key: 'nav.ourStory' },
]

export function CustomerLayout() {
  const { isAuthenticated } = useAuthStore()
  const cartCount = useCartStore((s) => s.count())
  const { t } = useI18n()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchOpen(false)
    navigate(`/shop?search=${encodeURIComponent(search)}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* Slim announcement bar */}
      <div className="bg-primary-dark text-center text-[11px] tracking-wide text-cream/70">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <span className="text-gold">✦</span> {t('top.shipping')}
          <span className="mx-2 text-gold/40">|</span> {t('top.handcrafted')}
        </div>
      </div>

      {/* Main navbar */}
      <header className={`sticky top-0 z-50 border-b transition-shadow ${scrolled ? 'border-gold/20 shadow-xl' : 'border-white/5'} bg-primary`}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo variant="light" size="md" />

          {/* Centered nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                    isActive ? 'text-gold' : 'text-cream/80 hover:text-gold'
                  }`
                }
              >
                {t(l.key)}
              </NavLink>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <LanguageSwitcher variant="light" />
            <button onClick={() => setSearchOpen((o) => !o)} className="rounded-full p-2.5 text-cream/80 transition-colors hover:bg-surface/10 hover:text-gold">
              <Search className="h-5 w-5" />
            </button>
            <Link to={isAuthenticated ? '/account' : '/login'} className="rounded-full p-2.5 text-cream/80 transition-colors hover:bg-surface/10 hover:text-gold">
              <User className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="relative rounded-full p-2.5 text-cream/80 transition-colors hover:bg-surface/10 hover:text-gold">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-primary-dark">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileOpen((o) => !o)} className="ml-1 rounded-full p-2 text-cream lg:hidden">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Search drawer */}
        {searchOpen && (
          <div className="border-t border-white/10 bg-primary-dark">
            <form onSubmit={submitSearch} className="mx-auto max-w-3xl px-6 py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/50" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('nav.search')}
                  className="w-full rounded-full border border-gold/30 bg-cream py-3 pl-11 pr-4 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="border-t border-white/10 bg-primary-dark lg:hidden">
            <div className="space-y-1 px-4 py-3">
              {navLinks.map((l) => (
                <NavLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `block rounded-lg px-4 py-2.5 text-sm font-medium ${isActive ? 'bg-surface/10 text-gold' : 'text-cream/80'}`}>
                  {t(l.key)}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary-dark text-cream/75">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo variant="light" size="md" />
              <p className="mt-5 text-sm leading-relaxed text-cream/55">
                Authentic Turkish delights, baklava and coffee — handcrafted in tradition and
                delivered across America. A celebration of Anatolian heritage.
              </p>
              <div className="mt-6 flex gap-3">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors hover:bg-gold hover:text-primary-dark">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="brand-ephesus text-sm tracking-widest text-gold">SHOP</h4>
              <ul className="mt-5 space-y-3 text-sm">
                <li><Link to="/shop?category=baklava" className="hover:text-gold">Baklava</Link></li>
                <li><Link to="/shop?category=turkish-delight" className="hover:text-gold">Turkish Delight</Link></li>
                <li><Link to="/shop?category=turkish-coffee" className="hover:text-gold">Turkish Coffee</Link></li>
                <li><Link to="/shop?category=gift-boxes" className="hover:text-gold">Gift Boxes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="brand-ephesus text-sm tracking-widest text-gold">CUSTOMER SERVICE</h4>
              <ul className="mt-5 space-y-3 text-sm">
                <li><Link to="/faq" className="hover:text-gold">Shipping &amp; Delivery</Link></li>
                <li><Link to="/faq" className="hover:text-gold">Returns &amp; Refunds</Link></li>
                <li><Link to="/faq" className="hover:text-gold">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-gold">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="brand-ephesus text-sm tracking-widest text-gold">COMPANY</h4>
              <ul className="mt-5 space-y-3 text-sm">
                <li><Link to="/about" className="hover:text-gold">Our Story</Link></li>
                <li><Link to="/wholesale" className="hover:text-gold">Wholesale</Link></li>
                <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
                <li className="flex items-center gap-2 text-cream/70"><Mail className="h-4 w-4 text-gold" /> info@ephesus.com</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-cream/45 sm:flex-row">
            <p>© {new Date().getFullYear()} Ephesus Mediterranean Delights. Tüm hakları saklıdır.</p>
            <p>Premium Akdeniz Gurme · İzmir · Türkiye</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
