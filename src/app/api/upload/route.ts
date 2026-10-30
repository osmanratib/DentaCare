import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase admin client with service role key for full bucket write permissions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const BUCKET_NAME = 'dentacare-media'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type (${file.type}). Please upload a JPG, PNG, WEBP, GIF, or SVG image.` },
        { status: 400 }
      )
    }

    // Max 15MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 15MB. Please upload an image under 15MB.' },
        { status: 400 }
      )
    }

    // Generate safe clean filename
    const ext = file.name.split('.').pop() || 'jpg'
    const cleanBase = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .slice(0, 40)
    const fileName = `${folder}/${Date.now()}-${cleanBase}.${ext}`

    // Ensure bucket exists or created
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (error) {
      console.error('Supabase storage upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Retrieve public URL
    const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      fileName,
    })
  } catch (err: unknown) {
    console.error('Upload handler exception:', err)
    const message = err instanceof Error ? err.message : 'Unexpected upload error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
