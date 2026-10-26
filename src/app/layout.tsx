import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { CursorGlow } from '@/components/motion/CursorGlow'
import { ToothPreloader } from '@/components/motion/ToothPreloader'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0E1A24',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'DentaCare — Quiet Luxury Dentistry & Aesthetic Smile Architecture',
    template: '%s | DentaCare Clinic',
  },
  description:
    'Award-winning dental clinic merging biological precision with quiet luxury aesthetics. Master porcelain veneers, computer-guided implants, and clear orthodontics in Manhattan.',
  keywords: [
    'luxury cosmetic dentist',
    'porcelain veneers NYC',
    'dental implants Manhattan',
    'quiet luxury dentistry',
    'Dr Osman Ratib',
    'Invisalign clear aligners',
    'biological dentistry',
  ],
  authors: [{ name: 'Dr. Osman Ratib', url: 'https://github.com/osmanratib/DentaCare' }],
  creator: 'Osman Ratib',
  openGraph: {
    title: 'DentaCare — Quiet Luxury Aesthetic Dentistry',
    description: 'Bespoke smile design, guided implants, and serene clinical excellence.',
    url: 'https://dentacare.vercel.app',
    siteName: 'DentaCare',
    images: [
      {
        url: '/images/hero-interior.jpg',
        width: 1200,
        height: 630,
        alt: 'DentaCare Luxury Clinic Suite',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DentaCare — Quiet Luxury Aesthetic Dentistry',
    description: 'Biological tooth conservation and master ceramist smile design.',
    images: ['/images/hero-interior.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-ivory text-ink selection:bg-electric-teal selection:text-white">
        <ToothPreloader />
        <CursorGlow />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
