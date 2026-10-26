'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  Phone,
  Mail,
  Shield,
  ArrowRight,
} from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { CLINIC_SERVICES, CLINIC_TEAM } from '@/lib/data/mockData'
import { requestAppointment } from '@/actions/booking'

function BookingForm() {
  const searchParams = useSearchParams()
  const initialService = searchParams.get('service') || CLINIC_SERVICES[0].id

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [successData, setSuccessData] = useState<{ referenceId: string } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    serviceId: initialService,
    doctorId: CLINIC_TEAM[0].name,
    date: '2026-10-30',
    timeSlot: '10:00 AM - 11:00 AM',
    name: '',
    phone: '',
    email: '',
    message: '',
    websiteUrl: '', // Honeypot
  })

  const availableSlots = [
    '09:00 AM - 10:00 AM',
    '10:30 AM - 11:30 AM',
    '01:00 PM - 02:00 PM',
    '02:30 PM - 03:30 PM',
    '04:00 PM - 05:00 PM',
  ]

  const selectedServiceObj =
    CLINIC_SERVICES.find((s) => s.id === formData.serviceId || s.slug === formData.serviceId) ||
    CLINIC_SERVICES[0]

  const handleNext = () => {
    setErrorMessage(null)
    if (step === 1 && !formData.serviceId) {
      setErrorMessage('Please select a treatment')
      return
    }
    if (step === 2 && (!formData.date || !formData.timeSlot)) {
      setErrorMessage('Please pick an appointment date and slot')
      return
    }
    setStep(step + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)

    try {
      const res = await requestAppointment({
        serviceId: formData.serviceId,
        doctorId: formData.doctorId,
        date: formData.date,
        timeSlot: formData.timeSlot,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        websiteUrl: formData.websiteUrl,
      })

      if (res.success) {
        setSuccessData({ referenceId: res.referenceId || 'DNT-842910' })
        setStep(4)
      } else {
        setErrorMessage(res.message || res.error || 'Failed to submit appointment')
      }
    } catch {
      setErrorMessage('An unexpected connection error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-16 px-6 lg:px-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
            Concierge Booking
          </span>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-normal text-ink">
            Reserve Your Consultation
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-ink/75 leading-relaxed font-light">
            An unhurried experience designed around you. Initial consultations include 3D digital smile simulation and bespoke treatment planning.
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div className="mt-12 flex items-center justify-between border-b border-sand-dark/30 pb-6">
          {[
            { num: 1, label: 'Treatment' },
            { num: 2, label: 'Schedule' },
            { num: 3, label: 'Your Details' },
            { num: 4, label: 'Confirmation' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  step === s.num
                    ? 'bg-ink text-ivory ring-4 ring-sand-dark/30'
                    : step > s.num
                    ? 'bg-electric-teal text-white'
                    : 'bg-sand text-ink/40'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
              </div>
              <span
                className={`hidden sm:inline text-xs font-medium uppercase tracking-wider ${
                  step >= s.num ? 'text-ink' : 'text-ink/40'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 border border-red-200 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Form Container */}
        <div className="mt-8 rounded-5xl border border-sand-dark/30 bg-white p-8 sm:p-12 shadow-sm">
          {/* STEP 1: Select Service & Doctor */}
          {step === 1 && (
            <div>
              <h3 className="font-serif text-2xl font-medium text-ink">1. Select Your Treatment Discipline</h3>
              <p className="mt-1 text-xs text-ink/70">
                Choose the primary reason for your visit. Multiple treatments can be discussed during consultation.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CLINIC_SERVICES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, serviceId: s.id })}
                    className={`rounded-3xl border p-5 text-left transition-all ${
                      formData.serviceId === s.id || formData.serviceId === s.slug
                        ? 'border-electric-teal bg-aqua/10 shadow-sm'
                        : 'border-sand-dark/30 hover:border-sand-dark'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-semibold text-electric-teal tracking-wider">
                        {s.subtitle}
                      </span>
                      <span className="text-xs font-medium text-ink/60">From ${s.priceFrom}</span>
                    </div>
                    <h4 className="mt-1.5 font-serif text-lg font-medium text-ink">{s.title}</h4>
                    <p className="mt-2 text-xs text-ink/70 line-clamp-2">{s.summary}</p>
                  </button>
                ))}
              </div>

              {/* Doctor preference */}
              <div className="mt-8">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80 mb-3">
                  Preferred Specialist (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CLINIC_TEAM.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, doctorId: doc.name })}
                      className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                        formData.doctorId === doc.name
                          ? 'border-electric-teal bg-aqua/10'
                          : 'border-sand-dark/30'
                      }`}
                    >
                      <User className="h-4 w-4 text-electric-teal shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-ink">{doc.name}</div>
                        <div className="text-[10px] text-ink/60">{doc.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-ivory hover:bg-electric-teal transition-colors"
                >
                  <span>Select Date & Time</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Slot */}
          {step === 2 && (
            <div>
              <h3 className="font-serif text-2xl font-medium text-ink">2. Choose Desired Time</h3>
              <p className="mt-1 text-xs text-ink/70">
                Select your preferred day. Appointments are spaced with 30-minute buffers for absolute privacy.
              </p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    min="2026-10-27"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-2xl border border-sand-dark/40 bg-sand/20 px-4 py-3.5 text-sm text-ink focus:border-electric-teal focus:outline-none"
                  />
                  <p className="mt-2 text-[11px] text-ink/60">
                    Clinic hours: Monday – Thursday 8:30 AM – 6:00 PM, Friday 8:30 AM – 4:30 PM.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80 mb-2">
                    Available Time Slot
                  </label>
                  <div className="space-y-2.5">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData({ ...formData, timeSlot: slot })}
                        className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-xs transition-all ${
                          formData.timeSlot === slot
                            ? 'border-electric-teal bg-aqua/20 font-semibold text-ink'
                            : 'border-sand-dark/30 hover:border-sand-dark text-ink/75'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-electric-teal" />
                          <span>{slot}</span>
                        </span>
                        <span className="text-[10px] uppercase text-electric-teal font-medium">Available</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 rounded-full border border-sand-dark px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-sand/30"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-ivory hover:bg-electric-teal transition-colors"
                >
                  <span>Enter Patient Details</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Info & Notes */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h3 className="font-serif text-2xl font-medium text-ink">3. Patient Contact & Goals</h3>
              <p className="mt-1 text-xs text-ink/70">
                Your information is protected under strict privacy safeguards and never shared.
              </p>

              {/* Hidden Anti-bot honeypot */}
              <input
                type="text"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              <div className="mt-8 space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80 mb-2">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Victoria Sterling"
                    className="w-full rounded-2xl border border-sand-dark/40 bg-sand/20 px-4 py-3.5 text-sm text-ink placeholder:text-ink/40 focus:border-electric-teal focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80 mb-2">
                      Telephone / Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 234-5678"
                      className="w-full rounded-2xl border border-sand-dark/40 bg-sand/20 px-4 py-3.5 text-sm text-ink placeholder:text-ink/40 focus:border-electric-teal focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="victoria@example.com"
                      className="w-full rounded-2xl border border-sand-dark/40 bg-sand/20 px-4 py-3.5 text-sm text-ink placeholder:text-ink/40 focus:border-electric-teal focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80 mb-2">
                    Aesthetic Aspirations or Clinical Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you would like to achieve or any dental sensitivities..."
                    className="w-full rounded-2xl border border-sand-dark/40 bg-sand/20 px-4 py-3.5 text-sm text-ink placeholder:text-ink/40 focus:border-electric-teal focus:outline-none"
                  />
                </div>

                {/* Summary Box */}
                <div className="rounded-3xl bg-sand/30 p-5 text-xs text-ink/80 space-y-1.5 border border-sand-dark/20">
                  <div className="font-semibold text-ink">Appointment Summary:</div>
                  <div>• Procedure: {selectedServiceObj.title}</div>
                  <div>• Specialist: {formData.doctorId}</div>
                  <div>• Selected Date: {formData.date} at {formData.timeSlot}</div>
                </div>
              </div>

              <div className="mt-10 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 rounded-full border border-sand-dark px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-sand/30"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-ivory hover:bg-electric-teal hover:text-white transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span>Confirming...</span>
                  ) : (
                    <>
                      <span>Submit Reservation</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && successData && (
            <div className="text-center py-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-electric-teal/20 text-electric-teal">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
                Reservation Confirmed
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-ink">
                We Look Forward to Welcoming You
              </h2>
              <p className="mt-3 text-sm text-ink/75 max-w-lg mx-auto leading-relaxed">
                Thank you, {formData.name}. Your priority appointment request has been logged. Our concierge will send a confirmation SMS and calendar invite.
              </p>

              <div className="mt-8 inline-block rounded-3xl bg-sand/40 border border-sand-dark/40 px-8 py-5 text-left">
                <div className="text-[11px] uppercase tracking-wider text-ink/60">Booking Reference</div>
                <div className="font-serif text-2xl font-bold text-ink">{successData.referenceId}</div>
                <div className="mt-3 space-y-1 text-xs text-ink/80 border-t border-sand-dark/30 pt-3">
                  <div><strong>Date:</strong> {formData.date} ({formData.timeSlot})</div>
                  <div><strong>Discipline:</strong> {selectedServiceObj.title}</div>
                  <div><strong>Specialist:</strong> {formData.doctorId}</div>
                  <div><strong>Location:</strong> 450 Park Avenue South, Suite 1400</div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-full border border-sand-dark px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-sand/30"
                >
                  Print Summary
                </button>
                <a
                  href="/"
                  className="rounded-full bg-ink px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-electric-teal"
                >
                  Return to Home
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-ink/60">Loading reservation portal...</div>}>
      <BookingForm />
    </Suspense>
  )
}
