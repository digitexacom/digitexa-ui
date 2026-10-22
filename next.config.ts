import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  async redirects() {
    return [
      { source: "/components/:slug", destination: "/docs/components/:slug", permanent: true },
      // one canonical address: the vercel.app domain forwards to ui.digitexa.com
      {
        source: "/:path*",
        has: [{ type: "host", value: "digitexa-ui.vercel.app" }],
        destination: "https://ui.digitexa.com/:path*",
        permanent: true,
      },
    ];
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
