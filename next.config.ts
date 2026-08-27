import type { NextConfig } from "next";

const portfolioOrigin =
  process.env.PORTFOLIO_DEV_ORIGIN ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/paulo",
        destination: `${portfolioOrigin}/paulo`,
      },
      {
        source: "/paulo/:path*",
        destination: `${portfolioOrigin}/paulo/:path*`,
      },
    ];
  },
};

export default nextConfig;
