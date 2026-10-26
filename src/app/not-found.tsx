import React from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-ivory px-6 text-center text-ink">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand/50 text-electric-teal mb-6">
        <Sparkles className="h-8 w-8" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-electric-teal">
        404 — Sanctuary Void
      </span>
      <h1 className="mt-3 font-serif text-5xl sm:text-6xl font-normal text-ink">
        Page Not Located
      </h1>
      <p className="mt-4 max-w-md text-xs sm:text-sm text-ink/70 leading-relaxed font-light">
        The requested clinical destination is unavailable or restricted. Please return to our main reception.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-electric-teal hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  )
}
