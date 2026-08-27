'use client'

import { useState } from 'react'
import Image from 'next/image'

interface PhotoGalleryProps {
  images: { image_url: string; sort_order: number }[]
  sisterName: string
}

export default function PhotoGallery({ images, sisterName }: PhotoGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})

  if (!images.length) return null

  return (
    <section className="py-16 px-6" style={{ background: '#FDF3E7' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl font-bold text-center mb-3"
          style={{ fontFamily: 'Playfair Display, serif', color: '#4A2C1D' }}
        >
          Our Memories Together
        </h2>
        <p className="text-center mb-10" style={{ fontFamily: 'Poppins, sans-serif', color: '#8A7863' }}>
          Moments that built our story 📸
        </p>

        {/* Grid — responsive */}
        <div className={`grid gap-4 ${images.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
          {images.map((img, i) => (
            <div
              key={img.sort_order}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
              style={{
                background: '#F0E4D3',
                boxShadow: '0 4px 16px rgba(74,44,29,0.12)',
                padding: '4px',
              }}
              onClick={() => setLightbox(i)}
              role="button"
              aria-label={`View photo ${i + 1} of ${images.length}`}
            >
              {!loaded[i] && (
                <div className="absolute inset-0 skeleton rounded-xl" aria-hidden="true" />
              )}
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={img.image_url}
                  alt={`Memory ${i + 1} for ${sisterName}`}
                  fill
                  className={`object-cover transition-transform duration-500 group-hover:scale-105 ${loaded[i] ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setLoaded((p) => ({ ...p, [i]: true }))}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(74,44,29,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none"
            onClick={() => setLightbox(null)}
            aria-label="Close lightbox"
          >
            ✕
          </button>
          <div
            className="relative w-full max-w-2xl aspect-square rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightbox].image_url}
              alt={`Memory ${lightbox + 1} for ${sisterName}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
          <div className="absolute bottom-6 flex gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l! > 0 ? l! - 1 : images.length - 1)) }}
              className="bg-white/20 hover:bg-white/40 text-white rounded-full px-4 py-2 transition"
            >
              ◀
            </button>
            <span className="bg-white/20 text-white rounded-full px-4 py-2 text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {lightbox + 1} / {images.length}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l! < images.length - 1 ? l! + 1 : 0)) }}
              className="bg-white/20 hover:bg-white/40 text-white rounded-full px-4 py-2 transition"
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
