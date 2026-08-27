import { notFound } from 'next/navigation'
import CopyLinkButton from '@/components/share/CopyLinkButton'
import WhatsAppShareButton from '@/components/share/WhatsAppShareButton'
import Link from 'next/link'

interface SuccessPageProps {
  params: Promise<{ id: string }>
}

export default async function SuccessPage({ params }: SuccessPageProps) {
  const { id } = await params

  if (!id || id.length < 8) notFound()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const giftUrl = `${appUrl}/g/${id}`

  return (
    <div className="min-h-screen mandala-bg flex flex-col">
      {/* Nav */}
      <nav
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{ background: 'rgba(255,248,240,0.92)', borderBottom: '1px solid rgba(212,163,115,0.15)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center">
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: 'Playfair Display, serif', color: '#4A2C1D' }}
          >
            Bandhan
          </span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          {/* Success icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(122,148,113,0.15)' }}
          >
            <svg className="w-10 h-10 text-[#7A9471]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: 'Playfair Display, serif', color: '#4A2C1D' }}
          >
            Your gift is ready! 🎁
          </h1>
          <p className="text-[#8A7863] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Share this private link with your sister to reveal the surprise.
          </p>

          {/* Link display */}
          <div
            className="rounded-xl p-4 mb-6 flex items-center gap-3"
            style={{ background: '#FDF3E7', border: '1px solid rgba(212,163,115,0.3)' }}
          >
            <svg className="w-5 h-5 flex-shrink-0 text-[#C9A15A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="text"
              readOnly
              value={giftUrl}
              className="flex-1 bg-transparent text-sm text-[#5A4433] outline-none truncate"
              style={{ fontFamily: 'Poppins, sans-serif' }}
              aria-label="Gift URL"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <CopyLinkButton url={giftUrl} />
            <WhatsAppShareButton url={giftUrl} />
          </div>

          {/* Preview link */}
          <div className="border-t border-[#F0E4D3] pt-6">
            <Link
              href={`/g/${id}`}
              className="text-sm text-[#6F4E37] underline hover:text-[#4A2C1D] transition-colors"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Preview your gift page →
            </Link>
          </div>

          {/* Privacy reminder */}
          <p
            className="text-xs text-[#8A7863] mt-4"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            🔒 This link is private — only share it with your sister directly.
          </p>

          <div className="mt-6">
            <Link
              href="/"
              className="text-xs text-[#8A7863] hover:text-[#5A4433] transition-colors underline"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Create another gift
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
