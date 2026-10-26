'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Shield,
  Star,
  Clock,
  ChevronRight,
  Eye,
  Activity,
  Layers,
} from 'lucide-react'
import { Reveal, CUBIC_EASE } from '@/components/motion/Reveal'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { TrustMarquee } from '@/components/site/TrustMarquee'
import { BeforeAfterSlider } from '@/components/site/BeforeAfterSlider'
import { CLINIC_SERVICES, CLINIC_TEAM, CLINIC_REVIEWS, GALLERY_CASES } from '@/lib/data/mockData'

export default function HomePage() {
  const [activeReviewIdx, setActiveReviewIdx] = useState(0)

  return (
    <div className="relative overflow-hidden">
      {/* ===================================================================
          1. HERO SECTION: Cinematic Split-Text Reveal & Ambient Video
         =================================================================== */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 lg:px-12 pt-12 pb-20">
        <div className="mx-auto max-w-7xl w-full">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: CUBIC_EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-sand-dark/40 bg-sand/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink"
          >
            <Sparkles className="h-3.5 w-3.5 text-electric-teal" />
            <span>Manhattan’s Premier Aesthetic Practice</span>
          </motion.div>

          {/* Giant Editorial Headline */}
          <div className="mt-8 max-w-5xl">
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: CUBIC_EASE }}
              className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-ink leading-[1.05]"
            >
              Quiet Luxury. <br />
              <span className="italic text-electric-teal font-medium">Bespoke</span> Smiles.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: CUBIC_EASE }}
              className="mt-8 max-w-2xl text-lg sm:text-xl text-ink/75 leading-relaxed font-light"
            >
              Where biological tooth conservation meets master ceramist artistry.
              Experience dental care elevated into a serene, unhurried wellness ritual.
            </motion.p>

            {/* Magnetic CTA Row */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: CUBIC_EASE }}
              className="mt-10 flex flex-wrap items-center gap-5"
            >
              <MagneticButton strength={0.3}>
                <Link
                  href="/book"
                  className="group flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-xs font-semibold uppercase tracking-widest text-ivory shadow-soft-layer transition-all duration-300 hover:bg-electric-teal hover:text-white"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Reserve Consultation</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </MagneticButton>

              <Link
                href="/smile-gallery"
                className="flex items-center gap-2 rounded-full border border-sand-dark px-7 py-4 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-ink hover:bg-sand/40"
              >
                <span>View Smile Archive</span>
              </Link>
            </motion.div>
          </div>

          {/* Ambient Video & Editorial Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.5, ease: CUBIC_EASE }}
            className="mt-16 relative h-[420px] sm:h-[520px] w-full overflow-hidden rounded-4xl shadow-hover-card"
          >
            {/* Background Loop Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/images/hero-interior.jpg"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/videos/dentacare-ambient.webm" type="video/webm" />
            </video>

            {/* Gradient Overlays for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />

            {/* Floating Glass Badges */}
            <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-white">
              <div className="max-w-md">
                <span className="rounded-full bg-electric-teal/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-electric-teal backdrop-blur-md border border-electric-teal/30">
                  Micro-Aesthetic Lab
                </span>
                <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-medium">
                  Designed for Light, Natural Texture & Balance
                </h3>
                <p className="mt-2 text-xs text-ivory/80 leading-relaxed">
                  Every veneer and restoration is individually tailored to your facial contours, skin undertone, and lip posture.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/15 text-center min-w-[110px]">
                  <span className="block font-serif text-2xl font-bold text-white">100%</span>
                  <span className="text-[10px] uppercase tracking-wider text-aqua">Biocompatible</span>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/15 text-center min-w-[110px]">
                  <span className="block font-serif text-2xl font-bold text-white">0-Puff</span>
                  <span className="text-[10px] uppercase tracking-wider text-aqua">Digital Scan</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          2. TRUST MARQUEE: Section 8 Item 3
         =================================================================== */}
      <TrustMarquee />

      {/* ===================================================================
          3. SIGNATURE SERVICES: Horizontal Scroll Cards (Section 8 Item 4)
         =================================================================== */}
      <section className="py-28 px-6 lg:px-12 bg-ivory">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
                Clinical Disciplines
              </span>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-normal text-ink">
                Artisan Treatments. Uncompromising Science.
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <Link
                href="/services"
                className="mt-6 md:mt-0 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink hover:text-electric-teal transition-colors"
              >
                <span>View Full Treatment Menu</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CLINIC_SERVICES.slice(0, 6).map((service, idx) => (
              <Reveal key={service.id} delay={idx * 0.1}>
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-4xl border border-sand-dark/30 bg-white/70 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-electric-teal/40 hover:shadow-hover-card">
                  <div>
                    {/* Top image preview */}
                    <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-sand/30">
                      <Image
                        src={service.imagePath}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 rounded-full bg-ink/75 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                        From ${service.priceFrom.toLocaleString()}
                      </div>
                    </div>

                    <span className="mt-6 block text-[11px] font-semibold uppercase tracking-widest text-electric-teal">
                      {service.subtitle}
                    </span>
                    <h3 className="mt-2 font-serif text-2xl font-medium text-ink group-hover:text-electric-teal transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-xs text-ink/70 leading-relaxed">
                      {service.summary}
                    </p>

                    <div className="mt-5 space-y-2 border-t border-sand-dark/20 pt-4">
                      {service.features.slice(0, 3).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-ink/80">
                          <CheckCircle2 className="h-3.5 w-3.5 text-electric-teal shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between pt-4 border-t border-sand-dark/20">
                    <span className="flex items-center gap-1.5 text-xs text-ink/60">
                      <Clock className="h-3.5 w-3.5 text-electric-teal" />
                      <span>{service.durationMin} mins</span>
                    </span>

                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-ink group-hover:text-electric-teal transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. SMILE TRANSFORMATION: Before / After Drag Slider (Section 8 Item 5)
         =================================================================== */}
      <section className="py-24 px-6 lg:px-12 bg-sand/30 border-y border-sand-dark/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
                Documented Evidence
              </span>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-normal text-ink">
                Transformations Captured in High Fidelity
              </h2>
              <p className="mt-4 text-sm text-ink/70 leading-relaxed">
                Interact with our dual-state comparative view. Every restoration is crafted with micro-translucency so it harmonizes seamlessly with natural dentition.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="mx-auto max-w-4xl">
            <BeforeAfterSlider
              beforeImage="/images/smile-before.jpg"
              afterImage="/images/smile-after.jpg"
              title="Full Anterior Micro-Feldspathic Veneers"
              treatment="10 Ultra-Thin Ceramic Laminates by Dr. Osman Ratib"
              beforeLabel="Pre-Treatment Discoloration"
              afterLabel="Sculpted Natural Aesthetics"
            />
          </Reveal>

          <div className="mt-12 text-center">
            <Link
              href="/smile-gallery"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-ivory hover:bg-electric-teal transition-colors"
            >
              <span>Explore Entire Smile Gallery (30+ Cases)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================
          5. TECHNOLOGY SPOTLIGHT: Parallax & Count-Up Stats (Section 8 Item 6)
         =================================================================== */}
      <section className="py-28 px-6 lg:px-12 bg-ink text-ivory relative overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
                Digital Biomimetic Engineering
              </span>
              <h2 className="mt-4 font-serif text-4xl sm:text-5xl font-normal leading-tight text-white">
                Sub-Millimeter Precision Meets Biological Conservation.
              </h2>
              <p className="mt-6 text-sm text-ivory/70 leading-relaxed font-light">
                We believe the best dentistry is undetectable. Utilizing Zeiss surgical operating microscopes, low-radiation 3D CBCT, and CAD/CAM robotic milling, we diagnose and execute with atomic accuracy.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
                <div>
                  <div className="font-serif text-4xl font-bold text-electric-teal">24x</div>
                  <span className="mt-1 block text-xs uppercase tracking-wider text-ivory/80">
                    Microscopic Magnification
                  </span>
                  <p className="mt-1 text-[11px] text-ivory/50">
                    Reveals hairline micro-fractures invisible to standard loupes.
                  </p>
                </div>

                <div>
                  <div className="font-serif text-4xl font-bold text-electric-teal">0.05 mm</div>
                  <span className="mt-1 block text-xs uppercase tracking-wider text-ivory/80">
                    Restoration Margin Fit
                  </span>
                  <p className="mt-1 text-[11px] text-ivory/50">
                    Eliminates bacterial micro-leakage and enhances longevity.
                  </p>
                </div>

                <div>
                  <div className="font-serif text-4xl font-bold text-electric-teal">100%</div>
                  <span className="mt-1 block text-xs uppercase tracking-wider text-ivory/80">
                    Mercury & BPA Free
                  </span>
                  <p className="mt-1 text-[11px] text-ivory/50">
                    Strict biological protocols for systemic whole-body safety.
                  </p>
                </div>

                <div>
                  <div className="font-serif text-4xl font-bold text-electric-teal">&lt; 3 mins</div>
                  <span className="mt-1 block text-xs uppercase tracking-wider text-ivory/80">
                    3D Digital Impression
                  </span>
                  <p className="mt-1 text-[11px] text-ivory/50">
                    No gag-inducing putty impressions ever.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3} className="relative">
              <div className="relative h-[480px] w-full rounded-4xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="/images/tech-microscope.jpg"
                  alt="High Tech Microscope and Clinic Technology"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="rounded-2xl bg-ink/80 p-5 backdrop-blur-md border border-white/15">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-electric-teal" />
                      <div>
                        <span className="text-xs font-semibold text-white">Carl Zeiss ProErgo System</span>
                        <p className="text-[11px] text-aqua">Real-time stereoscopic visualization</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================================================================
          6. THE SPECIALISTS: Hover-Reveal Portraits (Section 8 Item 7)
         =================================================================== */}
      <section className="py-28 px-6 lg:px-12 bg-ivory">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
                World-Class Clinical Faculty
              </span>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-normal text-ink">
                Master Restorative Specialists
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <Link
                href="/team"
                className="mt-6 md:mt-0 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink hover:text-electric-teal transition-colors"
              >
                <span>Read Doctor Biographies</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {CLINIC_TEAM.map((member, idx) => (
              <Reveal key={member.id} delay={idx * 0.1}>
                <div className="group relative overflow-hidden rounded-4xl border border-sand-dark/30 bg-white p-5 transition-all duration-500 hover:-translate-y-2 hover:shadow-hover-card">
                  <div className="relative h-72 w-full overflow-hidden rounded-3xl bg-sand/30">
                    <Image
                      src={member.photoPath}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="text-[10px] uppercase tracking-wider text-aqua">Education</span>
                      <p className="text-[11px] text-white font-medium leading-tight">{member.education}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-electric-teal">
                      {member.title}
                    </span>
                    <h3 className="mt-1 font-serif text-xl font-medium text-ink">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-xs text-ink/70">
                      {member.role}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-sand-dark/20">
                      {member.specialties.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-full bg-sand/40 px-2.5 py-0.5 text-[10px] font-medium text-ink/80"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          7. THE TREATMENT JOURNEY: Timeline (Section 8 Item 9)
         =================================================================== */}
      <section className="py-24 px-6 lg:px-12 bg-sand/20 border-t border-sand-dark/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
                Unhurried Experience
              </span>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-normal text-ink">
                Your 4-Stage Pathway to Perfection
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <Reveal delay={0.1}>
              <div className="relative rounded-3xl bg-white p-8 border border-sand-dark/30 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <span className="font-serif text-4xl font-light text-electric-teal">01</span>
                  <h4 className="mt-4 font-serif text-xl font-medium text-ink">Aesthetic Dialogue</h4>
                  <p className="mt-2 text-xs text-ink/70 leading-relaxed">
                    Over espresso or organic tea, we discuss your smile aspirations, lip dynamics, and facial aesthetic balance.
                  </p>
                </div>
                <div className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-electric-teal">
                  No Pressure • Discovery
                </div>
              </div>
            </Reveal>

            {/* Step 2 */}
            <Reveal delay={0.2}>
              <div className="relative rounded-3xl bg-white p-8 border border-sand-dark/30 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <span className="font-serif text-4xl font-light text-electric-teal">02</span>
                  <h4 className="mt-4 font-serif text-xl font-medium text-ink">3D Digital Simulation</h4>
                  <p className="mt-2 text-xs text-ink/70 leading-relaxed">
                    High-resolution scanning and facial mapping create a photorealistic preview of your final smile before touching a tooth.
                  </p>
                </div>
                <div className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-electric-teal">
                  Predictable • Bespoke
                </div>
              </div>
            </Reveal>

            {/* Step 3 */}
            <Reveal delay={0.3}>
              <div className="relative rounded-3xl bg-white p-8 border border-sand-dark/30 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <span className="font-serif text-4xl font-light text-electric-teal">03</span>
                  <h4 className="mt-4 font-serif text-xl font-medium text-ink">Master Crafting</h4>
                  <p className="mt-2 text-xs text-ink/70 leading-relaxed">
                    Our master ceramists hand-sculpt ultra-thin feldspathic porcelain laminates calibrated for micro-translucency and organic light.
                  </p>
                </div>
                <div className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-electric-teal">
                  Handmade • Ceramic Art
                </div>
              </div>
            </Reveal>

            {/* Step 4 */}
            <Reveal delay={0.4}>
              <div className="relative rounded-3xl bg-white p-8 border border-sand-dark/30 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <span className="font-serif text-4xl font-light text-electric-teal">04</span>
                  <h4 className="mt-4 font-serif text-xl font-medium text-ink">The Reveal & Care</h4>
                  <p className="mt-2 text-xs text-ink/70 leading-relaxed">
                    Bonded under gentle isolation. You leave with a timeless smile backed by our 10-year clinical assurance warranty.
                  </p>
                </div>
                <div className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-electric-teal">
                  10-Year Warranty
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================================================================
          8. TESTIMONIALS: Draggable Carousel (Section 8 Item 8)
         =================================================================== */}
      <section className="py-28 px-6 lg:px-12 bg-ivory">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
                Patient Narratives
              </span>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-normal text-ink">
                Trusted by Discriminating Individuals
              </h2>
            </Reveal>

            <div className="mt-6 md:mt-0 flex gap-2">
              {CLINIC_REVIEWS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveReviewIdx(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeReviewIdx === idx ? 'w-8 bg-electric-teal' : 'w-2.5 bg-sand-dark'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CLINIC_REVIEWS.map((rev, idx) => (
              <Reveal key={rev.id} delay={idx * 0.1}>
                <div
                  className={`rounded-4xl p-8 sm:p-10 transition-all duration-500 border ${
                    activeReviewIdx === idx
                      ? 'border-electric-teal/50 bg-white shadow-hover-card'
                      : 'border-sand-dark/20 bg-white/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="rounded-full bg-sand/50 px-3 py-1 text-[11px] font-semibold text-ink/70">
                      {rev.treatment}
                    </span>
                  </div>

                  <p className="mt-6 font-serif text-lg sm:text-xl text-ink leading-relaxed font-light">
                    “{rev.body}”
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-sand-dark/20 pt-5">
                    <div>
                      <h4 className="font-serif text-base font-medium text-ink">{rev.author}</h4>
                      <p className="text-xs text-ink/50">{rev.date}</p>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-electric-teal">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Verified Patient</span>
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
