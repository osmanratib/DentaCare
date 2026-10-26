'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  Calendar,
  Users,
  Clock,
  Sparkles,
  Settings,
  LogOut,
  Star,
  Stethoscope,
  Briefcase,
  Menu,
  X,
  ExternalLink,
  Search,
  Bell,
  Plus,
  ShieldCheck,
  CheckCircle2,
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

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const navLinks = [
    { label: 'Clinic Overview', href: '/admin', icon: Calendar, badge: 'Live' },
    { label: 'Appointments Matrix', href: '/admin/appointments', icon: Clock },
    { label: 'Patient Directory', href: '/admin/patients', icon: Users },
    { label: 'Clinical Faculty', href: '/admin/team', icon: Stethoscope },
    { label: 'Treatment Menu', href: '/admin/services', icon: Briefcase },
    { label: 'Operating Windows', href: '/admin/availability', icon: Clock },
    { label: 'Smile Transformations', href: '/admin/gallery', icon: Sparkles },
    { label: 'Patient Testimonials', href: '/admin/reviews', icon: Star },
    { label: 'Clinic Governance', href: '/admin/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  // Format today's human date
  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="flex min-h-screen bg-[#F4F1EA] text-[#0E1A24] font-sans antialiased selection:bg-[#12B5A6] selection:text-white">
      {/* ===================================================================
          DESKTOP SIDEBAR: Warm Architectural Luxury Shell
         =================================================================== */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-[#E5E0D5] bg-[#FAF8F5] p-6 shrink-0 shadow-[4px_0_24px_rgba(14,26,36,0.02)]">
        <div>
          {/* Clinic Brand Mark */}
          <Link href="/admin" className="group flex items-center gap-3.5 px-2 py-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0E1A24] text-[#FAF8F5] shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-[#12B5A6]" />
            </div>
            <div>
              <div className="font-serif text-xl font-bold tracking-tight text-[#0E1A24]">
                Denta<span className="italic text-[#12B5A6]">Care</span>
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#0E1A24]/50">
                Staff Sanctuary HQ
              </div>
            </div>
          </Link>

          {/* Attending Doctor Profile Card */}
          <div className="mt-6 rounded-3xl border border-[#E8E2D6] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-[#E8DCC8] border border-[#DAC7AD]">
                <Image
                  src="/images/dr-osman.jpg"
                  alt="Dr. Osman Ratib"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="min-w-0">
                <div className="font-serif text-sm font-bold text-[#0E1A24] truncate">
                  Dr. Osman Ratib
                </div>
                <div className="text-[11px] text-[#12B5A6] font-medium truncate">
                  Lead Aesthetic Surgeon
                </div>
                <div className="text-[9px] uppercase tracking-wider text-[#0E1A24]/40 font-semibold mt-0.5">
                  Owner Admin
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Clinic Open
              </span>
              <span className="text-[#0E1A24]/50 font-mono text-[10px]">Operatory 1</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#0E1A24]/40 px-3 mb-2">
              Clinical Workspace
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#0E1A24] text-white shadow-sm font-semibold'
                      : 'text-[#0E1A24]/70 hover:bg-[#EFECE3] hover:text-[#0E1A24]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? 'text-[#12B5A6]' : 'text-[#0E1A24]/45 group-hover:text-[#0E1A24]'
                      }`}
                    />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        isActive
                          ? 'bg-[#12B5A6] text-[#0E1A24]'
                          : 'bg-[#CFE8E4] text-[#0E1A24]'
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

        {/* Footer info & Logout */}
        <div className="border-t border-[#E5E0D5] pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl p-2.5 text-xs text-[#0E1A24]/70 hover:bg-[#EFECE3] hover:text-[#0E1A24] transition-colors mb-2"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-[#12B5A6]" />
              <span>Public Patient Site</span>
            </span>
            <span className="text-[10px] text-[#0E1A24]/40">↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full rounded-xl p-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out of Terminal</span>
          </button>
        </div>
      </aside>

      {/* ===================================================================
          MAIN WORKSPACE AREA
         =================================================================== */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Floating Glass Header */}
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-[#E5E0D5] bg-[#FAF8F5]/90 px-4 sm:px-8 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white text-[#0E1A24] border border-[#E5E0D5] hover:bg-[#EFECE3]"
              aria-label="Open clinical menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="font-serif text-sm font-medium text-[#0E1A24] hidden sm:block">
                {todayStr}
              </div>
              <div className="text-[11px] text-[#0E1A24]/50 hidden sm:flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Supabase Live Sync • Manhattan Operatories</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/appointments"
              className="flex items-center gap-1.5 rounded-full bg-[#0E1A24] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#12B5A6] transition-colors"
            >
              <Plus className="h-3.5 w-3.5 text-[#12B5A6]" />
              <span>New Intake</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#E5E0D5]">
              <span className="text-[11px] text-[#0E1A24]/60">Logged in as:</span>
              <span className="text-xs font-semibold text-[#0E1A24]">{userEmail}</span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-[#0E1A24]/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-72 bg-[#FAF8F5] p-6 flex flex-col justify-between shadow-2xl border-r border-[#E5E0D5] overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D5]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#12B5A6]" />
                    <span className="font-serif text-lg font-bold text-[#0E1A24]">
                      DentaCare HQ
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-[#0E1A24]/60 hover:text-[#0E1A24]"
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
                            ? 'bg-[#0E1A24] text-white font-bold'
                            : 'text-[#0E1A24]/70 hover:bg-[#EFECE3]'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-[#E5E0D5]">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full p-2.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Shell */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
