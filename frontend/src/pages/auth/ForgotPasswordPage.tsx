import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'
import { authApi } from '@/services/api/auth'
import { Logo } from '@/components/shared/Logo'
import { Seo } from '@/components/shared/Seo'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.forgotPassword(email),
    onSettled: () => setSent(true), // always show success (no account enumeration)
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <Seo title="Reset Password" />
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo variant="dark" size="md" /></div>
        <div className="rounded-2xl border border-mist bg-surface p-8">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-gold-dark">
                <MailCheck className="h-7 w-7" />
              </div>
              <h1 className="mt-5 font-heading text-2xl font-bold text-primary">Check your email</h1>
              <p className="mt-2 text-sm text-text-light">If an account exists for <span className="font-medium text-charcoal">{email}</span>, a reset link is on its way.</p>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-2xl font-bold text-primary">Reset Password</h1>
              <p className="mt-2 text-sm text-text-light">Enter your email and we will send you a reset link.</p>
              <form onSubmit={(e) => { e.preventDefault(); mutate() }} className="mt-6 space-y-4">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full rounded-lg border border-mist bg-surface px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
                <button type="submit" disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wide text-cream hover:bg-primary-dark disabled:opacity-60">
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />} Send Reset Link
                </button>
              </form>
            </>
          )}
          <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm text-text-light hover:text-gold-dark">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
