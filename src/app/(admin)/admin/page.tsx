'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Briefcase,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  HeartHandshake,
  Check,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminDashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all')
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    patientsCount: 0,
    servicesCount: 0,
  })

  const loadDashboardData = async () => {
    setLoading(true)

    // 1. Fetch appointments with joined patient & service
    const { data: apts } = await supabase
      .from('appointments')
      .select(`
        id,
        requested_at,
        status,
        message,
        source,
        created_at,
        patient:patients ( id, full_name, phone, email, notes ),
        service:services ( id, title, price_from, duration_min )
      `)
      .order('requested_at', { ascending: false })
      .limit(8)

    if (apts) {
      const normalized = apts.map((item: any) => ({
        ...item,
        patient: Array.isArray(item.patient) ? item.patient[0] : item.patient,
        service: Array.isArray(item.service) ? item.service[0] : item.service,
      }))
      setAppointments(normalized)

      const pending = apts.filter((a: any) => a.status === 'pending').length
      const confirmed = apts.filter((a: any) => a.status === 'confirmed').length

      // 2. Exact Counts
      const { count: patCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
      const { count: sCount } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })

      setStats({
        pending,
        confirmed,
        patientsCount: patCount || 0,
        servicesCount: sCount || 0,
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await supabase.from('appointments').update({ status: newStatus }).eq('id', id)
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    )
    loadDashboardData()
  }

  const filtered = appointments.filter((a) => {
    if (filter === 'all') return true
    return a.status === filter
  })

  return (
    <div className="space-y-8">
      {/* ===================================================================
          1. WARM EDITORIAL GREETING BANNER
         =================================================================== */}
      <div className="relative overflow-hidden rounded-4xl border border-[#E5E0D5] bg-white p-6 sm:p-10 shadow-[0_4px_30px_rgba(14,26,36,0.03)]">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EFECE3] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0E1A24]">
            <Sparkles className="h-3.5 w-3.5 text-[#12B5A6]" />
            <span>Manhattan Operatories • Private Practice</span>
          </div>

          <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#0E1A24] leading-tight">
            Good evening, <span className="italic text-[#12B5A6]">Dr. Ratib</span>.
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-[#0E1A24]/70 leading-relaxed font-light">
            You have <strong className="text-[#0E1A24] font-medium">{stats.confirmed} scheduled visits</strong> and{' '}
            <strong className="text-[#12B5A6] font-medium">{stats.pending} patient requests</strong> awaiting clinical triage. The sterilization autoclaves are verified and operatories are ready.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/admin/appointments"
              className="flex items-center gap-2 rounded-full bg-[#0E1A24] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#12B5A6] transition-colors shadow-sm"
            >
              <span>Review Schedule Matrix</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/admin/team"
              className="flex items-center gap-2 rounded-full border border-[#DAC7AD] bg-[#FAF8F5] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0E1A24] hover:bg-white transition-colors"
            >
              <span>Specialist Faculty</span>
            </Link>
          </div>
        </div>

        {/* Ambient warm gradient circle */}
        <div className="absolute top-0 right-0 h-80 w-80 translate-x-20 -translate-y-20 rounded-full bg-[#CFE8E4]/40 blur-3xl pointer-events-none" />
      </div>

      {/* ===================================================================
          2. HUMAN CLINIC METRICS (Editorial Ivory Cards)
         =================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-3xl border border-[#E5E0D5] bg-white p-5 sm:p-6 shadow-[0_2px_16px_rgba(14,26,36,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#0E1A24]/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Awaiting Triage</span>
              <span className="h-2 w-2 rounded-full bg-amber-400" />
            </div>
            <div className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[#0E1A24]">
              {stats.pending}
            </div>
          </div>
          <div className="mt-3 text-[11px] text-amber-700 font-medium bg-amber-50 rounded-xl px-2.5 py-1 w-fit">
            Needs doctor review
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E0D5] bg-white p-5 sm:p-6 shadow-[0_2px_16px_rgba(14,26,36,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#0E1A24]/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Confirmed Bookings</span>
              <CheckCircle2 className="h-4 w-4 text-[#12B5A6]" />
            </div>
            <div className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[#0E1A24]">
              {stats.confirmed}
            </div>
          </div>
          <div className="mt-3 text-[11px] text-emerald-700 font-medium bg-emerald-50 rounded-xl px-2.5 py-1 w-fit">
            Operatories reserved
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E0D5] bg-white p-5 sm:p-6 shadow-[0_2px_16px_rgba(14,26,36,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#0E1A24]/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Active Patient Registry</span>
              <Users className="h-4 w-4 text-sky-600" />
            </div>
            <div className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[#0E1A24]">
              {stats.patientsCount}
            </div>
          </div>
          <div className="mt-3 text-[11px] text-sky-800 font-medium bg-sky-50 rounded-xl px-2.5 py-1 w-fit">
            Registered charts
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E0D5] bg-white p-5 sm:p-6 shadow-[0_2px_16px_rgba(14,26,36,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#0E1A24]/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Laboratory Artistry</span>
              <HeartHandshake className="h-4 w-4 text-[#12B5A6]" />
            </div>
            <div className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[#0E1A24]">
              4.98<span className="text-xl text-[#12B5A6]">★</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-[#0E1A24]/70 font-medium bg-[#EFECE3] rounded-xl px-2.5 py-1 w-fit">
            Patient satisfaction index
          </div>
        </div>
      </div>

      {/* ===================================================================
          3. HUMAN QUICK CLINICAL SHORTCUTS
         =================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/team"
          className="group rounded-3xl border border-[#E5E0D5] bg-white p-4 sm:p-5 hover:border-[#12B5A6] hover:shadow-sm transition-all flex items-center gap-3.5"
        >
          <div className="p-3 rounded-2xl bg-[#CFE8E4]/60 text-[#0E1A24] group-hover:bg-[#12B5A6] group-hover:text-white transition-colors">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0E1A24]">Doctors Roster</div>
            <div className="text-[11px] text-[#0E1A24]/60">Add & Edit Faculty</div>
          </div>
        </Link>

        <Link
          href="/admin/services"
          className="group rounded-3xl border border-[#E5E0D5] bg-white p-4 sm:p-5 hover:border-[#12B5A6] hover:shadow-sm transition-all flex items-center gap-3.5"
        >
          <div className="p-3 rounded-2xl bg-[#E8DCC8]/60 text-[#0E1A24] group-hover:bg-[#12B5A6] group-hover:text-white transition-colors">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0E1A24]">Procedures Menu</div>
            <div className="text-[11px] text-[#0E1A24]/60">Pricing & Protocols</div>
          </div>
        </Link>

        <Link
          href="/admin/patients"
          className="group rounded-3xl border border-[#E5E0D5] bg-white p-4 sm:p-5 hover:border-[#12B5A6] hover:shadow-sm transition-all flex items-center gap-3.5"
        >
          <div className="p-3 rounded-2xl bg-sky-100 text-sky-900 group-hover:bg-[#12B5A6] group-hover:text-white transition-colors">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0E1A24]">Patient Files</div>
            <div className="text-[11px] text-[#0E1A24]/60">Notes & History</div>
          </div>
        </Link>

        <Link
          href="/admin/availability"
          className="group rounded-3xl border border-[#E5E0D5] bg-white p-4 sm:p-5 hover:border-[#12B5A6] hover:shadow-sm transition-all flex items-center gap-3.5"
        >
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-900 group-hover:bg-[#12B5A6] group-hover:text-white transition-colors">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0E1A24]">Operating Slots</div>
            <div className="text-[11px] text-[#0E1A24]/60">Hours & Holidays</div>
          </div>
        </Link>
      </div>

      {/* ===================================================================
          4. PATIENT APPOINTMENT QUEUE (Warm Medical Chart Cards)
         =================================================================== */}
      <div className="rounded-4xl border border-[#E5E0D5] bg-white p-6 sm:p-8 shadow-[0_4px_30px_rgba(14,26,36,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0ECE1] pb-6">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#12B5A6]">
              Patient Pipeline
            </div>
            <h2 className="mt-1 font-serif text-2xl font-medium text-[#0E1A24]">
              Recent Consultations & Requests
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-[#0E1A24] text-white'
                  : 'bg-[#EFECE3] text-[#0E1A24]/70 hover:text-[#0E1A24]'
              }`}
            >
              All ({appointments.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === 'pending'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-[#EFECE3] text-[#0E1A24]/70 hover:text-[#0E1A24]'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === 'confirmed'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-[#EFECE3] text-[#0E1A24]/70 hover:text-[#0E1A24]'
              }`}
            >
              Confirmed ({stats.confirmed})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#0E1A24]/50">
            Consulting Supabase database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#0E1A24]/50">
            No consultations matching this category.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((apt) => (
              <div
                key={apt.id}
                className="group rounded-3xl border border-[#E5E0D5] bg-[#FAF8F5] p-5 sm:p-6 transition-all hover:bg-white hover:border-[#DAC7AD] hover:shadow-[0_4px_20px_rgba(14,26,36,0.04)]"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Patient Identity */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8DCC8] font-serif text-lg font-bold text-[#0E1A24] shrink-0 border border-[#DAC7AD]">
                      {apt.patient?.full_name ? apt.patient.full_name.slice(0, 2).toUpperCase() : 'PT'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-serif text-lg font-bold text-[#0E1A24]">
                          {apt.patient?.full_name || 'Patient Chart'}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : apt.status === 'pending'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-[#EFECE3] text-[#0E1A24]/70'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#0E1A24]/60">
                        {apt.patient?.phone && (
                          <span className="flex items-center gap-1 font-mono text-[#0E1A24]/80">
                            <Phone className="h-3 w-3 text-[#12B5A6]" />
                            <span>{apt.patient.phone}</span>
                          </span>
                        )}
                        {apt.patient?.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-[#12B5A6]" />
                            <span>{apt.patient.email}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Procedure & Timing */}
                  <div className="rounded-2xl bg-white p-3.5 border border-[#E5E0D5] lg:min-w-[280px]">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#12B5A6]">
                      Requested Discipline
                    </div>
                    <div className="font-serif text-sm font-medium text-[#0E1A24] mt-0.5">
                      {apt.service?.title || 'Bespoke Aesthetic Consultation'}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-[#0E1A24]/70">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="h-3 w-3 text-[#12B5A6]" />
                        <span>{apt.requested_at ? apt.requested_at.split('T')[0] : 'Date TBD'}</span>
                      </span>
                      {apt.service?.price_from && (
                        <span className="font-semibold text-[#0E1A24]">
                          Est. ${apt.service.price_from}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E5E0D5]">
                    {apt.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                        className="flex items-center gap-1.5 rounded-full bg-[#12B5A6] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0E1A24] transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Confirm Visit</span>
                      </button>
                    )}
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'completed')}
                        className="flex items-center gap-1.5 rounded-full bg-[#0E1A24] px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#12B5A6]" />
                        <span>Mark Completed</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                      className="rounded-full border border-rose-200 px-3.5 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Patient Notes Quote Box */}
                {apt.message && (
                  <div className="mt-3.5 pt-3 border-t border-[#E8E2D6] text-xs text-[#0E1A24]/75 italic flex items-start gap-2">
                    <span className="text-base text-[#12B5A6] font-serif leading-none mt-0.5">&ldquo;</span>
                    <p className="leading-relaxed">{apt.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
