import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable local network access
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*'
      }
    ]
  }
};

export default nextConfig;
