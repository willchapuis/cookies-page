import type { NextConfig } from "next";

const repo = process.env.NEXT_PUBLIC_PAGES_BASE_PATH || ""; 
const isPages = !!process.env.GITHUB_PAGES; // vamos setar isso no workflow

const nextConfig: NextConfig = {
  ...(isPages
    ? {
        output: "export",
        basePath: repo,
        assetPrefix: repo,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;