import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "dmcicorporation.com",
      "dmci-agent-bakit.s3.ap-southeast-1.amazonaws.com" 
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
