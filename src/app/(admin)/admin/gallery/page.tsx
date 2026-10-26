'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, Eye, EyeOff, Sparkles } from 'lucide-react'
import { GALLERY_CASES, type GalleryCase } from '@/lib/data/mockData'

export default function GalleryAdminPage() {
  const [cases, setCases] = useState<GalleryCase[]>(GALLERY_CASES)

  const togglePublish = (id: string) => {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, published: !c.published } : c))
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-teal">
            Case Archive
          </span>
          <h1 className="mt-1 font-serif text-3xl font-medium text-white">
            Before / After Smile Manager
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Publish, modify, or archive clinical transformation cases with verified patient consent.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((c) => (
          <div
            key={c.id}
            className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-white">{c.title}</h3>
                <span className="text-xs text-electric-teal">{c.treatment}</span>
              </div>
              <button
                onClick={() => togglePublish(c.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  c.published
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {c.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                <span>{c.published ? 'Published' : 'Draft'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                <Image src={c.beforePath} alt="Before" fill className="object-cover" />
                <span className="absolute bottom-2 left-2 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] text-slate-300">
                  Before
                </span>
              </div>
              <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                <Image src={c.afterPath} alt="After" fill className="object-cover" />
                <span className="absolute bottom-2 left-2 rounded-md bg-electric-teal/90 px-2 py-0.5 text-[10px] text-slate-950 font-bold">
                  After
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Category: {c.category}</span>
              <span>Attending: {c.doctor}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
