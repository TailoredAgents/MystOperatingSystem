import { withContentlayer } from "next-contentlayer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  typescript: {
    // Temporarily ignore type errors during production builds on Render.
    // We still validate types locally and in CI.
    ignoreBuildErrors: true
  },
  eslint: {
    // Skip ESLint during build to avoid non-blocking warnings failing deploys.
    ignoreDuringBuilds: true
  },
  async redirects() {
    return [
      { source: "/areas/areas", destination: "/areas", permanent: true },
      { source: "/areas/index", destination: "/areas", permanent: true }
    ];
  },
  experimental: {
    // Allow larger uploads for Team Console (e.g., photo attachments).
    serverActions: {
      bodySizeLimit: "20mb"
    },
    // Next.js middleware default is 10MB; raise to match server action limit.
    middlewareClientMaxBodySize: "20mb"
  }
};

export default withContentlayer(nextConfig);
