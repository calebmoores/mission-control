import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Serve on local network
  async rewrites() {
    return [];
  },
};

export default nextConfig;
