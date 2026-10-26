'use client'

import React, { useState } from 'react'
import { Star, CheckCircle2, Trash2, Eye } from 'lucide-react'
import { CLINIC_REVIEWS, type Review } from '@/lib/data/mockData'

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>(CLINIC_REVIEWS)

  const togglePublish = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, published: !r.published } : r))
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-teal">
            Reputation Management
          </span>
          <h1 className="mt-1 font-serif text-3xl font-medium text-white">
            Patient Reviews & Testimonials
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Moderate, approve, and curate feedback displayed across marketing touchpoints.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-white text-base">{r.author}</span>
                <span className="text-xs text-slate-400 ml-2">({r.treatment})</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                </div>
                <button
                  onClick={() => togglePublish(r.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    r.published
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {r.published ? 'Approved / Live' : 'Hidden'}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic">“{r.body}”</p>
            <div className="text-[10px] text-slate-500">{r.date} • Verified Patient Review</div>
          </div>
        ))}
      </div>
    </div>
  )
}
