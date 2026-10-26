'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function ToothPreloader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user already saw preloader in this session
    const hasSeen = sessionStorage.getItem('dentacare_preloader_seen')
    if (hasSeen) {
      setLoading(false)
      return
    }

    const timer = setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem('dentacare_preloader_seen', 'true')
    }, 1150)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink text-ivory"
        >
          {/* Animated SVG Tooth Path */}
          <div className="relative flex flex-col items-center">
            <svg
              className="h-20 w-20 text-electric-teal drop-shadow-[0_0_20px_rgba(18,181,166,0.5)]"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Refined Molar Silhouette SVG */}
              <motion.path
                d="M30,22 C37,20 44,25 50,30 C56,25 63,20 70,22 C82,26 86,40 82,56 C79,68 74,80 68,88 C64,94 58,94 56,86 C54,78 52,68 50,68 C48,68 46,78 44,86 C42,94 36,94 32,88 C26,80 21,68 18,56 C14,40 18,26 30,22 Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: 1,
                  transition: { duration: 0.9, ease: 'easeInOut' },
                }}
              />
            </svg>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-6 flex flex-col items-center gap-1"
            >
              <span className="font-serif text-xl tracking-[0.3em] uppercase text-ivory">
                DentaCare
              </span>
              <span className="text-[11px] font-sans tracking-widest uppercase text-aqua opacity-75">
                Bespoke Aesthetic Dentistry
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
