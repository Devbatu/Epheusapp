import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { authApi } from '@/services/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { Logo } from '@/components/shared/Logo'
import { Seo } from '@/components/shared/Seo'

const loginSchema = z.object({
  email:    z.string().email('Geçerli bir e-posta girin.'),
  password: z.string().min(1, 'Şifre gerekli.'),
})

type LoginForm = z.infer<typeof loginSchema>

function getRedirectPath(roles: string[]): string {
  if (roles.some((r) => ['super-admin', 'company-admin', 'regional-manager'].includes(r))) return '/admin/dashboard'
  if (roles.some((r) => ['branch-manager', 'warehouse-manager', 'sales-representative'].includes(r))) return '/branch/dashboard'
  if (roles.includes('dealer')) return '/dealer/dashboard'
  if (roles.includes('customer')) return '/account'
  return '/'
}

export default function LoginPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login } = useAuthStore()
  const [showPw, setShowPw] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.requires_2fa) { toast.info('İki adımlı doğrulama gerekli.'); return }
      if (data.user && data.token) {
        login(data.user, data.token)
        const roleNames = data.user.roles.map((r) => r.name)
        navigate(from ?? getRedirectPath(roleNames), { replace: true })
        toast.success(`Hoş geldiniz, ${data.user.name}!`)
      }
    },
    onError: () => toast.error('E-posta veya şifre hatalı.'),
  })

  const fillDemo = () => {
    setValue('email', 'admin@ephesus.com')
    setValue('password', 'Admin@1234!')
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <Seo title="Giriş" description="Ephesus hesabınıza giriş yapın." />

      {/* Left — brand panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <img src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80" alt="Ephesus" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary-dark/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center">
          <Logo variant="light" size="lg" />
          <div className="mt-8 gold-rule" />
          <p className="mt-8 max-w-md font-heading text-2xl leading-relaxed text-cream/90">
            “Ege’nin bereketli topraklarından soframıza taşınan eşsiz lezzetler.”
          </p>
          <p className="mt-4 text-sm uppercase tracking-[0.3em] text-gold">1995’ten Beri</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-col justify-center bg-cream px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-text-light hover:text-gold-dark">
            <ArrowLeft className="h-4 w-4" /> Mağazaya dön
          </Link>

          <div className="lg:hidden"><Logo variant="dark" size="md" /></div>

          <h1 className="mt-6 font-heading text-3xl font-bold text-primary">Tekrar Hoş Geldiniz</h1>
          <p className="mt-2 text-sm text-text-light">Hesabınıza giriş yapın.</p>

          <form onSubmit={handleSubmit((d) => mutate(d))} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">E-posta</label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="w-full rounded-lg border border-mist bg-surface px-4 py-3 text-sm text-charcoal placeholder-text-light/60 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                placeholder="ornek@email.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">Şifre</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-mist bg-surface px-4 py-3 pr-11 text-sm text-charcoal placeholder-text-light/60 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-gold-dark">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wide text-cream shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Giriş Yap
            </button>
          </form>

          {/* Demo credentials */}
          <button
            onClick={fillDemo}
            className="mt-4 w-full rounded-lg border border-dashed border-gold/50 bg-gold/5 px-4 py-3 text-left text-xs text-gold-dark transition-colors hover:bg-gold/10"
          >
            <span className="font-semibold">Demo girişi:</span> admin@ephesus.com / Admin@1234!
            <span className="ml-1 underline">(otomatik doldur)</span>
          </button>

          <p className="mt-8 text-center text-xs text-text-light">
            © {new Date().getFullYear()} Ephesus Mediterranean Delights
          </p>
        </div>
      </div>
    </div>
  )
}
