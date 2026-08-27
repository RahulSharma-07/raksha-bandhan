import GiftForm from '@/components/forms/GiftForm'

export const metadata = {
  title: 'Create a Personalized Rakhi Gift — Rakhi Gift',
  description: 'Upload photos, write a heartfelt message, and create a beautiful private gift page for your sister this Raksha Bandhan.',
}

export default function CreatePage() {
  return (
    <div className="min-h-screen mandala-bg">
      {/* Nav */}
      <nav
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{ background: 'rgba(255,248,240,0.92)', borderBottom: '1px solid rgba(212,163,115,0.15)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: 'Playfair Display, serif', color: '#4A2C1D' }}
          >
            Raksha Bandhan
          </span>
          <span className="text-sm text-[#8A7863]" style={{ fontFamily: 'Nunito, sans-serif' }}>
            🎗️ Raksha Bandhan
          </span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl sm:text-5xl font-bold leading-tight mb-4"
            style={{ fontFamily: 'Playfair Display, serif', color: '#4A2C1D' }}
          >
            Create a Digital Gift
            <br />
            <span style={{ color: '#6F4E37' }}>for Your Sister</span>
          </h1>
          <p
            className="text-lg text-[#8A7863] max-w-xl mx-auto"
            style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '1.7' }}
          >
            Craft a beautiful, personalized experience full of memories and love.
            This Raksha Bandhan, give a gift that lasts forever.
          </p>

          {/* Steps */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center text-sm">
            {['Upload 1–5 photos', 'Write your message', 'Share the private link'].map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: 'rgba(201,161,90,0.12)', fontFamily: 'Nunito, sans-serif', color: '#6F4E37' }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: '#C9A15A', color: '#FFF8F0' }}
                >
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div
          className="rounded-2xl p-6 sm:p-10"
          style={{
            background: '#FFF8F0',
            border: '1px solid rgba(212,163,115,0.2)',
            boxShadow: '0 8px 32px rgba(74,44,29,0.08)',
          }}
        >
          <GiftForm />
        </div>

        <p
          className="text-center text-xs mt-6 text-[#8A7863]"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          🔒 Your gift is private — only someone with the link can see it.
        </p>
      </main>
    </div>
  )
}
