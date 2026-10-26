'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Calendar, Menu, X, Shield } from 'lucide-react'
import { MagneticButton } from '../motion/MagneticButton'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Smile Gallery', href: '/smile-gallery' },
    { label: 'Specialists', href: '/team' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Journal', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-glass border-b border-sand-dark/20 py-3.5 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-ivory transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-electric-teal" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-ink">
              Denta<span className="italic text-electric-teal">Care</span>
            </span>
            <span className="text-[9px] font-sans uppercase tracking-[0.22em] text-ink/60">
              Quiet Luxury Dentistry
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors hover:text-electric-teal ${
                  isActive ? 'text-electric-teal font-semibold' : 'text-ink/80'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-electric-teal rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 text-xs text-ink/60 hover:text-ink transition-colors px-2 py-1 rounded"
            title="Clinic Staff Portal"
          >
            <Shield className="h-3.5 w-3.5 text-electric-teal" />
            <span>Staff</span>
          </Link>

          <MagneticButton strength={0.25}>
            <Link
              href="/book"
              className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory shadow-soft-layer transition-all duration-300 hover:bg-electric-teal hover:text-white"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Book a Visit</span>
            </Link>
          </MagneticButton>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 p-2 text-ink md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 border-b border-sand-dark/20 bg-ivory px-6 py-6 shadow-xl md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-ink hover:text-electric-teal"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-sand-dark/20">
              <Link
                href="/book"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-center text-xs font-semibold uppercase tracking-wider text-ivory"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Consultation</span>
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 py-2 text-xs text-ink/70"
              >
                <Shield className="h-3.5 w-3.5 text-electric-teal" />
                <span>Staff Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
