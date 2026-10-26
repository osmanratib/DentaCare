import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Award, GraduationCap, Sparkles, Calendar } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { CLINIC_TEAM } from '@/lib/data/mockData'

export const metadata = {
  title: 'Our Specialists & Clinical Faculty',
  description: 'Meet Dr. Osman Ratib and the multidisciplinary restorative faculty at DentaCare.',
}

export default function TeamPage() {
  return (
    <div className="py-16 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
            The Faculty
          </span>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl font-normal text-ink">
            Pioneers in Biomimetic Aesthetics
          </h1>
          <p className="mt-6 text-base text-ink/75 leading-relaxed font-light">
            Our clinical team holds dual credentials across cosmetic artistry, oral surgery, and biocompatible material science. We limit daily patient intake to ensure every procedure receives undivided focus.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="mt-20 space-y-20">
          {CLINIC_TEAM.map((doctor, idx) => (
            <Reveal key={doctor.id} delay={0.1}>
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center rounded-5xl border border-sand-dark/30 bg-white p-8 sm:p-12 shadow-sm ${
                  idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Portrait */}
                <div className={`relative h-96 sm:h-[450px] w-full overflow-hidden rounded-4xl bg-sand/30 lg:col-span-5 ${
                  idx % 2 === 1 ? 'lg:order-2' : ''
                }`}>
                  <Image
                    src={doctor.photoPath}
                    alt={doctor.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-electric-teal">
                      {doctor.title}
                    </span>
                    <h3 className="font-serif text-2xl font-bold">{doctor.name}</h3>
                  </div>
                </div>

                {/* Bio & Education */}
                <div className={`lg:col-span-7 flex flex-col justify-between ${
                  idx % 2 === 1 ? 'lg:order-1' : ''
                }`}>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-electric-teal">
                      {doctor.role}
                    </span>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-ink">
                      {doctor.name}
                    </h2>
                    <p className="mt-6 text-sm text-ink/80 leading-relaxed font-light">
                      {doctor.bio}
                    </p>

                    <div className="mt-8 rounded-3xl bg-sand/30 p-5 space-y-3">
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-4 w-4 text-electric-teal shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-semibold text-ink">Education & Residency</span>
                          <p className="text-xs text-ink/70 mt-0.5">{doctor.education}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {doctor.specialties.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-full bg-sand/50 px-3 py-1 text-xs font-medium text-ink/80"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 flex items-center justify-between border-t border-sand-dark/20 pt-6">
                    <span className="flex items-center gap-1.5 text-xs text-electric-teal font-medium">
                      <Award className="h-4 w-4" />
                      <span>Accepting Select Private Appointments</span>
                    </span>

                    <Link
                      href={`/book?doctor=${encodeURIComponent(doctor.name)}`}
                      className="rounded-full bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-electric-teal hover:text-white transition-colors"
                    >
                      Request Consultation
                    </Link>
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
