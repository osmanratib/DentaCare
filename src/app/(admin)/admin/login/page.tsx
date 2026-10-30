'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Lock, Mail, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toastSuccess, toastError } from '@/lib/sweetalert'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials')
  const [email, setEmail] = useState('osmanratib14@gmail.com')
  const [password, setPassword] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // 1. Authenticate against Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (authError || !authData.user) {
        const msg = authError?.message || 'Invalid login credentials. Please check your email and password.'
        setError(msg)
        toastError('Authentication Failed', msg)
        setLoading(false)
        return
      }

      // 2. Verify role in public.admins table
      const { data: adminRecord, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (adminError || !adminRecord) {
        await supabase.auth.signOut()
        const msg = 'Access denied: Your account is not registered in the clinic staff directory.'
        setError(msg)
        toastError('Unauthorized', msg)
        setLoading(false)
        return
      }

      // 3. Check for TOTP MFA enrollment
      const { data: factorsData } = await supabase.auth.mfa.listFactors()
      const totpFactor = factorsData?.totp?.find((f) => f.status === 'verified')

      if (totpFactor) {
        setMfaFactorId(totpFactor.id)
        setStep('mfa')
        toastSuccess('Identity Verified', 'Enter your 6-digit TOTP code to proceed.')
        setLoading(false)
      } else {
        // Successful login without active TOTP factor
        toastSuccess('Welcome, Doctor', 'Authentication successful.')
        router.push('/admin')
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
      setLoading(false)
    }
  }

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!mfaFactorId) {
        setError('No active MFA factor found.')
        setLoading(false)
        return
      }

      const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
        factorId: mfaFactorId,
        code: totpCode.trim(),
      })

      if (verifyError) {
        const msg = `MFA Verification Failed: ${verifyError.message}`
        setError(msg)
        toastError('MFA Challenge Failed', verifyError.message)
        setLoading(false)
        return
      }

      toastSuccess('Session Authenticated', 'Access granted to admin panel.')
      router.push('/admin')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'MFA verification failed')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 sm:px-6 py-12 text-ivory">
      <div className="w-full max-w-md">
        {/* Clinic Crest */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-electric-teal/20 text-electric-teal shadow-glow-teal">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-serif text-3xl font-medium tracking-tight text-white">
            Clinic Command Center
          </h1>
          <p className="mt-2 text-xs text-ivory/60">
            Authenticated via Supabase PostgreSQL & RLS
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-red-950/70 p-4 border border-red-800 text-xs text-red-200">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
            <div>
              <span className="font-semibold text-white">Authentication Error:</span>
              <p className="mt-0.5 text-red-300">{error}</p>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-4xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-2">
                  Staff Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-ivory/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="osmanratib14@gmail.com"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 pl-11 pr-4 text-xs text-white placeholder:text-white/30 focus:border-electric-teal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-2">
                  Supabase Master Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-ivory/40" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your Supabase password"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 pl-11 pr-4 text-xs text-white placeholder:text-white/30 focus:border-electric-teal focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-ivory/60">
                <span>Verified in: <strong className="text-white">public.admins</strong></span>
                <span className="text-electric-teal">AAL2 Security</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-electric-teal py-3.5 text-xs font-semibold uppercase tracking-wider text-ink transition-all hover:bg-white disabled:opacity-50"
              >
                {loading ? 'Authenticating with Supabase...' : 'Sign In to Dashboard'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <span className="text-[10px] uppercase tracking-wider text-electric-teal font-semibold">
                  MFA Challenge
                </span>
                <p className="mt-1 text-xs text-ivory/70">
                  Enter the 6-digit code from your authenticator app (Google Authenticator, Authy, or 1Password).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-2 text-center">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-3.5 h-4 w-4 text-electric-teal" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.5em] font-mono text-lg rounded-2xl border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-white placeholder:text-white/20 focus:border-electric-teal focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="w-1/3 rounded-full border border-white/20 py-3 text-xs uppercase tracking-wider text-ivory hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 flex items-center justify-center gap-2 rounded-full bg-electric-teal py-3 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-white transition-colors"
                >
                  {loading ? 'Verifying...' : 'Authorize Login'}
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-ivory/50 hover:text-white transition-colors">
            ← Return to DentaCare Public Site
          </Link>
        </div>
      </div>
    </div>
  )
}
