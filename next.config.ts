import type { NextConfig } from "next";

// Uploaded course images live in Cloudflare R2: either the bucket's r2.dev URL or a custom
// domain set in NEXT_PUBLIC_MEDIA_URL (e.g. https://media.example.com).
const mediaHost = process.env.NEXT_PUBLIC_MEDIA_URL ? new URL(process.env.NEXT_PUBLIC_MEDIA_URL).hostname : null;

// When API_PROXY_URL is set (staging/production), the browser calls the API through this
// site at /api/v1/*, so the auth cookies are first-party and no CORS is involved. Set
// NEXT_PUBLIC_API_URL="/" alongside it. Locally the browser calls the API on :4000 directly.
const apiProxy = process.env.API_PROXY_URL?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  cacheComponents: true,
  async rewrites() {
    return apiProxy ? [{ source: "/api/v1/:path*", destination: `${apiProxy}/api/v1/:path*` }] : [];
  },
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
