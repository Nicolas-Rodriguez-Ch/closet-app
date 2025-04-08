import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    '192.168.2.195',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
