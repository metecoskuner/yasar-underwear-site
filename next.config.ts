import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    // allow loading images from Cloudinary and Supabase
    domains: ['res.cloudinary.com', 'weqrfanzkvvlhtoymxdn.supabase.co'],
  },
};

export default nextConfig;
