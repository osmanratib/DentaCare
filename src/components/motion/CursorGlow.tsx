'use client'

import React, { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export function CursorGlow() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  const mouseX = useSpring(0, { stiffness: 120, damping: 20 })
  const mouseY = useSpring(0, { stiffness: 120, damping: 20 })

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 160)
      mouseY.set(e.clientY - 160)
      if (!visible) setVisible(true)
    }

    const handleMouseLeave = () => {
      setVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mouseX, mouseY, visible])

  if (!mounted || !visible) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: mouseX,
        y: mouseY,
      }}
      className="pointer-events-none fixed top-0 left-0 z-30 h-80 w-80 rounded-full opacity-35 blur-[90px] transition-opacity duration-300"
      initial={{ opacity: 0 }}
      animate={{
        opacity: visible ? 0.35 : 0,
        background: 'radial-gradient(circle, rgba(18, 181, 166, 0.45) 0%, rgba(207, 232, 228, 0.15) 50%, transparent 70%)',
      }}
    />
  )
}
