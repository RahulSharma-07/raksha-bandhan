'use client'

interface GiftFooterProps {
  brotherName: string
  onReport?: () => void
}

export default function GiftFooter({ brotherName, onReport }: GiftFooterProps) {
  return (
    <footer
      className="py-12 px-6 text-center"
      style={{ background: '#4A2C1D' }}
    >
      <div className="max-w-lg mx-auto">
        <div className="mb-4 text-[#C9A15A] text-2xl" aria-hidden="true">🎗️</div>

        <p
          className="text-xl italic"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#E8C577' }}
        >
          With all my love,
        </p>
        <p
          className="text-3xl font-bold mt-1"
          style={{ fontFamily: 'Playfair Display, serif', color: '#FFF8F0' }}
        >
          {brotherName}
        </p>

        <p
          className="mt-6 text-sm opacity-60"
          style={{ fontFamily: 'Nunito, sans-serif', color: '#FFF8F0' }}
        >
          Made with ❤️ on Rakhi Gift
        </p>

        {onReport && (
          <button
            onClick={onReport}
            className="mt-6 text-xs opacity-40 hover:opacity-70 transition-opacity underline"
            style={{ fontFamily: 'Nunito, sans-serif', color: '#FFF8F0' }}
            aria-label="Report this page"
          >
            Report this page
          </button>
        )}
      </div>
    </footer>
  )
}
