'use client'

// next/image loader for Unsplash. Unsplash's CDN (imgix) resizes and re-encodes on
// request, so images skip the Next.js optimizer. `src` is the photo path, such as
// "photo-1753563351975-7304490da3f3".
export default function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  return `https://images.unsplash.com/${src}?auto=format&fit=crop&w=${width}&q=${quality ?? 70}`
}
