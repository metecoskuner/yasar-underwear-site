import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    // allow loading images from Cloudinary used by the admin upload
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
