const withNextIntl = require('next-intl/plugin')('./src/i18n/config.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server external packages
  serverExternalPackages: ['@prisma/client'],
  
  // Output configuration
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['example.com', 'localhost'],
    formats: ['image/webp', 'image/avif'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ],
      },
    ]
  },

  // Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/health',
        destination: '/api/health',
      },
    ]
  },

  // Webpack config
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Development configuration
  reactStrictMode: true,
}

module.exports = withNextIntl(nextConfig)