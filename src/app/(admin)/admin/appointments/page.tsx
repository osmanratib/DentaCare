'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Clock,
  User,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AppointmentRecord {
  id: string
  requested_at: string
  status: string
  message: string | null
  source: string
  created_at: string
  patient: {
    id: string
    full_name: string
    phone: string
    email: string | null
  } | null
  service: {
    id: string
    title: string
  } | null
}

export default function AppointmentsAdminPage() {
  const supabase = createClient()
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([])
  const [servicesList, setServicesList] = useState<{ id: string; title: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // New Appointment Form
  const [newPatientName, setNewPatientName] = useState('')
  const [newPatientPhone, setNewPatientPhone] = useState('')
  const [newPatientEmail, setNewPatientEmail] = useState('')
  const [newServiceId, setNewServiceId] = useState('')
  const [newDate, setNewDate] = useState('2026-10-30')
  const [newTime, setNewTime] = useState('10:00 AM')
  const [newNotes, setNewNotes] = useState('')

  const fetchAppointments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        requested_at,
        status,
        message,
        source,
        created_at,
        patient:patients ( id, full_name, phone, email ),
        service:services ( id, title )
      `)
      .order('requested_at', { ascending: false })

    if (error) {
      console.error('Error fetching appointments:', error)
    } else if (data) {
      // Normalize patient and service objects (Supabase can return arrays or objects)
      const normalized = data.map((item: any) => ({
        ...item,
        patient: Array.isArray(item.patient) ? item.patient[0] : item.patient,
        service: Array.isArray(item.service) ? item.service[0] : item.service,
      }))
      setAppointments(normalized)
    }

    // Fetch services for modal select
    const { data: svcData } = await supabase.from('services').select('id, title')
    if (svcData) {
      setServicesList(svcData)
      if (svcData.length > 0 && !newServiceId) setNewServiceId(svcData[0].id)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      setMessage({ text: `Failed to update status: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: `Appointment status updated to ${newStatus}.`, type: 'success' })
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      )
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment from the database?')) return

    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (error) {
      setMessage({ text: `Failed to delete: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: 'Appointment deleted from database.', type: 'success' })
      setAppointments((prev) => prev.filter((a) => a.id !== id))
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Upsert patient
    const { data: patient, error: pError } = await supabase
      .from('patients')
      .upsert(
        {
          full_name: newPatientName.trim(),
          phone: newPatientPhone.trim(),
          email: newPatientEmail.trim() || null,
        },
        { onConflict: 'phone' }
      )
      .select()
      .single()

    if (pError || !patient) {
      setMessage({ text: `Patient error: ${pError?.message || 'Could not save patient'}`, type: 'error' })
      return
    }

    // 2. Insert appointment
    const { error: aError } = await supabase.from('appointments').insert([
      {
        patient_id: patient.id,
        service_id: newServiceId || null,
        requested_at: new Date(`${newDate}T10:00:00Z`).toISOString(),
        status: 'confirmed',
        message: `${newTime} | Notes: ${newNotes || 'Direct clinical booking'}`,
        source: 'admin',
      },
    ])

    if (aError) {
      setMessage({ text: `Appointment creation error: ${aError.message}`, type: 'error' })
    } else {
      setMessage({ text: 'New appointment booked and saved to database.', type: 'success' })
      setModalOpen(false)
      fetchAppointments()
      // reset form
      setNewPatientName('')
      setNewPatientPhone('')
      setNewPatientEmail('')
      setNewNotes('')
    }
    setTimeout(() => setMessage(null), 3500)
  }

  const exportCSV = () => {
    const headers = 'ID,Patient Name,Phone,Email,Procedure,Date,Status,Notes\n'
    const rows = appointments
      .map((a) => {
        const pName = a.patient?.full_name || 'Anonymous'
        const pPhone = a.patient?.phone || ''
        const pEmail = a.patient?.email || ''
        const sTitle = a.service?.title || 'General Consultation'
        return `"${a.id}","${pName}","${pPhone}","${pEmail}","${sTitle}","${a.requested_at}","${a.status}","${a.message || ''}"`
      })
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `dentacare-appointments-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const filtered = appointments.filter((apt) => {
    const patientName = apt.patient?.full_name?.toLowerCase() || ''
    const patientPhone = apt.patient?.phone || ''
    const serviceTitle = apt.service?.title?.toLowerCase() || ''
    const matchesSearch =
      patientName.includes(searchTerm.toLowerCase()) ||
      patientPhone.includes(searchTerm) ||
      serviceTitle.includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-teal">
            Clinical Operations
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-white">
            Appointment Pipeline & Registry
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time CRUD operations linked directly to Supabase <code className="text-slate-300">appointments</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-electric-teal px-4 py-2 text-xs font-semibold text-slate-950 shadow-glow-teal hover:bg-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Appointment</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-2xl p-4 text-xs ${
            message.type === 'success'
              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800'
              : 'bg-red-950/70 text-red-300 border border-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name, phone, or treatment..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:border-electric-teal focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs uppercase font-medium tracking-wider transition-colors ${
                statusFilter === st
                  ? 'bg-electric-teal text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">
          Fetching live appointments from Supabase...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
          No appointments found matching this filter. Click &ldquo;Add Appointment&rdquo; to insert one.
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-5">Patient Details</th>
                    <th className="py-3 px-5">Procedure</th>
                    <th className="py-3 px-5">Date & Notes</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filtered.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-800/20">
                      <td className="py-4 px-5">
                        <div className="font-semibold text-white">
                          {apt.patient?.full_name || 'Unassigned Patient'}
                        </div>
                        <div className="text-[11px] text-slate-300">{apt.patient?.phone}</div>
                        <div className="text-[10px] text-slate-500">{apt.patient?.email}</div>
                      </td>
                      <td className="py-4 px-5 text-slate-200">
                        <div className="font-medium text-white">
                          {apt.service?.title || 'General Consultation'}
                        </div>
                        <span className="text-[10px] font-mono text-electric-teal">
                          ID: {apt.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-300">
                        <div className="font-mono text-[11px]">
                          {apt.requested_at ? apt.requested_at.split('T')[0] : 'TBD'}
                        </div>
                        {apt.message && (
                          <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                            {apt.message}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <select
                          value={apt.status}
                          onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-200 focus:border-electric-teal focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleDelete(apt.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Delete Appointment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS VIEW */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filtered.map((apt) => (
              <div
                key={apt.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white text-sm">
                      {apt.patient?.full_name || 'Unassigned Patient'}
                    </h3>
                    <p className="text-xs text-electric-teal">{apt.patient?.phone}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(apt.id)}
                    className="p-1 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-300">
                  <div className="font-medium text-white">{apt.service?.title || 'General Consultation'}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Date: {apt.requested_at ? apt.requested_at.split('T')[0] : 'TBD'}
                  </div>
                  {apt.message && <p className="mt-1 text-[11px] text-slate-400">{apt.message}</p>}
                </div>

                <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                  <span className="text-[11px] text-slate-400">Status:</span>
                  <select
                    value={apt.status}
                    onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CREATE APPOINTMENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-4xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="font-serif text-xl font-medium text-white">Book New Appointment</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. Charlotte Montgomery"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newPatientPhone}
                    onChange={(e) => setNewPatientPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={newPatientEmail}
                    onChange={(e) => setNewPatientEmail(e.target.value)}
                    placeholder="patient@domain.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Select Procedure *</label>
                <select
                  value={newServiceId}
                  onChange={(e) => setNewServiceId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                >
                  {servicesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Time Slot</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                  >
                    <option>09:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:30 AM</option>
                    <option>01:00 PM</option>
                    <option>02:30 PM</option>
                    <option>04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Internal Clinical Notes</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Notes from initial telephone intake..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2.5 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-electric-teal px-5 py-2.5 font-semibold text-slate-950 hover:bg-white transition-colors"
                >
                  Confirm & Insert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
