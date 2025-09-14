
import type {NextConfig} from 'next';
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'control.puntoexacto.ec',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'controlrutas.gpsplataforma.net',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
