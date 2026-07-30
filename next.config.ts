import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {},

  // @prisma/client, prisma and pg are already in Next's default opt-out list;
  // the pg driver adapter is not, and bundling it breaks the native binding.
  serverExternalPackages: ['@prisma/adapter-pg'],

  images: {
    // Product images are served from public/images by Next itself, so no remote
    // patterns are needed. Optimisation stays off to avoid spending the Vercel
    // Hobby transformation quota on a static catalogue.
    unoptimized: true,
  },
};

export default nextConfig;
