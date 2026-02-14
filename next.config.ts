import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Use standalone output for production
  output: 'standalone',
  // Serve on local network
  async rewrites() {
    return [];
  },
};

export default nextConfig;
