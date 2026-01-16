import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable static page generation for problematic pages
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Exclude my_plan from static optimization
  async headers() {
    return [
      {
        source: '/my_plan',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;