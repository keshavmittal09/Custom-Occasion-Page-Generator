import type { NextConfig } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Helmet-style security headers for every response
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(self)" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(process.env.NODE_ENV === "production" ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }] : []),
];

// CORS: the API only answers browsers on our own origin
const corsHeaders = [
  { key: "Access-Control-Allow-Origin", value: APP_URL },
  { key: "Access-Control-Allow-Credentials", value: "true" },
  { key: "Access-Control-Allow-Methods", value: "GET,POST,PATCH,DELETE,OPTIONS" },
  { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, x-view-token" },
  { key: "Vary", value: "Origin" },
];

const nextConfig: NextConfig = {
  // local-dev MongoDB launcher spawns a binary — keep it out of the bundle
  serverExternalPackages: ["mongodb-memory-server", "mongodb-memory-server-core"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/api/:path*", headers: corsHeaders },
    ];
  },
};

export default nextConfig;
