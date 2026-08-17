import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const targetBackend = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
    return [
      {
        source: '/api/:path*',
        destination: `${targetBackend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
