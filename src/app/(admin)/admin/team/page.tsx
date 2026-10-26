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
  User,
  GraduationCap,
  Sparkles,
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
      const { error } = await supabase.from('team_members').insert([
        {
          name: formData.name,
          title: formData.title,
          bio: formData.bio,
          photo_path: formData.photo_path,
          sort_order: formData.sort_order,
          published: formData.published,
        },
      ])

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
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D5] pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#12B5A6]">
            Clinical Faculty Directory
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-medium text-[#0E1A24]">
            Specialists & Master Ceramists
          </h1>
          <p className="mt-1 text-xs text-[#0E1A24]/60">
            Curate the attending physicians displayed on the public clinic website and booking wizards.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-full bg-[#0E1A24] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#12B5A6] transition-colors"
        >
          <Plus className="h-4 w-4 text-[#12B5A6]" />
          <span>Add Specialist</span>
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

      {loading ? (
        <div className="py-16 text-center text-xs text-[#0E1A24]/50">
          Loading clinical faculty...
        </div>
      ) : doctors.length === 0 ? (
        <div className="rounded-4xl border border-[#E5E0D5] bg-white p-12 text-center text-xs text-[#0E1A24]/50">
          No doctor profiles registered yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="group rounded-4xl border border-[#E5E0D5] bg-white p-6 shadow-[0_4px_24px_rgba(14,26,36,0.02)] transition-all hover:border-[#DAC7AD] hover:shadow-[0_8px_32px_rgba(14,26,36,0.06)] flex flex-col justify-between"
            >
              <div>
                {/* Doctor Portrait Card */}
                <div className="relative h-64 w-full rounded-3xl overflow-hidden bg-[#E8DCC8] mb-5 border border-[#DAC7AD]/40">
                  {doc.photo_path ? (
                    <Image
                      src={doc.photo_path}
                      alt={doc.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <User className="h-12 w-12 text-[#0E1A24]/30" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3 rounded-full bg-[#0E1A24]/80 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                    Sort #{doc.sort_order}
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                        doc.published
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-[#0E1A24]/80 text-[#FAF8F5]/60'
                      }`}
                    >
                      {doc.published ? 'Live on Site' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-semibold uppercase tracking-widest text-[#12B5A6]">
                  {doc.title || 'Cosmetic Specialist'}
                </div>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[#0E1A24]">
                  {doc.name}
                </h3>

                <p className="mt-3 text-xs text-[#0E1A24]/70 leading-relaxed font-light line-clamp-3">
                  {doc.bio || 'Dedicated to unhurried, biological restorative excellence.'}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-[#F0ECE1]">
                <button
                  onClick={() => handleOpenEdit(doc)}
                  className="rounded-full border border-[#DAC7AD] bg-[#FAF8F5] px-4 py-1.5 text-xs font-semibold text-[#0E1A24] hover:bg-[#0E1A24] hover:text-white transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => handleDelete(doc.id, doc.name)}
                  className="rounded-full border border-rose-200 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT / ADD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1A24]/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-4xl border border-[#E5E0D5] bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
              <h2 className="font-serif text-2xl font-medium text-[#0E1A24]">
                {editingDoctor ? 'Update Specialist Dossier' : 'Register Specialist to Faculty'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[#0E1A24]/50 hover:text-[#0E1A24]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Full Name & Diplomas *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Osman Ratib, DDS, FICOI"
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Clinical Title / Discipline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Lead Ceramic Reconstruction Surgeon"
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={formData.photo_path}
                  onChange={(e) => setFormData({ ...formData, photo_path: e.target.value })}
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Biography & Credentials
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Fellowships, academic background, philosophy of gentle care..."
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="docPub"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="h-4 w-4 rounded accent-[#12B5A6]"
                  />
                  <label htmlFor="docPub" className="text-xs font-semibold text-[#0E1A24] cursor-pointer">
                    Publish in Public Directory
                  </label>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span>Sort Order:</span>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-16 rounded-xl border border-[#DAC7AD] bg-[#FAF8F5] p-1.5 text-center text-[#0E1A24]"
                  />
                </div>
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
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
