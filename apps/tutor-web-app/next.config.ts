import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com", // S3 bucket
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com", // Cloudflare R2
      },
    ],
  },
};

module.exports = nextConfig;
