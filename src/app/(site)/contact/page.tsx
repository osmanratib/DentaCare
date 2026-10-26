'use client'

import React, { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Shield } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="py-16 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
            Concierge & Location
          </span>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl font-normal text-ink">
            Connect with Our Sanctuary
          </h1>
          <p className="mt-6 text-base text-ink/75 leading-relaxed font-light">
            Conveniently situated on Park Avenue South in Manhattan. Our concierge team coordinates private valet parking, international patient accommodations, and priority scheduling.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Hours */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-4xl border border-sand-dark/30 bg-white p-8 shadow-sm space-y-6">
              <h3 className="font-serif text-2xl font-medium text-ink">Clinic Sanctuary</h3>

              <div className="space-y-4 text-xs sm:text-sm text-ink/80">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-electric-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-ink">Manhattan Practice</span>
                    <p className="text-xs text-ink/70 mt-0.5">
                      450 Park Avenue South, Suite 1400<br />
                      New York, NY 10016
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-electric-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-ink">Telephone</span>
                    <p className="text-xs text-ink/70 mt-0.5">+1 (212) 555-0198</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-electric-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-ink">Concierge Email</span>
                    <p className="text-xs text-ink/70 mt-0.5">concierge@dentacare.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-sand-dark/30 bg-sand/30 p-8 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-electric-teal" />
                <h4 className="font-serif text-lg font-medium text-ink">Practice Hours</h4>
              </div>
              <div className="space-y-2 text-xs text-ink/75 border-t border-sand-dark/30 pt-4">
                <div className="flex justify-between">
                  <span>Monday – Thursday</span>
                  <span className="font-medium text-ink">8:30 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span className="font-medium text-ink">8:30 AM – 4:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium text-ink">9:00 AM – 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-electric-teal">Private VIP Reserve</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-5xl border border-sand-dark/30 bg-white p-8 sm:p-12 shadow-sm">
              <h3 className="font-serif text-2xl font-medium text-ink">Direct Concierge Message</h3>
              <p className="mt-2 text-xs text-ink/70">
                Responses are dispatched within two business hours by our dedicated patient coordinator.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-3xl bg-aqua/20 p-8 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-electric-teal" />
                  <h4 className="mt-4 font-serif text-2xl font-medium text-ink">Message Transmitted</h4>
                  <p className="mt-2 text-xs text-ink/70">
                    Thank you, {formData.name}. Our patient concierge will contact you shortly at {formData.email}.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 rounded-full bg-ink px-6 py-2.5 text-xs font-semibold text-ivory hover:bg-electric-teal transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Victoria Sterling"
                        className="w-full rounded-2xl border border-sand-dark/40 bg-sand/20 px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-electric-teal focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. victoria@domain.com"
                        className="w-full rounded-2xl border border-sand-dark/40 bg-sand/20 px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-electric-teal focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full rounded-2xl border border-sand-dark/40 bg-sand/20 px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-electric-teal focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80 mb-2">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full rounded-2xl border border-sand-dark/40 bg-sand/20 px-4 py-3 text-sm text-ink focus:border-electric-teal focus:outline-none"
                      >
                        <option>General Inquiry</option>
                        <option>Veneers Consultation</option>
                        <option>Implant Reconstruction</option>
                        <option>Invisalign Assessment</option>
                        <option>Private VIP Scheduling</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80 mb-2">
                      Your Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share your dental goals or questions..."
                      className="w-full rounded-2xl border border-sand-dark/40 bg-sand/20 px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-electric-teal focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-widest text-ivory hover:bg-electric-teal hover:text-white transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    <span>Transmit Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
