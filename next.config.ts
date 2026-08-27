import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Increase body size limit for multipart uploads (5 images × 5MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '30mb',
    },
  },
}

export default nextConfig
