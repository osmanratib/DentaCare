'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  Sparkles,
  Settings,
  LogOut,
  ShieldCheck,
  Star,
  Stethoscope,
  Briefcase,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('osmanratib14@gmail.com')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email)
      }
    })
  }, [supabase])

  // Don't render shell on the login page itself
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const navLinks = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { label: 'Patients', href: '/admin/patients', icon: Users },
    { label: 'Doctors / Faculty', href: '/admin/team', icon: Stethoscope },
    { label: 'Treatments / Services', href: '/admin/services', icon: Briefcase },
    { label: 'Availability & Slots', href: '/admin/availability', icon: Clock },
    { label: 'Smile Gallery', href: '/admin/gallery', icon: Sparkles },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
    { label: 'Audit & Settings', href: '/admin/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-slate-800 bg-slate-900/90 p-6 backdrop-blur-xl shrink-0">
        <div>
          {/* Clinic Brand */}
          <Link href="/admin" className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-teal text-slate-950 font-bold shadow-glow-teal">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-serif text-lg font-bold tracking-tight text-white">
                DentaCare <span className="text-xs text-electric-teal font-sans">HQ</span>
              </div>
              <div className="text-[10px] text-slate-400">Clinic Staff Command</div>
            </div>
          </Link>

          {/* Security Status Badge */}
          <div className="mt-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>PostgreSQL & RLS Connected</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-electric-teal text-slate-950 font-semibold shadow-glow-teal'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between px-2">
            <div className="truncate pr-2">
              <div className="text-xs font-semibold text-white">Dr. Osman Ratib</div>
              <div className="text-[10px] text-slate-400 truncate">{userEmail}</div>
              <div className="text-[9px] uppercase tracking-wider text-electric-teal font-bold mt-0.5">
                Owner Administrator
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/60">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between text-[11px] text-slate-400 hover:text-white px-2 py-1"
            >
              <span>View Public Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-xs text-slate-400 hidden sm:block">
              Database: <span className="font-mono text-electric-teal">Connected (qknsobdwmngzyriptptd)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/appointments"
              className="rounded-full bg-electric-teal px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-glow-teal hover:bg-white transition-colors"
            >
              + Booking
            </Link>
            <span className="text-xs text-slate-400 hidden md:inline">
              Owner: <strong className="text-slate-200">{userEmail}</strong>
            </span>
          </div>
        </header>

        {/* Mobile Navigation Drawer with Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 p-6 flex flex-col justify-between shadow-2xl border-r border-slate-800 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-electric-teal" />
                    <span className="font-serif text-lg font-bold text-white">DentaCare HQ</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="mt-6 space-y-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-xl p-3 text-xs ${
                          isActive
                            ? 'bg-electric-teal text-slate-950 font-bold'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full p-2.5 text-xs text-red-400 hover:bg-slate-800 rounded-xl"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
