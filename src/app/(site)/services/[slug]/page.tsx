import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Sparkles, CheckCircle2, Clock, ShieldCheck, ArrowLeft, ArrowRight, Calendar } from 'lucide-react'
import { CLINIC_SERVICES } from '@/lib/data/mockData'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return CLINIC_SERVICES.map((s) => ({
    slug: s.slug,
  }))
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const service = CLINIC_SERVICES.find((s) => s.slug === slug)

  if (!service) {
    notFound()
  }

  return (
    <div className="py-16 px-6 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Back Link */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/60 hover:text-electric-teal transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Treatment Menu</span>
        </Link>

        {/* Hero Section */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
            {service.subtitle}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-ink leading-tight">
            {service.title}
          </h1>
          <p className="max-w-3xl text-lg text-ink/75 leading-relaxed font-light">
            {service.summary}
          </p>
        </div>

        {/* Featured Visual */}
        <div className="mt-12 relative h-[420px] sm:h-[500px] w-full overflow-hidden rounded-5xl shadow-hover-card">
          <Image
            src={service.imagePath}
            alt={service.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1000px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
            <div>
              <span className="text-xs uppercase tracking-wider text-aqua">Starting Investment</span>
              <div className="font-serif text-3xl font-bold">${service.priceFrom.toLocaleString()}</div>
            </div>
            <Link
              href={`/book?service=${service.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-electric-teal px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-ink hover:bg-white transition-colors"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Priority Consultation</span>
            </Link>
          </div>
        </div>

        {/* Clinical Protocol Details */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-sand-dark/20 pb-16">
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl font-medium text-ink">Clinical Methodology & Anatomy</h3>
            <p className="mt-4 text-sm text-ink/80 leading-relaxed">
              {service.description}
            </p>
            <p className="mt-4 text-sm text-ink/80 leading-relaxed">
              Each clinical appointment is conducted within our quiet private operatories outfitted with medical-grade HEPA filtration, noise-cancelling acoustic technology, and ergonomic leather seating.
            </p>

            <div className="mt-8">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-electric-teal mb-4">
                What Sets Our Protocol Apart
              </h4>
              <div className="space-y-3">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-2xl bg-sand/30 p-4">
                    <CheckCircle2 className="h-4 w-4 text-electric-teal shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-ink">{feat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Specs */}
          <div className="rounded-4xl border border-sand-dark/30 bg-white p-6 shadow-sm h-fit">
            <h4 className="font-serif text-lg font-medium text-ink mb-4">Treatment Specifications</h4>
            <div className="space-y-4 text-xs text-ink/75 border-b border-sand-dark/20 pb-6">
              <div className="flex justify-between">
                <span>Chair Time:</span>
                <span className="font-medium text-ink">~{service.durationMin} minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Anaesthesia:</span>
                <span className="font-medium text-ink">Gentle Wand / Painless</span>
              </div>
              <div className="flex justify-between">
                <span>Recovery:</span>
                <span className="font-medium text-ink">Immediate / Same Day</span>
              </div>
              <div className="flex justify-between">
                <span>Warranty:</span>
                <span className="font-medium text-electric-teal">10-Year Clinical Assurance</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/smile-gallery"
                className="flex items-center justify-center gap-2 rounded-full border border-ink/20 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-ink hover:bg-sand/30"
              >
                <span>View Before & Afters</span>
              </Link>
              <Link
                href={`/book?service=${service.slug}`}
                className="flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-center text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-electric-teal hover:text-white transition-colors"
              >
                <span>Reserve Appointment</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
