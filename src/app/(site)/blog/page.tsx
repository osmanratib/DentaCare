import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ArrowRight, User } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { BLOG_POSTS } from '@/lib/data/mockData'

export const metadata = {
  title: 'Journal & Oral Health Editorial',
  description: 'Insights on biomimetic dentistry, facial aesthetics, and dental health longevity from DentaCare doctors.',
}

export default function BlogPage() {
  return (
    <div className="py-16 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
            The Journal
          </span>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl font-normal text-ink">
            Aesthetic Science & Longevity
          </h1>
          <p className="mt-6 text-base text-ink/75 leading-relaxed font-light">
            Essays on biomimetic tooth preservation, optical ceramist principles, and the systemic biology of oral wellness.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, idx) => (
            <Reveal key={post.id} delay={idx * 0.1}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col justify-between rounded-4xl border border-sand-dark/30 bg-white overflow-hidden shadow-sm hover:shadow-hover-card transition-all h-full"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-sand/30">
                    <Image
                      src={post.coverPath}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 rounded-full bg-ink/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-3 text-[11px] text-ink/60 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-electric-teal" />
                        <span>{post.readTime}</span>
                      </span>
                      <span>•</span>
                      <span>{post.author}</span>
                    </div>

                    <h2 className="font-serif text-2xl font-medium text-ink group-hover:text-electric-teal transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-xs text-ink/70 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-8 pb-8 pt-4 flex items-center gap-2 text-xs font-semibold text-ink group-hover:text-electric-teal transition-colors border-t border-sand-dark/10">
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
