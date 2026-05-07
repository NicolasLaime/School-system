import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Proxy API calls to the backend to bypass CORS during development
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
