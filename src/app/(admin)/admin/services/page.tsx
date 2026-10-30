'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  X,
  Clock,
  Sparkles,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { confirmDelete, toastSuccess, toastError } from '@/lib/sweetalert'
import PhotoUpload from '@/components/admin/PhotoUpload'

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
      toastError('Fetch Error', error.message)
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
    const isConfirmed = await confirmDelete(
      `Procedure "${title}"`,
      'This procedure will be unlisted from booking and removed from the catalog.'
    )
    if (!isConfirmed) return

    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) {
      toastError('Delete Error', error.message)
    } else {
      toastSuccess('Procedure Deleted', `"${title}" removed from catalog.`)
      setServices((prev) => prev.filter((s) => s.id !== id))
    }
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
        toastError('Update Error', error.message)
      } else {
        toastSuccess('Procedure Updated', `${formData.title} has been updated.`)
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
        toastError('Creation Error', error.message)
      } else {
        toastSuccess('Procedure Created', `${formData.title} cataloged in database.`)
        setModalOpen(false)
        fetchServices()
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D5] pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#12B5A6]">
            Clinical Treatment Repertoire
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-medium text-[#0E1A24]">
            Procedures & Ceremonies
          </h1>
          <p className="mt-1 text-xs text-[#0E1A24]/60">
            Import treatment photos from your computer, configure clinical pricing, chair times, and patient protocols.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-full bg-[#0E1A24] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#12B5A6] transition-colors"
        >
          <Plus className="h-4 w-4 text-[#12B5A6]" />
          <span>Add Procedure</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#0E1A24]/50">
          Loading clinical repertoire...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-4xl border border-[#E5E0D5] bg-white p-12 text-center text-xs text-[#0E1A24]/50">
          No procedures cataloged yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((s) => (
            <div
              key={s.id}
              className="rounded-4xl border border-[#E5E0D5] bg-white p-6 shadow-[0_2px_16px_rgba(14,26,36,0.02)] hover:border-[#DAC7AD] hover:shadow-[0_8px_32px_rgba(14,26,36,0.06)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full rounded-3xl overflow-hidden bg-[#E8DCC8] mb-4 border border-[#DAC7AD]/40">
                  {s.image_path ? (
                    <Image
                      src={s.image_path}
                      alt={s.title}
                      fill
                      unoptimized={s.image_path.includes('supabase.co') || s.image_path.startsWith('data:')}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Briefcase className="h-8 w-8 text-[#0E1A24]/30" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3 rounded-full bg-[#0E1A24]/80 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    Sort #{s.sort_order}
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                        s.published
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-[#0E1A24]/80 text-[#FAF8F5]/60'
                      }`}
                    >
                      {s.published ? 'Live Catalog' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#0E1A24]/60 mb-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#12B5A6]" />
                    {s.duration_min} mins
                  </span>
                  <span className="font-serif font-bold text-[#0E1A24]">
                    from ${s.price_from}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#0E1A24]">{s.title}</h3>
                <p className="mt-2 text-xs text-[#0E1A24]/70 line-clamp-3 font-light leading-relaxed">
                  {s.summary || 'Custom biological protocol tailored to patient physiology.'}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-[#F0ECE1]">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="rounded-full border border-[#DAC7AD] bg-[#FAF8F5] px-3.5 py-1 text-xs font-semibold text-[#0E1A24] hover:bg-[#0E1A24] hover:text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id, s.title)}
                  className="rounded-full border border-rose-200 px-3 py-1 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1A24]/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-4xl border border-[#E5E0D5] bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#12B5A6]">
                  Repertoire Catalog
                </span>
                <h2 className="font-serif text-2xl font-medium text-[#0E1A24]">
                  {editingService ? 'Update Treatment Protocol' : 'Catalog New Treatment'}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#0E1A24]/50 hover:text-[#0E1A24] rounded-full p-1.5 hover:bg-[#FAF8F5]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-xs">
              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Procedure Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Feldspathic Porcelain Laminates"
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Price Minimum (USD) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price_from}
                    onChange={(e) => setFormData({ ...formData, price_from: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Chair Time (Mins)
                  </label>
                  <input
                    type="number"
                    value={formData.duration_min}
                    onChange={(e) => setFormData({ ...formData, duration_min: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                  />
                </div>
              </div>

              {/* Photo Upload with direct Computer Import */}
              <PhotoUpload
                value={formData.image_path}
                onChange={(url) => setFormData({ ...formData, image_path: url })}
                label="Procedure Cover Photo (Import from Computer)"
                folder="services"
                aspectRatio="wide"
                helperText="Upload a clinical treatment photo directly from your PC."
              />

              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Clinical Summary
                </label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Handcrafted micro-layering details..."
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="servPub"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="h-4 w-4 rounded accent-[#12B5A6]"
                  />
                  <label htmlFor="servPub" className="text-xs font-semibold text-[#0E1A24] cursor-pointer">
                    Publish in Public Menu
                  </label>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#0E1A24]/70">Sort Order:</span>
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
                  Save Procedure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
