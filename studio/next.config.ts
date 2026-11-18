import type { NextConfig } from "next";

// Optional override for path-mounted deploys; default is site root (/)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath } : {}),
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  async redirects() {
    return [
      { source: "/posts/yc-landing", destination: "/posts/model-default", permanent: true },
      { source: "/posts/product-was-last", destination: "/posts/how-a-surface-ships", permanent: true },
      { source: "/posts/keep-the-system", destination: "/posts/how-a-surface-ships", permanent: true },
      { source: "/posts/not-that-hire", destination: "/posts/wait-three-months", permanent: true },
      { source: "/posts/fortune-500-craft", destination: "/posts/wait-three-months", permanent: true },
    ];
  },
};

export default nextConfig;
