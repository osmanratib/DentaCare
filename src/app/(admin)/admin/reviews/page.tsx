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
      setMessage({ text: `Review by "${author}" deleted from Supabase.`, type: 'success' })
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
      setMessage({ text: 'Patient testimonial saved to Supabase.', type: 'success' })
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-teal">
            Reputation Management
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-white">
            Patient Reviews & Testimonials
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time CRUD operations linked directly to Supabase <code className="text-slate-300">reviews</code>.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-electric-teal px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-glow-teal hover:bg-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Review</span>
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
          Loading patient reviews from Supabase...
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
          No reviews found in the database. Click &ldquo;Add Review&rdquo; to insert one.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 shadow-sm hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-lg font-medium text-white">{r.author}</span>
                  <div className="flex text-amber-400">
                    {[...Array(r.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish(r.id, r.published)}
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      r.published
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {r.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    <span>{r.published ? 'Live on Site' : 'Hidden'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(r.id, r.author)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg"
                    title="Delete Review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic leading-relaxed">
                &ldquo;{r.body}&rdquo;
              </p>
              <div className="text-[10px] text-slate-500 font-mono">
                ID: {r.id.slice(0, 12)}... • Registered in Supabase
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
              <h2 className="font-serif text-xl font-medium text-white">Add Patient Testimonial</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Author Name *</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. Genevieve Moreau"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Rating (1 to 5 Stars)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
                >
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★☆</option>
                  <option value={3}>3 Stars ★★★☆☆</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Testimonial Body *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Patient experience, results, feedback on comfort..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white focus:border-electric-teal focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="revPublished"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 rounded accent-electric-teal"
                />
                <label htmlFor="revPublished" className="text-white cursor-pointer">
                  Publish on Website immediately
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
