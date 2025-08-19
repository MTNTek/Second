/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Enable Server Components by default
    appDir: true,
    
    // Optimize server components
    serverComponentsExternalPackages: ['better-sqlite3'],
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression and optimization
  compress: true,
  
  // PWA settings (optional for future enhancement)
  poweredByHeader: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: '../analyze/client.html',
          })
        );
      }
      return config;
    },
  }),

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
    
    // Minification
    swcMinify: true,
    
    // Remove console logs in production
    compiler: {
      removeConsole: {
        exclude: ['error'],
      },
    },
  }),
};

module.exports = nextConfig;
