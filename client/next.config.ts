import { NextConfig } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const apiHostname = new URL(API_URL).hostname;
const apiPort = new URL(API_URL).port;

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: new URL(API_URL).protocol.replace(':', '') as 'http' | 'https',
        hostname: apiHostname,
        port: apiPort,
        pathname: '/images/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
