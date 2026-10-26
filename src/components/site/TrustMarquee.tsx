'use client'

import React from 'react'
import { Award, Star, ShieldCheck, Sparkles, HeartHandshake } from 'lucide-react'

export function TrustMarquee() {
  const stats = [
    { label: 'Years of Practice', value: '18+', icon: Award },
    { label: 'Smiles Restored', value: '15,000+', icon: Sparkles },
    { label: 'Patient Satisfaction', value: '99.4%', icon: HeartHandshake },
    { label: 'Google & Trustpilot', value: '4.98 / 5.0', icon: Star },
    { label: 'FICOI Surgical Fellows', value: 'Lead Doctors', icon: ShieldCheck },
  ]

  return (
    <div className="relative w-full overflow-hidden border-y border-sand-dark/30 bg-sand/30 py-5">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {/* Render twice for continuous loop */}
        {[...stats, ...stats].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electric-teal/15 text-electric-teal">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg font-bold text-ink">{stat.value}</span>
                <span className="text-xs uppercase tracking-wider text-ink/70">{stat.label}</span>
              </div>
              <span className="ml-8 text-sand-dark">•</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
