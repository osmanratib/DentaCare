import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { CLINIC_SERVICES } from '@/lib/data/mockData'

export const metadata = {
  title: 'Clinical Disciplines & Services',
  description: 'Explore bespoke aesthetic dentistry treatments including artisan porcelain veneers, guided implants, clear orthodontics, and biological hygiene.',
}

export default function ServicesPage() {
  return (
    <div className="py-16 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
            The Treatment Repertoire
          </span>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl font-normal text-ink">
            Mastery Across Every Specialty
          </h1>
          <p className="mt-6 text-base text-ink/75 leading-relaxed font-light">
            We reject the hurried pace of conventional practices. Each discipline is delivered by specialists utilizing biological tooth conservation protocols and master ceramist craftsmanship.
          </p>
        </div>

        {/* Services List */}
        <div className="mt-20 space-y-16">
          {CLINIC_SERVICES.map((service, idx) => (
            <Reveal key={service.id} delay={0.1}>
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center rounded-5xl border border-sand-dark/30 bg-white/70 p-8 sm:p-12 transition-all duration-500 hover:shadow-hover-card ${
                  idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Visual / Image */}
                <div className={`relative h-80 sm:h-96 w-full overflow-hidden rounded-4xl lg:col-span-5 ${
                  idx % 2 === 1 ? 'lg:order-2' : ''
                }`}>
                  <Image
                    src={service.imagePath}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 rounded-full bg-ink/80 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    From ${service.priceFrom.toLocaleString()}
                  </div>
                </div>

                {/* Details */}
                <div className={`lg:col-span-7 flex flex-col justify-between ${
                  idx % 2 === 1 ? 'lg:order-1' : ''
                }`}>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-electric-teal">
                      {service.subtitle}
                    </span>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-ink">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-sm text-ink/75 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-sand-dark/20 pt-6">
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2.5 text-xs text-ink/80">
                          <CheckCircle2 className="h-4 w-4 text-electric-teal shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-sand-dark/20 pt-6">
                    <div className="flex items-center gap-2 text-xs text-ink/60">
                      <Clock className="h-4 w-4 text-electric-teal" />
                      <span>Treatment duration: ~{service.durationMin} minutes</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink hover:text-electric-teal transition-colors"
                      >
                        <span>Detailed Protocol</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/book?service=${service.slug}`}
                        className="rounded-full bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-electric-teal hover:text-white transition-colors"
                      >
                        Book Treatment
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
