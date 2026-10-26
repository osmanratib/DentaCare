'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Sparkles, MoveHorizontal } from 'lucide-react'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  title?: string
  treatment?: string
  className?: string
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Natural Baseline',
  afterLabel = 'Architected Smile',
  title = 'Artisan Veneer Reconstruction',
  treatment = '10 Feldspathic Porcelain Laminates',
  className = '',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return
      handleMove(e.touches[0].clientX)
    },
    [isDragging, handleMove]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      handleMove(e.clientX)
    },
    [isDragging, handleMove]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove])

  return (
    <div className={`relative overflow-hidden rounded-4xl bg-ink text-ivory shadow-soft-layer ${className}`}>
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        className="relative h-[480px] sm:h-[560px] w-full select-none cursor-ew-resize overflow-hidden"
      >
        {/* AFTER IMAGE (Base Layer - 100% width) */}
        <div className="absolute inset-0 h-full w-full">
          <Image
            src={afterImage}
            alt={afterLabel}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
          <div className="absolute top-6 right-6 z-10 rounded-full bg-ink/75 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md border border-white/10 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-electric-teal" />
            <span>{afterLabel}</span>
          </div>
        </div>

        {/* BEFORE IMAGE (Clipped Layer) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="relative h-full w-full" style={{ width: containerRef.current?.clientWidth || '100%' }}>
            <Image
              src={beforeImage}
              alt={beforeLabel}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              priority
            />
            <div className="absolute top-6 left-6 z-10 rounded-full bg-ink/75 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ivory/80 backdrop-blur-md border border-white/10">
              {beforeLabel}
            </div>
          </div>
        </div>

        {/* SLIDER DIVIDER LINE */}
        <div
          className="absolute top-0 bottom-0 z-20 w-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* DRAGGABLE HANDLE BUTTON */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-transform hover:scale-110 active:scale-95">
            <MoveHorizontal className="h-4 w-4 text-ink" />
          </div>
        </div>
      </div>

      {/* Caption footer bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-white/10 bg-ink px-8 py-5">
        <div>
          <h4 className="font-serif text-lg text-white font-medium">{title}</h4>
          <p className="text-xs text-aqua">{treatment}</p>
        </div>
        <div className="text-[11px] text-ivory/50">
          Drag horizontally to inspect microscopic translucency
        </div>
      </div>
    </div>
  )
}
