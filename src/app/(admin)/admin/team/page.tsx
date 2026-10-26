'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Stethoscope,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  User,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Doctor {
  id: string
  name: string
  title: string
  bio: string
  photo_path: string
  sort_order: number
  published: boolean
}

export default function AdminTeamPage() {
  const supabase = createClient()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    photo_path: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    sort_order: 1,
    published: true,
  })

  const fetchDoctors = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching doctors:', error)
    } else if (data) {
      setDoctors(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleOpenAdd = () => {
    setEditingDoctor(null)
    setFormData({
      name: '',
      title: 'Cosmetic & Restorative Specialist',
      bio: '',
      photo_path: 'https://images.unsplash.com/photo-1594824813637-27e1f13b1f13?auto=format&fit=crop&w=800&q=80',
      sort_order: doctors.length + 1,
      published: true,
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (doc: Doctor) => {
    setEditingDoctor(doc)
    setFormData({
      name: doc.name,
      title: doc.title || '',
      bio: doc.bio || '',
      photo_path: doc.photo_path || '',
      sort_order: doc.sort_order || 1,
      published: doc.published,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the clinical faculty?`)) return

    const { error } = await supabase.from('team_members').delete().eq('id', id)
    if (error) {
      setMessage({ text: `Failed to delete doctor: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: `${name} has been removed from the database.`, type: 'success' })
      setDoctors((prev) => prev.filter((d) => d.id !== id))
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingDoctor) {
      // Update
      const { error } = await supabase
        .from('team_members')
        .update({
          name: formData.name,
          title: formData.title,
          bio: formData.bio,
          photo_path: formData.photo_path,
          sort_order: formData.sort_order,
          published: formData.published,
        })
        .eq('id', editingDoctor.id)

      if (error) {
        setMessage({ text: `Update error: ${error.message}`, type: 'error' })
      } else {
        setMessage({ text: 'Doctor profile updated in Supabase database.', type: 'success' })
        setModalOpen(false)
        fetchDoctors()
      }
    } else {
      // Insert
      const { data, error } = await supabase.from('team_members').insert([
        {
          name: formData.name,
          title: formData.title,
          bio: formData.bio,
          photo_path: formData.photo_path,
          sort_order: formData.sort_order,
          published: formData.published,
        },
      ]).select()

      if (error) {
        setMessage({ text: `Creation error: ${error.message}`, type: 'error' })
      } else {
        setMessage({ text: 'New doctor registered in Supabase database.', type: 'success' })
        setModalOpen(false)
        fetchDoctors()
      }
    }
    setTimeout(() => setMessage(null), 3500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-teal">
            Clinical Faculty Directory
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-white">
            Doctors & Specialists
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time CRUD management directly connected to Supabase <code className="text-slate-300">team_members</code> table.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-electric-teal px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-glow-teal hover:bg-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Notification Toast */}
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

      {/* Loading state */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">
          Fetching doctor roster from Supabase...
        </div>
      ) : doctors.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
          No doctor profiles in the database. Click &ldquo;Add New Doctor&rdquo; above to create one.
        </div>
      ) : (
        /* Doctors Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-sm hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                    {doc.photo_path ? (
                      <Image
                        src={doc.photo_path}
                        alt={doc.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-slate-500 m-auto mt-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg font-medium text-white truncate">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-electric-teal font-medium mt-0.5">
                      {doc.title || 'Specialist'}
                    </p>
                    <span
                      className={`inline-block mt-2 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase ${
                        doc.published
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {doc.published ? 'Live on Site' : 'Draft'}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {doc.bio || 'No clinical biography specified.'}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
                <span className="text-[11px] text-slate-500">Order: #{doc.sort_order}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(doc)}
                    className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-slate-200 hover:bg-slate-700"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id, doc.name)}
                    className="flex items-center gap-1 rounded-lg border border-red-900/60 px-2.5 py-1 text-red-400 hover:bg-red-950/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-4xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="font-serif text-xl font-medium text-white">
                {editingDoctor ? 'Edit Doctor Profile' : 'Register New Specialist'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Full Name & Credentials *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Alexander Ward, DDS, FICOI"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Clinical Role / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Lead Ceramic Reconstruction Surgeon"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Photo URL (Portrait)</label>
                <input
                  type="url"
                  value={formData.photo_path}
                  onChange={(e) => setFormData({ ...formData, photo_path: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Clinical Biography</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Education, fellowships, patient philosophy..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Display Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="h-4 w-4 rounded accent-electric-teal"
                  />
                  <label htmlFor="published" className="text-white cursor-pointer">
                    Publish on Website
                  </label>
                </div>
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
                  {editingDoctor ? 'Save Changes' : 'Insert Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
