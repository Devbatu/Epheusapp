import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthGuard }   from '@/components/layout/AuthGuard'
import { RoleGuard }   from '@/components/layout/RoleGuard'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { BranchLayout } from '@/components/layout/BranchLayout'
import { DealerLayout } from '@/components/layout/DealerLayout'
import { CustomerLayout } from '@/components/layout/CustomerLayout'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

// Lazy-loaded pages
const LoginPage               = lazy(() => import('@/pages/auth/LoginPage'))
const ForgotPasswordPage      = lazy(() => import('@/pages/auth/ForgotPasswordPage'))

// Admin pages
const AdminDashboard          = lazy(() => import('@/pages/admin/DashboardPage'))
const BranchesPage            = lazy(() => import('@/pages/admin/BranchesPage'))
const BranchDetailPage        = lazy(() => import('@/pages/admin/BranchDetailPage'))
const UsersPage               = lazy(() => import('@/pages/admin/UsersPage'))
const ProductsPage            = lazy(() => import('@/pages/admin/ProductsPage'))
const ProductDetailPage       = lazy(() => import('@/pages/admin/ProductDetailPage'))
const DealersPage             = lazy(() => import('@/pages/admin/DealersPage'))
const DealerDetailPage        = lazy(() => import('@/pages/admin/DealerDetailPage'))
const SuppliersPage           = lazy(() => import('@/pages/admin/SuppliersPage'))
const ReportsPage             = lazy(() => import('@/pages/admin/ReportsPage'))
const AdminTransfersPage      = lazy(() => import('@/pages/admin/TransfersPage'))

// Branch pages
const BranchDashboard         = lazy(() => import('@/pages/branch/DashboardPage'))
const InventoryPage           = lazy(() => import('@/pages/branch/InventoryPage'))
const WarehousesPage          = lazy(() => import('@/pages/branch/WarehousesPage'))
const TransfersPage           = lazy(() => import('@/pages/branch/TransfersPage'))
const TransferDetailPage      = lazy(() => import('@/pages/branch/TransferDetailPage'))
const CreateTransferPage      = lazy(() => import('@/pages/branch/CreateTransferPage'))
const BranchOrdersPage        = lazy(() => import('@/pages/branch/OrdersPage'))
const PurchaseOrdersPage      = lazy(() => import('@/pages/branch/PurchaseOrdersPage'))
const FinancePage             = lazy(() => import('@/pages/branch/FinancePage'))

// Dealer pages
const DealerDashboard         = lazy(() => import('@/pages/dealer/DashboardPage'))
const DealerShopPage          = lazy(() => import('@/pages/dealer/ShopPage'))
const DealerOrdersPage        = lazy(() => import('@/pages/dealer/OrdersPage'))

// Customer pages
const CustomerHomePage        = lazy(() => import('@/pages/customer/HomePage'))
const CustomerShopPage        = lazy(() => import('@/pages/customer/ShopPage'))
const CustomerProductPage     = lazy(() => import('@/pages/customer/ProductPage'))
const CustomerCartPage        = lazy(() => import('@/pages/customer/CartPage'))
const CustomerOrdersPage      = lazy(() => import('@/pages/customer/OrdersPage'))
const CustomerProfilePage     = lazy(() => import('@/pages/customer/ProfilePage'))
const AboutPage               = lazy(() => import('@/pages/customer/AboutPage'))
const ContactPage             = lazy(() => import('@/pages/customer/ContactPage'))
const WholesalePage           = lazy(() => import('@/pages/customer/WholesalePage'))
const FaqPage                 = lazy(() => import('@/pages/customer/FaqPage'))

const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner fullscreen />}>{children}</Suspense>
)

export const router = createBrowserRouter([
  // ─── Public ──────────────────────────────────────────────────────────────
  {
    path: '/login',
    element: <S><LoginPage /></S>,
  },
  {
    path: '/forgot-password',
    element: <S><ForgotPasswordPage /></S>,
  },

  // ─── Admin ───────────────────────────────────────────────────────────────
  {
    path: '/admin',
    element: (
      <AuthGuard>
        <RoleGuard roles={['super-admin', 'company-admin', 'regional-manager']}>
          <AdminLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard',         element: <S><AdminDashboard /></S> },
      { path: 'branches',          element: <S><BranchesPage /></S> },
      { path: 'branches/:id',      element: <S><BranchDetailPage /></S> },
      { path: 'users',             element: <S><UsersPage /></S> },
      { path: 'products',          element: <S><ProductsPage /></S> },
      { path: 'products/:id',      element: <S><ProductDetailPage /></S> },
      { path: 'dealers',           element: <S><DealersPage /></S> },
      { path: 'dealers/:id',       element: <S><DealerDetailPage /></S> },
      { path: 'suppliers',         element: <S><SuppliersPage /></S> },
      { path: 'transfers',         element: <S><AdminTransfersPage /></S> },
      { path: 'reports',           element: <S><ReportsPage /></S> },
    ],
  },

  // ─── Branch ──────────────────────────────────────────────────────────────
  {
    path: '/branch',
    element: (
      <AuthGuard>
        <RoleGuard roles={['branch-manager', 'warehouse-manager', 'sales-representative']}>
          <BranchLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/branch/dashboard" replace /> },
      { path: 'dashboard',               element: <S><BranchDashboard /></S> },
      { path: 'inventory',               element: <S><InventoryPage /></S> },
      { path: 'warehouses',              element: <S><WarehousesPage /></S> },
      { path: 'transfers',               element: <S><TransfersPage /></S> },
      { path: 'transfers/create',        element: <S><CreateTransferPage /></S> },
      { path: 'transfers/:id',           element: <S><TransferDetailPage /></S> },
      { path: 'orders',                  element: <S><BranchOrdersPage /></S> },
      { path: 'purchase-orders',         element: <S><PurchaseOrdersPage /></S> },
      { path: 'finance',                 element: <S><FinancePage /></S> },
    ],
  },

  // ─── Dealer Portal ───────────────────────────────────────────────────────
  {
    path: '/dealer',
    element: (
      <AuthGuard>
        <RoleGuard roles={['dealer']}>
          <DealerLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/dealer/dashboard" replace /> },
      { path: 'dashboard', element: <S><DealerDashboard /></S> },
      { path: 'shop',      element: <S><DealerShopPage /></S> },
      { path: 'orders',    element: <S><DealerOrdersPage /></S> },
    ],
  },

  // ─── E-Commerce (Customer) ───────────────────────────────────────────────
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      { index: true,          element: <S><CustomerHomePage /></S> },
      { path: 'shop',         element: <S><CustomerShopPage /></S> },
      { path: 'shop/:slug',   element: <S><CustomerProductPage /></S> },
      { path: 'cart',         element: <S><CustomerCartPage /></S> },
      { path: 'about',        element: <S><AboutPage /></S> },
      { path: 'contact',      element: <S><ContactPage /></S> },
      { path: 'wholesale',    element: <S><WholesalePage /></S> },
      { path: 'faq',          element: <S><FaqPage /></S> },
      {
        path: 'account',
        element: <AuthGuard><RoleGuard roles={['customer']}><S><CustomerProfilePage /></S></RoleGuard></AuthGuard>,
      },
      {
        path: 'account/orders',
        element: <AuthGuard><RoleGuard roles={['customer']}><S><CustomerOrdersPage /></S></RoleGuard></AuthGuard>,
      },
    ],
  },

  // ─── Catch-all ───────────────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/" replace /> },
])
