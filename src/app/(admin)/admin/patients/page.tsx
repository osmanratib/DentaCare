'use client'

import React, { useState, useEffect } from 'react'
import {
  Search,
  UserCheck,
  Phone,
  Mail,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Patient {
  id: string
  full_name: string
  phone: string
  email: string | null
  notes: string | null
  created_at: string
}

export default function PatientsAdminPage() {
  const supabase = createClient()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    notes: '',
  })

  const fetchPatients = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching patients:', error)
    } else if (data) {
      setPatients(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handleOpenAdd = () => {
    setEditingPatient(null)
    setFormData({ full_name: '', phone: '', email: '', notes: '' })
    setModalOpen(true)
  }

  const handleOpenEdit = (pat: Patient) => {
    setEditingPatient(pat)
    setFormData({
      full_name: pat.full_name,
      phone: pat.phone,
      email: pat.email || '',
      notes: pat.notes || '',
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete patient file for "${name}"?`)) return

    const { error } = await supabase.from('patients').delete().eq('id', id)
    if (error) {
      setMessage({ text: `Delete error: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: `Patient file for "${name}" removed.`, type: 'success' })
      setPatients((prev) => prev.filter((p) => p.id !== id))
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingPatient) {
      const { error } = await supabase
        .from('patients')
        .update({
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          notes: formData.notes.trim() || null,
        })
        .eq('id', editingPatient.id)

      if (error) {
        setMessage({ text: `Update error: ${error.message}`, type: 'error' })
      } else {
        setMessage({ text: 'Patient records updated.', type: 'success' })
        setModalOpen(false)
        fetchPatients()
      }
    } else {
      const { error } = await supabase.from('patients').insert([
        {
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          notes: formData.notes.trim() || null,
        },
      ])

      if (error) {
        setMessage({ text: `Registration error: ${error.message}`, type: 'error' })
      } else {
        setMessage({ text: 'New patient registered in clinic database.', type: 'success' })
        setModalOpen(false)
        fetchPatients()
      }
    }
    setTimeout(() => setMessage(null), 3500)
  }

  const filtered = patients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D5] pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#12B5A6]">
            Confidential Health Registry
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-medium text-[#0E1A24]">
            Patient Records & Clinical Notes
          </h1>
          <p className="mt-1 text-xs text-[#0E1A24]/60">
            Secure records conforming to HIPAA/GDPR minimal retention principles.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-full bg-[#0E1A24] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#12B5A6] transition-colors"
        >
          <Plus className="h-4 w-4 text-[#12B5A6]" />
          <span>Register Patient</span>
        </button>
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#0E1A24]/40" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, phone, or email..."
          className="w-full rounded-2xl border border-[#DAC7AD] bg-white py-2.5 pl-10 pr-4 text-xs text-[#0E1A24] placeholder:text-[#0E1A24]/40 focus:border-[#12B5A6] focus:outline-none shadow-sm"
        />
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#0E1A24]/50">
          Loading patient directory...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-4xl border border-[#E5E0D5] bg-white p-12 text-center text-xs text-[#0E1A24]/50">
          No patients matching this search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((pat) => (
            <div
              key={pat.id}
              className="group rounded-3xl border border-[#E5E0D5] bg-white p-6 shadow-[0_2px_16px_rgba(14,26,36,0.02)] hover:border-[#DAC7AD] hover:shadow-[0_4px_24px_rgba(14,26,36,0.05)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8DCC8] font-serif text-base font-bold text-[#0E1A24] border border-[#DAC7AD]">
                      {pat.full_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#0E1A24]">
                        {pat.full_name}
                      </h3>
                      <span className="font-mono text-[10px] text-[#0E1A24]/40">
                        {pat.id.slice(0, 13)}...
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(pat)}
                      className="p-2 text-[#0E1A24]/50 hover:text-[#0E1A24] rounded-full hover:bg-[#FAF8F5]"
                      title="Edit File"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pat.id, pat.full_name)}
                      className="p-2 text-[#0E1A24]/40 hover:text-rose-600 rounded-full hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-[#0E1A24]/75">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#12B5A6] shrink-0" />
                    <span className="font-mono text-[#0E1A24]">{pat.phone}</span>
                  </div>
                  {pat.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-[#12B5A6] shrink-0" />
                      <span>{pat.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[#0E1A24]/50 text-[11px] pt-1">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Registered: {pat.created_at ? pat.created_at.split('T')[0] : 'Today'}</span>
                  </div>
                </div>
              </div>

              {/* Physical Clinical Notes Card */}
              <div className="mt-4 rounded-2xl bg-[#FAF8F5] p-4 border border-[#E5E0D5] text-xs">
                <span className="text-[10px] uppercase font-semibold text-[#12B5A6] tracking-wider block mb-1">
                  Confidential Dental Notes
                </span>
                <p className="leading-relaxed text-[#0E1A24]/80 italic font-light">
                  {pat.notes ? `“${pat.notes}”` : 'No confidential notes recorded yet.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1A24]/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-4xl border border-[#E5E0D5] bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
              <h2 className="font-serif text-2xl font-medium text-[#0E1A24]">
                {editingPatient ? 'Update Patient File' : 'Register New Patient'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[#0E1A24]/50 hover:text-[#0E1A24]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Victoria Sterling"
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
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="patient@domain.com"
                    className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Clinical Care & Aesthetic Notes
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Tooth sensitivities, aesthetic goals, dental anxiety preferences..."
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
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
                  Save Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
