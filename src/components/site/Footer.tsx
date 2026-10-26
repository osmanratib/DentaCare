'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, MapPin, Phone, Mail, Clock, ArrowUpRight, Award, ShieldCheck } from 'lucide-react'
import { MagneticButton } from '../motion/MagneticButton'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-24 pb-12 text-ivory">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-[800px] rounded-full bg-electric-teal/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
        {/* Top Call to Action Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-16">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
              Begin Your Transformation
            </span>
            <h2 className="mt-4 font-serif text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
              Ready to reveal a smile crafted with quiet mastery?
            </h2>
            <p className="mt-4 text-sm text-ivory/70 leading-relaxed">
              We welcome new patients to experience our clinical sanctuary. Consultations include 3D digital smile simulation and bespoke treatment mapping.
            </p>
          </div>

          <div className="mt-8 md:mt-0 flex flex-col sm:flex-row gap-4">
            <MagneticButton strength={0.3}>
              <Link
                href="/book"
                className="group flex items-center gap-3 rounded-full bg-electric-teal px-8 py-4 text-xs font-semibold uppercase tracking-widest text-ink transition-all duration-300 hover:bg-white hover:text-ink shadow-glow-teal"
              >
                <span>Reserve Appointment</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </MagneticButton>
            <Link
              href="/smile-gallery"
              className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-ivory transition-colors hover:border-white hover:bg-white/5"
            >
              <span>Explore Gallery</span>
            </Link>
          </div>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-white/10 text-sm">
          {/* Col 1: Brand & Philosophy */}
          <div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 text-electric-teal" />
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Denta<span className="italic text-electric-teal">Care</span>
              </span>
            </div>
            <p className="mt-4 text-xs text-ivory/65 leading-relaxed">
              Where biological tooth conservation meets artisanal master ceramist craftsmanship. Dedicated to calm, unhurried excellence.
            </p>
            <div className="mt-6 flex items-center gap-4 text-xs text-aqua">
              <span className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-electric-teal" /> FICOI Certified
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-electric-teal" /> AAL2 Security
              </span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-electric-teal mb-4">
              Treatments
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/70">
              <li>
                <Link href="/services/porcelain-veneers" className="hover:text-white transition-colors">
                  Porcelain Veneers & Laminates
                </Link>
              </li>
              <li>
                <Link href="/services/dental-implants" className="hover:text-white transition-colors">
                  Computer-Guided Bio-Implants
                </Link>
              </li>
              <li>
                <Link href="/services/invisalign-aligners" className="hover:text-white transition-colors">
                  Invisalign® Clear Orthodontics
                </Link>
              </li>
              <li>
                <Link href="/services/laser-whitening" className="hover:text-white transition-colors">
                  Atelier Laser Teeth Brightening
                </Link>
              </li>
              <li>
                <Link href="/services/biological-periodontics" className="hover:text-white transition-colors">
                  Regenerative Periodontics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Clinic Hours */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-electric-teal mb-4">
              Sanctuary Hours
            </h4>
            <ul className="space-y-2 text-xs text-ivory/70">
              <li className="flex justify-between">
                <span>Mon – Thu</span>
                <span className="text-white">8:30 AM – 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Friday</span>
                <span className="text-white">8:30 AM – 4:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="text-white">9:00 AM – 2:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-aqua">Private VIP / Closed</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-electric-teal mb-4">
              Concierge
            </h4>
            <div className="space-y-3 text-xs text-ivory/70">
              <p className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-electric-teal shrink-0 mt-0.5" />
                <span>450 Park Avenue South, Suite 1400, Manhattan, New York, NY 10016</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-electric-teal shrink-0" />
                <a href="tel:+12125550198" className="hover:text-white transition-colors">
                  +1 (212) 555-0198
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-electric-teal shrink-0" />
                <a href="mailto:concierge@dentacare.com" className="hover:text-white transition-colors">
                  concierge@dentacare.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Signature Giant "Smile." Wordmark (Section 8 Item 10) */}
        <div className="py-12 select-none overflow-hidden text-center">
          <span className="block font-serif text-[18vw] leading-none font-bold tracking-tighter text-white/[0.04] uppercase transition-colors duration-700 hover:text-white/[0.08]">
            Smile.
          </span>
        </div>

        {/* Bottom Metadata & Staff Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-ivory/50 pt-6">
          <p>© {new Date().getFullYear()} DentaCare Clinic. Architected by Osman Ratib. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex items-center gap-6">
            <Link href="/privacy" className="hover:text-ivory transition-colors">Privacy Notice</Link>
            <Link href="/terms" className="hover:text-ivory transition-colors">Terms of Practice</Link>
            <Link href="/admin/login" className="text-electric-teal hover:underline flex items-center gap-1">
              <span>Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
