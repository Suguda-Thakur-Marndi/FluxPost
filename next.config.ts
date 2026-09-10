import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prevent clickjacking — deny all framing
  { key: "X-Frame-Options", value: "DENY" },
  // Don't send referrer to cross-origin destinations
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features not needed by this app
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "interest-cohort=()",
    ].join(", "),
  },
  // DNS prefetch control
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Enforce HTTPS (1 year, include subdomains)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Content Security Policy — compatible with Clerk, InsForge, Inngest, Google Fonts
  {
    key: "Content-Security-Policy",
    value: [
      // Allow only HTTPS and self for all origins by default
      "default-src 'self'",
      // Scripts: self + Clerk + Inngest
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.accounts.dev",
      // Styles: self + Google Fonts + inline (required by Tailwind/shadcn)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self + Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + all HTTPS (needed for CDN-hosted social profile images)
      "img-src 'self' data: https:",
      // Connect: API calls to Clerk, InsForge, Google Gemini, and social APIs
      "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://*.insforge.app https://generativelanguage.googleapis.com wss://*.insforge.app",
      // Frames: Clerk components
      "frame-src 'self' https://clerk.com https://*.clerk.accounts.dev",
      // Worker: none
      "worker-src 'none'",
      // Object/embed: none
      "object-src 'none'",
      // Base URI: self only (prevent base tag injection)
      "base-uri 'self'",
      // Form action: self only
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",

  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "**.insforge.app" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "media.licdn.com" },
      // Additional social platforms for profile images
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "graph.facebook.com" },
      { protocol: "https", hostname: "**.bsky.app" },
      // Generic fallback for avatar services used in development
      { protocol: "https", hostname: "avatar.iran.liara.run" },
    ],
  },
};

export default nextConfig;
