'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Trash2, Eye, EyeOff, CheckCircle2, AlertCircle, X } from 'lucide-react'
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
        text: `Case ${!currentPublished ? 'published to website' : 'hidden from public view'}.`,
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
      setMessage({ text: `Case "${title}" deleted from Supabase.`, type: 'success' })
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
      setMessage({ text: 'New smile transformation case added to Supabase.', type: 'success' })
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-teal">
            Case Archive
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-white">
            Before / After Transformations
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time CRUD operations linked directly to Supabase <code className="text-slate-300">gallery_cases</code>.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-electric-teal px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-glow-teal hover:bg-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Smile Case</span>
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

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">
          Loading gallery cases from Supabase...
        </div>
      ) : cases.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
          No smile transformation cases in the database. Click &ldquo;Add Smile Case&rdquo; to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((c) => (
            <div
              key={c.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-medium text-white">{c.title}</h3>
                  <span className="text-xs text-electric-teal">{c.treatment}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish(c.id, c.published)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      c.published
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {c.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    <span>{c.published ? 'Live' : 'Hidden'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.title)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  {c.before_path && <Image src={c.before_path} alt="Before" fill className="object-cover" />}
                  <span className="absolute bottom-2 left-2 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] text-slate-300">
                    Before
                  </span>
                </div>
                <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  {c.after_path && <Image src={c.after_path} alt="After" fill className="object-cover" />}
                  <span className="absolute bottom-2 left-2 rounded-md bg-electric-teal/90 px-2 py-0.5 text-[10px] text-slate-950 font-bold">
                    After
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-4xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="font-serif text-xl font-medium text-white">Add Before & After Case</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Case Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Diastema Closure & 8 Porcelain Veneers"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Treatment Performed *</label>
                <input
                  type="text"
                  required
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  placeholder="e.g. Micro-layered feldspathic porcelain laminates"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Before Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.before_path}
                  onChange={(e) => setFormData({ ...formData, before_path: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">After Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.after_path}
                  onChange={(e) => setFormData({ ...formData, after_path: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="casePublished"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 rounded accent-electric-teal"
                />
                <label htmlFor="casePublished" className="text-white cursor-pointer">
                  Publish on Website Gallery immediately
                </label>
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
