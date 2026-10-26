'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Trash2, Eye, EyeOff, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface GalleryCase {
  id: string
  title: string
  treatment: string
  before_path: string
  after_path: string
  published: boolean
}

export default function GalleryAdminPage() {
  const supabase = createClient()
  const [cases, setCases] = useState<GalleryCase[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    treatment: 'Upper Arch Porcelain Veneers',
    before_path: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80',
    after_path: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80',
    published: true,
  })

  const fetchCases = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('gallery_cases').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching cases:', error)
    } else if (data) {
      setCases(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCases()
  }, [])

  const togglePublish = async (id: string, currentPublished: boolean) => {
    const { error } = await supabase
      .from('gallery_cases')
      .update({ published: !currentPublished })
      .eq('id', id)

    if (error) {
      setMessage({ text: `Update error: ${error.message}`, type: 'error' })
    } else {
      setCases((prev) =>
        prev.map((c) => (c.id === id ? { ...c, published: !currentPublished } : c))
      )
      setMessage({
        text: `Case ${!currentPublished ? 'published to live gallery' : 'hidden from public view'}.`,
        type: 'success',
      })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete case "${title}" from database?`)) return

    const { error } = await supabase.from('gallery_cases').delete().eq('id', id)
    if (error) {
      setMessage({ text: `Delete error: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: `Case "${title}" removed from Supabase.`, type: 'success' })
      setCases((prev) => prev.filter((c) => c.id !== id))
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.from('gallery_cases').insert([formData])

    if (error) {
      setMessage({ text: `Creation error: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: 'New smile transformation case added into Supabase.', type: 'success' })
      setModalOpen(false)
      fetchCases()
      setFormData({
        title: '',
        treatment: '',
        before_path: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80',
        after_path: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80',
        published: true,
      })
    }
    setTimeout(() => setMessage(null), 3500)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D5] pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#12B5A6]">
            Transformation Archive
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-medium text-[#0E1A24]">
            Before & After Smile Dossiers
          </h1>
          <p className="mt-1 text-xs text-[#0E1A24]/60">
            Curate optical evidence and ceramic restoration comparative pairs.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-full bg-[#0E1A24] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#12B5A6] transition-colors"
        >
          <Plus className="h-4 w-4 text-[#12B5A6]" />
          <span>Add Smile Case</span>
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
          Loading transformation archive...
        </div>
      ) : cases.length === 0 ? (
        <div className="rounded-4xl border border-[#E5E0D5] bg-white p-12 text-center text-xs text-[#0E1A24]/50">
          No transformation cases registered yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {cases.map((c) => (
            <div
              key={c.id}
              className="rounded-4xl border border-[#E5E0D5] bg-white p-6 shadow-[0_2px_16px_rgba(14,26,36,0.02)] hover:border-[#DAC7AD] hover:shadow-[0_4px_24px_rgba(14,26,36,0.05)] transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0E1A24]">{c.title}</h3>
                  <span className="text-xs font-medium text-[#12B5A6]">{c.treatment}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish(c.id, c.published)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      c.published
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-[#EFECE3] text-[#0E1A24]/60'
                    }`}
                  >
                    {c.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    <span>{c.published ? 'Live' : 'Hidden'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.title)}
                    className="p-1.5 text-[#0E1A24]/40 hover:text-rose-600 rounded-full hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative h-40 rounded-2xl overflow-hidden bg-[#E8DCC8] border border-[#DAC7AD]">
                  {c.before_path && <Image src={c.before_path} alt="Before" fill className="object-cover" />}
                  <span className="absolute bottom-2 left-2 rounded-full bg-[#0E1A24]/80 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    Baseline
                  </span>
                </div>
                <div className="relative h-40 rounded-2xl overflow-hidden bg-[#E8DCC8] border border-[#DAC7AD]">
                  {c.after_path && <Image src={c.after_path} alt="After" fill className="object-cover" />}
                  <span className="absolute bottom-2 left-2 rounded-full bg-[#12B5A6] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    Revealed
                  </span>
                </div>
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
              <h2 className="font-serif text-2xl font-medium text-[#0E1A24]">Add Transformation Pair</h2>
              <button onClick={() => setModalOpen(false)} className="text-[#0E1A24]/50 hover:text-[#0E1A24]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Case Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Diastema Closure & 8 Porcelain Veneers"
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Treatment Discipline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  placeholder="e.g. Micro-layered feldspathic porcelain laminates"
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24]"
                />
              </div>

              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Before Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.before_path}
                  onChange={(e) => setFormData({ ...formData, before_path: e.target.value })}
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24]"
                />
              </div>

              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  After Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.after_path}
                  onChange={(e) => setFormData({ ...formData, after_path: e.target.value })}
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="casePub"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 rounded accent-[#12B5A6]"
                />
                <label htmlFor="casePub" className="text-xs font-semibold text-[#0E1A24] cursor-pointer">
                  Publish on public gallery immediately
                </label>
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
                  Save Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
