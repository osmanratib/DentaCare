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
  Upload,
  Copy,
  ExternalLink,
  ImageIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { confirmDelete, toastSuccess, toastError, alertSuccess } from '@/lib/sweetalert'
import PhotoUpload from '@/components/admin/PhotoUpload'

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

  // Quick Photo Importer State
  const [dashboardPhoto, setDashboardPhoto] = useState('')
  const [recentUploads, setRecentUploads] = useState<string[]>([])

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
    if (newStatus === 'cancelled') {
      const isConfirmed = await confirmDelete(
        'this appointment',
        'The reserved operatory slot will be released.'
      )
      if (!isConfirmed) return
    }

    const { error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', id)
    if (error) {
      toastError('Update Failed', error.message)
    } else {
      toastSuccess(
        newStatus === 'confirmed' ? 'Visit Confirmed' : `Appointment ${newStatus}`,
        `Status set to ${newStatus}.`
      )
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      )
      loadDashboardData()
    }
  }

  const handlePhotoImported = (url: string) => {
    setDashboardPhoto(url)
    if (url && !recentUploads.includes(url)) {
      setRecentUploads((prev) => [url, ...prev].slice(0, 6))
    }
    if (url && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url)
      toastSuccess('Photo Stored & URL Copied', 'Direct link copied to your clipboard.')
    }
  }

  const handleCopyUrl = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url)
      toastSuccess('URL Copied', 'Photo URL copied to clipboard.')
    }
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
            <strong className="text-[#12B5A6] font-medium">{stats.pending} patient requests</strong> awaiting clinical triage. Autoclaves verified and operatories prepped.
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
              <span className="text-[11px] font-semibold uppercase tracking-wider">Active Patient Files</span>
              <Users className="h-4 w-4 text-[#12B5A6]" />
            </div>
            <div className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[#0E1A24]">
              {stats.patientsCount}
            </div>
          </div>
          <div className="mt-3 text-[11px] text-[#0E1A24]/60 font-medium bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-2.5 py-1 w-fit">
            Synchronized with Supabase
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E0D5] bg-white p-5 sm:p-6 shadow-[0_2px_16px_rgba(14,26,36,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#0E1A24]/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Cataloged Procedures</span>
              <Briefcase className="h-4 w-4 text-[#12B5A6]" />
            </div>
            <div className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[#0E1A24]">
              {stats.servicesCount}
            </div>
          </div>
          <div className="mt-3 text-[11px] text-[#0E1A24]/60 font-medium bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl px-2.5 py-1 w-fit">
            Custom protocol menu
          </div>
        </div>
      </div>

      {/* ===================================================================
          3. DIRECT PHOTO IMPORTER FROM COMPUTER (Media Assets & Storage)
         =================================================================== */}
      <div className="rounded-4xl border border-[#E5E0D5] bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(14,26,36,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0ECE1] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#12B5A6]">
              <Upload className="h-3.5 w-3.5" />
              <span>Clinic Media Center</span>
            </div>
            <h2 className="mt-1 font-serif text-2xl font-medium text-[#0E1A24]">
              Import Photos from Your Computer
            </h2>
            <p className="mt-1 text-xs text-[#0E1A24]/60">
              Import doctor portraits, before & after clinical photography, or treatment images directly from your PC into Supabase Storage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/gallery"
              className="rounded-full border border-[#DAC7AD] bg-[#FAF8F5] px-4 py-2 text-xs font-semibold text-[#0E1A24] hover:bg-[#0E1A24] hover:text-white transition-colors"
            >
              Go to Smile Gallery
            </Link>
            <Link
              href="/admin/team"
              className="rounded-full bg-[#0E1A24] px-4 py-2 text-xs font-semibold text-white hover:bg-[#12B5A6] transition-colors shadow-sm"
            >
              Go to Faculty
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <PhotoUpload
              value={dashboardPhoto}
              onChange={handlePhotoImported}
              label="Select or Drag Image File from Computer"
              aspectRatio="wide"
              folder="general"
              helperText="Upload any JPEG, PNG, or WEBP photo from your computer. Once imported, its permanent link is auto-copied."
            />
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-[#E5E0D5] bg-[#FAF8F5] p-5">
              <h3 className="font-serif text-base font-semibold text-[#0E1A24]">
                Where are imported photos used?
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs text-[#0E1A24]/75">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#12B5A6] shrink-0 mt-0.5" />
                  <span>
                    <strong>Specialists & Faculty:</strong> Import doctor portraits in{' '}
                    <Link href="/admin/team" className="text-[#12B5A6] underline font-medium">
                      Faculty Directory
                    </Link>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#12B5A6] shrink-0 mt-0.5" />
                  <span>
                    <strong>Smile Transformation:</strong> Upload Baseline (Before) and Revealed (After) pairs in{' '}
                    <Link href="/admin/gallery" className="text-[#12B5A6] underline font-medium">
                      Aesthetic Gallery
                    </Link>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#12B5A6] shrink-0 mt-0.5" />
                  <span>
                    <strong>Procedures:</strong> Upload treatment cards in{' '}
                    <Link href="/admin/services" className="text-[#12B5A6] underline font-medium">
                      Procedures Repertoire
                    </Link>
                    .
                  </span>
                </li>
              </ul>
            </div>

            {recentUploads.length > 0 && (
              <div className="rounded-3xl border border-[#E5E0D5] bg-white p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#0E1A24]/60 mb-2.5">
                  Recently Imported Session Photos
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {recentUploads.map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative h-20 rounded-2xl overflow-hidden bg-[#E8DCC8] border border-[#DAC7AD]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="Uploaded" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(url)}
                        title="Copy Link"
                        className="absolute inset-0 bg-[#0E1A24]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-[10px] font-semibold gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================
          4. INCOMING CLINICAL CONSULTATION REQUESTS (Physical Chart Cards)
         =================================================================== */}
      <div className="rounded-4xl border border-[#E5E0D5] bg-white p-6 sm:p-8 shadow-[0_2px_20px_rgba(14,26,36,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0ECE1] pb-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#12B5A6]">
              Clinical Queue
            </div>
            <h2 className="mt-1 font-serif text-2xl font-medium text-[#0E1A24]">
              Recent Consultation Inquiries
            </h2>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-[#DAC7AD] bg-[#FAF8F5] p-1 text-xs">
            {(['all', 'pending', 'confirmed'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`rounded-full px-3.5 py-1 text-xs font-medium capitalize transition-colors ${
                  filter === mode
                    ? 'bg-[#0E1A24] text-white shadow-xs'
                    : 'text-[#0E1A24]/70 hover:text-[#0E1A24]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-[#0E1A24]/50">
            Synchronizing clinical appointment files...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#0E1A24]/50">
            No inquiries match the active filter.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((apt) => (
              <div
                key={apt.id}
                className="group rounded-3xl border border-[#DAC7AD] bg-[#FAF8F5] p-5 transition-all hover:border-[#12B5A6] hover:shadow-[0_4px_20px_rgba(14,26,36,0.04)]"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Patient ID & Chart Label */}
                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 shrink-0 rounded-2xl bg-[#E8DCC8] flex items-center justify-center text-[#0E1A24] font-serif font-bold text-base border border-[#DAC7AD]">
                      {apt.patient?.full_name ? apt.patient.full_name[0] : 'P'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-lg font-bold text-[#0E1A24]">
                          {apt.patient?.full_name || 'Anonymous Visitor'}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : apt.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-[#E5E0D5] text-[#0E1A24]/60'
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
