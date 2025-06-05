import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production"; 
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, 
  },
  assetPrefix: isProd ? "/WordChains" : "", 
  basePath: isProd ? "/WordChains" : "", 
  output: "export", 
};

export default nextConfig;
