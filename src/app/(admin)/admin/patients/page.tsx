'use client'

import React, { useState, useEffect } from 'react'
import {
  Search,
  UserCheck,
  Phone,
  Mail,
  FileText,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  X,
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
    if (!confirm(`Delete patient record for "${name}"?`)) return

    const { error } = await supabase.from('patients').delete().eq('id', id)
    if (error) {
      setMessage({ text: `Delete error: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: `Patient "${name}" removed from database.`, type: 'success' })
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
        setMessage({ text: 'Patient records updated in Supabase.', type: 'success' })
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
        setMessage({ text: 'New patient registered into Supabase.', type: 'success' })
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-teal">
            Patient Registry
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-white">
            Patients & Clinical Records
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time CRUD operations linked directly to Supabase <code className="text-slate-300">patients</code>.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-electric-teal px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-glow-teal hover:bg-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Register Patient</span>
        </button>
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by patient name, phone, or email..."
          className="w-full rounded-2xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:border-electric-teal focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">
          Fetching patient records from Supabase...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
          No patients found. Click &ldquo;Register Patient&rdquo; to add your first patient.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((pat) => (
            <div
              key={pat.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-sm hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-white">{pat.full_name}</h3>
                    <span className="font-mono text-[10px] text-electric-teal">
                      ID: {pat.id.slice(0, 13)}...
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(pat)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pat.id, pat.full_name)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-electric-teal shrink-0" />
                    <span>{pat.phone}</span>
                  </div>
                  {pat.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-electric-teal shrink-0" />
                      <span>{pat.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Registered: {pat.created_at ? pat.created_at.split('T')[0] : 'Today'}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-950 p-3.5 border border-slate-800 text-xs text-slate-400">
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider block mb-1">
                  Clinical Care Notes
                </span>
                <p className="leading-relaxed text-slate-300 text-xs line-clamp-3">
                  {pat.notes || 'No confidential care notes recorded for this patient.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PATIENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-4xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="font-serif text-xl font-medium text-white">
                {editingPatient ? 'Edit Patient File' : 'Register New Patient'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Eleanor Roosevelt"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Telephone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="patient@email.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Confidential Dental Notes</label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Tooth sensitivities, aesthetic goals, medical flags..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
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
                  {editingPatient ? 'Save Updates' : 'Save Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
