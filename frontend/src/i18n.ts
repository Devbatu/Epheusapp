import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LocaleCode = 'en' | 'tr'

export interface Locale {
  code: LocaleCode
  label: string
  flag: string
  enabled: boolean
}

export const LOCALES: Locale[] = [
  { code: 'en', label: 'English', flag: '🇺🇸', enabled: true },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷', enabled: true },
]

type Dict = Record<string, string>

const en: Dict = {
  'nav.shop': 'Shop',
  'nav.baklava': 'Baklava',
  'nav.turkishDelight': 'Turkish Delight',
  'nav.turkishCoffee': 'Turkish Coffee',
  'nav.giftBoxes': 'Gift Boxes',
  'nav.ourStory': 'Our Story',
  'nav.account': 'Account',
  'nav.signin': 'Sign in',
  'nav.cart': 'Cart',
  'nav.search': 'Search Turkish delights…',
  'top.shipping': 'Free shipping across the USA on orders over $75',
  'top.handcrafted': 'Handcrafted in tradition, delivered fresh',
  'hero.cta': 'Shop Collection',
  'home.collections': 'Explore Our Collections',
  'home.viewAllCollections': 'View all collections',
  'home.bestSellers': 'Best Sellers',
  'home.viewAllProducts': 'View all products',
  'home.shopNow': 'Shop Now',
  'home.signature': 'Signature Collection',
  'home.ottoman': 'The Taste of Ottoman Heritage',
  'home.discoverMore': 'Discover More',
  'home.ourStory': 'Our Story',
  'home.fromAnatolia': 'From Anatolia To America',
  'home.learnStory': 'Learn Our Story',
  'home.clubTitle': 'Join Our Delights Club',
  'home.clubText': 'Be the first to know about new collections and exclusive offers.',
  'home.emailPlaceholder': 'Your email address',
  'home.subscribe': 'Subscribe',
  'footer.shop': 'Shop',
  'footer.customerService': 'Customer Service',
  'footer.company': 'Company',
}

const tr: Dict = {
  'nav.shop': 'Mağaza',
  'nav.baklava': 'Baklava',
  'nav.turkishDelight': 'Lokum',
  'nav.turkishCoffee': 'Türk Kahvesi',
  'nav.giftBoxes': 'Hediye Kutuları',
  'nav.ourStory': 'Hikâyemiz',
  'nav.account': 'Hesabım',
  'nav.signin': 'Giriş',
  'nav.cart': 'Sepet',
  'nav.search': 'Ürünlerde ara…',
  'top.shipping': '75$ üzeri siparişlerde ABD geneli ücretsiz kargo',
  'top.handcrafted': 'Geleneksel yöntemlerle, taze paketleme',
  'hero.cta': 'Koleksiyonu Keşfet',
  'home.collections': 'Koleksiyonları Keşfedin',
  'home.viewAllCollections': 'Tümünü gör',
  'home.bestSellers': 'Çok Satanlar',
  'home.viewAllProducts': 'Tüm ürünler',
  'home.shopNow': 'İncele',
  'home.signature': 'İmza Koleksiyon',
  'home.ottoman': 'Osmanlı Mirasının Tadı',
  'home.discoverMore': 'Daha Fazla',
  'home.ourStory': 'Hikâyemiz',
  'home.fromAnatolia': "Anadolu'dan Amerika'ya",
  'home.learnStory': 'Hikâyemizi Okuyun',
  'home.clubTitle': 'Lezzet Kulübüne Katılın',
  'home.clubText': 'Yeni koleksiyonlar ve özel fırsatlardan ilk siz haberdar olun.',
  'home.emailPlaceholder': 'E-posta adresiniz',
  'home.subscribe': 'Abone Ol',
  'footer.shop': 'Mağaza',
  'footer.customerService': 'Müşteri Hizmetleri',
  'footer.company': 'Kurumsal',
}

const dictionaries: Record<LocaleCode, Dict> = { en, tr }

interface I18nStore {
  locale: LocaleCode
  enabled: LocaleCode[]
  defaultLocale: LocaleCode
  setLocale: (l: LocaleCode) => void
  toggleEnabled: (l: LocaleCode) => void
  setDefault: (l: LocaleCode) => void
  t: (key: string) => string
}

export const useI18n = create<I18nStore>()(
  persist(
    (set, get) => ({
      locale: 'en',
      enabled: ['en', 'tr'],
      defaultLocale: 'en',
      setLocale: (locale) => set({ locale }),
      toggleEnabled: (l) => set((s) => {
        const has = s.enabled.includes(l)
        // never allow disabling the last remaining locale
        if (has && s.enabled.length === 1) return s
        return { enabled: has ? s.enabled.filter((x) => x !== l) : [...s.enabled, l] }
      }),
      setDefault: (l) => set({ defaultLocale: l }),
      t: (key) => dictionaries[get().locale]?.[key] ?? en[key] ?? key,
    }),
    { name: 'ephesus_locale' },
  ),
)
