import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking attacks
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Control referrer information
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features not needed by this app
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Force HTTPS for 2 years (enable only when deployed over HTTPS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: allow self + Next.js inline scripts + Cloudinary widget
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://upload-widget.cloudinary.com https://widget.cloudinary.com",
      // Styles: allow self + inline styles (used by Tailwind & shadcn)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: allow self, data URIs, Cloudinary, and Unsplash
      "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com",
      // Connections: allow self + Cloudinary uploads + Neon DB (server-side only)
      "connect-src 'self' https://api.cloudinary.com https://upload.cloudinary.com",
      // Frames: Cloudinary upload widget uses an iframe
      "frame-src https://upload-widget.cloudinary.com https://widget.cloudinary.com",
      // No plugins
      "object-src 'none'",
      // Upgrade insecure requests when on HTTPS
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
