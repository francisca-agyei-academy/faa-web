import type { NextConfig } from "next";

// Uploaded course images live in Cloudflare R2: either the bucket's r2.dev URL or a custom
// domain set in NEXT_PUBLIC_MEDIA_URL (e.g. https://media.example.com).
const mediaHost = process.env.NEXT_PUBLIC_MEDIA_URL ? new URL(process.env.NEXT_PUBLIC_MEDIA_URL).hostname : null;

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev" },
      ...(mediaHost ? [{ protocol: "https" as const, hostname: mediaHost }] : []),
    ],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
