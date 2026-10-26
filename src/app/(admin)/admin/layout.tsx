'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  Sparkles,
  Sliders,
  Settings,
  LogOut,
  ShieldCheck,
  Star,
  FileText,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Don't render shell on the login page itself
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const navLinks = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Appointments', href: '/admin/appointments', icon: Calendar, badge: '3' },
    { label: 'Patients', href: '/admin/patients', icon: Users },
    { label: 'Availability', href: '/admin/availability', icon: Clock },
    { label: 'Smile Gallery', href: '/admin/gallery', icon: Sparkles },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
    { label: 'Audit & Settings', href: '/admin/settings', icon: Settings },
  ]

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dentacare_admin_token')
      localStorage.removeItem('dentacare_admin_user')
    }
    router.push('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-slate-800 bg-slate-950/70 p-6 backdrop-blur-xl">
        <div>
          {/* Clinic Brand */}
          <Link href="/admin" className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-teal text-slate-950 font-bold">
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
          <div className="mt-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>AAL2 MFA Active</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-electric-teal text-slate-950 font-semibold shadow-glow-teal'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive ? 'bg-slate-950 text-white' : 'bg-electric-teal/20 text-electric-teal'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-slate-800 pt-5">
          <div className="flex items-center justify-between px-2">
            <div>
              <div className="text-xs font-semibold text-white">Dr. Osman Ratib</div>
              <div className="text-[10px] text-slate-400">osmanratib14@gmail.com</div>
              <div className="text-[9px] uppercase tracking-wider text-electric-teal font-bold mt-0.5">
                Owner Administrator
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between text-[11px] text-slate-400 hover:text-white px-2 py-1"
            >
              <span>View Public Marketing Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="text-xs text-slate-400">
              Session: <span className="font-mono text-electric-teal">Verified TLS • Supabase Auth</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/appointments"
              className="rounded-full bg-electric-teal/15 px-3 py-1 text-xs font-semibold text-electric-teal border border-electric-teal/30 hover:bg-electric-teal hover:text-slate-950 transition-colors"
            >
              + New Appointment
            </Link>
            <span className="text-xs text-slate-400">
              Owner: <strong className="text-slate-200">osmanratib14@gmail.com</strong>
            </span>
          </div>
        </header>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-slate-950 p-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl p-3 text-xs ${
                    isActive ? 'bg-electric-teal text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && <span>{link.badge}</span>}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="w-full text-left p-3 text-xs text-red-400 hover:bg-slate-800 rounded-xl"
            >
              Sign Out
            </button>
          </div>
        )}

        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  )
}
