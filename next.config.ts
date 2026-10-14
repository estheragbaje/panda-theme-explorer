import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  // Every photo comes from Unsplash, resized by Unsplash's own CDN.
  images: { loader: 'custom', loaderFile: './src/lib/unsplash-loader.ts' },
  partialPrefetching: true,
};

export default nextConfig;
