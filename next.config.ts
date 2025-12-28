import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Disable image optimization since there is no server-side Next.js process to resize them
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes are handled correctly for static routing
  trailingSlash: true,
  // Rewrites to proxy API requests to the Wrangler/Miniflare server in development
  async rewrites() {
    // Only apply rewrites in development mode
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          // Proxy all /api requests to the local Wrangler/Miniflare server
          // Default port for Wrangler Pages dev is 8788
          source: '/api/:path*',
          destination: 'http://127.0.0.1:8788/api/:path*',
        },
      ];
    }
    return [];
  },
  /* config options here */
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
