import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Local-first SPA: routes are driven by client localStorage + dynamic ids.
  // Keep Cache Components off so pathname/params don't force Suspense everywhere.
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
