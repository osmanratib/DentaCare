'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, HelpCircle, ChevronDown, ShieldCheck, Calendar, Sparkles } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { CLINIC_SERVICES } from '@/lib/data/mockData'

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Why does DentaCare publish clear treatment fee minimums?',
      a: 'We believe true luxury is built on transparency. While every clinical smile requires customized mapping, providing clear initial ranges eliminates surprises and respects your time.',
    },
    {
      q: 'Do you accept private dental insurance?',
      a: 'We operate as an out-of-network boutique practice to provide uncompromised material quality and unrestricted chair time. Our concierge provides comprehensive itemized CMS superbills for maximum insurance reimbursement.',
    },
    {
      q: 'What is included in the 10-Year Clinical Warranty?',
      a: 'All comprehensive porcelain restorations and dental implants placed at DentaCare include our 10-year warranty against structural ceramic fractures or failures, provided standard semi-annual hygiene appointments are maintained.',
    },
    {
      q: 'Are bespoke financing plans available?',
      a: 'Yes. We partner with specialized healthcare financing providers offering 0% APR terms over 12 to 24 months, allowing patients to phase treatment comfortably.',
    },
  ]

  return (
    <div className="py-16 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
            Transparent Investment
          </span>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl font-normal text-ink">
            Priced with Absolute Integrity
          </h1>
          <p className="mt-6 text-base text-ink/75 leading-relaxed font-light">
            Every quote is comprehensive: includes 3D diagnostic scans, temporaries, master ceramist laboratory fees, and our 10-year restorative assurance.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CLINIC_SERVICES.map((s, idx) => (
            <Reveal key={s.id} delay={idx * 0.08}>
              <div className="rounded-4xl border border-sand-dark/30 bg-white p-8 shadow-sm flex flex-col justify-between h-full hover:border-electric-teal transition-all">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-electric-teal">
                    {s.subtitle}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-medium text-ink">{s.title}</h3>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-xs text-ink/60">From</span>
                    <span className="font-serif text-4xl font-bold text-ink">${s.priceFrom.toLocaleString()}</span>
                  </div>

                  <p className="mt-4 text-xs text-ink/70 leading-relaxed">
                    {s.summary}
                  </p>

                  <div className="mt-6 space-y-2.5 border-t border-sand-dark/20 pt-6">
                    {s.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-ink/80">
                        <CheckCircle2 className="h-3.5 w-3.5 text-electric-teal shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-sand-dark/20">
                  <Link
                    href={`/book?service=${s.slug}`}
                    className="block w-full rounded-full bg-ink py-3 text-center text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-electric-teal transition-colors"
                  >
                    Select Procedure
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Animated FAQ Accordion */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
              Clarity & Answers
            </span>
            <h3 className="mt-2 font-serif text-3xl font-medium text-ink">
              Frequently Addressed Inquiries
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-sand-dark/30 bg-white overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="font-serif text-base font-medium text-ink pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-electric-teal shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-xs sm:text-sm text-ink/75 leading-relaxed border-t border-sand-dark/20 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
