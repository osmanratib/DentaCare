'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Stethoscope,
  Briefcase,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminDashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    patientsCount: 0,
    servicesCount: 0,
  })

  const loadDashboardData = async () => {
    setLoading(true)

    // 1. Appointments
    const { data: apts } = await supabase
      .from('appointments')
      .select(`
        id,
        requested_at,
        status,
        message,
        patient:patients ( full_name, phone ),
        service:services ( title )
      `)
      .order('requested_at', { ascending: false })
      .limit(6)

    if (apts) {
      const normalized = apts.map((item: any) => ({
        ...item,
        patient: Array.isArray(item.patient) ? item.patient[0] : item.patient,
        service: Array.isArray(item.service) ? item.service[0] : item.service,
      }))
      setAppointments(normalized)

      const pending = apts.filter((a: any) => a.status === 'pending').length
      const confirmed = apts.filter((a: any) => a.status === 'confirmed').length

      // 2. Counts
      const { count: patCount } = await supabase.from('patients').select('*', { count: 'exact', head: true })
      const { count: sCount } = await supabase.from('services').select('*', { count: 'exact', head: true })

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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-teal">
            Live Telemetry
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-white">
            Clinic Command Center
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time metrics connected directly to your PostgreSQL database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/appointments"
            className="flex items-center gap-1.5 rounded-xl bg-electric-teal px-4 py-2 text-xs font-semibold text-slate-950 shadow-glow-teal hover:bg-white transition-colors"
          >
            <span>Manage All Bookings</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Pending Bookings</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3 font-serif text-3xl font-bold text-white">{stats.pending}</div>
          <div className="mt-1.5 text-[11px] text-amber-400 font-medium">Requires staff review</div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Confirmed</span>
            <CheckCircle2 className="h-4 w-4 text-electric-teal" />
          </div>
          <div className="mt-3 font-serif text-3xl font-bold text-white">{stats.confirmed}</div>
          <div className="mt-1.5 text-[11px] text-emerald-400 font-medium">Scheduled in calendar</div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Patients</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-3 font-serif text-3xl font-bold text-white">{stats.patientsCount}</div>
          <div className="mt-1.5 text-[11px] text-slate-400 font-medium">In Supabase registry</div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Active Services</span>
            <Briefcase className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-3 font-serif text-3xl font-bold text-white">{stats.servicesCount}</div>
          <div className="mt-1.5 text-[11px] text-purple-400 font-medium">Public catalog items</div>
        </div>
      </div>

      {/* Quick Access Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/team"
          className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 hover:border-electric-teal/50 transition-all flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-electric-teal/15 text-electric-teal">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Doctors</div>
            <div className="text-[10px] text-slate-400">Manage Faculty</div>
          </div>
        </Link>

        <Link
          href="/admin/services"
          className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 hover:border-electric-teal/50 transition-all flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Treatments</div>
            <div className="text-[10px] text-slate-400">Add & Edit Menu</div>
          </div>
        </Link>

        <Link
          href="/admin/patients"
          className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 hover:border-electric-teal/50 transition-all flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Patients</div>
            <div className="text-[10px] text-slate-400">View Histories</div>
          </div>
        </Link>

        <Link
          href="/admin/availability"
          className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 hover:border-electric-teal/50 transition-all flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Operating Slots</div>
            <div className="text-[10px] text-slate-400">Hours & Blocked</div>
          </div>
        </Link>
      </div>

      {/* Live Recent Pipeline */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-medium text-white">
              Recent Inquiries & Intake
            </h3>
            <p className="text-xs text-slate-400">Live database rows from Supabase</p>
          </div>
          <Link
            href="/admin/appointments"
            className="text-xs text-electric-teal hover:underline font-medium"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading live data...</div>
        ) : appointments.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No appointment records yet. Submit a test booking on the website to see it appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs"
              >
                <div>
                  <div className="font-semibold text-white text-sm">
                    {apt.patient?.full_name || 'Patient'}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {apt.service?.title || 'General Consultation'} • {apt.patient?.phone}
                  </div>
                  {apt.message && (
                    <p className="text-[11px] text-slate-400 italic mt-0.5">{apt.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                      apt.status === 'confirmed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : apt.status === 'pending'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {apt.status}
                  </span>

                  {apt.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                      className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
                    >
                      Confirm
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
