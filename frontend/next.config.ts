import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
    // ✅ ADD THIS LINE: Bypasses the private IP security block for local dev
    unoptimized: true, 
  },
};

export default nextConfig;