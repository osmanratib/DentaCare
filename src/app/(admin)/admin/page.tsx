'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  Filter,
  Download,
} from 'lucide-react'
import { INITIAL_APPOINTMENTS, CLINIC_SERVICES, CLINIC_STATS } from '@/lib/data/mockData'

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all')

  const pendingCount = appointments.filter((a) => a.status === 'pending').length
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length

  const handleUpdateStatus = (id: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    )
  }

  const filteredAppointments =
    filter === 'all'
      ? appointments
      : appointments.filter((a) => a.status === filter)

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-teal">
            Clinic Overview
          </span>
          <h1 className="mt-1 font-serif text-3xl font-medium text-white">
            Practice Pulse & Analytics
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time telemetry for appointments, patient inquiries, and schedule capacity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/appointments"
            className="flex items-center gap-2 rounded-xl bg-electric-teal px-4 py-2 text-xs font-semibold text-slate-950 shadow-glow-teal hover:bg-white transition-colors"
          >
            <span>Full Schedule Matrix</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Pending Approval</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-4 font-serif text-3xl font-bold text-white">{pendingCount}</div>
          <div className="mt-2 text-[11px] text-amber-400 font-medium">Requires triage confirmation</div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Confirmed Bookings</span>
            <CheckCircle2 className="h-4 w-4 text-electric-teal" />
          </div>
          <div className="mt-4 font-serif text-3xl font-bold text-white">{confirmedCount}</div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium">+14% vs previous 30 days</div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">No-Show Rate</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-4 font-serif text-3xl font-bold text-white">0.6%</div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium">Industry average is 8.4%</div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Monthly Patients</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-4 font-serif text-3xl font-bold text-white">{CLINIC_STATS.monthlyBookings}</div>
          <div className="mt-2 text-[11px] text-slate-400 font-medium">Capacity at 91%</div>
        </div>
      </div>

      {/* Middle Section: 30-Day Chart & Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 30-Day Booking Velocity Chart Bar representation */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-xl font-medium text-white">30-Day Appointment Trajectory</h3>
              <p className="text-xs text-slate-400">Weekly patient visits across disciplines</p>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] text-slate-300">
              Oct 2026
            </span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Week 1 (Oct 1 - Oct 7)', count: 32, max: 40, highlight: false },
              { label: 'Week 2 (Oct 8 - Oct 14)', count: 38, max: 40, highlight: false },
              { label: 'Week 3 (Oct 15 - Oct 21)', count: 36, max: 40, highlight: false },
              { label: 'Week 4 (Oct 22 - Oct 28)', count: 39, max: 40, highlight: true },
            ].map((wk, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{wk.label}</span>
                  <span className="font-mono font-semibold text-white">{wk.count} visits</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      wk.highlight ? 'bg-electric-teal shadow-glow-teal' : 'bg-slate-500'
                    }`}
                    style={{ width: `${(wk.count / wk.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
            <span>Average treatment cycle: 2.4 visits</span>
            <span className="text-emerald-400">Peak hour: 10:00 AM – 1:00 PM</span>
          </div>
        </div>

        {/* Top Procedures */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8">
          <h3 className="font-serif text-xl font-medium text-white mb-1">Top Requested Procedures</h3>
          <p className="text-xs text-slate-400 mb-6">By consultation volume</p>

          <div className="space-y-4">
            {CLINIC_SERVICES.slice(0, 4).map((s, idx) => (
              <div key={s.id} className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                <div>
                  <div className="font-medium text-slate-200">{s.title}</div>
                  <div className="text-[10px] text-slate-400">From ${s.priceFrom}</div>
                </div>
                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-electric-teal">
                  #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Appointments Pipeline */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-serif text-xl font-medium text-white">Recent Intake Pipeline</h3>
            <p className="text-xs text-slate-400">Review, confirm, or modify patient appointments</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-3 py-1.5 text-xs ${
                filter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({appointments.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`rounded-lg px-3 py-1.5 text-xs ${
                filter === 'pending' ? 'bg-amber-950 text-amber-300 font-semibold border border-amber-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`rounded-lg px-3 py-1.5 text-xs ${
                filter === 'confirmed' ? 'bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              Confirmed ({confirmedCount})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Procedure</th>
                <th className="py-3 px-4">Requested Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-white">{apt.patientName}</div>
                    <div className="text-[10px] text-slate-400">{apt.id}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div>{apt.patientPhone}</div>
                    <div className="text-[10px] text-slate-400">{apt.patientEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-200">
                    <div>{apt.serviceName}</div>
                    <div className="text-[10px] text-electric-teal">{apt.doctor}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                    <div>{apt.requestedAt.split('T')[0]}</div>
                    <div className="text-[10px] text-slate-400">{apt.timeSlot}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : apt.status === 'pending'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {apt.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500"
                        >
                          Confirm
                        </button>
                      )}
                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'completed')}
                          className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-700"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                        className="rounded-lg border border-red-800/40 px-2.5 py-1 text-[11px] text-red-400 hover:bg-red-950/40"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
