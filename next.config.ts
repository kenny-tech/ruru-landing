import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allows builds to succeed even with lint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
