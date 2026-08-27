import Link from 'next/link'

export default function GiftNotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center mandala-bg"
      style={{ background: '#FFF8F0' }}
    >
      {/* Decorative element */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
        style={{ background: 'rgba(212,163,115,0.15)' }}
        aria-hidden="true"
      >
        <svg className="w-12 h-12 text-[#C9A15A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      </div>

      <h1
        className="text-3xl sm:text-4xl font-bold mb-4"
        style={{ fontFamily: 'Playfair Display, serif', color: '#4A2C1D' }}
      >
        This link isn&apos;t valid
      </h1>

      <p
        className="text-[#8A7863] max-w-md mb-8 text-lg leading-relaxed"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        The gift page you&apos;re looking for may have been moved, removed, or the link might be incorrect.
      </p>

      <Link
        href="/"
        className="btn-primary"
        style={{ textDecoration: 'none' }}
      >
        Make a gift for someone you love
      </Link>

      <p
        className="mt-8 text-xs text-[#8A7863]"
        style={{ fontFamily: 'Nunito, sans-serif' }}
      >
        Rakhi Gift — Personalized Raksha Bandhan gifts
      </p>
    </div>
  )
}
