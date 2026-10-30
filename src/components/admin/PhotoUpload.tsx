'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Link as LinkIcon, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react'
import { toastSuccess, toastError } from '@/lib/sweetalert'

interface PhotoUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide'
  folder?: string
  helperText?: string
}

export default function PhotoUpload({
  value,
  onChange,
  label = 'Photo',
  aspectRatio = 'portrait',
  folder = 'admin',
  helperText = 'Select a photo from your computer (JPG, PNG, WEBP, up to 15MB).',
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    wide: 'aspect-[16/9]',
  }[aspectRatio]

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toastError('Invalid File Format', 'Please upload an image file (JPG, PNG, WEBP, GIF, SVG).')
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      toastError('File Too Large', 'Maximum allowed image size is 15MB.')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.url) {
        onChange(data.url)
        toastSuccess('Photo Uploaded', `${file.name} successfully imported and stored.`)
      } else {
        // Fallback: Read as base64 data URL if storage upload failed
        console.warn('Upload API failed, falling back to base64 preview:', data.error)
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            onChange(reader.result)
            toastSuccess('Photo Loaded Locally', 'Loaded directly from your computer.')
          }
        }
        reader.readAsDataURL(file)
      }
    } catch (err) {
      console.error('File upload error, fallback to data URL:', err)
      // Base64 fallback so local computer upload never breaks
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result)
          toastSuccess('Photo Loaded', 'Imported directly into browser session.')
        }
      }
      reader.readAsDataURL(file)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
      toastSuccess('Photo URL Applied')
    }
  }

  const handleClear = () => {
    onChange('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[#0E1A24]/70 font-semibold uppercase tracking-wider text-[11px]">
          {label}
        </label>
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
              mode === 'upload'
                ? 'bg-[#0E1A24] text-white'
                : 'text-[#0E1A24]/60 hover:text-[#0E1A24]'
            }`}
          >
            From Computer
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
              mode === 'url'
                ? 'bg-[#0E1A24] text-white'
                : 'text-[#0E1A24]/60 hover:text-[#0E1A24]'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        /* Preview Frame */
        <div className="relative group overflow-hidden rounded-3xl border border-[#DAC7AD] bg-[#E8DCC8]/40 shadow-sm">
          <div className={`relative w-full ${aspectClasses} max-h-72 overflow-hidden bg-[#FAF8F5]`}>
            {value.startsWith('http') || value.startsWith('/') ? (
              <Image
                src={value}
                alt="Selected Photo"
                fill
                unoptimized={value.includes('supabase.co') || value.startsWith('data:')}
                className="object-cover transition-transform duration-500 group-hover:scale-102"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Selected Photo"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
            )}

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-[#0E1A24]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0E1A24] shadow-md hover:bg-[#12B5A6] hover:text-white transition-colors"
              >
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                <span>Replace from PC</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-rose-700 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-3.5 py-2 bg-[#FAF8F5] border-t border-[#DAC7AD]/50 text-[10px] text-[#0E1A24]/60">
            <span className="flex items-center gap-1 truncate max-w-[280px]">
              <CheckCircle2 className="h-3 w-3 text-[#12B5A6] shrink-0" />
              <span className="truncate">{value}</span>
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[#12B5A6] font-semibold hover:underline shrink-0 ml-2"
            >
              Choose different
            </button>
          </div>
        </div>
      ) : mode === 'upload' ? (
        /* Computer Upload Dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`cursor-pointer rounded-3xl border-2 border-dashed p-6 text-center transition-all ${
            isDragging
              ? 'border-[#12B5A6] bg-[#12B5A6]/10 scale-[1.01]'
              : 'border-[#DAC7AD] bg-[#FAF8F5] hover:border-[#12B5A6] hover:bg-[#FAF8F5]/80'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#12B5A6] mb-2" />
              <p className="text-xs font-medium text-[#0E1A24]">Importing photo from computer...</p>
              <p className="text-[10px] text-[#0E1A24]/50 mt-1">Uploading and optimizing asset</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-3">
              <div className="h-11 w-11 rounded-2xl bg-[#E8DCC8]/60 flex items-center justify-center text-[#0E1A24] mb-3 group-hover:scale-110 transition-transform">
                <Upload className="h-5 w-5 text-[#12B5A6]" />
              </div>
              <p className="text-xs font-semibold text-[#0E1A24]">
                Click to browse photo from computer
              </p>
              <p className="text-[11px] text-[#0E1A24]/60 mt-0.5">
                or drag & drop your image file here
              </p>
              <span className="mt-2.5 inline-block rounded-full bg-[#E8DCC8]/50 px-3 py-0.5 text-[10px] font-medium text-[#0E1A24]/70">
                JPG, PNG, WEBP, GIF up to 15MB
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Manual URL Input */
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image URL (https://...)"
            className="flex-1 rounded-2xl border border-[#DAC7AD] bg-[#FAF8F5] p-3 text-xs text-[#0E1A24] focus:border-[#12B5A6] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="rounded-2xl bg-[#0E1A24] px-4 text-xs font-semibold text-white hover:bg-[#12B5A6] transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      {helperText && <p className="text-[10px] text-[#0E1A24]/50">{helperText}</p>}
    </div>
  )
}
