'use client'

import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
} from 'lucide-react'
import { INITIAL_APPOINTMENTS } from '@/lib/data/mockData'

export default function AppointmentsAdminPage() {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const handleStatusChange = (id: string, status: any) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    )
  }

  const exportCSV = () => {
    const headers = 'ID,Patient Name,Phone,Email,Procedure,Doctor,Date,Time,Status\n'
    const rows = appointments
      .map(
        (a) =>
          `"${a.id}","${a.patientName}","${a.patientPhone}","${a.patientEmail}","${a.serviceName}","${a.doctor}","${a.requestedAt}","${a.timeSlot}","${a.status}"`
      )
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `dentacare-appointments-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patientPhone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-teal">
            Clinical Operations
          </span>
          <h1 className="mt-1 font-serif text-3xl font-medium text-white">
            Appointment Directory & Calendar
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Manage consultations, update statuses, and export clinical schedules.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name, procedure, or phone..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:border-electric-teal focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-2 text-xs uppercase font-medium tracking-wider transition-colors ${
                statusFilter === st
                  ? 'bg-electric-teal text-slate-950 font-bold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-5">Ref / Patient</th>
                <th className="py-3 px-5">Contact Details</th>
                <th className="py-3 px-5">Procedure & Doctor</th>
                <th className="py-3 px-5">Date & Slot</th>
                <th className="py-3 px-5">Current Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-800/20">
                  <td className="py-4 px-5">
                    <div className="font-semibold text-white">{apt.patientName}</div>
                    <div className="font-mono text-[10px] text-electric-teal">{apt.id}</div>
                  </td>
                  <td className="py-4 px-5 text-slate-300">
                    <div>{apt.patientPhone}</div>
                    <div className="text-[10px] text-slate-400">{apt.patientEmail}</div>
                  </td>
                  <td className="py-4 px-5 text-slate-200">
                    <div className="font-medium">{apt.serviceName}</div>
                    <div className="text-[10px] text-slate-400">{apt.doctor}</div>
                    {apt.message && (
                      <p className="mt-1 text-[11px] text-slate-400 italic">“{apt.message}”</p>
                    )}
                  </td>
                  <td className="py-4 px-5 text-slate-300">
                    <div>{apt.requestedAt.split('T')[0]}</div>
                    <div className="text-[10px] text-slate-400">{apt.timeSlot}</div>
                  </td>
                  <td className="py-4 px-5">
                    <select
                      value={apt.status}
                      onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-200 focus:border-electric-teal focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no_show">No Show</option>
                    </select>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => handleStatusChange(apt.id, 'confirmed')}
                      className="text-xs text-electric-teal hover:underline mr-3"
                    >
                      Quick Confirm
                    </button>
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
