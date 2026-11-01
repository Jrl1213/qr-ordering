import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Build a plain static site into `out/` so Netlify (or any static host) can serve it.
  output: 'export',
};

export default nextConfig;
