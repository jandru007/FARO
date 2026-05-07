import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@faro/shared"],
  typedRoutes: false
};

export default nextConfig;
