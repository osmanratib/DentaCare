'use client'

import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

interface RevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  delay?: number
  duration?: number
  yOffset?: number
  className?: string
}

export const CUBIC_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function Reveal({
  children,
  delay = 0,
  duration = 0.9,
  yOffset = 40,
  className = '',
  ...rest
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{
        duration,
        delay,
        ease: CUBIC_EASE,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration,
        delay,
        ease: CUBIC_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
