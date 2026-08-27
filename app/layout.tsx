import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rakhi Gift — Create a Personalized Raksha Bandhan Gift',
  description: 'Create a beautiful, personalized digital gift page for your sister. Upload photos, write a heartfelt message, and share a unique private link.',
  openGraph: {
    title: 'Rakhi Gift — Personalized Raksha Bandhan Gift',
    description: 'Create a beautiful digital gift for your sister this Raksha Bandhan.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen mandala-bg">
        {children}
      </body>
    </html>
  )
}
