'use client'

import { useState } from 'react'

interface MessageCardProps {
  message: string
  brotherName: string
}

export default function MessageCard({ message, brotherName }: MessageCardProps) {
  const [opened, setOpened] = useState(false)

  if (!opened) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ fontFamily: 'Playfair Display, serif', color: '#4A2C1D' }}
          >
            A letter from your brother
          </h2>
          <button
            onClick={() => setOpened(true)}
            className="relative group cursor-pointer"
            aria-label="Open the letter"
            style={{ display: 'inline-block' }}
          >
            {/* Envelope SVG */}
            <svg
              className="w-40 h-28 mx-auto transition-transform group-hover:scale-105"
              viewBox="0 0 160 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="2" y="2" width="156" height="106" rx="8" fill="#FDF3E7" stroke="#D4A373" strokeWidth="2"/>
              <path d="M2 10 L80 62 L158 10" stroke="#C9A15A" strokeWidth="2" fill="none"/>
              <circle cx="80" cy="55" r="12" fill="#C9A15A"/>
              <text x="80" y="59" textAnchor="middle" fontSize="12" fill="white" fontFamily="serif">R</text>
            </svg>
            <p className="mt-3 text-[#6F4E37] font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Tap to open ✨
            </p>
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-6 fade-in-up visible">
      <div
        className="max-w-2xl mx-auto paper-card rounded-2xl p-8 sm:p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10" aria-hidden="true">
          <svg viewBox="0 0 100 100" fill="#C9A15A">
            <path d="M50 0c27.6 0 50 22.4 50 50S77.6 100 50 100 0 77.6 0 50 22.4 0 50 0zm0 10c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40z"/>
          </svg>
        </div>

        <p
          className="text-sm font-medium tracking-widest uppercase mb-6"
          style={{ fontFamily: 'Nunito, sans-serif', color: '#C9A15A' }}
        >
          💌 A letter for you
        </p>

        <blockquote
          className="text-lg leading-relaxed italic whitespace-pre-wrap"
          style={{
            fontFamily: 'Playfair Display, serif',
            color: '#5A4433',
            lineHeight: '1.8',
          }}
        >
          {message}
        </blockquote>

        <div className="mt-8 text-right border-t border-[#F0E4D3] pt-4">
          <p
            className="text-xl"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#4A2C1D', fontStyle: 'italic' }}
          >
            With love,
          </p>
          <p
            className="text-2xl font-bold"
            style={{ fontFamily: 'Playfair Display, serif', color: '#6F4E37' }}
          >
            {brotherName} 🎗️
          </p>
        </div>
      </div>
    </section>
  )
}
