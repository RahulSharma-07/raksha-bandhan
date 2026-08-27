import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import HeroSection from '@/components/gift-page/HeroSection'
import MessageCard from '@/components/gift-page/MessageCard'
import PhotoGallery from '@/components/gift-page/PhotoGallery'
import GiftFooter from '@/components/gift-page/Footer'
import ReportButton from '@/components/gift-page/ReportButton'
import type { GiftPageData } from '@/types/gift'

interface GiftPageProps {
  params: Promise<{ id: string }>
}

async function getGift(id: string): Promise<GiftPageData | null> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  try {
    const res = await fetch(`${appUrl}/api/gifts/${id}`, {
      next: { revalidate: 0 }, // always fresh — view count must increment
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: GiftPageProps): Promise<Metadata> {
  const { id } = await params
  const gift = await getGift(id)

  if (!gift) {
    return { title: 'Gift not found — Rakhi Gift' }
  }

  const firstImage = gift.images[0]?.image_url
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return {
    title: `Happy Raksha Bandhan, ${gift.sister_name}! 🎗️`,
    description: `${gift.brother_name} made a special Raksha Bandhan gift just for ${gift.sister_name}.`,
    openGraph: {
      title: `Happy Raksha Bandhan, ${gift.sister_name}! 🎗️`,
      description: `${gift.brother_name} made something special for you this Raksha Bandhan. ❤️`,
      url: `${appUrl}/g/${id}`,
      type: 'website',
      images: firstImage
        ? [{ url: firstImage, width: 1200, height: 630, alt: `A gift for ${gift.sister_name}` }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Happy Raksha Bandhan, ${gift.sister_name}! 🎗️`,
      description: `${gift.brother_name} made something special for you. ❤️`,
      images: firstImage ? [firstImage] : [],
    },
  }
}

export default async function GiftPage({ params }: GiftPageProps) {
  const { id } = await params
  const gift = await getGift(id)

  if (!gift) notFound()

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
      <HeroSection sisterName={gift.sister_name} />
      <MessageCard message={gift.message} brotherName={gift.brother_name} />
      <PhotoGallery images={gift.images} sisterName={gift.sister_name} />
      <GiftFooter brotherName={gift.brother_name} />
      <ReportButton giftId={id} />
    </div>
  )
}
