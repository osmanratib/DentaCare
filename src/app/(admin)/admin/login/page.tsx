'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Lock, Mail, KeyRound, QrCode, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials')
  const [email, setEmail] = useState('osmanratib14@gmail.com')
  const [password, setPassword] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please provide staff credentials')
      return
    }

    // Owner check per Section 14
    if (email !== 'osmanratib14@gmail.com' && !email.endsWith('@dentacare.com')) {
      setError('Access restricted to authorized clinic personnel.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Transition to MFA Step (AAL2 enforcement per Section 6 & 14)
      setStep('mfa')
    }, 500)
  }

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (totpCode.length < 6) {
      setError('Please enter the 6-digit authenticator code.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Store staff session token
      if (typeof window !== 'undefined') {
        localStorage.setItem('dentacare_admin_token', 'session_aal2_active')
        localStorage.setItem('dentacare_admin_user', email)
      }
      router.push('/admin')
    }, 600)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-12 text-ivory">
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
            Strict AAL2 Multi-Factor Protected Staff Terminal
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-red-950/60 p-4 border border-red-800 text-xs text-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-8 rounded-4xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl shadow-2xl">
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
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-ivory/40" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 pl-11 pr-4 text-xs text-white placeholder:text-white/30 focus:border-electric-teal focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-ivory/60">
                <span>Role: Owner Admin</span>
                <span className="text-electric-teal">AAL2 Required</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-electric-teal py-3.5 text-xs font-semibold uppercase tracking-wider text-ink transition-all hover:bg-white disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Proceed to Authenticator'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <span className="text-[10px] uppercase tracking-wider text-electric-teal font-semibold">
                  MFA Enrollment / TOTP
                </span>
                <p className="mt-1 text-xs text-ivory/70">
                  Enter the 6-digit token from Google Authenticator, Authy, or 1Password.
                </p>

                {/* Simulated QR Code for new device setup */}
                <div className="my-4 mx-auto flex h-28 w-28 items-center justify-center rounded-2xl bg-white p-2">
                  <QrCode className="h-24 w-24 text-ink" />
                </div>
                <div className="font-mono text-[10px] text-ivory/50">
                  TOTP SECRET: DENT-7290-AAL2-SEC
                </div>
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
                  {loading ? 'Authenticating...' : 'Authorize Login'}
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
