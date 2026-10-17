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
  // The design-system specs (all themes, and one per theme) are public, so tools on other
  // sites, such as Panda Studio, can fetch them.
  async headers() {
    const cors = [
      { key: 'Access-Control-Allow-Origin', value: '*' },
      { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
    ];
    return [
      { source: '/specs/:path*', headers: cors },
      { source: '/design-system.json', headers: cors },
    ];
  },
};

export default nextConfig;
