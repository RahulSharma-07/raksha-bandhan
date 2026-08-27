'use client'

import { useCallback, useState, useRef } from 'react'

interface PreviewFile {
  file: File
  preview: string
  id: string
}

interface ImageUploaderProps {
  files: File[]
  onChange: (files: File[]) => void
  error?: string
}

export default function ImageUploader({ files, onChange, error }: ImageUploaderProps) {
  const [previews, setPreviews] = useState<PreviewFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const MAX = 5
  const MAX_SIZE = 5 * 1024 * 1024
  const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic']

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const arr = Array.from(newFiles)
      const valid: PreviewFile[] = []
      const errors: string[] = []

      for (const f of arr) {
        if (!ALLOWED.includes(f.type)) {
          errors.push(`"${f.name}" is not a supported image type.`)
          continue
        }
        if (f.size > MAX_SIZE) {
          errors.push(`"${f.name}" is over 5MB.`)
          continue
        }
        if (previews.length + valid.length >= MAX) break
        valid.push({
          file: f,
          preview: URL.createObjectURL(f),
          id: `${f.name}-${f.lastModified}-${Math.random()}`,
        })
      }

      if (errors.length) alert(errors.join('\n'))

      const updated = [...previews, ...valid].slice(0, MAX)
      setPreviews(updated)
      onChange(updated.map((p) => p.file))
    },
    [previews, onChange]
  )

  const removeFile = (id: string) => {
    const updated = previews.filter((p) => p.id !== id)
    setPreviews(updated)
    onChange(updated.map((p) => p.file))
  }

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const updated = [...previews]
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= updated.length) return
    ;[updated[index], updated[target]] = [updated[target], updated[index]]
    setPreviews(updated)
    onChange(updated.map((p) => p.file))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <div>
      <div
        onClick={() => previews.length < MAX && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        className={[
          'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200',
          dragOver
            ? 'border-[#C9A15A] bg-[#FDF3E7]'
            : error
            ? 'border-[#B5544B] bg-[#FFF8F0]'
            : 'border-[#D4A373] bg-[#FFF8F0] hover:bg-[#FDF3E7] hover:border-[#C9A15A]',
          previews.length >= MAX ? 'opacity-60 cursor-not-allowed' : '',
        ].join(' ')}
        role="button"
        aria-label="Upload photos"
      >
        <div className="flex flex-col items-center gap-2">
          <svg className="w-10 h-10 text-[#C9A15A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-[#5A4433] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {previews.length === 0
              ? 'Drop photos here or click to browse'
              : previews.length >= MAX
              ? 'Maximum 5 photos reached'
              : `${previews.length} photo${previews.length !== 1 ? 's' : ''} selected — add more`}
          </p>
          <p className="text-sm text-[#8A7863]">JPEG, PNG, WebP, GIF · Max 5MB each · Up to {MAX} photos</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-[#B5544B]" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {error}
        </p>
      )}

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {previews.map((p, i) => (
            <div
              key={p.id}
              className="relative group rounded-xl overflow-hidden aspect-square bg-[#F0E4D3]"
              style={{ boxShadow: '0 4px 12px rgba(74,44,29,0.1)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.preview}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); moveFile(i, 'up') }}
                  disabled={i === 0}
                  className="bg-white/80 rounded-full p-1 text-[#4A2C1D] disabled:opacity-30 hover:bg-white transition"
                  aria-label="Move left"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(p.id) }}
                  className="bg-[#B5544B]/90 rounded-full p-1 text-white hover:bg-[#B5544B] transition"
                  aria-label="Remove photo"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); moveFile(i, 'down') }}
                  disabled={i === previews.length - 1}
                  className="bg-white/80 rounded-full p-1 text-[#4A2C1D] disabled:opacity-30 hover:bg-white transition"
                  aria-label="Move right"
                >
                  ▶
                </button>
              </div>
              <span className="absolute top-1 left-1 bg-black/50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
