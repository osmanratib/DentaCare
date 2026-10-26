import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const tag = searchParams.get('tag')

    const revalidateSecret = process.env.REVALIDATE_SECRET || 'dentacare_secret_token_2026'

    if (secret !== revalidateSecret) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    if (!tag) {
      return NextResponse.json({ message: 'Missing tag' }, { status: 400 })
    }

    revalidateTag(tag)

    return NextResponse.json({ revalidated: true, tag, now: Date.now() })
  } catch (err: unknown) {
    return NextResponse.json(
      { message: 'Error revalidating', error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
