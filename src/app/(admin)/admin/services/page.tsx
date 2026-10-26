'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Clock,
  DollarSign,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Service {
  id: string
  slug: string
  title: string
  summary: string
  price_from: number
  duration_min: number
  image_path: string
  sort_order: number
  published: boolean
}

export default function AdminServicesPage() {
  const supabase = createClient()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    price_from: 1200,
    duration_min: 60,
    image_path: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
    sort_order: 1,
    published: true,
  })

  const fetchServices = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching services:', error)
    } else if (data) {
      setServices(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleOpenAdd = () => {
    setEditingService(null)
    setFormData({
      title: '',
      slug: '',
      summary: '',
      price_from: 1200,
      duration_min: 60,
      image_path: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
      sort_order: services.length + 1,
      published: true,
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (svc: Service) => {
    setEditingService(svc)
    setFormData({
      title: svc.title,
      slug: svc.slug,
      summary: svc.summary || '',
      price_from: svc.price_from || 0,
      duration_min: svc.duration_min || 45,
      image_path: svc.image_path || '',
      sort_order: svc.sort_order || 1,
      published: svc.published,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) {
      setMessage({ text: `Delete error: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: `"${title}" has been deleted from Supabase.`, type: 'success' })
      setServices((prev) => prev.filter((s) => s.id !== id))
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formattedSlug = formData.slug
      ? formData.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    if (editingService) {
      const { error } = await supabase
        .from('services')
        .update({
          title: formData.title,
          slug: formattedSlug,
          summary: formData.summary,
          price_from: formData.price_from,
          duration_min: formData.duration_min,
          image_path: formData.image_path,
          sort_order: formData.sort_order,
          published: formData.published,
        })
        .eq('id', editingService.id)

      if (error) {
        setMessage({ text: `Update error: ${error.message}`, type: 'error' })
      } else {
        setMessage({ text: 'Treatment procedure updated successfully.', type: 'success' })
        setModalOpen(false)
        fetchServices()
      }
    } else {
      const { error } = await supabase.from('services').insert([
        {
          title: formData.title,
          slug: formattedSlug,
          summary: formData.summary,
          price_from: formData.price_from,
          duration_min: formData.duration_min,
          image_path: formData.image_path,
          sort_order: formData.sort_order,
          published: formData.published,
        },
      ])

      if (error) {
        setMessage({ text: `Creation error: ${error.message}`, type: 'error' })
      } else {
        setMessage({ text: 'New treatment procedure saved in Supabase database.', type: 'success' })
        setModalOpen(false)
        fetchServices()
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
            Clinical Catalog
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-white">
            Treatments & Procedures
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time CRUD management directly connected to Supabase <code className="text-slate-300">services</code> table.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-electric-teal px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-glow-teal hover:bg-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Treatment</span>
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
          Fetching treatment menu from Supabase...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
          No services registered in the database. Click &ldquo;Add New Treatment&rdquo; to add your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-sm hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-800 mb-3 border border-slate-700">
                  {svc.image_path && (
                    <Image
                      src={svc.image_path}
                      alt={svc.title}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-white">
                    From ${svc.price_from}
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <h3 className="font-serif text-lg font-medium text-white">
                    {svc.title}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase ${
                      svc.published
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {svc.published ? 'Live' : 'Hidden'}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-electric-teal mt-0.5">
                  /services/{svc.slug}
                </div>

                <p className="mt-2 text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {svc.summary || 'No summary entered.'}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
                <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                  <Clock className="h-3.5 w-3.5 text-electric-teal" />
                  <span>{svc.duration_min} mins</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(svc)}
                    className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-slate-200 hover:bg-slate-700"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(svc.id, svc.title)}
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

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-4xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="font-serif text-xl font-medium text-white">
                {editingService ? 'Edit Treatment Procedure' : 'Create Treatment Discipline'}
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
                <label className="block text-slate-400 mb-1 font-medium">Procedure Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Handcrafted Ceramic Veneers"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">URL Slug (e.g. ceramic-veneers)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Leave empty to generate automatically"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Starting Fee (USD) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price_from}
                    onChange={(e) => setFormData({ ...formData, price_from: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Chair Time (Minutes)</label>
                  <input
                    type="number"
                    value={formData.duration_min}
                    onChange={(e) => setFormData({ ...formData, duration_min: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Image URL</label>
                <input
                  type="url"
                  value={formData.image_path}
                  onChange={(e) => setFormData({ ...formData, image_path: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Clinical Summary</label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Concise overview of technique, materials, and benefits..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Sort Order</label>
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
                    id="publishedService"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="h-4 w-4 rounded accent-electric-teal"
                  />
                  <label htmlFor="publishedService" className="text-white cursor-pointer">
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
                  {editingService ? 'Save Changes' : 'Insert Treatment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
