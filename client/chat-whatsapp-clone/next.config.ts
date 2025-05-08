import type { NextConfig } from "next";

// Modified security headers to allow YouTube
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
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://utfs.io https://i.ytimg.com; font-src 'self'; frame-src 'self' https://www.youtube.com; connect-src 'self' https://*.vercel.app https://*.vercel-insights.com http://localhost:* https://* ws: wss:"
  }
];

// Add CORS headers
const corsHeaders = [
  {
    key: 'Access-Control-Allow-Credentials',
    value: 'true'
  },
  {
    key: 'Access-Control-Allow-Origin',
    value: '*'
  },
  {
    key: 'Access-Control-Allow-Methods',
    value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  },
  {
    key: 'Access-Control-Allow-Headers',
    value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
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
    domains: ['utfs.io', 'i.ytimg.com'],
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
        headers: [...securityHeaders, ...corsHeaders],
      },
      {
        // Add specific headers for API routes
        source: '/api/:path*',
        headers: corsHeaders,
      }
    ];
  },
};

export default nextConfig;
// import type { NextConfig } from "next";

// const securityHeaders = [
//   {
//     key: 'X-DNS-Prefetch-Control',
//     value: 'on'
//   },
//   {
//     key: 'Strict-Transport-Security',
//     value: 'max-age=63072000; includeSubDomains; preload'
//   },
//   {
//     key: 'X-XSS-Protection',
//     value: '1; mode=block'
//   },
//   {
//     key: 'X-Frame-Options',
//     value: 'SAMEORIGIN'
//   },
//   {
//     key: 'X-Content-Type-Options',
//     value: 'nosniff'
//   },
//   {
//     key: 'Referrer-Policy',
//     value: 'origin-when-cross-origin'
//   },
//   {
//     key: 'Content-Security-Policy',
//     value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://utfs.io; font-src 'self'; connect-src 'self' https://*.vercel.app https://*.vercel-insights.com http://localhost:* https://* ws: wss:"
//   }
// ];

// const nextConfig: NextConfig = {
//   devIndicators: false,
//   compress: true,
//   poweredByHeader: false,
//   reactStrictMode: true,
  
//   // Speed up builds by using SWC
//   // swcMinify: true,
  
//     // Add image configuration
//     images: {
//       domains: ['utfs.io'],
//     },

//   // Skip type checking and ESLint for faster builds
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
  
//   // Security headers
//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: securityHeaders,
//       },
//     ];
//   },
// };

// export default nextConfig;
