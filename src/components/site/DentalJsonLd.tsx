import React from 'react'

export function DentalJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Dentist', 'MedicalBusiness', 'LocalBusiness'],
    '@id': 'https://dentacare.vercel.app/#clinic',
    name: 'DentaCare Luxury Aesthetic Clinic',
    alternateName: 'DentaCare Manhattan',
    description:
      'Premier cosmetic and implant dentistry sanctuary specializing in bespoke porcelain veneers, computer-guided dental implants, and clear orthodontics.',
    url: 'https://dentacare.vercel.app',
    telephone: '+1-212-555-0198',
    email: 'concierge@dentacare.com',
    image: [
      'https://dentacare.vercel.app/images/hero-interior.jpg',
      'https://dentacare.vercel.app/images/smile-after.jpg',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '450 Park Avenue South, Suite 1400',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10016',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.7445,
      longitude: -73.9832,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '08:30',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '08:30',
        closes: '16:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
    priceRange: '$$$$',
    paymentAccepted: 'Cash, Credit Card, Wire Transfer, Healthcare Financing',
    currenciesAccepted: 'USD',
    founder: {
      '@type': 'Person',
      name: 'Dr. Osman Ratib, DDS, FICOI',
      jobTitle: 'Lead Cosmetic & Implant Surgeon',
      sameAs: 'https://github.com/osmanratib',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.98',
      reviewCount: '340',
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
