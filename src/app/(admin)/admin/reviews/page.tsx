'use client'

import React, { useState, useEffect } from 'react'
import { Star, CheckCircle2, AlertCircle, Trash2, Eye, EyeOff, Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Review {
  id: string
  author: string
  rating: number
  body: string
  published: boolean
  created_at: string
}

export default function ReviewsAdminPage() {
  const supabase = createClient()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const [formData, setFormData] = useState({
    author: '',
    rating: 5,
    body: '',
    published: true,
  })

  const fetchReviews = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
    } else if (data) {
      setReviews(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const togglePublish = async (id: string, currentPublished: boolean) => {
    const { error } = await supabase
      .from('reviews')
      .update({ published: !currentPublished })
      .eq('id', id)

    if (error) {
      setMessage({ text: `Update error: ${error.message}`, type: 'error' })
    } else {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, published: !currentPublished } : r))
      )
      setMessage({
        text: `Review ${!currentPublished ? 'approved and live' : 'hidden from public view'}.`,
        type: 'success',
      })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id: string, author: string) => {
    if (!confirm(`Delete review from "${author}"?`)) return

    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) {
      setMessage({ text: `Delete error: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: `Review by "${author}" removed.`, type: 'success' })
      setReviews((prev) => prev.filter((r) => r.id !== id))
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.from('reviews').insert([formData])

    if (error) {
      setMessage({ text: `Creation error: ${error.message}`, type: 'error' })
    } else {
      setMessage({ text: 'Patient testimonial saved into Supabase.', type: 'success' })
      setModalOpen(false)
      fetchReviews()
      setFormData({
        author: '',
        rating: 5,
        body: '',
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
            Patient Voices & Sentiments
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-medium text-[#0E1A24]">
            Testimonial Moderation
          </h1>
          <p className="mt-1 text-xs text-[#0E1A24]/60">
            Moderate, approve, and display verified patient experiences across marketing touchpoints.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-full bg-[#0E1A24] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#12B5A6] transition-colors"
        >
          <Plus className="h-4 w-4 text-[#12B5A6]" />
          <span>Add Review</span>
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
          Loading patient reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-4xl border border-[#E5E0D5] bg-white p-12 text-center text-xs text-[#0E1A24]/50">
          No reviews found in database.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-3xl border border-[#E5E0D5] bg-white p-6 shadow-[0_2px_16px_rgba(14,26,36,0.02)] hover:border-[#DAC7AD] transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-lg font-bold text-[#0E1A24]">{r.author}</span>
                  <div className="flex text-amber-400">
                    {[...Array(r.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish(r.id, r.published)}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold ${
                      r.published
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-[#EFECE3] text-[#0E1A24]/60'
                    }`}
                  >
                    {r.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    <span>{r.published ? 'Approved / Live' : 'Hidden'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(r.id, r.author)}
                    className="p-1.5 text-[#0E1A24]/40 hover:text-rose-600 rounded-full hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#0E1A24]/80 italic font-light leading-relaxed">
                &ldquo;{r.body}&rdquo;
              </p>
              <div className="text-[10px] text-[#0E1A24]/40 font-mono">
                Verified Patient Review • Logged in Supabase
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
              <h2 className="font-serif text-2xl font-medium text-[#0E1A24]">Add Patient Testimonial</h2>
              <button onClick={() => setModalOpen(false)} className="text-[#0E1A24]/50 hover:text-[#0E1A24]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. Julian Davies"
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Rating
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24]"
                >
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★☆</option>
                  <option value={3}>3 Stars ★★★☆☆</option>
                </select>
              </div>

              <div>
                <label className="block text-[#0E1A24]/70 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Testimonial Body *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Atmosphere, clinical results, painlessness..."
                  className="w-full rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="revPub"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 rounded accent-[#12B5A6]"
                />
                <label htmlFor="revPub" className="text-xs font-semibold text-[#0E1A24] cursor-pointer">
                  Approve and publish live immediately
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
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
