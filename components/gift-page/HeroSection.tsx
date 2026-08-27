'use client'

interface HeroSectionProps {
  sisterName: string
}

export default function HeroSection({ sisterName }: HeroSectionProps) {
  return (
    <section
      className="relative text-center py-20 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4A2C1D 0%, #6F4E37 50%, #8B5E3C 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-4 left-8 w-32 h-32 rounded-full border border-white/10" />
        <div className="absolute bottom-4 right-8 w-24 h-24 rounded-full border border-white/10" />
        <div className="absolute top-1/2 left-4 w-16 h-16 rounded-full border border-[#C9A15A]/20" />
        <div className="absolute top-8 right-12 w-8 h-8 rounded-full bg-[#C9A15A]/20" />
      </div>

      {/* Rakhi thread divider line */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, #C9A15A, transparent)' }} />

      <div className="relative z-10 max-w-2xl mx-auto">
        <p className="text-[#C9A15A] text-sm font-medium tracking-widest uppercase mb-4" style={{ fontFamily: 'Nunito, sans-serif' }}>
          🪢 Happy Raksha Bandhan
        </p>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
          style={{ fontFamily: 'Playfair Display, serif', textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}
        >
          For you, <span style={{ color: '#E8C577' }}>{sisterName}</span> 🌸
        </h1>
        <p className="mt-4 text-white/70 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
          A little something made with all my heart
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: 'linear-gradient(to top, #FFF8F0, transparent)' }} />
    </section>
  )
}
