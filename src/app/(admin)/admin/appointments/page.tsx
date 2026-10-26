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
  Phone,
  Mail,
  Check,
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
      const normalized = data.map((item: any) => ({
        ...item,
        patient: Array.isArray(item.patient) ? item.patient[0] : item.patient,
        service: Array.isArray(item.service) ? item.service[0] : item.service,
      }))
      setAppointments(normalized)
    }

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
      setMessage({ text: `Appointment marked as ${newStatus}.`, type: 'success' })
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      )
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel and remove this appointment?')) return

    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (error) {
      setMessage({ text: `Failed to delete: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: 'Appointment removed from schedule.', type: 'success' })
      setAppointments((prev) => prev.filter((a) => a.id !== id))
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault()

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
      setMessage({ text: 'New appointment booked and saved into database.', type: 'success' })
      setModalOpen(false)
      fetchAppointments()
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
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D5] pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#12B5A6]">
            Clinical Schedule Matrix
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-medium text-[#0E1A24]">
            Appointment Pipeline
          </h1>
          <p className="mt-1 text-xs text-[#0E1A24]/60">
            Real-time synchronization with patient bookings, consultations, and operatory reservations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-full border border-[#DAC7AD] bg-white px-4 py-2 text-xs font-semibold text-[#0E1A24] hover:bg-[#FAF8F5] transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-[#12B5A6]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#0E1A24] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#12B5A6] transition-colors"
          >
            <Plus className="h-4 w-4 text-[#12B5A6]" />
            <span>Book Visit</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-2xl p-4 text-xs ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#0E1A24]/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient, phone, or treatment..."
            className="w-full rounded-2xl border border-[#DAC7AD] bg-white py-2.5 pl-10 pr-4 text-xs text-[#0E1A24] placeholder:text-[#0E1A24]/40 focus:border-[#12B5A6] focus:outline-none shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === st
                  ? 'bg-[#0E1A24] text-white shadow-sm'
                  : 'bg-white text-[#0E1A24]/70 hover:bg-[#FAF8F5] border border-[#E5E0D5]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* List / Cards */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#0E1A24]/50">
          Loading appointments from Supabase...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-4xl border border-[#E5E0D5] bg-white p-12 text-center text-xs text-[#0E1A24]/50">
          No appointments found matching this criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((apt) => (
            <div
              key={apt.id}
              className="rounded-3xl border border-[#E5E0D5] bg-white p-5 sm:p-6 shadow-[0_2px_16px_rgba(14,26,36,0.02)] hover:border-[#DAC7AD] hover:shadow-[0_4px_24px_rgba(14,26,36,0.05)] transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Patient */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8DCC8] font-serif text-base font-bold text-[#0E1A24] shrink-0 border border-[#DAC7AD]">
                    {apt.patient?.full_name ? apt.patient.full_name.slice(0, 2).toUpperCase() : 'PT'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-[#0E1A24]">
                        {apt.patient?.full_name || 'Patient Chart'}
                      </h3>
                      <span className="font-mono text-[10px] text-[#0E1A24]/40">
                        ({apt.id.slice(0, 8)})
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#0E1A24]/60">
                      {apt.patient?.phone && (
                        <span className="flex items-center gap-1 font-mono text-[#0E1A24]">
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

                {/* Middle: Procedure & Date */}
                <div className="rounded-2xl bg-[#FAF8F5] p-3 border border-[#E5E0D5] lg:min-w-[260px]">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#12B5A6]">
                    Treatment Ceremony
                  </div>
                  <div className="font-serif text-sm font-medium text-[#0E1A24] mt-0.5">
                    {apt.service?.title || 'Comprehensive Aesthetic Consultation'}
                  </div>
                  <div className="mt-1 text-xs text-[#0E1A24]/70 flex items-center gap-1.5 font-mono">
                    <Clock className="h-3 w-3 text-[#12B5A6]" />
                    <span>{apt.requested_at ? apt.requested_at.split('T')[0] : 'Date TBD'}</span>
                  </div>
                </div>

                {/* Right: Status Workflow & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#F0ECE1]">
                  <select
                    value={apt.status}
                    onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                    className="rounded-full border border-[#DAC7AD] bg-white px-3 py-1.5 text-xs font-semibold text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none shadow-sm"
                  >
                    <option value="pending">🟡 Pending Triage</option>
                    <option value="confirmed">🟢 Confirmed</option>
                    <option value="completed">🔵 Completed</option>
                    <option value="cancelled">🔴 Cancelled</option>
                  </select>

                  <button
                    onClick={() => handleDelete(apt.id)}
                    className="p-2 text-[#0E1A24]/40 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                    title="Remove Appointment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Message */}
              {apt.message && (
                <div className="mt-3.5 pt-3 border-t border-[#F0ECE1] text-xs text-[#0E1A24]/75 italic flex items-start gap-1.5">
                  <span className="text-[#12B5A6] font-serif text-base leading-none">&ldquo;</span>
                  <p>{apt.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1A24]/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-4xl border border-[#E5E0D5] bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
              <h2 className="font-serif text-2xl font-medium text-[#0E1A24]">Book Priority Appointment</h2>
              <button onClick={() => setModalOpen(false)} className="text-[#0E1A24]/50 hover:text-[#0E1A24]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. Harrison Blake"
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPatientPhone}
                    onChange={(e) => setNewPatientPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newPatientEmail}
                    onChange={(e) => setNewPatientEmail(e.target.value)}
                    placeholder="patient@domain.com"
                    className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Procedure *
                </label>
                <select
                  value={newServiceId}
                  onChange={(e) => setNewServiceId(e.target.value)}
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24]"
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
                  <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24]"
                  />
                </div>
                <div>
                  <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Time Slot
                  </label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24]"
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
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Internal Clinical Notes
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Patient requests, anesthesia preferences..."
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F0ECE1]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-[#DAC7AD] px-5 py-2.5 text-[#0E1A24]/70 hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#0E1A24] px-6 py-2.5 font-semibold text-white hover:bg-[#12B5A6] transition-colors shadow-sm"
                >
                  Confirm & Reserve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
