import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first, then WebP — the catalog is image-heavy and mostly viewed on mobile data
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
