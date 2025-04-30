import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
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
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://utfs.io; font-src 'self'; connect-src 'self' https://*.vercel.app https://*.vercel-insights.com http://localhost:* https://* ws: wss:"
  }
];

const nextConfig: NextConfig = {
  devIndicators: false,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Speed up builds by using SWC
  // swcMinify: true,
  
    // Add image configuration
    images: {
      domains: ['utfs.io'],
    },

  // Skip type checking and ESLint for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
