import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Calendar, Sparkles, Share2 } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/data/mockData'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({
    slug: p.slug,
  }))
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="py-16 px-6 lg:px-12">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/60 hover:text-electric-teal transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Journal</span>
        </Link>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-electric-teal">
            {post.category}
          </span>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-normal text-ink leading-tight">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-4 text-xs text-ink/60 border-y border-sand-dark/20 py-4">
            <span className="font-medium text-ink">By {post.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-electric-teal" />
              <span>{post.readTime}</span>
            </span>
          </div>
        </div>

        <div className="mt-8 relative h-96 w-full rounded-4xl overflow-hidden shadow-sm">
          <Image
            src={post.coverPath}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-12 space-y-6 text-base text-ink/85 leading-relaxed font-light">
          <p className="text-xl font-serif text-ink leading-relaxed">
            {post.excerpt}
          </p>
          <p>{post.body}</p>
          <p>
            In contemporary practice, patient goals have fundamentally shifted away from unnaturally bright opaque teeth toward harmonious bio-restorations. We utilize layered feldspathic porcelain precisely because it replicates the light scattering, micro-roughness, and fluorapatite translucency of pristine youthful enamel.
          </p>
          <p>
            When paired with digital facial scans, the margin for error is compressed down to tenths of a millimeter. Every restorative milestone honors the biological principle: preserve as much natural tooth structure as humanly possible.
          </p>
        </div>

        <div className="mt-16 rounded-4xl bg-sand/30 p-8 border border-sand-dark/30 flex items-center justify-between">
          <div>
            <h4 className="font-serif text-xl font-medium text-ink">Have questions regarding this topic?</h4>
            <p className="text-xs text-ink/70 mt-1">Our clinical concierge is delighted to assist with any questions.</p>
          </div>
          <Link
            href="/contact"
            className="rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-electric-teal hover:text-white transition-colors"
          >
            Inquire
          </Link>
        </div>
      </article>
    </div>
  )
}
