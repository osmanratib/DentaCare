'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Calendar, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { BeforeAfterSlider } from '@/components/site/BeforeAfterSlider'
import { GALLERY_CASES } from '@/lib/data/mockData'

export default function SmileGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', 'Veneers', 'Invisalign', 'Implants', 'Whitening']

  const filteredCases =
    selectedCategory === 'All'
      ? GALLERY_CASES
      : GALLERY_CASES.filter((c) => c.category === selectedCategory)

  return (
    <div className="py-16 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
            The Transformation Archive
          </span>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl font-normal text-ink">
            A Testament to Biological Artistry
          </h1>
          <p className="mt-6 text-base text-ink/75 leading-relaxed font-light">
            Every case represents a delicate synthesis of facial morphology, dental biomechanics, and handcrafted ceramic translucency. Slide to compare natural starting points against finished aesthetic balance.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-12 flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-ink text-ivory shadow-sm'
                  : 'bg-sand/40 text-ink/70 hover:bg-sand hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cases Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {filteredCases.map((caseItem) => (
            <Reveal key={caseItem.id} delay={0.1}>
              <div className="rounded-5xl border border-sand-dark/30 bg-white p-6 shadow-sm">
                <BeforeAfterSlider
                  beforeImage={caseItem.beforePath}
                  afterImage={caseItem.afterPath}
                  title={caseItem.title}
                  treatment={caseItem.treatment}
                  beforeLabel="Initial Assessment"
                  afterLabel="Revealed Result"
                />

                <div className="mt-6 space-y-3 px-2">
                  <p className="text-xs text-ink/80 leading-relaxed">
                    {caseItem.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-sand-dark/20 text-[11px] text-ink/60">
                    <div>
                      <span className="font-semibold text-ink">Lead Surgeon:</span> {caseItem.doctor}
                    </div>
                    <div>
                      <span className="font-semibold text-ink">Timeline:</span> {caseItem.duration}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom Booking Prompt */}
        <div className="mt-24 rounded-5xl bg-ink p-10 sm:p-16 text-center text-ivory relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
              Personalized Consultation
            </span>
            <h3 className="mt-4 font-serif text-3xl sm:text-4xl font-normal text-white">
              Every smile begins with an unhurried conversation.
            </h3>
            <p className="mt-4 text-xs sm:text-sm text-ivory/70 leading-relaxed font-light">
              We capture digital 3D scans during your initial session to simulate your finished smile before any clinical decisions are made.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/book"
                className="flex items-center gap-2 rounded-full bg-electric-teal px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-ink hover:bg-white transition-colors"
              >
                <Calendar className="h-4 w-4" />
                <span>Reserve Consultation</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
