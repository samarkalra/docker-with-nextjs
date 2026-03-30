import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [new URL(`https://${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/product-images/**`)],
  },
};

export default nextConfig;
